package models

import (
	"time"
)

// Notification represents system notifications
type Notification struct {
	BaseModel
	UserID    uint      `json:"user_id" gorm:"not null"`
	Title     string    `json:"title" gorm:"not null"`
	Message   string    `json:"message" gorm:"not null"`
	Type      string    `json:"type" gorm:"not null"` // booking, payment, course_condition, promotion
	IsRead    bool      `json:"is_read" gorm:"default:false"`
	ReadAt    *time.Time `json:"read_at"`
	Priority  string    `json:"priority" gorm:"default:normal"` // low, normal, high, urgent
	
	// Relationships
	User User `json:"user"`
}

// AuditLog represents audit trail for important actions
type AuditLog struct {
	BaseModel
	UserID      *uint     `json:"user_id"`
	Action      string    `json:"action" gorm:"not null"`
	Resource    string    `json:"resource" gorm:"not null"`
	ResourceID  uint      `json:"resource_id"`
	OldValues   string    `json:"old_values" gorm:"type:text"`
	NewValues   string    `json:"new_values" gorm:"type:text"`
	IPAddress   string    `json:"ip_address"`
	UserAgent   string    `json:"user_agent"`
	Timestamp   time.Time `json:"timestamp" gorm:"not null"`
	
	// Relationships
	User *User `json:"user,omitempty"`
}
