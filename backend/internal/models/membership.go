package models

import (
	"time"
)

// Membership represents user memberships
type Membership struct {
	BaseModel
	UserID           uint      `json:"user_id" gorm:"not null"`
	MembershipTypeID uint      `json:"membership_type_id" gorm:"not null"`
	MembershipNumber string    `json:"membership_number" gorm:"uniqueIndex;not null"`
	StartDate        time.Time `json:"start_date" gorm:"not null"`
	EndDate          time.Time `json:"end_date" gorm:"not null"`
	Status           string    `json:"status" gorm:"default:active"` // active, suspended, expired, cancelled
	AutoRenew        bool      `json:"auto_renew" gorm:"default:true"`
	LastPaymentDate  *time.Time `json:"last_payment_date"`
	NextPaymentDate  *time.Time `json:"next_payment_date"`
	Notes            string    `json:"notes"`
	
	// Relationships
	User           User           `json:"user"`
	MembershipType MembershipType `json:"membership_type"`
	Payments       []Payment      `json:"payments"`
}

// MembershipType represents different types of memberships
type MembershipType struct {
	BaseModel
	Name               string  `json:"name" gorm:"not null"`
	Description        string  `json:"description"`
	MonthlyFee         float64 `json:"monthly_fee" gorm:"not null"`
	AnnualFee          float64 `json:"annual_fee"`
	InitiationFee      float64 `json:"initiation_fee"`
	TeeTimeDiscount    float64 `json:"tee_time_discount"` // Percentage discount
	RangeDiscount      float64 `json:"range_discount"`    // Percentage discount
	MaxAdvanceBookings int     `json:"max_advance_bookings" gorm:"default:7"` // Days in advance
	IncludesRange      bool    `json:"includes_range" gorm:"default:false"`
	IncludesCart       bool    `json:"includes_cart" gorm:"default:false"`
	GuestPolicy        string  `json:"guest_policy"`
	IsActive           bool    `json:"is_active" gorm:"default:true"`
	
	// Relationships
	Memberships []Membership `json:"memberships"`
}
