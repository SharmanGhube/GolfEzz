package service

import (
	"errors"
	"fmt"
	"golfezz-backend/internal/models"
	"golfezz-backend/internal/repository"
	"time"
)

type BookingService interface {
	CreateBooking(req CreateBookingRequest) (*models.Booking, error)
	GetBookingByID(id uint) (*models.Booking, error)
	GetUserBookings(userID uint) ([]models.Booking, error)
	UpdateBooking(id uint, req UpdateBookingRequest) (*models.Booking, error)
	CancelBooking(id uint, userID uint) error
	GetAvailableSlots(courseID uint, date time.Time) ([]models.TeeTimeSlot, error)
}

type CreateBookingRequest struct {
	TeeTimeSlotID uint                    `json:"tee_time_slot_id" binding:"required"`
	Players       []BookingPlayerRequest  `json:"players" binding:"required,min=1,max=4"`
	Notes         string                  `json:"notes"`
}

type UpdateBookingRequest struct {
	Players []BookingPlayerRequest `json:"players"`
	Notes   string                 `json:"notes"`
}

type BookingPlayerRequest struct {
	UserID    *uint   `json:"user_id"`
	FirstName string  `json:"first_name" binding:"required"`
	LastName  string  `json:"last_name" binding:"required"`
	Email     string  `json:"email"`
	Phone     string  `json:"phone"`
	Handicap  float64 `json:"handicap"`
	IsGuest   bool    `json:"is_guest"`
}

type bookingService struct {
	bookingRepo repository.BookingRepository
	teeTimeRepo repository.TeeTimeRepository
	userRepo    repository.UserRepository
}

func NewBookingService(
	bookingRepo repository.BookingRepository,
	teeTimeRepo repository.TeeTimeRepository,
	userRepo repository.UserRepository,
) BookingService {
	return &bookingService{
		bookingRepo: bookingRepo,
		teeTimeRepo: teeTimeRepo,
		userRepo:    userRepo,
	}
}

func (s *bookingService) CreateBooking(req CreateBookingRequest) (*models.Booking, error) {
	// Get tee time slot
	teeTimeSlot, err := s.teeTimeRepo.GetByID(req.TeeTimeSlotID)
	if err != nil {
		return nil, errors.New("tee time slot not found")
	}

	// Check availability
	if !teeTimeSlot.IsAvailable {
		return nil, errors.New("tee time slot is not available")
	}

	// Check max players
	if len(req.Players) > teeTimeSlot.MaxPlayers {
		return nil, fmt.Errorf("maximum %d players allowed", teeTimeSlot.MaxPlayers)
	}

	// Generate booking number
	bookingNumber := s.generateBookingNumber()

	// Calculate total amount
	totalAmount := teeTimeSlot.Price * float64(len(req.Players))

	// Create booking
	booking := &models.Booking{
		TeeTimeSlotID: req.TeeTimeSlotID,
		BookingNumber: bookingNumber,
		TotalPlayers:  len(req.Players),
		TotalAmount:   totalAmount,
		Status:        "pending",
		BookingDate:   time.Now(),
		Notes:         req.Notes,
	}

	if err := s.bookingRepo.Create(booking); err != nil {
		return nil, fmt.Errorf("failed to create booking: %w", err)
	}

	// Create booking players
	for _, playerReq := range req.Players {
		player := models.BookingPlayer{
			BookingID: booking.ID,
			UserID:    playerReq.UserID,
			FirstName: playerReq.FirstName,
			LastName:  playerReq.LastName,
			Email:     playerReq.Email,
			Phone:     playerReq.Phone,
			Handicap:  playerReq.Handicap,
			IsGuest:   playerReq.IsGuest,
		}
		booking.Players = append(booking.Players, player)
	}

	// Update tee time slot availability
	teeTimeSlot.IsAvailable = false
	if err := s.teeTimeRepo.Update(teeTimeSlot); err != nil {
		return nil, fmt.Errorf("failed to update tee time slot: %w", err)
	}

	return booking, nil
}

func (s *bookingService) GetBookingByID(id uint) (*models.Booking, error) {
	return s.bookingRepo.GetByID(id)
}

func (s *bookingService) GetUserBookings(userID uint) ([]models.Booking, error) {
	return s.bookingRepo.GetByUserID(userID)
}

func (s *bookingService) UpdateBooking(id uint, req UpdateBookingRequest) (*models.Booking, error) {
	booking, err := s.bookingRepo.GetByID(id)
	if err != nil {
		return nil, errors.New("booking not found")
	}

	if booking.Status == "cancelled" || booking.Status == "completed" {
		return nil, errors.New("cannot update completed or cancelled booking")
	}

	// Update booking details
	booking.Notes = req.Notes

	if err := s.bookingRepo.Update(booking); err != nil {
		return nil, fmt.Errorf("failed to update booking: %w", err)
	}

	return booking, nil
}

func (s *bookingService) CancelBooking(id uint, userID uint) error {
	booking, err := s.bookingRepo.GetByID(id)
	if err != nil {
		return errors.New("booking not found")
	}

	if booking.UserID != userID {
		return errors.New("unauthorized to cancel this booking")
	}

	if booking.Status == "cancelled" {
		return errors.New("booking is already cancelled")
	}

	// Update booking status
	booking.Status = "cancelled"
	if err := s.bookingRepo.Update(booking); err != nil {
		return fmt.Errorf("failed to cancel booking: %w", err)
	}

	// Release tee time slot
	teeTimeSlot, err := s.teeTimeRepo.GetByID(booking.TeeTimeSlotID)
	if err == nil {
		teeTimeSlot.IsAvailable = true
		s.teeTimeRepo.Update(teeTimeSlot)
	}

	return nil
}

func (s *bookingService) GetAvailableSlots(courseID uint, date time.Time) ([]models.TeeTimeSlot, error) {
	return s.teeTimeRepo.GetAvailableSlots(courseID, date)
}

func (s *bookingService) generateBookingNumber() string {
	timestamp := time.Now().Unix()
	return fmt.Sprintf("BK%d", timestamp)
}
