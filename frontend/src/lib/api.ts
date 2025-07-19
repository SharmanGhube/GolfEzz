/**
 * API Services Index
 * Central export point for all API services
 */

export { default as apiClient } from './api-client';
export { default as AuthService } from './services/auth.service';
export { default as CourseService } from './services/course.service';
export { default as BookingService } from './services/booking.service';
export { default as AdminService } from './services/admin.service';

// Re-export types for convenience
export type {
  ApiResponse,
  PaginatedResponse,
} from './api-client';

// Re-export main API types
export type {
  User,
  LoginRequest,
  RegisterRequest,
  Course,
  TeeTimeBooking,
  RangeBooking,
  DashboardStats,
  TeeTimeSlot,
  CoursePricing,
  RangePricing,
  AdminActivity,
  SystemSettings,
  MembershipPlan
} from '@/types/api';
