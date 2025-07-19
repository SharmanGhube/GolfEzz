// Package auth provides authentication functionality
package auth

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"net/http"
	"strings"
	"time"

	"golf-ezz-backend/internal/config"
	"golf-ezz-backend/internal/database"
	"golf-ezz-backend/internal/models"

	"errors"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// AuthHandler handles authentication requests
type AuthHandler struct {
	config *config.Config
}

// NewAuthHandler creates a new auth handler
func NewAuthHandler(cfg *config.Config) *AuthHandler {
	return &AuthHandler{config: cfg}
}

// LoginRequest represents login request payload
type LoginRequest struct {
	Email        string `json:"email" binding:"required,email"`
	Password     string `json:"password" binding:"required"`
	ExpectedRole string `json:"expected_role,omitempty"` // Optional: validate user role matches expected
}

// RegisterRequest represents registration request payload
type RegisterRequest struct {
	Email          string `json:"email" binding:"required,email"`
	Name           string `json:"name" binding:"required"`
	Password       string `json:"password" binding:"required,min=6"`
	Phone          string `json:"phone"`
	Role           string `json:"role"`
	Address        string `json:"address"`
	DateOfBirth    string `json:"date_of_birth"`
	MembershipType string `json:"membership_type"`
}

// LoginResponse represents login response
type LoginResponse struct {
	Token     string      `json:"token"`
	User      models.User `json:"user"`
	ExpiresAt time.Time   `json:"expires_at"`
}

// Register handles user registration
func (h *AuthHandler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if user already exists
	var existingUser models.User
	if err := database.DB.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "User already exists"})
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// Determine role - default to member if not specified or invalid
	role := "member"
	if req.Role == "admin" || req.Role == "member" {
		role = req.Role
	}

	// Parse date of birth if provided
	var dateOfBirth *time.Time
	if req.DateOfBirth != "" {
		if parsedDate, err := time.Parse("2006-01-02", req.DateOfBirth); err == nil {
			dateOfBirth = &parsedDate
		}
	}

	// Set membership type if provided
	var membershipType *string
	if req.MembershipType != "" {
		membershipType = &req.MembershipType
	}

	// Set address if provided
	var address *string
	if req.Address != "" {
		address = &req.Address
	}

	// Set phone if provided
	var phone *string
	if req.Phone != "" {
		phone = &req.Phone
	}

	// Create user
	user := models.User{
		Email:          req.Email,
		Name:           req.Name,
		Role:           role,
		Phone:          phone,
		Address:        address,
		DateOfBirth:    dateOfBirth,
		MembershipType: membershipType,
		Password:       string(hashedPassword),
		Preferences: models.UserPreferences{
			PreferredTeeTime: "morning",
			PreferredCourses: []string{},
			Notifications: models.NotificationSettings{
				Email: true,
				SMS:   false,
				Push:  true,
			},
			PlayingStyle: "casual",
		},
	}

	if err := database.DB.Create(&user).Error; err != nil {
		// Check if it's a unique constraint violation (duplicate email)
		if strings.Contains(err.Error(), "duplicate key value violates unique constraint") ||
			strings.Contains(err.Error(), "idx_users_email") {
			c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
			return
		}
		// Log the actual error for debugging
		fmt.Printf("Database error during user creation: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	// Generate JWT token
	token, expiresAt, err := h.generateJWT(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// Create response without password
	responseUser := user
	responseUser.Password = ""

	c.JSON(http.StatusCreated, LoginResponse{
		Token:     token,
		User:      responseUser,
		ExpiresAt: expiresAt,
	})
}

// Login handles user login
func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	// Debug logging
	log.Printf("Login attempt: email=%s, expected_role=%s", req.Email, req.ExpectedRole)

	// Validate input
	if req.Email == "" || req.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email and password are required"})
		return
	}

	// Find user by email
	var user models.User
	if err := database.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Debug logging
	log.Printf("User found: email=%s, user_role=%s", user.Email, user.Role)

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Role validation: Check if expected role matches user's actual role
	if req.ExpectedRole != "" {
		expectedRole := strings.ToLower(strings.TrimSpace(req.ExpectedRole))
		userRole := strings.ToLower(strings.TrimSpace(user.Role))

		log.Printf("Role validation: expected=%s, actual=%s", expectedRole, userRole)

		if expectedRole != userRole {
			log.Printf("Role mismatch: user with role '%s' tried to login as '%s'", userRole, expectedRole)
			c.JSON(http.StatusUnauthorized, gin.H{"error": fmt.Sprintf("Access denied: User role '%s' cannot access %s portal", userRole, expectedRole)})
			return
		}
	}

	// Generate JWT token
	token, expiresAt, err := h.generateJWT(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// Update last login time
	user.LastLoginAt = &time.Time{}
	*user.LastLoginAt = time.Now()
	database.DB.Save(&user)

	log.Printf("Login successful: email=%s, role=%s", user.Email, user.Role)

	// Return success response
	c.JSON(http.StatusOK, gin.H{
		"message":    "Login successful",
		"token":      token,
		"expires_at": expiresAt,
		"user": gin.H{
			"id":              user.ID,
			"email":           user.Email,
			"name":            user.Name,
			"role":            user.Role,
			"membership_type": user.MembershipType,
			"admin_level":     user.AdminLevel,
			"image":           user.Image,
		},
	})
}

// GetProfile returns the current user's profile
func (h *AuthHandler) GetProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in token"})
		return
	}

	// Convert userID to string if it's a float64 (from JWT claims)
	var userIDStr string
	switch v := userID.(type) {
	case string:
		userIDStr = v
	case float64:
		userIDStr = fmt.Sprintf("%.0f", v)
	default:
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID format"})
		return
	}

	// Query user from database using GORM
	var user models.User
	if err := database.DB.Where("id = ?", userIDStr).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Remove sensitive information before sending response
	user.Password = ""

	c.JSON(http.StatusOK, user)
}

// UpdateProfile updates the current user's profile
func (h *AuthHandler) UpdateProfile(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	userModel := user.(models.User)

	var updateReq struct {
		Name     string   `json:"name"`
		Phone    *string  `json:"phone"`
		Handicap *float64 `json:"handicap"`
	}

	if err := c.ShouldBindJSON(&updateReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update user fields
	if updateReq.Name != "" {
		userModel.Name = updateReq.Name
	}
	if updateReq.Phone != nil {
		userModel.Phone = updateReq.Phone
	}
	if updateReq.Handicap != nil {
		userModel.Handicap = updateReq.Handicap
	}

	// Save to database
	if err := database.DB.Save(&userModel).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	responseUser := userModel
	responseUser.Password = "" // Remove password from response
	c.JSON(http.StatusOK, responseUser)
}

// generateJWT generates a JWT token for the user
func (h *AuthHandler) generateJWT(user models.User) (string, time.Time, error) {
	expiresAt := time.Now().Add(24 * time.Hour) // Token expires in 24 hours

	claims := jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"role":    user.Role,
		"exp":     expiresAt.Unix(),
		"iat":     time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(h.config.JWT.Secret))
	if err != nil {
		return "", time.Time{}, err
	}

	return tokenString, expiresAt, nil
}

// generateRandomString generates a random string for various purposes
func generateRandomString(length int) (string, error) {
	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(bytes)[:length], nil
}
