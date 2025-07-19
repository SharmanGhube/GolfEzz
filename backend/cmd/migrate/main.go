package main

import (
	"log"

	"golf-ezz-backend/internal/config"
	"golf-ezz-backend/internal/database"
	"golf-ezz-backend/internal/models"

	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Initialize database connection
	cfg := config.Load()
	err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	db := database.DB

	// Auto-migrate all models
	log.Println("Running database migrations...")

	err = db.AutoMigrate(
		&models.User{},
		&models.Course{},
		&models.CourseCondition{},
		&models.TeeTimeBooking{},
		&models.RangeBooking{},
		&models.Payment{},
		&models.Review{},
		&models.Notification{},
		&models.InventoryItem{},
		&models.Analytics{},
	)

	if err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	log.Println("Database migrations completed successfully!")

	// Create initial admin user if not exists
	var adminUser models.User
	result := db.Where("email = ?", "admin@golfezz.com").First(&adminUser)
	if result.Error != nil {
		log.Println("Creating initial admin user...")
		adminUser = models.User{
			Email: "admin@golfezz.com",
			Name:  "Admin User",
			Role:  "admin",
		}
		if err := db.Create(&adminUser).Error; err != nil {
			log.Printf("Failed to create admin user: %v", err)
		} else {
			log.Println("Admin user created successfully!")
		}
	} else {
		log.Println("Admin user already exists")
	}
}
