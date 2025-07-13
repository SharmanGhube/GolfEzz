package service

import (
	"errors"
	"fmt"
	"golfezz-backend/internal/models"
	"golfezz-backend/internal/repository"
	"time"
)

type RangeService interface {
	StartSession(userID uint, req StartSessionRequest) (*models.RangeSession, error)
	GetSessionByID(id uint) (*models.RangeSession, error)
	GetActiveUserSessions(userID uint) ([]models.RangeSession, error)
	EndSession(sessionID uint, userID uint) (*models.RangeSession, error)
	
	AddBallBucket(sessionID uint, req AddBallBucketRequest) (*models.BallBucket, error)
	ReturnBallBucket(bucketID uint) error
	
	AddEquipment(sessionID uint, req AddEquipmentRequest) (*models.RangeEquipment, error)
	ReturnEquipment(equipmentID uint) error
}

type StartSessionRequest struct {
	BayNumber int    `json:"bay_number"`
	Notes     string `json:"notes"`
}

type AddBallBucketRequest struct {
	BucketSize string  `json:"bucket_size" binding:"required"`
	BallCount  int     `json:"ball_count" binding:"required"`
	Price      float64 `json:"price" binding:"required"`
}

type AddEquipmentRequest struct {
	EquipmentType string  `json:"equipment_type" binding:"required"`
	EquipmentName string  `json:"equipment_name" binding:"required"`
	Quantity      int     `json:"quantity" binding:"required"`
	Price         float64 `json:"price" binding:"required"`
}

type rangeService struct {
	rangeRepo repository.RangeRepository
	userRepo  repository.UserRepository
}

func NewRangeService(rangeRepo repository.RangeRepository, userRepo repository.UserRepository) RangeService {
	return &rangeService{
		rangeRepo: rangeRepo,
		userRepo:  userRepo,
	}
}

func (s *rangeService) StartSession(userID uint, req StartSessionRequest) (*models.RangeSession, error) {
	// Check if user exists
	user, err := s.userRepo.GetByID(userID)
	if err != nil {
		return nil, errors.New("user not found")
	}

	// Check for active sessions
	activeSessions, err := s.rangeRepo.GetActiveSessionsByUser(userID)
	if err != nil {
		return nil, fmt.Errorf("failed to check active sessions: %w", err)
	}

	if len(activeSessions) > 0 {
		return nil, errors.New("user already has an active range session")
	}

	// Create new session
	session := &models.RangeSession{
		UserID:      userID,
		StartTime:   time.Now(),
		Status:      "active",
		BayNumber:   req.BayNumber,
		Notes:       req.Notes,
		TotalAmount: 0, // Will be calculated as items are added
	}

	if err := s.rangeRepo.CreateSession(session); err != nil {
		return nil, fmt.Errorf("failed to create range session: %w", err)
	}

	session.User = *user
	return session, nil
}

func (s *rangeService) GetSessionByID(id uint) (*models.RangeSession, error) {
	return s.rangeRepo.GetSessionByID(id)
}

func (s *rangeService) GetActiveUserSessions(userID uint) ([]models.RangeSession, error) {
	return s.rangeRepo.GetActiveSessionsByUser(userID)
}

func (s *rangeService) EndSession(sessionID uint, userID uint) (*models.RangeSession, error) {
	session, err := s.rangeRepo.GetSessionByID(sessionID)
	if err != nil {
		return nil, errors.New("session not found")
	}

	if session.UserID != userID {
		return nil, errors.New("unauthorized to end this session")
	}

	if session.Status != "active" {
		return nil, errors.New("session is not active")
	}

	// Calculate duration
	now := time.Now()
	session.EndTime = &now
	session.DurationMinutes = int(now.Sub(session.StartTime).Minutes())
	session.Status = "completed"

	if err := s.rangeRepo.UpdateSession(session); err != nil {
		return nil, fmt.Errorf("failed to end session: %w", err)
	}

	return session, nil
}

func (s *rangeService) AddBallBucket(sessionID uint, req AddBallBucketRequest) (*models.BallBucket, error) {
	session, err := s.rangeRepo.GetSessionByID(sessionID)
	if err != nil {
		return nil, errors.New("session not found")
	}

	if session.Status != "active" {
		return nil, errors.New("session is not active")
	}

	// Create ball bucket
	bucket := &models.BallBucket{
		RangeSessionID: sessionID,
		BucketSize:     req.BucketSize,
		BallCount:      req.BallCount,
		Price:          req.Price,
		IsReturned:     false,
	}

	if err := s.rangeRepo.CreateBallBucket(bucket); err != nil {
		return nil, fmt.Errorf("failed to add ball bucket: %w", err)
	}

	// Update session total amount
	session.TotalAmount += req.Price
	s.rangeRepo.UpdateSession(session)

	return bucket, nil
}

func (s *rangeService) ReturnBallBucket(bucketID uint) error {
	// Get buckets by session to find the specific bucket
	// This is a simplified approach - in a real system you'd want a GetBucketByID method
	return errors.New("method not implemented - need GetBucketByID in repository")
}

func (s *rangeService) AddEquipment(sessionID uint, req AddEquipmentRequest) (*models.RangeEquipment, error) {
	session, err := s.rangeRepo.GetSessionByID(sessionID)
	if err != nil {
		return nil, errors.New("session not found")
	}

	if session.Status != "active" {
		return nil, errors.New("session is not active")
	}

	// Create equipment rental
	equipment := &models.RangeEquipment{
		RangeSessionID: sessionID,
		EquipmentType:  req.EquipmentType,
		EquipmentName:  req.EquipmentName,
		Quantity:       req.Quantity,
		Price:          req.Price,
		IsReturned:     false,
		Condition:      "good",
	}

	if err := s.rangeRepo.CreateEquipment(equipment); err != nil {
		return nil, fmt.Errorf("failed to add equipment: %w", err)
	}

	// Update session total amount
	session.TotalAmount += req.Price
	s.rangeRepo.UpdateSession(session)

	return equipment, nil
}

func (s *rangeService) ReturnEquipment(equipmentID uint) error {
	// Similar to ReturnBallBucket - would need GetEquipmentByID method
	return errors.New("method not implemented - need GetEquipmentByID in repository")
}
