package handler

import (
	"net/http"
	"strconv"
	"time"
	"golfezz-backend/internal/service"

	"github.com/gin-gonic/gin"
)

type BookingHandler struct {
	bookingService service.BookingService
}

func NewBookingHandler(bookingService service.BookingService) *BookingHandler {
	return &BookingHandler{
		bookingService: bookingService,
	}
}

// @Summary Create a new booking
// @Description Create a new tee time booking
// @Tags bookings
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param request body service.CreateBookingRequest true "Booking request"
// @Success 201 {object} models.Booking
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Router /bookings [post]
func (h *BookingHandler) CreateBooking(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var req service.CreateBookingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	booking, err := h.bookingService.CreateBooking(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Set the user ID for the booking
	booking.UserID = userID.(uint)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Booking created successfully",
		"booking": booking,
	})
}

// @Summary Get booking by ID
// @Description Get a specific booking by ID
// @Tags bookings
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Booking ID"
// @Success 200 {object} models.Booking
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /bookings/{id} [get]
func (h *BookingHandler) GetBooking(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid booking ID"})
		return
	}

	booking, err := h.bookingService.GetBookingByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	c.JSON(http.StatusOK, booking)
}

// @Summary Get user bookings
// @Description Get all bookings for the authenticated user
// @Tags bookings
// @Produce json
// @Security ApiKeyAuth
// @Success 200 {array} models.Booking
// @Failure 401 {object} map[string]string
// @Router /bookings/my [get]
func (h *BookingHandler) GetUserBookings(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	bookings, err := h.bookingService.GetUserBookings(userID.(uint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"bookings": bookings,
		"count":    len(bookings),
	})
}

// @Summary Update booking
// @Description Update an existing booking
// @Tags bookings
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Booking ID"
// @Param request body service.UpdateBookingRequest true "Update booking request"
// @Success 200 {object} models.Booking
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /bookings/{id} [put]
func (h *BookingHandler) UpdateBooking(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid booking ID"})
		return
	}

	var req service.UpdateBookingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	booking, err := h.bookingService.UpdateBooking(uint(id), req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Booking updated successfully",
		"booking": booking,
	})
}

// @Summary Cancel booking
// @Description Cancel an existing booking
// @Tags bookings
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Booking ID"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Router /bookings/{id}/cancel [post]
func (h *BookingHandler) CancelBooking(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid booking ID"})
		return
	}

	err = h.bookingService.CancelBooking(uint(id), userID.(uint))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Booking cancelled successfully"})
}

// @Summary Get available tee times
// @Description Get available tee time slots for a specific course and date
// @Tags bookings
// @Produce json
// @Param course_id query int true "Golf Course ID"
// @Param date query string true "Date (YYYY-MM-DD format)"
// @Success 200 {array} models.TeeTimeSlot
// @Failure 400 {object} map[string]string
// @Router /bookings/available-slots [get]
func (h *BookingHandler) GetAvailableSlots(c *gin.Context) {
	courseIDStr := c.Query("course_id")
	dateStr := c.Query("date")

	if courseIDStr == "" || dateStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "course_id and date parameters are required"})
		return
	}

	courseID, err := strconv.ParseUint(courseIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid course ID"})
		return
	}

	date, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Use YYYY-MM-DD"})
		return
	}

	slots, err := h.bookingService.GetAvailableSlots(uint(courseID), date)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"slots": slots,
		"count": len(slots),
		"date":  dateStr,
	})
}
