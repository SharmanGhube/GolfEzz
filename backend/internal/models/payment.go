package models

import (
	"time"
)

// Payment represents payment transactions
type Payment struct {
	BaseModel
	BookingID       *uint     `json:"booking_id"`
	RangeSessionID  *uint     `json:"range_session_id"`
	MembershipID    *uint     `json:"membership_id"`
	PaymentMethodID uint      `json:"payment_method_id" gorm:"not null"`
	Amount          float64   `json:"amount" gorm:"not null"`
	Currency        string    `json:"currency" gorm:"default:USD"`
	Status          string    `json:"status" gorm:"default:pending"` // pending, completed, failed, refunded
	TransactionID   string    `json:"transaction_id" gorm:"uniqueIndex"`
	PaymentDate     time.Time `json:"payment_date" gorm:"not null"`
	Description     string    `json:"description"`
	RefundAmount    float64   `json:"refund_amount" gorm:"default:0"`
	RefundDate      *time.Time `json:"refund_date"`
	RefundReason    string    `json:"refund_reason"`
	
	// Relationships
	Booking       *Booking       `json:"booking,omitempty"`
	RangeSession  *RangeSession  `json:"range_session,omitempty"`
	Membership    *Membership    `json:"membership,omitempty"`
	PaymentMethod PaymentMethod  `json:"payment_method"`
}

// PaymentMethod represents available payment methods
type PaymentMethod struct {
	BaseModel
	Name        string `json:"name" gorm:"not null"` // Credit Card, Debit Card, Cash, Check, etc.
	Type        string `json:"type" gorm:"not null"` // card, cash, bank_transfer, digital_wallet
	IsActive    bool   `json:"is_active" gorm:"default:true"`
	ProcessorID string `json:"processor_id"` // For external payment processors
	
	// Relationships
	Payments []Payment `json:"payments"`
}
