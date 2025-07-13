package handler

import (
	"net/http"
	"strconv"
	"golfezz-backend/internal/service"

	"github.com/gin-gonic/gin"
)

type RangeHandler struct {
	rangeService service.RangeService
}

func NewRangeHandler(rangeService service.RangeService) *RangeHandler {
	return &RangeHandler{
		rangeService: rangeService,
	}
}

// @Summary Start a new range session
// @Description Start a new driving range session
// @Tags range
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param request body service.StartSessionRequest true "Start session request"
// @Success 201 {object} models.RangeSession
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Router /range/sessions [post]
func (h *RangeHandler) StartSession(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var req service.StartSessionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	session, err := h.rangeService.StartSession(userID.(uint), req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Range session started successfully",
		"session": session,
	})
}

// @Summary Get range session by ID
// @Description Get a specific range session by ID
// @Tags range
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Session ID"
// @Success 200 {object} models.RangeSession
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /range/sessions/{id} [get]
func (h *RangeHandler) GetSession(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid session ID"})
		return
	}

	session, err := h.rangeService.GetSessionByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Session not found"})
		return
	}

	c.JSON(http.StatusOK, session)
}

// @Summary Get active user sessions
// @Description Get all active range sessions for the authenticated user
// @Tags range
// @Produce json
// @Security ApiKeyAuth
// @Success 200 {array} models.RangeSession
// @Failure 401 {object} map[string]string
// @Router /range/sessions/active [get]
func (h *RangeHandler) GetActiveSessions(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	sessions, err := h.rangeService.GetActiveUserSessions(userID.(uint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"sessions": sessions,
		"count":    len(sessions),
	})
}

// @Summary End a range session
// @Description End an active range session
// @Tags range
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Session ID"
// @Success 200 {object} models.RangeSession
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Router /range/sessions/{id}/end [post]
func (h *RangeHandler) EndSession(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid session ID"})
		return
	}

	session, err := h.rangeService.EndSession(uint(id), userID.(uint))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Session ended successfully",
		"session": session,
	})
}

// @Summary Add ball bucket to session
// @Description Add a ball bucket to an active range session
// @Tags range
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Session ID"
// @Param request body service.AddBallBucketRequest true "Ball bucket request"
// @Success 201 {object} models.BallBucket
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Router /range/sessions/{id}/buckets [post]
func (h *RangeHandler) AddBallBucket(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid session ID"})
		return
	}

	var req service.AddBallBucketRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	bucket, err := h.rangeService.AddBallBucket(uint(id), req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Ball bucket added successfully",
		"bucket":  bucket,
	})
}

// @Summary Add equipment to session
// @Description Add equipment rental to an active range session
// @Tags range
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Session ID"
// @Param request body service.AddEquipmentRequest true "Equipment request"
// @Success 201 {object} models.RangeEquipment
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Router /range/sessions/{id}/equipment [post]
func (h *RangeHandler) AddEquipment(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid session ID"})
		return
	}

	var req service.AddEquipmentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	equipment, err := h.rangeService.AddEquipment(uint(id), req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":   "Equipment added successfully",
		"equipment": equipment,
	})
}

// @Summary Return ball bucket
// @Description Return a ball bucket
// @Tags range
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Bucket ID"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Router /range/buckets/{id}/return [post]
func (h *RangeHandler) ReturnBallBucket(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid bucket ID"})
		return
	}

	err = h.rangeService.ReturnBallBucket(uint(id))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Ball bucket returned successfully"})
}

// @Summary Return equipment
// @Description Return rented equipment
// @Tags range
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Equipment ID"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Router /range/equipment/{id}/return [post]
func (h *RangeHandler) ReturnEquipment(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid equipment ID"})
		return
	}

	err = h.rangeService.ReturnEquipment(uint(id))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Equipment returned successfully"})
}
