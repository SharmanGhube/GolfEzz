package models

import (
	"time"

	"gorm.io/gorm"
)

// Base model with common fields
type BaseModel struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`
}

// User represents a user in the system
type User struct {
	BaseModel
	FirstName   string    `json:"first_name" gorm:"not null"`
	LastName    string    `json:"last_name" gorm:"not null"`
	Email       string    `json:"email" gorm:"uniqueIndex;not null"`
	Phone       string    `json:"phone"`
	Password    string    `json:"-" gorm:"not null"`
	DateOfBirth time.Time `json:"date_of_birth"`
	Handicap    float64   `json:"handicap"`
	IsActive    bool      `json:"is_active" gorm:"default:true"`
	
	// Relationships
	Roles       []Role       `json:"roles" gorm:"many2many:user_roles;"`
	Bookings    []Booking    `json:"bookings"`
	Memberships []Membership `json:"memberships"`
}

// Role represents user roles
type Role struct {
	BaseModel
	Name        string `json:"name" gorm:"uniqueIndex;not null"`
	Description string `json:"description"`
	
	// Relationships
	Users []User `json:"users" gorm:"many2many:user_roles;"`
}

// UserRole represents the many-to-many relationship between users and roles
type UserRole struct {
	UserID uint `json:"user_id" gorm:"primaryKey"`
	RoleID uint `json:"role_id" gorm:"primaryKey"`
	
	// Relationships
	User User `json:"user"`
	Role Role `json:"role"`
}
