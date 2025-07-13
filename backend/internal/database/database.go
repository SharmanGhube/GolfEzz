package database

import (
	"fmt"
	"golfezz-backend/internal/config"
	"golfezz-backend/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func NewConnection(cfg config.DatabaseConfig) (*gorm.DB, error) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		cfg.Host, cfg.User, cfg.Password, cfg.Name, cfg.Port, cfg.SSLMode)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	return db, nil
}

func RunMigrations(db *gorm.DB) error {
	err := db.AutoMigrate(
		// User and Authentication
		&models.User{},
		&models.Role{},
		&models.UserRole{},

		// Golf Course
		&models.GolfCourse{},
		&models.Hole{},
		&models.Tee{},
		&models.GreenCondition{},

		// Bookings
		&models.TeeTimeSlot{},
		&models.Booking{},
		&models.BookingPlayer{},

		// Range and Equipment
		&models.RangeSession{},
		&models.BallBucket{},
		&models.RangeEquipment{},

		// Payments
		&models.Payment{},
		&models.PaymentMethod{},

		// Membership
		&models.Membership{},
		&models.MembershipType{},

		// Notifications
		&models.Notification{},

		// Audit
		&models.AuditLog{},
	)

	if err != nil {
		return fmt.Errorf("failed to run migrations: %w", err)
	}

	// Create default data
	if err := createDefaultData(db); err != nil {
		return fmt.Errorf("failed to create default data: %w", err)
	}

	return nil
}

func createDefaultData(db *gorm.DB) error {
	// Create default roles
	roles := []models.Role{
		{Name: "admin", Description: "Administrator with full access"},
		{Name: "manager", Description: "Golf course manager"},
		{Name: "staff", Description: "Golf course staff"},
		{Name: "member", Description: "Golf course member"},
		{Name: "guest", Description: "Guest player"},
	}

	for _, role := range roles {
		var existingRole models.Role
		if err := db.Where("name = ?", role.Name).First(&existingRole).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				if err := db.Create(&role).Error; err != nil {
					return fmt.Errorf("failed to create role %s: %w", role.Name, err)
				}
			}
		}
	}

	// Create default membership types
	membershipTypes := []models.MembershipType{
		{
			Name:               "Premium",
			Description:        "Premium membership with full access",
			MonthlyFee:         200.00,
			TeeTimeDiscount:    20.0,
			RangeDiscount:      15.0,
			MaxAdvanceBookings: 14,
		},
		{
			Name:               "Standard",
			Description:        "Standard membership",
			MonthlyFee:         120.00,
			TeeTimeDiscount:    10.0,
			RangeDiscount:      10.0,
			MaxAdvanceBookings: 7,
		},
		{
			Name:               "Basic",
			Description:        "Basic membership",
			MonthlyFee:         80.00,
			TeeTimeDiscount:    5.0,
			RangeDiscount:      5.0,
			MaxAdvanceBookings: 3,
		},
	}

	for _, membershipType := range membershipTypes {
		var existing models.MembershipType
		if err := db.Where("name = ?", membershipType.Name).First(&existing).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				if err := db.Create(&membershipType).Error; err != nil {
					return fmt.Errorf("failed to create membership type %s: %w", membershipType.Name, err)
				}
			}
		}
	}

	return nil
}
