package models

import (
	"time"
)

// TeeTimeSlot represents available tee times
type TeeTimeSlot struct {
	BaseModel
	GolfCourseID  uint      `json:"golf_course_id" gorm:"not null"`
	Date          time.Time `json:"date" gorm:"not null"`
	Time          time.Time `json:"time" gorm:"not null"`
	MaxPlayers    int       `json:"max_players" gorm:"default:4"`
	Price         float64   `json:"price" gorm:"not null"`
	IsAvailable   bool      `json:"is_available" gorm:"default:true"`
	TeeType       string    `json:"tee_type"` // Championship, Regular, Senior, Ladies
	IsWeekend     bool      `json:"is_weekend" gorm:"default:false"`
	IsPrimetime   bool      `json:"is_primetime" gorm:"default:false"`
	
	// Relationships
	GolfCourse GolfCourse `json:"golf_course"`
	Bookings   []Booking  `json:"bookings"`
}

// Booking represents a tee time booking
type Booking struct {
	BaseModel
	UserID        uint      `json:"user_id" gorm:"not null"`
	TeeTimeSlotID uint      `json:"tee_time_slot_id" gorm:"not null"`
	BookingNumber string    `json:"booking_number" gorm:"uniqueIndex;not null"`
	TotalPlayers  int       `json:"total_players" gorm:"not null"`
	TotalAmount   float64   `json:"total_amount" gorm:"not null"`
	Status        string    `json:"status" gorm:"default:confirmed"` // pending, confirmed, cancelled, completed
	BookingDate   time.Time `json:"booking_date" gorm:"not null"`
	Notes         string    `json:"notes"`
	
	// Relationships
	User        User           `json:"user"`
	TeeTimeSlot TeeTimeSlot    `json:"tee_time_slot"`
	Players     []BookingPlayer `json:"players"`
	Payments    []Payment      `json:"payments"`
}

// BookingPlayer represents individual players in a booking
type BookingPlayer struct {
	BaseModel
	BookingID uint    `json:"booking_id" gorm:"not null"`
	UserID    *uint   `json:"user_id"` // Optional - guest players might not have accounts
	FirstName string  `json:"first_name" gorm:"not null"`
	LastName  string  `json:"last_name" gorm:"not null"`
	Email     string  `json:"email"`
	Phone     string  `json:"phone"`
	Handicap  float64 `json:"handicap"`
	IsGuest   bool    `json:"is_guest" gorm:"default:false"`
	
	// Relationships
	Booking Booking `json:"booking"`
	User    *User   `json:"user,omitempty"`
}
