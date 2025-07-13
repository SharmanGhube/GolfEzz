package repository

import (
	"golfezz-backend/internal/models"
	"gorm.io/gorm"
)

type RangeRepository interface {
	CreateSession(session *models.RangeSession) error
	GetSessionByID(id uint) (*models.RangeSession, error)
	GetActiveSessionsByUser(userID uint) ([]models.RangeSession, error)
	UpdateSession(session *models.RangeSession) error
	EndSession(sessionID uint) error
	
	CreateBallBucket(bucket *models.BallBucket) error
	GetBucketsBySession(sessionID uint) ([]models.BallBucket, error)
	UpdateBucket(bucket *models.BallBucket) error
	
	CreateEquipment(equipment *models.RangeEquipment) error
	GetEquipmentBySession(sessionID uint) ([]models.RangeEquipment, error)
	UpdateEquipment(equipment *models.RangeEquipment) error
}

type rangeRepository struct {
	db *gorm.DB
}

func NewRangeRepository(db *gorm.DB) RangeRepository {
	return &rangeRepository{db: db}
}

func (r *rangeRepository) CreateSession(session *models.RangeSession) error {
	return r.db.Create(session).Error
}

func (r *rangeRepository) GetSessionByID(id uint) (*models.RangeSession, error) {
	var session models.RangeSession
	err := r.db.Preload("User").Preload("BallBuckets").Preload("Equipment").Preload("Payments").First(&session, id).Error
	if err != nil {
		return nil, err
	}
	return &session, nil
}

func (r *rangeRepository) GetActiveSessionsByUser(userID uint) ([]models.RangeSession, error) {
	var sessions []models.RangeSession
	err := r.db.Preload("BallBuckets").Preload("Equipment").
		Where("user_id = ? AND status = ?", userID, "active").Find(&sessions).Error
	return sessions, err
}

func (r *rangeRepository) UpdateSession(session *models.RangeSession) error {
	return r.db.Save(session).Error
}

func (r *rangeRepository) EndSession(sessionID uint) error {
	return r.db.Model(&models.RangeSession{}).
		Where("id = ?", sessionID).
		Update("status", "completed").Error
}

func (r *rangeRepository) CreateBallBucket(bucket *models.BallBucket) error {
	return r.db.Create(bucket).Error
}

func (r *rangeRepository) GetBucketsBySession(sessionID uint) ([]models.BallBucket, error) {
	var buckets []models.BallBucket
	err := r.db.Where("range_session_id = ?", sessionID).Find(&buckets).Error
	return buckets, err
}

func (r *rangeRepository) UpdateBucket(bucket *models.BallBucket) error {
	return r.db.Save(bucket).Error
}

func (r *rangeRepository) CreateEquipment(equipment *models.RangeEquipment) error {
	return r.db.Create(equipment).Error
}

func (r *rangeRepository) GetEquipmentBySession(sessionID uint) ([]models.RangeEquipment, error) {
	var equipment []models.RangeEquipment
	err := r.db.Where("range_session_id = ?", sessionID).Find(&equipment).Error
	return equipment, err
}

func (r *rangeRepository) UpdateEquipment(equipment *models.RangeEquipment) error {
	return r.db.Save(equipment).Error
}
