package models

import (
	"time"
)

// GolfCourse represents a golf course
type GolfCourse struct {
	BaseModel
	Name         string  `json:"name" gorm:"not null"`
	Description  string  `json:"description"`
	Address      string  `json:"address" gorm:"not null"`
	City         string  `json:"city" gorm:"not null"`
	State        string  `json:"state" gorm:"not null"`
	ZipCode      string  `json:"zip_code" gorm:"not null"`
	Phone        string  `json:"phone"`
	Email        string  `json:"email"`
	Website      string  `json:"website"`
	TotalHoles   int     `json:"total_holes" gorm:"default:18"`
	ParTotal     int     `json:"par_total" gorm:"default:72"`
	CourseRating float64 `json:"course_rating"`
	SlopeRating  int     `json:"slope_rating"`
	YardageTotal int     `json:"yardage_total"`
	IsActive     bool    `json:"is_active" gorm:"default:true"`
	
	// Relationships
	Holes            []Hole            `json:"holes"`
	Tees             []Tee             `json:"tees"`
	TeeTimeSlots     []TeeTimeSlot     `json:"tee_time_slots"`
	GreenConditions  []GreenCondition  `json:"green_conditions"`
}

// Hole represents a single hole on the golf course
type Hole struct {
	BaseModel
	GolfCourseID uint    `json:"golf_course_id" gorm:"not null"`
	HoleNumber   int     `json:"hole_number" gorm:"not null"`
	Par          int     `json:"par" gorm:"not null"`
	Handicap     int     `json:"handicap"`
	Description  string  `json:"description"`
	
	// Relationships
	GolfCourse GolfCourse `json:"golf_course"`
	Tees       []Tee      `json:"tees"`
}

// Tee represents different tee positions for each hole
type Tee struct {
	BaseModel
	HoleID      uint    `json:"hole_id" gorm:"not null"`
	TeeColor    string  `json:"tee_color" gorm:"not null"` // Red, White, Blue, Black, etc.
	TeeName     string  `json:"tee_name"`
	Yardage     int     `json:"yardage" gorm:"not null"`
	Rating      float64 `json:"rating"`
	SlopeRating int     `json:"slope_rating"`
	
	// Relationships
	Hole Hole `json:"hole"`
}

// GreenCondition represents daily green conditions and speeds
type GreenCondition struct {
	BaseModel
	GolfCourseID   uint      `json:"golf_course_id" gorm:"not null"`
	Date           time.Time `json:"date" gorm:"not null"`
	GreenSpeed     float64   `json:"green_speed"` // Stimpmeter reading
	FirmnessRating int       `json:"firmness_rating" gorm:"check:firmness_rating >= 1 AND firmness_rating <= 10"`
	MoistureLevel  int       `json:"moisture_level" gorm:"check:moisture_level >= 1 AND moisture_level <= 10"`
	WeatherCondition string  `json:"weather_condition"`
	Temperature    float64   `json:"temperature"`
	WindSpeed      float64   `json:"wind_speed"`
	WindDirection  string    `json:"wind_direction"`
	Notes          string    `json:"notes"`
	
	// Relationships
	GolfCourse GolfCourse `json:"golf_course"`
}
