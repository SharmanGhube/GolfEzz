// Package admin provides admin-specific functionality
package admin

import (
	"net/http"
	"time"

	"golf-ezz-backend/internal/database"
	"golf-ezz-backend/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// AdminHandler handles admin-specific requests
type AdminHandler struct{}

// NewAdminHandler creates a new admin handler
func NewAdminHandler() *AdminHandler {
	return &AdminHandler{}
}

// GetAllUsers returns all users (admin only)
func (h *AdminHandler) GetAllUsers(c *gin.Context) {
	var users []models.User
	if err := database.DB.Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve users"})
		return
	}

	// Remove passwords from response
	for i := range users {
		users[i].Password = ""
	}

	c.JSON(http.StatusOK, gin.H{
		"users": users,
		"count": len(users),
	})
}

// GetUserByID returns a specific user by ID (admin only)
func (h *AdminHandler) GetUserByID(c *gin.Context) {
	userID := c.Param("id")

	id, err := uuid.Parse(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var user models.User
	if err := database.DB.Preload("Bookings").Preload("RangeBookings").First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	user.Password = "" // Remove password from response
	c.JSON(http.StatusOK, user)
}

// UpdateUserRole updates a user's role (admin only)
func (h *AdminHandler) UpdateUserRole(c *gin.Context) {
	userID := c.Param("id")

	id, err := uuid.Parse(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var req struct {
		Role string `json:"role" binding:"required,oneof=admin member staff"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Find user
	var user models.User
	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Update role
	user.Role = req.Role
	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user role"})
		return
	}

	user.Password = "" // Remove password from response
	c.JSON(http.StatusOK, user)
}

// GetAllBookings returns all tee time bookings (admin only)
func (h *AdminHandler) GetAllBookings(c *gin.Context) {
	var bookings []models.TeeTimeBooking
	if err := database.DB.Preload("User").Preload("Course").
		Order("date DESC, time DESC").Find(&bookings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve bookings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"bookings": bookings,
		"count":    len(bookings),
	})
}

// GetBookingsByDate returns bookings for a specific date (admin only)
func (h *AdminHandler) GetBookingsByDate(c *gin.Context) {
	dateStr := c.Query("date")
	if dateStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Date parameter required"})
		return
	}

	date, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Use YYYY-MM-DD"})
		return
	}

	var bookings []models.TeeTimeBooking
	if err := database.DB.Where("date = ?", date).
		Preload("User").Preload("Course").
		Order("time ASC").Find(&bookings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve bookings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"date":     dateStr,
		"bookings": bookings,
		"count":    len(bookings),
	})
}

// GetDashboardStats returns dashboard statistics (admin only)
func (h *AdminHandler) GetDashboardStats(c *gin.Context) {
	var userCount int64
	var courseCount int64
	var bookingCount int64
	var todayBookingCount int64

	// Get counts
	database.DB.Model(&models.User{}).Count(&userCount)
	database.DB.Model(&models.Course{}).Count(&courseCount)
	database.DB.Model(&models.TeeTimeBooking{}).Count(&bookingCount)

	// Today's bookings
	today := time.Now().Format("2006-01-02")
	todayDate, _ := time.Parse("2006-01-02", today)
	database.DB.Model(&models.TeeTimeBooking{}).Where("date = ?", todayDate).Count(&todayBookingCount)

	// Revenue calculation (example)
	var totalRevenue float64
	database.DB.Model(&models.TeeTimeBooking{}).
		Where("payment_status = ?", "completed").
		Select("SUM(total_amount)").Scan(&totalRevenue)

	// Recent bookings
	var recentBookings []models.TeeTimeBooking
	database.DB.Limit(5).Order("created_at DESC").
		Preload("User").Preload("Course").
		Find(&recentBookings)

	stats := gin.H{
		"total_users":     userCount,
		"total_courses":   courseCount,
		"total_bookings":  bookingCount,
		"today_bookings":  todayBookingCount,
		"total_revenue":   totalRevenue,
		"recent_bookings": recentBookings,
		"generated_at":    time.Now(),
	}

	c.JSON(http.StatusOK, stats)
}

// GetRevenueReport returns revenue report for a date range (admin only)
func (h *AdminHandler) GetRevenueReport(c *gin.Context) {
	startDateStr := c.Query("start_date")
	endDateStr := c.Query("end_date")

	if startDateStr == "" || endDateStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "start_date and end_date parameters required"})
		return
	}

	startDate, err := time.Parse("2006-01-02", startDateStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start_date format. Use YYYY-MM-DD"})
		return
	}

	endDate, err := time.Parse("2006-01-02", endDateStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end_date format. Use YYYY-MM-DD"})
		return
	}

	// Get bookings in date range
	var bookings []models.TeeTimeBooking
	if err := database.DB.Where("date BETWEEN ? AND ? AND payment_status = ?",
		startDate, endDate, "completed").
		Preload("Course").Find(&bookings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve revenue data"})
		return
	}

	// Calculate revenue by course
	courseRevenue := make(map[string]float64)
	totalRevenue := 0.0

	for _, booking := range bookings {
		courseRevenue[booking.Course.Name] += booking.TotalAmount
		totalRevenue += booking.TotalAmount
	}

	report := gin.H{
		"start_date":        startDateStr,
		"end_date":          endDateStr,
		"total_revenue":     totalRevenue,
		"booking_count":     len(bookings),
		"revenue_by_course": courseRevenue,
		"generated_at":      time.Now(),
	}

	c.JSON(http.StatusOK, report)
}

// UpdateBookingStatus updates the status of a booking (admin only)
func (h *AdminHandler) UpdateBookingStatus(c *gin.Context) {
	bookingID := c.Param("id")

	id, err := uuid.Parse(bookingID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid booking ID"})
		return
	}

	var req struct {
		Status        string `json:"status" binding:"required,oneof=pending confirmed cancelled completed"`
		PaymentStatus string `json:"payment_status" binding:"omitempty,oneof=pending completed failed refunded"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Find booking
	var booking models.TeeTimeBooking
	if err := database.DB.First(&booking, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	// Update status
	booking.Status = req.Status
	if req.PaymentStatus != "" {
		booking.PaymentStatus = req.PaymentStatus
	}

	if err := database.DB.Save(&booking).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update booking"})
		return
	}

	// Load updated booking with relations
	if err := database.DB.Preload("User").Preload("Course").First(&booking, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load updated booking"})
		return
	}

	c.JSON(http.StatusOK, booking)
}

// GetSystemLogs returns system activity logs (admin only)
func (h *AdminHandler) GetSystemLogs(c *gin.Context) {
	// This would typically integrate with a logging system
	// For now, we'll return recent activity based on database changes

	var recentUsers []models.User
	var recentBookings []models.TeeTimeBooking

	database.DB.Limit(10).Order("created_at DESC").Find(&recentUsers)
	database.DB.Limit(10).Order("created_at DESC").
		Preload("User").Preload("Course").Find(&recentBookings)

	// Remove passwords from users
	for i := range recentUsers {
		recentUsers[i].Password = ""
	}

	logs := gin.H{
		"recent_users":    recentUsers,
		"recent_bookings": recentBookings,
		"generated_at":    time.Now(),
	}

	c.JSON(http.StatusOK, logs)
}

// ExportData exports system data in various formats (admin only)
func (h *AdminHandler) ExportData(c *gin.Context) {
	exportType := c.Query("type")

	switch exportType {
	case "users":
		var users []models.User
		database.DB.Find(&users)

		// Remove passwords
		for i := range users {
			users[i].Password = ""
		}

		c.JSON(http.StatusOK, gin.H{
			"export_type": "users",
			"data":        users,
			"count":       len(users),
			"exported_at": time.Now(),
		})

	case "bookings":
		var bookings []models.TeeTimeBooking
		database.DB.Preload("User").Preload("Course").Find(&bookings)

		c.JSON(http.StatusOK, gin.H{
			"export_type": "bookings",
			"data":        bookings,
			"count":       len(bookings),
			"exported_at": time.Now(),
		})

	case "courses":
		var courses []models.Course
		database.DB.Find(&courses)

		c.JSON(http.StatusOK, gin.H{
			"export_type": "courses",
			"data":        courses,
			"count":       len(courses),
			"exported_at": time.Now(),
		})

	default:
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid export type. Use: users, bookings, or courses",
		})
	}
}
