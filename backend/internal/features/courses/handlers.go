package courses

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"golf-ezz-backend/internal/models"
)

type Handler struct {
	db *gorm.DB
}

func NewHandler(db *gorm.DB) *Handler {
	return &Handler{db: db}
}

// GetCourses retrieves all courses with pagination
func (h *Handler) GetCourses(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	offset := (page - 1) * limit

	var courses []models.Course
	var total int64

	// Count total courses
	if err := h.db.Model(&models.Course{}).Where("is_active = ?", true).Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to count courses",
		})
		return
	}

	// Get courses with pagination
	if err := h.db.Where("is_active = ?", true).
		Offset(offset).
		Limit(limit).
		Find(&courses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve courses",
		})
		return
	}

	totalPages := (int(total) + limit - 1) / limit

	response := gin.H{
		"data": courses,
		"pagination": gin.H{
			"page":        page,
			"limit":       limit,
			"total":       total,
			"total_pages": totalPages,
		},
	}

	c.JSON(http.StatusOK, response)
}

// GetCourse retrieves a single course by ID
func (h *Handler) GetCourse(c *gin.Context) {
	courseID := c.Param("id")

	var course models.Course
	if err := h.db.Where("id = ? AND is_active = ?", courseID, true).
		Preload("Conditions").
		First(&course).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Course not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve course",
		})
		return
	}

	c.JSON(http.StatusOK, course)
}

// SearchCourses searches courses by name or address
func (h *Handler) SearchCourses(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Search query is required",
		})
		return
	}

	var courses []models.Course
	searchPattern := "%" + query + "%"

	if err := h.db.Where("is_active = ? AND (name ILIKE ? OR address ILIKE ?)",
		true, searchPattern, searchPattern).
		Find(&courses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to search courses",
		})
		return
	}

	c.JSON(http.StatusOK, courses)
}

// GetFeaturedCourses retrieves featured courses
func (h *Handler) GetFeaturedCourses(c *gin.Context) {
	var courses []models.Course

	// For now, just return courses with higher green fees as "featured"
	if err := h.db.Where("is_active = ?", true).
		Order("green_fee DESC").
		Limit(6).
		Find(&courses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve featured courses",
		})
		return
	}

	c.JSON(http.StatusOK, courses)
}

// GetCourseAvailability retrieves available tee times for a course on a specific date
func (h *Handler) GetCourseAvailability(c *gin.Context) {
	courseID := c.Param("id")
	date := c.Query("date")

	if date == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Date is required",
		})
		return
	}

	// Verify course exists
	var course models.Course
	if err := h.db.Where("id = ? AND is_active = ?", courseID, true).First(&course).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Course not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to verify course",
		})
		return
	}

	// Get existing bookings for the date
	var bookedTimes []string
	if err := h.db.Model(&models.TeeTimeBooking{}).
		Where("course_id = ? AND date = ? AND status IN ?",
			courseID, date, []string{"confirmed", "pending"}).
		Pluck("time", &bookedTimes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to check existing bookings",
		})
		return
	}

	// Generate available time slots (example: 7:00 AM to 6:00 PM, every 15 minutes)
	allTimes := generateTimeSlots()
	availableTimes := []string{}

	for _, time := range allTimes {
		isBooked := false
		for _, bookedTime := range bookedTimes {
			if time == bookedTime {
				isBooked = true
				break
			}
		}
		if !isBooked {
			availableTimes = append(availableTimes, time)
		}
	}

	c.JSON(http.StatusOK, availableTimes)
}

// Helper function to generate time slots
func generateTimeSlots() []string {
	times := []string{}

	// Generate times from 7:00 AM to 6:00 PM in 15-minute intervals
	for hour := 7; hour <= 18; hour++ {
		for minute := 0; minute < 60; minute += 15 {
			var timeStr string
			if hour < 12 {
				if hour == 0 {
					timeStr = "12"
				} else {
					timeStr = strconv.Itoa(hour)
				}
				timeStr += ":"
				if minute < 10 {
					timeStr += "0"
				}
				timeStr += strconv.Itoa(minute) + " AM"
			} else {
				displayHour := hour
				if hour > 12 {
					displayHour = hour - 12
				}
				timeStr = strconv.Itoa(displayHour) + ":"
				if minute < 10 {
					timeStr += "0"
				}
				timeStr += strconv.Itoa(minute) + " PM"
			}
			times = append(times, timeStr)
		}
	}

	return times
}
