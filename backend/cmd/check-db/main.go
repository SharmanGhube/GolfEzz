package main

import (
	"fmt"
	"log"

	"golf-ezz-backend/internal/config"
	"golf-ezz-backend/internal/database"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Connect to database
	err := database.Connect(cfg)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	fmt.Println("Database connected successfully")

	// Check if new tables exist
	tables := []string{
		"users",
		"tee_time_slots",
		"course_pricing",
		"range_pricing",
		"admin_activities",
		"system_settings",
		"membership_plans",
	}

	for _, table := range tables {
		var count int
		query := fmt.Sprintf("SELECT COUNT(*) FROM %s", table)
		err := database.DB.Raw(query).Scan(&count).Error
		if err != nil {
			fmt.Printf("❌ Table %s: Error - %v\n", table, err)
		} else {
			fmt.Printf("✅ Table %s: %d records\n", table, count)
		}
	}

	// Check users table structure
	fmt.Println("\n📋 Users table columns:")
	var columns []struct {
		ColumnName string `json:"column_name"`
		DataType   string `json:"data_type"`
	}

	err = database.DB.Raw(`
		SELECT column_name, data_type 
		FROM information_schema.columns 
		WHERE table_name = 'users' 
		ORDER BY ordinal_position
	`).Scan(&columns).Error

	if err != nil {
		fmt.Printf("Error checking users table structure: %v\n", err)
	} else {
		for _, col := range columns {
			fmt.Printf("  - %s (%s)\n", col.ColumnName, col.DataType)
		}
	}
}
