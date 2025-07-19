// Package database provides database connection and management
package database

import (
	"fmt"
	"log"

	"golf-ezz-backend/internal/config"
	"golf-ezz-backend/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// DB is the global database instance
var DB *gorm.DB

// Connect initializes the database connection
func Connect(cfg *config.Config) error {
	var err error

	gormConfig := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	}

	if !cfg.App.Debug {
		gormConfig.Logger = logger.Default.LogMode(logger.Silent)
	}

	DB, err = gorm.Open(postgres.Open(cfg.Database.DSN), gormConfig)
	if err != nil {
		return fmt.Errorf("failed to connect to database: %w", err)
	}

	log.Println("Database connected successfully")
	return nil
}

// Migrate runs database migrations
func Migrate() error {
	if DB == nil {
		return fmt.Errorf("database not connected")
	}

	log.Println("Running database migrations...")

	err := DB.AutoMigrate(
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
		return fmt.Errorf("failed to migrate database: %w", err)
	}

	log.Println("Database migrations completed successfully")
	return nil
}

// GetDB returns the database instance
func GetDB() *gorm.DB {
	return DB
}

// Close closes the database connection
func Close() error {
	if DB == nil {
		return nil
	}

	sqlDB, err := DB.DB()
	if err != nil {
		return fmt.Errorf("failed to get underlying sql.DB: %w", err)
	}

	return sqlDB.Close()
}
