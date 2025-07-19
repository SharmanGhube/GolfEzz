// Package courses provides course-related functionality
package courses

import (
	"net/http"
	"strconv"

	"golf-ezz-backend/internal/database"
	"golf-ezz-backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// NewCourseHandler creates a new course handler
func NewCourseHandler() *CourseHandler {
	return &CourseHandler{}
}

// CourseHandler handles course-related requests
type CourseHandler struct{}

// GetCourses retrieves all courses
func (h *CourseHandler) GetCourses(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset := (page - 1) * limit

	var courses []models.Course
	var total int64

	db := database.GetDB()

	// Count total courses
	db.Model(&models.Course{}).Where("is_active = ?", true).Count(&total)

	// Get courses with pagination
	result := db.Where("is_active = ?", true).
		Preload("Conditions").
		Offset(offset).
		Limit(limit).
		Find(&courses)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve courses",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    courses,
		"pagination": gin.H{
			"page":       page,
			"limit":      limit,
			"total":      total,
			"totalPages": (total + int64(limit) - 1) / int64(limit),
		},
	})
}

// GetCourse retrieves a single course by ID
func (h *CourseHandler) GetCourse(c *gin.Context) {
	courseID := c.Param("id")

	parsedID, err := uuid.Parse(courseID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid course ID",
		})
		return
	}

	var course models.Course
	db := database.GetDB()

	result := db.Where("id = ? AND is_active = ?", parsedID, true).
		Preload("Conditions").
		First(&course)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Course not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    course,
	})
}

// CreateCourse creates a new course (admin only)
func (h *CourseHandler) CreateCourse(c *gin.Context) {
	var course models.Course

	if err := c.ShouldBindJSON(&course); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid course data",
		})
		return
	}

	// Generate new UUID
	course.ID = uuid.New()
	course.IsActive = true

	db := database.GetDB()
	result := db.Create(&course)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create course",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data":    course,
	})
}

// UpdateCourse updates an existing course (admin only)
func (h *CourseHandler) UpdateCourse(c *gin.Context) {
	courseID := c.Param("id")

	parsedID, err := uuid.Parse(courseID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid course ID",
		})
		return
	}

	var course models.Course
	db := database.GetDB()

	// Check if course exists
	result := db.Where("id = ?", parsedID).First(&course)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Course not found",
		})
		return
	}

	// Bind updated data
	if err := c.ShouldBindJSON(&course); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid course data",
		})
		return
	}

	// Update course
	result = db.Save(&course)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update course",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    course,
	})
}

// DeleteCourse soft deletes a course (admin only)
func (h *CourseHandler) DeleteCourse(c *gin.Context) {
	courseID := c.Param("id")

	parsedID, err := uuid.Parse(courseID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid course ID",
		})
		return
	}

	db := database.GetDB()

	// Soft delete by setting is_active to false
	result := db.Model(&models.Course{}).
		Where("id = ?", parsedID).
		Update("is_active", false)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to delete course",
		})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Course not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Course deleted successfully",
	})
}

// UpdateCourseConditions updates course conditions
func (h *CourseHandler) UpdateCourseConditions(c *gin.Context) {
	courseID := c.Param("id")

	parsedID, err := uuid.Parse(courseID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid course ID",
		})
		return
	}

	var conditions models.CourseCondition
	if err := c.ShouldBindJSON(&conditions); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid conditions data",
		})
		return
	}

	conditions.ID = uuid.New()
	conditions.CourseID = parsedID

	db := database.GetDB()
	result := db.Create(&conditions)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update course conditions",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    conditions,
	})
}
