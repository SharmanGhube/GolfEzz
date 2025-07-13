package routes

import (
	"golfezz-backend/internal/config"
	"golfezz-backend/internal/handler"
	"golfezz-backend/internal/middleware"
	"golfezz-backend/internal/repository"
	"golfezz-backend/internal/service"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func InitializeRoutes(router *gin.Engine, db *gorm.DB, cfg *config.Config) {
	// Initialize repositories
	userRepo := repository.NewUserRepository(db)
	bookingRepo := repository.NewBookingRepository(db)
	teeTimeRepo := repository.NewTeeTimeRepository(db)
	rangeRepo := repository.NewRangeRepository(db)

	// Initialize services
	authService := service.NewAuthService(userRepo, cfg.JWT.Secret, cfg.JWT.ExpiresIn)
	bookingService := service.NewBookingService(bookingRepo, teeTimeRepo, userRepo)
	rangeService := service.NewRangeService(rangeRepo, userRepo)

	// Initialize handlers
	authHandler := handler.NewAuthHandler(authService)
	bookingHandler := handler.NewBookingHandler(bookingService)
	rangeHandler := handler.NewRangeHandler(rangeService)

	// API version 1
	v1 := router.Group("/api/v1")
	{
		// Public routes (no authentication required)
		auth := v1.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.POST("/refresh", authHandler.RefreshToken)
		}

		// Public course information
		public := v1.Group("/public")
		{
			// These would be implemented with a CourseHandler
			public.GET("/courses", func(c *gin.Context) {
				c.JSON(200, gin.H{"message": "Get golf courses - not implemented yet"})
			})
			public.GET("/courses/:id", func(c *gin.Context) {
				c.JSON(200, gin.H{"message": "Get course details - not implemented yet"})
			})
			public.GET("/green-conditions", func(c *gin.Context) {
				c.JSON(200, gin.H{"message": "Get green conditions - not implemented yet"})
			})
		}

		// Protected routes (authentication required)
		protected := v1.Group("/")
		protected.Use(middleware.JWTAuth(cfg.JWT.Secret))
		{
			// User profile
			protected.GET("/auth/profile", authHandler.GetProfile)
			protected.POST("/auth/change-password", authHandler.ChangePassword)

			// Bookings
			bookings := protected.Group("/bookings")
			{
				bookings.POST("", bookingHandler.CreateBooking)
				bookings.GET("/my", bookingHandler.GetUserBookings)
				bookings.GET("/:id", bookingHandler.GetBooking)
				bookings.PUT("/:id", bookingHandler.UpdateBooking)
				bookings.POST("/:id/cancel", bookingHandler.CancelBooking)
			}

			// Tee times (public access for viewing available slots)
			protected.GET("/bookings/available-slots", bookingHandler.GetAvailableSlots)

			// Range sessions
			range_group := protected.Group("/range")
			{
				// Sessions
				sessions := range_group.Group("/sessions")
				{
					sessions.POST("", rangeHandler.StartSession)
					sessions.GET("/active", rangeHandler.GetActiveSessions)
					sessions.GET("/:id", rangeHandler.GetSession)
					sessions.POST("/:id/end", rangeHandler.EndSession)
					sessions.POST("/:id/buckets", rangeHandler.AddBallBucket)
					sessions.POST("/:id/equipment", rangeHandler.AddEquipment)
				}

				// Ball buckets and equipment returns
				range_group.POST("/buckets/:id/return", rangeHandler.ReturnBallBucket)
				range_group.POST("/equipment/:id/return", rangeHandler.ReturnEquipment)
			}

			// Payments (placeholder routes)
			payments := protected.Group("/payments")
			{
				payments.POST("", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "Process payment - not implemented yet"})
				})
				payments.GET("/my", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "Get user payments - not implemented yet"})
				})
			}

			// Memberships (placeholder routes)
			memberships := protected.Group("/memberships")
			{
				memberships.GET("/types", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "Get membership types - not implemented yet"})
				})
				memberships.POST("", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "Create membership - not implemented yet"})
				})
				memberships.GET("/my", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "Get user memberships - not implemented yet"})
				})
			}

			// Dashboard data
			dashboard := protected.Group("/dashboard")
			{
				dashboard.GET("/stats", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "Get dashboard stats - not implemented yet"})
				})
				dashboard.GET("/recent-activity", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "Get recent activity - not implemented yet"})
				})
			}
		}

		// Admin routes (require admin role)
		admin := v1.Group("/admin")
		admin.Use(middleware.JWTAuth(cfg.JWT.Secret))
		admin.Use(middleware.RoleAuth("admin", "manager"))
		{
			// Course management
			courses := admin.Group("/courses")
			{
				courses.POST("", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "Create course - not implemented yet"})
				})
				courses.PUT("/:id", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "Update course - not implemented yet"})
				})
				courses.DELETE("/:id", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "Delete course - not implemented yet"})
				})
			}

			// Tee time management
			teetimes := admin.Group("/tee-times")
			{
				teetimes.POST("/bulk", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "Bulk create tee times - not implemented yet"})
				})
				teetimes.PUT("/:id", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "Update tee time - not implemented yet"})
				})
			}

			// User management
			users := admin.Group("/users")
			{
				users.GET("", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "List users - not implemented yet"})
				})
				users.PUT("/:id/status", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "Update user status - not implemented yet"})
				})
			}

			// Reports
			reports := admin.Group("/reports")
			{
				reports.GET("/bookings", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "Booking reports - not implemented yet"})
				})
				reports.GET("/revenue", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "Revenue reports - not implemented yet"})
				})
				reports.GET("/range", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "Range reports - not implemented yet"})
				})
			}
		}
	}
}
