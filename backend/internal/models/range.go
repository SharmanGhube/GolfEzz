package models

import (
	"time"
)

// RangeSession represents a driving range session
type RangeSession struct {
	BaseModel
	UserID          uint      `json:"user_id" gorm:"not null"`
	StartTime       time.Time `json:"start_time" gorm:"not null"`
	EndTime         *time.Time `json:"end_time"`
	DurationMinutes int       `json:"duration_minutes"`
	TotalAmount     float64   `json:"total_amount" gorm:"not null"`
	Status          string    `json:"status" gorm:"default:active"` // active, completed, cancelled
	BayNumber       int       `json:"bay_number"`
	Notes           string    `json:"notes"`
	
	// Relationships
	User        User         `json:"user"`
	BallBuckets []BallBucket `json:"ball_buckets"`
	Equipment   []RangeEquipment `json:"equipment"`
	Payments    []Payment    `json:"payments"`
}

// BallBucket represents golf ball buckets for the driving range
type BallBucket struct {
	BaseModel
	RangeSessionID uint    `json:"range_session_id" gorm:"not null"`
	BucketSize     string  `json:"bucket_size" gorm:"not null"` // small, medium, large, jumbo
	BallCount      int     `json:"ball_count" gorm:"not null"`
	Price          float64 `json:"price" gorm:"not null"`
	IsReturned     bool    `json:"is_returned" gorm:"default:false"`
	ReturnedAt     *time.Time `json:"returned_at"`
	
	// Relationships
	RangeSession RangeSession `json:"range_session"`
}

// RangeEquipment represents equipment rental for range sessions
type RangeEquipment struct {
	BaseModel
	RangeSessionID uint    `json:"range_session_id" gorm:"not null"`
	EquipmentType  string  `json:"equipment_type" gorm:"not null"` // clubs, mat, tee, etc.
	EquipmentName  string  `json:"equipment_name" gorm:"not null"`
	Quantity       int     `json:"quantity" gorm:"default:1"`
	Price          float64 `json:"price" gorm:"not null"`
	IsReturned     bool    `json:"is_returned" gorm:"default:false"`
	ReturnedAt     *time.Time `json:"returned_at"`
	Condition      string  `json:"condition"` // excellent, good, fair, damaged
	
	// Relationships
	RangeSession RangeSession `json:"range_session"`
}
