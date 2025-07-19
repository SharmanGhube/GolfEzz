package main

import (
	"fmt"
	"log"

	"golf-ezz-backend/internal/config"
	"golf-ezz-backend/internal/database"
	"golf-ezz-backend/internal/models"

	"golang.org/x/crypto/bcrypt"
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
	fmt.Println("Creating admin user...")

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal("Failed to hash password:", err)
	}

	// Create admin user
	adminLevel := "super_admin"
	adminUser := models.User{
		Email:            "admin@golfezz.com",
		Name:             "Admin User",
		Password:         string(hashedPassword),
		Role:             "admin",
		Status:           "active",
		EmailVerified:    true,
		CanManageCourses: true,
		CanManageUsers:   true,
		CanManagePricing: true,
		CanViewAnalytics: true,
		AdminLevel:       &adminLevel,
	}

	// Check if admin exists
	var existingUser models.User
	result := database.DB.Where("email = ?", adminUser.Email).First(&existingUser)

	if result.Error == nil {
		// User exists, update permissions
		fmt.Println("Admin user exists, updating permissions...")
		err = database.DB.Model(&existingUser).Updates(map[string]interface{}{
			"role":               "admin",
			"status":             "active",
			"email_verified":     true,
			"can_manage_courses": true,
			"can_manage_users":   true,
			"can_manage_pricing": true,
			"can_view_analytics": true,
			"admin_level":        "super_admin",
		}).Error
		if err != nil {
			fmt.Printf("Error updating admin user: %v\n", err)
		} else {
			fmt.Println("✅ Admin user permissions updated")
		}
	} else {
		// Create new admin user
		err = database.DB.Create(&adminUser).Error
		if err != nil {
			fmt.Printf("Error creating admin user: %v\n", err)
			// Try to update existing user instead
			fmt.Println("Attempting to update existing user...")
			database.DB.Exec(`
				UPDATE users SET 
					role = 'admin',
					status = 'active',
					email_verified = true,
					can_manage_courses = true,
					can_manage_users = true,
					can_manage_pricing = true,
					can_view_analytics = true,
					admin_level = 'super_admin'
				WHERE email = 'admin@golfezz.com'
			`)
			fmt.Println("✅ Admin user updated via SQL")
		} else {
			fmt.Println("✅ Admin user created successfully")
		}
	}

	fmt.Println("\n🎯 Admin Login Credentials:")
	fmt.Println("   Email: admin@golfezz.com")
	fmt.Println("   Password: admin123")
	fmt.Println("\n📊 Admin Permissions:")
	fmt.Println("   ✅ Can manage courses")
	fmt.Println("   ✅ Can manage users")
	fmt.Println("   ✅ Can manage pricing")
	fmt.Println("   ✅ Can view analytics")
	fmt.Println("   ✅ Super admin level")

	// Let's also check our current users
	fmt.Println("\n👥 Current Users:")
	var users []struct {
		Name   string
		Email  string
		Role   string
		Status string
	}
	database.DB.Table("users").Select("name, email, role, status").Find(&users)
	for _, user := range users {
		fmt.Printf("   - %s (%s) - Role: %s, Status: %s\n", user.Name, user.Email, user.Role, user.Status)
	}

	fmt.Println("\n🚀 Database is ready for the role-based system!")
}
