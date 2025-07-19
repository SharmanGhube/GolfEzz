// Package main is the entry point for the Golf Course Management System backend
package main

import (
	"log"
	"net/http"

	"golf-ezz-backend/internal/config"
	"golf-ezz-backend/internal/database"
	"golf-ezz-backend/internal/features/admin"
	"golf-ezz-backend/internal/features/auth"
	"golf-ezz-backend/internal/features/bookings"
	"golf-ezz-backend/internal/features/courses"
	"golf-ezz-backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

// @title Golf Course Management System API
// @version 1.0
// @description A comprehensive golf course management system
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.golfezz.com/support
// @contact.email support@golfezz.com

// @license.name MIT
// @license.url https://opensource.org/licenses/MIT

// @host localhost:8080
// @BasePath /api/v1

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization

func main() {
	// Load configuration
	cfg := config.Load()

	// Connect to database
	if err := database.Connect(cfg); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer database.Close()

	// Run migrations
	if err := database.Migrate(); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// Set Gin mode
	if !cfg.App.Debug {
		gin.SetMode(gin.ReleaseMode)
	}

	// Initialize router
	router := gin.New()

	// Apply middleware
	router.Use(middleware.LoggerMiddleware())
	router.Use(middleware.CORSMiddleware())
	router.Use(gin.Recovery())

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "healthy",
			"service": "golf-course-management",
			"version": "1.0.0",
		})
	})

	// API v1 routes
	v1 := router.Group("/api/v1")
	{
		// Public routes
		setupPublicRoutes(v1, cfg)

		// Protected routes (require authentication)
		protected := v1.Group("")
		protected.Use(middleware.JWTMiddleware(cfg))
		{
			setupProtectedRoutes(protected, cfg)
		}

		// Admin routes (require admin role)
		admin := v1.Group("/admin")
		admin.Use(middleware.JWTMiddleware(cfg))
		admin.Use(middleware.AdminMiddleware())
		{
			setupAdminRoutes(admin, cfg)
		}
	}

	// Start server
	serverAddr := cfg.Server.Host + ":" + cfg.Server.Port
	log.Printf("Server starting on %s", serverAddr)
	log.Fatal(http.ListenAndServe(serverAddr, router))
}

// setupPublicRoutes sets up public API routes
func setupPublicRoutes(router *gin.RouterGroup, cfg *config.Config) {
	// Authentication routes
	authHandler := auth.NewAuthHandler(cfg)
	router.POST("/auth/register", authHandler.Register)
	router.POST("/auth/login", authHandler.Login)

	// Course routes (public)
	courseHandler := courses.NewCourseHandler()
	router.GET("/courses", courseHandler.GetCourses)
	router.GET("/courses/:id", courseHandler.GetCourse)
	router.GET("/courses/:id/availability", bookings.NewBookingHandler().GetAvailableTimeSlots)

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "healthy",
		})
	})
}

// setupProtectedRoutes sets up protected API routes (require authentication)
func setupProtectedRoutes(router *gin.RouterGroup, cfg *config.Config) {
	// User profile routes
	authHandler := auth.NewAuthHandler(cfg)
	router.GET("/auth/profile", authHandler.GetProfile)
	router.PUT("/auth/profile", authHandler.UpdateProfile)

	// User booking routes
	bookingHandler := bookings.NewBookingHandler()
	router.GET("/my/bookings", bookingHandler.GetMyBookings)
	router.POST("/bookings/tee-time", bookingHandler.CreateTeeTimeBooking)
	router.DELETE("/bookings/:id", bookingHandler.CancelBooking)

	// Range booking routes
	router.GET("/my/range-bookings", bookingHandler.GetMyRangeBookings)
	router.POST("/bookings/range", bookingHandler.CreateRangeBooking)
	router.PUT("/range-bookings/:id/usage", bookingHandler.UpdateBucketUsage)
}

// setupAdminRoutes sets up admin API routes
func setupAdminRoutes(router *gin.RouterGroup, cfg *config.Config) {
	// Course management (admin only)
	courseHandler := courses.NewCourseHandler()
	router.POST("/courses", courseHandler.CreateCourse)
	router.PUT("/courses/:id", courseHandler.UpdateCourse)
	router.DELETE("/courses/:id", courseHandler.DeleteCourse)
	router.PUT("/courses/:id/conditions", courseHandler.UpdateCourseConditions)

	// User management (admin only)
	adminHandler := admin.NewAdminHandler()
	router.GET("/users", adminHandler.GetAllUsers)
	router.GET("/users/:id", adminHandler.GetUserByID)
	router.PUT("/users/:id/role", adminHandler.UpdateUserRole)

	// Booking management (admin only)
	router.GET("/bookings", adminHandler.GetAllBookings)
	router.GET("/bookings/by-date", adminHandler.GetBookingsByDate)
	router.PUT("/bookings/:id/status", adminHandler.UpdateBookingStatus)

	// Analytics and reporting (admin only)
	router.GET("/dashboard/stats", adminHandler.GetDashboardStats)
	router.GET("/reports/revenue", adminHandler.GetRevenueReport)
	router.GET("/system/logs", adminHandler.GetSystemLogs)
	router.GET("/export", adminHandler.ExportData)
}
