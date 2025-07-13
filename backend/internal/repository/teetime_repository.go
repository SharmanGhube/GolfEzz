package repository

import (
	"golfezz-backend/internal/models"
	"time"
	"gorm.io/gorm"
)

type TeeTimeRepository interface {
	Create(teeTime *models.TeeTimeSlot) error
	GetByID(id uint) (*models.TeeTimeSlot, error)
	GetAvailableSlots(courseID uint, date time.Time) ([]models.TeeTimeSlot, error)
	GetByDateRange(courseID uint, startDate, endDate time.Time) ([]models.TeeTimeSlot, error)
	Update(teeTime *models.TeeTimeSlot) error
	Delete(id uint) error
	BulkCreate(teeTimeSlots []models.TeeTimeSlot) error
}

type teeTimeRepository struct {
	db *gorm.DB
}

func NewTeeTimeRepository(db *gorm.DB) TeeTimeRepository {
	return &teeTimeRepository{db: db}
}

func (r *teeTimeRepository) Create(teeTime *models.TeeTimeSlot) error {
	return r.db.Create(teeTime).Error
}

func (r *teeTimeRepository) GetByID(id uint) (*models.TeeTimeSlot, error) {
	var teeTime models.TeeTimeSlot
	err := r.db.Preload("GolfCourse").Preload("Bookings").First(&teeTime, id).Error
	if err != nil {
		return nil, err
	}
	return &teeTime, nil
}

func (r *teeTimeRepository) GetAvailableSlots(courseID uint, date time.Time) ([]models.TeeTimeSlot, error) {
	var teeTimeSlots []models.TeeTimeSlot
	err := r.db.Where("golf_course_id = ? AND date = ? AND is_available = ?", 
		courseID, date.Format("2006-01-02"), true).Find(&teeTimeSlots).Error
	return teeTimeSlots, err
}

func (r *teeTimeRepository) GetByDateRange(courseID uint, startDate, endDate time.Time) ([]models.TeeTimeSlot, error) {
	var teeTimeSlots []models.TeeTimeSlot
	err := r.db.Where("golf_course_id = ? AND date BETWEEN ? AND ?", 
		courseID, startDate.Format("2006-01-02"), endDate.Format("2006-01-02")).Find(&teeTimeSlots).Error
	return teeTimeSlots, err
}

func (r *teeTimeRepository) Update(teeTime *models.TeeTimeSlot) error {
	return r.db.Save(teeTime).Error
}

func (r *teeTimeRepository) Delete(id uint) error {
	return r.db.Delete(&models.TeeTimeSlot{}, id).Error
}

func (r *teeTimeRepository) BulkCreate(teeTimeSlots []models.TeeTimeSlot) error {
	return r.db.CreateInBatches(teeTimeSlots, 100).Error
}
