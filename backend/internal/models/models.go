// Package models defines the data models for the Golf Course Management System
package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"strings"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// StringArray is a custom type for PostgreSQL text arrays
type StringArray []string

// Scan implements the Scanner interface for database deserialization
func (s *StringArray) Scan(value interface{}) error {
	if value == nil {
		*s = StringArray{}
		return nil
	}

	switch v := value.(type) {
	case string:
		// Handle PostgreSQL array format: {item1,item2,item3}
		if v == "" || v == "{}" {
			*s = StringArray{}
			return nil
		}

		// Remove braces and split by comma
		v = strings.Trim(v, "{}")
		if v == "" {
			*s = StringArray{}
			return nil
		}

		items := strings.Split(v, ",")
		result := make([]string, len(items))
		for i, item := range items {
			result[i] = strings.TrimSpace(item)
		}
		*s = StringArray(result)
		return nil
	case []byte:
		return s.Scan(string(v))
	default:
		return errors.New("cannot scan non-string value into StringArray")
	}
}

// Value implements the Valuer interface for database serialization
func (s StringArray) Value() (driver.Value, error) {
	if len(s) == 0 {
		return "{}", nil
	}

	// Convert to PostgreSQL array format: {item1,item2,item3}
	return "{" + strings.Join([]string(s), ",") + "}", nil
}

// Base contains common columns for all tables
type Base struct {
	ID        uuid.UUID      `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

// User represents a user in the system (both members and admins)
type User struct {
	Base
	Email           string     `json:"email" gorm:"uniqueIndex;not null"`
	Name            string     `json:"name" gorm:"not null"`
	Password        string     `json:"-" gorm:"not null"` // Password field, hidden from JSON
	Image           *string    `json:"image"`
	Role            string     `json:"role" gorm:"not null;check:role IN ('member','admin','super_admin')"`
	Status          string     `json:"status" gorm:"default:'active';check:status IN ('active','inactive','suspended')"`
	EmailVerified   bool       `json:"email_verified" gorm:"default:false"`
	EmailVerifiedAt *time.Time `json:"email_verified_at"`
	Phone           *string    `json:"phone"`
	Address         *string    `json:"address"`
	DateOfBirth     *time.Time `json:"date_of_birth"`

	// Member-specific fields
	MembershipID     *string         `json:"membership_id" gorm:"uniqueIndex"`
	MembershipType   *string         `json:"membership_type"` // basic, premium, vip
	MembershipExpiry *time.Time      `json:"membership_expiry"`
	MembershipStatus *string         `json:"membership_status"` // active, expired, suspended
	Handicap         *float64        `json:"handicap"`
	Preferences      UserPreferences `json:"preferences" gorm:"type:jsonb"`

	// Admin-specific fields
	AdminLevel       *string    `json:"admin_level"` // course_admin, system_admin, super_admin
	CanManageCourses bool       `json:"can_manage_courses" gorm:"default:false"`
	CanManageUsers   bool       `json:"can_manage_users" gorm:"default:false"`
	CanManagePricing bool       `json:"can_manage_pricing" gorm:"default:false"`
	CanViewAnalytics bool       `json:"can_view_analytics" gorm:"default:false"`
	LastLoginAt      *time.Time `json:"last_login_at"`

	// Authentication & Security
	GoogleID            *string    `json:"google_id" gorm:"uniqueIndex"`
	PasswordResetToken  *string    `json:"-"`
	PasswordResetExpiry *time.Time `json:"-"`
	TwoFactorEnabled    bool       `json:"two_factor_enabled" gorm:"default:false"`
	TwoFactorSecret     *string    `json:"-"`

	// Relationships
	Bookings       []TeeTimeBooking `json:"bookings" gorm:"foreignKey:UserID"`
	RangeBookings  []RangeBooking   `json:"range_bookings" gorm:"foreignKey:UserID"`
	Reviews        []Review         `json:"reviews" gorm:"foreignKey:UserID"`
	Notifications  []Notification   `json:"notifications" gorm:"foreignKey:UserID"`
	ManagedCourses []Course         `json:"managed_courses" gorm:"many2many:user_course_management;"`
}

// UserPreferences stores user preferences in JSONB format
type UserPreferences struct {
	PreferredTeeTime string               `json:"preferred_tee_time"`
	PreferredCourses []string             `json:"preferred_courses"`
	Notifications    NotificationSettings `json:"notifications"`
	PlayingStyle     string               `json:"playing_style"`
}

// Scan implements the Scanner interface for database deserialization
func (up *UserPreferences) Scan(value interface{}) error {
	if value == nil {
		*up = UserPreferences{}
		return nil
	}

	var bytes []byte
	switch v := value.(type) {
	case []byte:
		bytes = v
	case string:
		bytes = []byte(v)
	default:
		return errors.New("cannot scan non-string/[]byte value into UserPreferences")
	}

	if len(bytes) == 0 {
		*up = UserPreferences{}
		return nil
	}

	// Use json.Unmarshal to deserialize JSONB data
	return json.Unmarshal(bytes, up)
}

// Value implements the Valuer interface for database serialization
func (up UserPreferences) Value() (driver.Value, error) {
	return json.Marshal(up)
}

// NotificationSettings stores user notification preferences
type NotificationSettings struct {
	Email bool `json:"email"`
	SMS   bool `json:"sms"`
	Push  bool `json:"push"`
}

// Course represents a golf course
type Course struct {
	Base
	Name        string       `json:"name" gorm:"not null"`
	Description string       `json:"description"`
	Address     string       `json:"address" gorm:"not null"`
	Phone       string       `json:"phone"`
	Email       string       `json:"email"`
	Website     *string      `json:"website"`
	Holes       int          `json:"holes" gorm:"default:18"`
	Par         int          `json:"par"`
	Length      int          `json:"length"` // in yards
	Difficulty  string       `json:"difficulty"`
	Image       *string      `json:"image"`
	Images      StringArray  `json:"images" gorm:"type:text[]"`
	Amenities   StringArray  `json:"amenities" gorm:"type:text[]"`
	HoleDetails []HoleDetail `json:"hole_details" gorm:"type:jsonb"`

	// Pricing Management
	GreenFeeWeekday float64 `json:"green_fee_weekday"`
	GreenFeeWeekend float64 `json:"green_fee_weekend"`
	GreenFeeHoliday float64 `json:"green_fee_holiday"`
	CartFee         float64 `json:"cart_fee"`
	ClubRentalFee   float64 `json:"club_rental_fee"`
	RangeBallPrice  float64 `json:"range_ball_price"`
	MemberDiscount  float64 `json:"member_discount"` // percentage

	// Course Settings
	IsActive           bool   `json:"is_active" gorm:"default:true"`
	BookingAdvanceDays int    `json:"booking_advance_days" gorm:"default:14"`
	MaxPlayersPerSlot  int    `json:"max_players_per_slot" gorm:"default:4"`
	SlotDuration       int    `json:"slot_duration" gorm:"default:15"` // minutes
	OpenTime           string `json:"open_time" gorm:"default:'06:00'"`
	CloseTime          string `json:"close_time" gorm:"default:'19:00'"`

	// Relationships
	Conditions     []CourseCondition `json:"conditions" gorm:"foreignKey:CourseID"`
	Bookings       []TeeTimeBooking  `json:"bookings" gorm:"foreignKey:CourseID"`
	RangeBookings  []RangeBooking    `json:"range_bookings" gorm:"foreignKey:CourseID"`
	Reviews        []Review          `json:"reviews" gorm:"foreignKey:CourseID"`
	Inventory      []InventoryItem   `json:"inventory" gorm:"foreignKey:CourseID"`
	Analytics      []Analytics       `json:"analytics" gorm:"foreignKey:CourseID"`
	Admins         []User            `json:"admins" gorm:"many2many:user_course_management;"`
	AvailableSlots []TeeTimeSlot     `json:"available_slots" gorm:"foreignKey:CourseID"`
}

// HoleDetail represents details for a specific hole
type HoleDetail struct {
	HoleNumber  int      `json:"hole_number"`
	Par         int      `json:"par"`
	Length      int      `json:"length"`
	Handicap    int      `json:"handicap"`
	Description *string  `json:"description"`
	Hazards     []Hazard `json:"hazards"`
}

// Hazard represents a course hazard
type Hazard struct {
	Type        string `json:"type"` // water, sand, rough, trees, out-of-bounds
	Description string `json:"description"`
	Position    string `json:"position"` // left, right, center, front, back
}

// CourseCondition represents current course conditions
type CourseCondition struct {
	Base
	CourseID         uuid.UUID `json:"course_id" gorm:"type:uuid;not null"`
	Course           Course    `json:"course" gorm:"foreignKey:CourseID"`
	GreenSpeed       int       `json:"green_speed"` // 1-10 scale
	FairwayCondition string    `json:"fairway_condition"`
	RoughCondition   string    `json:"rough_condition"`
	BunkerCondition  string    `json:"bunker_condition"`
	WeatherCondition string    `json:"weather_condition"`
	Temperature      float64   `json:"temperature"`
	WindSpeed        float64   `json:"wind_speed"`
	Humidity         float64   `json:"humidity"`
	LastUpdated      time.Time `json:"last_updated"`
}

// TeeTimeBooking represents a tee time booking
type TeeTimeBooking struct {
	Base
	CourseID        uuid.UUID  `json:"course_id" gorm:"type:uuid;not null"`
	Course          Course     `json:"course" gorm:"foreignKey:CourseID"`
	UserID          uuid.UUID  `json:"user_id" gorm:"type:uuid;not null"`
	User            User       `json:"user" gorm:"foreignKey:UserID"`
	Date            time.Time  `json:"date" gorm:"not null"`
	Time            string     `json:"time" gorm:"not null"`
	Players         int        `json:"players" gorm:"not null"`
	Status          string     `json:"status" gorm:"default:'pending'"`
	TotalAmount     float64    `json:"total_amount"`
	PaymentStatus   string     `json:"payment_status" gorm:"default:'pending'"`
	SpecialRequests *string    `json:"special_requests"`
	CheckedIn       bool       `json:"checked_in" gorm:"default:false"`
	CheckInTime     *time.Time `json:"check_in_time"`
}

// RangeBooking represents a driving range booking
type RangeBooking struct {
	Base
	UserID      uuid.UUID `json:"user_id" gorm:"type:uuid;not null"`
	User        User      `json:"user" gorm:"foreignKey:UserID"`
	CourseID    uuid.UUID `json:"course_id" gorm:"type:uuid;not null"`
	Course      Course    `json:"course" gorm:"foreignKey:CourseID"`
	Date        time.Time `json:"date" gorm:"not null"`
	StartTime   string    `json:"start_time" gorm:"not null"`
	Duration    int       `json:"duration"`    // in minutes
	BucketSize  string    `json:"bucket_size"` // small, medium, large
	BucketCount int       `json:"bucket_count"`
	TotalAmount float64   `json:"total_amount"`
	Status      string    `json:"status" gorm:"default:'active'"`
	UsedBuckets int       `json:"used_buckets" gorm:"default:0"`
}

// Payment represents a payment transaction
type Payment struct {
	Base
	UserID         uuid.UUID       `json:"user_id" gorm:"type:uuid;not null"`
	User           User            `json:"user" gorm:"foreignKey:UserID"`
	BookingID      *uuid.UUID      `json:"booking_id" gorm:"type:uuid"`
	Booking        *TeeTimeBooking `json:"booking" gorm:"foreignKey:BookingID"`
	RangeBookingID *uuid.UUID      `json:"range_booking_id" gorm:"type:uuid"`
	RangeBooking   *RangeBooking   `json:"range_booking" gorm:"foreignKey:RangeBookingID"`
	Amount         float64         `json:"amount" gorm:"not null"`
	Currency       string          `json:"currency" gorm:"default:'USD'"`
	Status         string          `json:"status" gorm:"default:'pending'"`
	PaymentMethod  string          `json:"payment_method"`
	TransactionID  *string         `json:"transaction_id"`
	ProcessedAt    *time.Time      `json:"processed_at"`
}

// Review represents a course review
type Review struct {
	Base
	UserID   uuid.UUID `json:"user_id" gorm:"type:uuid;not null"`
	User     User      `json:"user" gorm:"foreignKey:UserID"`
	CourseID uuid.UUID `json:"course_id" gorm:"type:uuid;not null"`
	Course   Course    `json:"course" gorm:"foreignKey:CourseID"`
	Rating   int       `json:"rating" gorm:"not null;check:rating >= 1 AND rating <= 5"`
	Comment  *string   `json:"comment"`
	IsPublic bool      `json:"is_public" gorm:"default:true"`
}

// Notification represents a system notification
type Notification struct {
	Base
	UserID  uuid.UUID  `json:"user_id" gorm:"type:uuid;not null"`
	User    User       `json:"user" gorm:"foreignKey:UserID"`
	Title   string     `json:"title" gorm:"not null"`
	Message string     `json:"message" gorm:"not null"`
	Type    string     `json:"type" gorm:"not null"` // booking, payment, system, etc.
	IsRead  bool       `json:"is_read" gorm:"default:false"`
	ReadAt  *time.Time `json:"read_at"`
	Data    *string    `json:"data" gorm:"type:jsonb"` // Additional data in JSON format
}

// InventoryItem represents range inventory
type InventoryItem struct {
	Base
	CourseID    uuid.UUID `json:"course_id" gorm:"type:uuid;not null"`
	Course      Course    `json:"course" gorm:"foreignKey:CourseID"`
	ItemType    string    `json:"item_type" gorm:"not null"` // golf_balls, clubs, etc.
	Name        string    `json:"name" gorm:"not null"`
	Description *string   `json:"description"`
	Quantity    int       `json:"quantity" gorm:"not null"`
	MinQuantity int       `json:"min_quantity" gorm:"default:0"`
	UnitPrice   float64   `json:"unit_price"`
	IsActive    bool      `json:"is_active" gorm:"default:true"`
}

// Analytics represents course analytics data
type Analytics struct {
	Base
	CourseID        uuid.UUID   `json:"course_id" gorm:"type:uuid;not null"`
	Course          Course      `json:"course" gorm:"foreignKey:CourseID"`
	Date            time.Time   `json:"date" gorm:"not null"`
	BookingsCount   int         `json:"bookings_count"`
	Revenue         float64     `json:"revenue"`
	UtilizationRate float64     `json:"utilization_rate"`
	AverageRating   float64     `json:"average_rating"`
	MemberGrowth    int         `json:"member_growth"`
	PopularTimes    StringArray `json:"popular_times" gorm:"type:text[]"`
}

// TeeTimeSlot represents available tee time slots for a course
type TeeTimeSlot struct {
	Base
	CourseID       uuid.UUID `json:"course_id" gorm:"type:uuid;not null"`
	Course         Course    `json:"course" gorm:"foreignKey:CourseID"`
	Date           time.Time `json:"date" gorm:"not null"`
	StartTime      string    `json:"start_time" gorm:"not null"`
	EndTime        string    `json:"end_time" gorm:"not null"`
	MaxPlayers     int       `json:"max_players" gorm:"default:4"`
	AvailableSlots int       `json:"available_slots" gorm:"default:1"`
	Price          float64   `json:"price"`
	IsAvailable    bool      `json:"is_available" gorm:"default:true"`
	SlotType       string    `json:"slot_type" gorm:"default:'regular'"` // regular, premium, tournament
}

// CoursePricing represents dynamic pricing for courses
type CoursePricing struct {
	Base
	CourseID      uuid.UUID  `json:"course_id" gorm:"type:uuid;not null"`
	Course        Course     `json:"course" gorm:"foreignKey:CourseID"`
	PricingType   string     `json:"pricing_type" gorm:"not null"` // weekday, weekend, holiday, peak, off_peak
	StartDate     *time.Time `json:"start_date"`
	EndDate       *time.Time `json:"end_date"`
	TimeSlotStart string     `json:"time_slot_start"`
	TimeSlotEnd   string     `json:"time_slot_end"`
	BasePrice     float64    `json:"base_price"`
	MemberPrice   float64    `json:"member_price"`
	IsActive      bool       `json:"is_active" gorm:"default:true"`
}

// RangePricing represents driving range pricing
type RangePricing struct {
	Base
	CourseID    uuid.UUID `json:"course_id" gorm:"type:uuid;not null"`
	Course      Course    `json:"course" gorm:"foreignKey:CourseID"`
	BucketSize  string    `json:"bucket_size" gorm:"not null"` // small, medium, large, jumbo
	BallCount   int       `json:"ball_count"`
	Price       float64   `json:"price"`
	MemberPrice float64   `json:"member_price"`
	Duration    int       `json:"duration"` // minutes allowed per bucket
	IsActive    bool      `json:"is_active" gorm:"default:true"`
}

// AdminActivity represents admin activity logs
type AdminActivity struct {
	Base
	AdminID     uuid.UUID  `json:"admin_id" gorm:"type:uuid;not null"`
	Admin       User       `json:"admin" gorm:"foreignKey:AdminID"`
	Action      string     `json:"action" gorm:"not null"`
	Resource    string     `json:"resource" gorm:"not null"` // course, user, pricing, booking
	ResourceID  *uuid.UUID `json:"resource_id" gorm:"type:uuid"`
	Description string     `json:"description"`
	IPAddress   string     `json:"ip_address"`
	UserAgent   string     `json:"user_agent"`
	Changes     string     `json:"changes" gorm:"type:jsonb"` // JSON of what was changed
}

// SystemSettings represents global system settings
type SystemSettings struct {
	Base
	Key         string     `json:"key" gorm:"uniqueIndex;not null"`
	Value       string     `json:"value" gorm:"not null"`
	Description string     `json:"description"`
	DataType    string     `json:"data_type" gorm:"default:'string'"` // string, number, boolean, json
	Category    string     `json:"category" gorm:"default:'general'"` // general, pricing, booking, notification
	IsPublic    bool       `json:"is_public" gorm:"default:false"`
	UpdatedBy   *uuid.UUID `json:"updated_by" gorm:"type:uuid"`
	Admin       *User      `json:"admin" gorm:"foreignKey:UpdatedBy"`
}

// MembershipPlan represents membership plans available
type MembershipPlan struct {
	Base
	Name             string      `json:"name" gorm:"not null"`
	Description      string      `json:"description"`
	Price            float64     `json:"price"`
	BillingCycle     string      `json:"billing_cycle" gorm:"default:'monthly'"` // monthly, yearly
	Features         StringArray `json:"features" gorm:"type:text[]"`
	BookingAdvantage int         `json:"booking_advantage"` // days in advance
	DiscountPercent  float64     `json:"discount_percent"`
	MaxBookingsMonth int         `json:"max_bookings_month" gorm:"default:0"` // 0 = unlimited
	IncludesRange    bool        `json:"includes_range" gorm:"default:false"`
	IncludesCart     bool        `json:"includes_cart" gorm:"default:false"`
	IsActive         bool        `json:"is_active" gorm:"default:true"`
}
