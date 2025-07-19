package main

import (
	"log"
	"time"

	"golf-ezz-backend/internal/config"
	"golf-ezz-backend/internal/database"
	"golf-ezz-backend/internal/models"

	"github.com/joho/godotenv"
	"gorm.io/gorm"
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

	log.Println("Seeding database with sample data...")

	// Seed sample courses
	seedCourses(db)

	// Seed sample users
	seedUsers(db)

	// Seed course conditions
	seedCourseConditions(db)

	log.Println("Database seeding completed successfully!")
}

func seedCourses(db *gorm.DB) {
	// Create courses with simpler structure first
	courses := []struct {
		Name            string
		Description     string
		Address         string
		Phone           string
		Email           string
		Website         *string
		Holes           int
		Par             int
		Length          int
		Difficulty      string
		GreenFeeWeekday float64
		GreenFeeWeekend float64
		GreenFeeHoliday float64
		CartFee         float64
		ClubRentalFee   float64
		RangeBallPrice  float64
		IsActive        bool
	}{
		{
			Name:            "Pine Valley Golf Course",
			Description:     "Championship 18-hole course with pristine fairways and challenging greens",
			Address:         "123 Golf Course Drive, Pine Valley, CA 90210",
			Phone:           "(555) 123-4567",
			Email:           "info@pinevalley.com",
			Website:         stringPtr("https://pinevalley.com"),
			Holes:           18,
			Par:             72,
			Length:          6800,
			Difficulty:      "Championship",
			GreenFeeWeekday: 120.00,
			GreenFeeWeekend: 150.00,
			GreenFeeHoliday: 175.00,
			CartFee:         25.00,
			ClubRentalFee:   35.00,
			RangeBallPrice:  8.00,
			IsActive:        true,
		},
		{
			Name:            "Oak Ridge Country Club",
			Description:     "Scenic 18-hole course nestled in rolling hills",
			Address:         "456 Country Club Road, Oak Ridge, CA 90211",
			Phone:           "(555) 987-6543",
			Email:           "contact@oakridge.com",
			Website:         stringPtr("https://oakridge.com"),
			Holes:           18,
			Par:             71,
			Length:          6400,
			Difficulty:      "Resort",
			GreenFeeWeekday: 75.00,
			GreenFeeWeekend: 95.00,
			GreenFeeHoliday: 110.00,
			CartFee:         20.00,
			ClubRentalFee:   30.00,
			RangeBallPrice:  6.00,
			IsActive:        true,
		},
		{
			Name:            "Mountain View Golf Club",
			Description:     "Challenging mountain course with spectacular views",
			Address:         "789 Mountain Drive, Hillside, CA 90212",
			Phone:           "(555) 456-7890",
			Email:           "info@mountainview.com",
			Website:         stringPtr("https://mountainview.com"),
			Holes:           18,
			Par:             70,
			Length:          6200,
			Difficulty:      "Advanced",
			GreenFeeWeekday: 100.00,
			GreenFeeWeekend: 120.00,
			GreenFeeHoliday: 140.00,
			CartFee:         22.00,
			ClubRentalFee:   32.00,
			RangeBallPrice:  7.00,
			IsActive:        true,
		},
	}

	for _, courseData := range courses {
		var existingCourse models.Course
		result := db.Where("name = ?", courseData.Name).First(&existingCourse)
		if result.Error != nil {
			// Create course without JSONB fields first
			course := models.Course{
				Name:            courseData.Name,
				Description:     courseData.Description,
				Address:         courseData.Address,
				Phone:           courseData.Phone,
				Email:           courseData.Email,
				Website:         courseData.Website,
				Holes:           courseData.Holes,
				Par:             courseData.Par,
				Length:          courseData.Length,
				Difficulty:      courseData.Difficulty,
				GreenFeeWeekday: courseData.GreenFeeWeekday,
				GreenFeeWeekend: courseData.GreenFeeWeekend,
				GreenFeeHoliday: courseData.GreenFeeHoliday,
				CartFee:         courseData.CartFee,
				ClubRentalFee:   courseData.ClubRentalFee,
				RangeBallPrice:  courseData.RangeBallPrice,
				IsActive:        courseData.IsActive,
			}

			if err := db.Create(&course).Error; err != nil {
				log.Printf("Failed to create course %s: %v", courseData.Name, err)
			} else {
				log.Printf("Created course: %s", courseData.Name)

				// Update with amenities as PostgreSQL text array
				var amenities models.StringArray
				if courseData.Name == "Oak Ridge Country Club" {
					amenities = models.StringArray{"Pro Shop", "Clubhouse", "Cart Rental", "Practice Green"}
				} else if courseData.Name == "Mountain View Golf Club" {
					amenities = models.StringArray{"Pro Shop", "Restaurant", "Scenic Views", "Practice Facility"}
				} else {
					amenities = models.StringArray{"Pro Shop", "Restaurant", "Cart Rental", "Driving Range"}
				}

				// Update the course with amenities
				db.Model(&course).Update("amenities", amenities)
			}
		} else {
			log.Printf("Course already exists: %s", courseData.Name)
		}
	}
}

func seedUsers(db *gorm.DB) {
	users := []struct {
		Email          string
		Name           string
		Role           string
		MembershipType *string
		Phone          *string
		Handicap       *float64
	}{
		{
			Email:          "john.smith@example.com",
			Name:           "John Smith",
			Role:           "member",
			MembershipType: stringPtr("Premium"),
			Phone:          stringPtr("(555) 111-2222"),
			Handicap:       float64Ptr(12.5),
		},
		{
			Email:          "sarah.johnson@example.com",
			Name:           "Sarah Johnson",
			Role:           "member",
			MembershipType: stringPtr("Standard"),
			Phone:          stringPtr("(555) 333-4444"),
			Handicap:       float64Ptr(18.2),
		},
		{
			Email:          "mike.wilson@example.com",
			Name:           "Mike Wilson",
			Role:           "member",
			MembershipType: stringPtr("Premium"),
			Phone:          stringPtr("(555) 555-6666"),
			Handicap:       float64Ptr(8.3),
		},
	}

	for _, userData := range users {
		var existingUser models.User
		result := db.Where("email = ?", userData.Email).First(&existingUser)
		if result.Error != nil {
			// Create user without complex JSONB preferences
			user := models.User{
				Email:          userData.Email,
				Name:           userData.Name,
				Role:           userData.Role,
				MembershipType: userData.MembershipType,
				Phone:          userData.Phone,
				Handicap:       userData.Handicap,
			}

			if err := db.Create(&user).Error; err != nil {
				log.Printf("Failed to create user %s: %v", userData.Email, err)
			} else {
				log.Printf("Created user: %s", userData.Email)

				// Update with default preferences using raw SQL
				preferences := `{"preferred_tee_time": "morning", "preferred_courses": [], "notifications": {"email": true, "sms": false, "push": true}, "playing_style": "casual"}`
				db.Exec("UPDATE users SET preferences = ? WHERE id = ?", preferences, user.ID)
			}
		} else {
			log.Printf("User already exists: %s", userData.Email)
		}
	}
}

func seedCourseConditions(db *gorm.DB) {
	var courses []models.Course
	db.Find(&courses)

	for _, course := range courses {
		condition := models.CourseCondition{
			CourseID:         course.ID,
			GreenSpeed:       8,
			FairwayCondition: "Excellent",
			RoughCondition:   "Good",
			BunkerCondition:  "Good",
			WeatherCondition: "Sunny",
			Temperature:      72.0,
			WindSpeed:        5.0,
			Humidity:         45.0,
			LastUpdated:      time.Now(),
		}

		var existingCondition models.CourseCondition
		result := db.Where("course_id = ?", course.ID).First(&existingCondition)
		if result.Error != nil {
			if err := db.Create(&condition).Error; err != nil {
				log.Printf("Failed to create condition for course %s: %v", course.Name, err)
			} else {
				log.Printf("Created condition for course: %s", course.Name)
			}
		} else {
			log.Printf("Condition already exists for course: %s", course.Name)
		}
	}
}

// Helper functions
func stringPtr(s string) *string {
	return &s
}

func float64Ptr(f float64) *float64 {
	return &f
}
