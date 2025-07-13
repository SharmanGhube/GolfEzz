package repository

import (
	"golfezz-backend/internal/models"
	"time"
	"gorm.io/gorm"
)

type BookingRepository interface {
	Create(booking *models.Booking) error
	GetByID(id uint) (*models.Booking, error)
	GetByUserID(userID uint) ([]models.Booking, error)
	GetByTeeTimeSlot(teeTimeSlotID uint) ([]models.Booking, error)
	Update(booking *models.Booking) error
	Delete(id uint) error
	List(offset, limit int) ([]models.Booking, error)
	GetByDateRange(startDate, endDate time.Time) ([]models.Booking, error)
}

type bookingRepository struct {
	db *gorm.DB
}

func NewBookingRepository(db *gorm.DB) BookingRepository {
	return &bookingRepository{db: db}
}

func (r *bookingRepository) Create(booking *models.Booking) error {
	return r.db.Create(booking).Error
}

func (r *bookingRepository) GetByID(id uint) (*models.Booking, error) {
	var booking models.Booking
	err := r.db.Preload("User").Preload("TeeTimeSlot").Preload("Players").Preload("Payments").First(&booking, id).Error
	if err != nil {
		return nil, err
	}
	return &booking, nil
}

func (r *bookingRepository) GetByUserID(userID uint) ([]models.Booking, error) {
	var bookings []models.Booking
	err := r.db.Preload("TeeTimeSlot").Preload("Players").Where("user_id = ?", userID).Find(&bookings).Error
	return bookings, err
}

func (r *bookingRepository) GetByTeeTimeSlot(teeTimeSlotID uint) ([]models.Booking, error) {
	var bookings []models.Booking
	err := r.db.Preload("User").Preload("Players").Where("tee_time_slot_id = ?", teeTimeSlotID).Find(&bookings).Error
	return bookings, err
}

func (r *bookingRepository) Update(booking *models.Booking) error {
	return r.db.Save(booking).Error
}

func (r *bookingRepository) Delete(id uint) error {
	return r.db.Delete(&models.Booking{}, id).Error
}

func (r *bookingRepository) List(offset, limit int) ([]models.Booking, error) {
	var bookings []models.Booking
	err := r.db.Preload("User").Preload("TeeTimeSlot").Offset(offset).Limit(limit).Find(&bookings).Error
	return bookings, err
}

func (r *bookingRepository) GetByDateRange(startDate, endDate time.Time) ([]models.Booking, error) {
	var bookings []models.Booking
	err := r.db.Preload("User").Preload("TeeTimeSlot").
		Joins("JOIN tee_time_slots ON bookings.tee_time_slot_id = tee_time_slots.id").
		Where("tee_time_slots.date BETWEEN ? AND ?", startDate, endDate).
		Find(&bookings).Error
	return bookings, err
}
