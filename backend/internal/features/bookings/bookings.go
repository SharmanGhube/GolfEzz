// Package bookings provides booking functionality for users
package bookings

import (
	"net/http"
	"time"

	"golf-ezz-backend/internal/database"
	"golf-ezz-backend/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// BookingHandler handles booking-related requests
type BookingHandler struct{}

// NewBookingHandler creates a new booking handler
func NewBookingHandler() *BookingHandler {
	return &BookingHandler{}
}

// TeeTimeBookingRequest represents a tee time booking request
type TeeTimeBookingRequest struct {
	CourseID        string    `json:"course_id" binding:"required"`
	Date            time.Time `json:"date" binding:"required"`
	Time            string    `json:"time" binding:"required"`
	Players         int       `json:"players" binding:"required,min=1,max=4"`
	SpecialRequests string    `json:"special_requests"`
}

// RangeBookingRequest represents a range booking request
type RangeBookingRequest struct {
	CourseID    string    `json:"course_id" binding:"required"`
	Date        time.Time `json:"date" binding:"required"`
	StartTime   string    `json:"start_time" binding:"required"`
	Duration    int       `json:"duration" binding:"required"` // in minutes
	BucketSize  string    `json:"bucket_size" binding:"required"`
	BucketCount int       `json:"bucket_count" binding:"required,min=1"`
}

// GetMyBookings returns all bookings for the authenticated user
func (h *BookingHandler) GetMyBookings(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	userModel := user.(models.User)

	var bookings []models.TeeTimeBooking
	if err := database.DB.Where("user_id = ?", userModel.ID).
		Preload("Course").
		Order("date ASC, time ASC").
		Find(&bookings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve bookings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"bookings": bookings,
		"count":    len(bookings),
	})
}

// CreateTeeTimeBooking creates a new tee time booking
func (h *BookingHandler) CreateTeeTimeBooking(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	userModel := user.(models.User)

	var req TeeTimeBookingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Parse course ID
	courseID, err := uuid.Parse(req.CourseID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid course ID"})
		return
	}

	// Verify course exists
	var course models.Course
	if err := database.DB.First(&course, courseID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
		return
	}

	// Check for booking conflicts
	var existingBooking models.TeeTimeBooking
	if err := database.DB.Where("course_id = ? AND date = ? AND time = ?",
		courseID, req.Date, req.Time).First(&existingBooking).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Time slot already booked"})
		return
	}

	// Calculate total amount based on day of week
	var greenFee float64
	weekday := req.Date.Weekday()
	if weekday == time.Saturday || weekday == time.Sunday {
		greenFee = course.GreenFeeWeekend
	} else {
		greenFee = course.GreenFeeWeekday
	}

	totalAmount := greenFee * float64(req.Players)

	// Create booking
	specialRequests := req.SpecialRequests
	booking := models.TeeTimeBooking{
		CourseID:        courseID,
		UserID:          userModel.ID,
		Date:            req.Date,
		Time:            req.Time,
		Players:         req.Players,
		Status:          "confirmed",
		TotalAmount:     totalAmount,
		PaymentStatus:   "pending",
		SpecialRequests: &specialRequests,
	}

	if err := database.DB.Create(&booking).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create booking"})
		return
	}

	// Load course information for response
	if err := database.DB.Preload("Course").First(&booking, booking.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load booking details"})
		return
	}

	c.JSON(http.StatusCreated, booking)
}

// GetMyRangeBookings returns all range bookings for the authenticated user
func (h *BookingHandler) GetMyRangeBookings(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	userModel := user.(models.User)

	var bookings []models.RangeBooking
	if err := database.DB.Where("user_id = ?", userModel.ID).
		Preload("Course").
		Order("date ASC, start_time ASC").
		Find(&bookings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve range bookings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"bookings": bookings,
		"count":    len(bookings),
	})
}

// CreateRangeBooking creates a new driving range booking
func (h *BookingHandler) CreateRangeBooking(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	userModel := user.(models.User)

	var req RangeBookingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Parse course ID
	courseID, err := uuid.Parse(req.CourseID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid course ID"})
		return
	}

	// Verify course exists
	var course models.Course
	if err := database.DB.First(&course, courseID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
		return
	}

	// Calculate total amount based on bucket size and count
	bucketPrices := map[string]float64{
		"small":  10.0,
		"medium": 15.0,
		"large":  20.0,
		"jumbo":  25.0,
	}

	bucketPrice, exists := bucketPrices[req.BucketSize]
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid bucket size"})
		return
	}

	totalAmount := bucketPrice * float64(req.BucketCount)

	// Create range booking
	booking := models.RangeBooking{
		UserID:      userModel.ID,
		CourseID:    courseID,
		Date:        req.Date,
		StartTime:   req.StartTime,
		Duration:    req.Duration,
		BucketSize:  req.BucketSize,
		BucketCount: req.BucketCount,
		TotalAmount: totalAmount,
		Status:      "active",
		UsedBuckets: 0,
	}

	if err := database.DB.Create(&booking).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create range booking"})
		return
	}

	// Load course information for response
	if err := database.DB.Preload("Course").First(&booking, booking.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load booking details"})
		return
	}

	c.JSON(http.StatusCreated, booking)
}

// CancelBooking cancels a tee time booking
func (h *BookingHandler) CancelBooking(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	userModel := user.(models.User)
	bookingID := c.Param("id")

	// Parse booking ID
	id, err := uuid.Parse(bookingID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid booking ID"})
		return
	}

	// Find booking
	var booking models.TeeTimeBooking
	if err := database.DB.Where("id = ? AND user_id = ?", id, userModel.ID).First(&booking).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	// Check if booking can be cancelled (e.g., not within 24 hours)
	if time.Until(booking.Date) < 24*time.Hour {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot cancel booking within 24 hours of tee time"})
		return
	}

	// Update booking status
	booking.Status = "cancelled"
	if err := database.DB.Save(&booking).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to cancel booking"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Booking cancelled successfully"})
}

// GetAvailableTimeSlots returns available time slots for a given date and course
func (h *BookingHandler) GetAvailableTimeSlots(c *gin.Context) {
	courseID := c.Param("id")
	dateStr := c.Query("date")

	// Parse course ID
	id, err := uuid.Parse(courseID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid course ID"})
		return
	}

	// Parse date
	date, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Use YYYY-MM-DD"})
		return
	}

	// Get existing bookings for the date
	var bookedSlots []models.TeeTimeBooking
	if err := database.DB.Where("course_id = ? AND date = ?", id, date).Find(&bookedSlots).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check availability"})
		return
	}

	// Generate available time slots (example: 7 AM to 7 PM, every 15 minutes)
	availableSlots := []string{}
	bookedTimes := make(map[string]bool)

	for _, booking := range bookedSlots {
		bookedTimes[booking.Time] = true
	}

	// Generate time slots from 7:00 AM to 7:00 PM
	startHour := 7
	endHour := 19

	for hour := startHour; hour <= endHour; hour++ {
		for minute := 0; minute < 60; minute += 15 {
			timeSlot := time.Date(2000, 1, 1, hour, minute, 0, 0, time.UTC).Format("15:04")
			if !bookedTimes[timeSlot] {
				availableSlots = append(availableSlots, timeSlot)
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"course_id":       courseID,
		"date":            dateStr,
		"available_slots": availableSlots,
		"total_available": len(availableSlots),
	})
}

// UpdateBucketUsage updates the used bucket count for range booking
func (h *BookingHandler) UpdateBucketUsage(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	userModel := user.(models.User)
	bookingID := c.Param("id")

	var req struct {
		UsedBuckets int `json:"used_buckets" binding:"required,min=0"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Parse booking ID
	id, err := uuid.Parse(bookingID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid booking ID"})
		return
	}

	// Find range booking
	var booking models.RangeBooking
	if err := database.DB.Where("id = ? AND user_id = ?", id, userModel.ID).First(&booking).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Range booking not found"})
		return
	}

	// Validate bucket usage
	if req.UsedBuckets > booking.BucketCount {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot use more buckets than booked"})
		return
	}

	// Update used buckets
	booking.UsedBuckets = req.UsedBuckets
	if req.UsedBuckets >= booking.BucketCount {
		booking.Status = "completed"
	}

	if err := database.DB.Save(&booking).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update bucket usage"})
		return
	}

	c.JSON(http.StatusOK, booking)
}
