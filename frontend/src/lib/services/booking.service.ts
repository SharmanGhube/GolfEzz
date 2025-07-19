/**
 * Booking Service
 * Handles tee time and driving range bookings
 */

import apiClient from '@/lib/api-client';
import type { TeeTimeBooking, RangeBooking, ApiResponse, PaginatedResponse } from '@/types/api';

export interface TeeTimeBookingRequest {
  courseId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  players: number;
  specialRequests?: string;
}

export interface RangeBookingRequest {
  courseId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  duration: number; // in minutes
  bucketSize: 'small' | 'medium' | 'large';
  bucketCount: number;
}

export interface AvailableTimeSlot {
  time: string;
  available: boolean;
  price: number;
}

export interface BookingFilters {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  courseId?: string;
}

export class BookingService {
  // === TEE TIME BOOKINGS ===

  /**
   * Get available tee times for a specific course and date
   */
  static async getAvailableTeetimes(
    courseId: string,
    date: string
  ): Promise<ApiResponse<AvailableTimeSlot[]>> {
    return apiClient.get<AvailableTimeSlot[]>(
      `/api/v1/courses/${courseId}/available-times?date=${date}`
    );
  }

  /**
   * Book a tee time
   */
  static async bookTeeTime(booking: TeeTimeBookingRequest): Promise<ApiResponse<TeeTimeBooking>> {
    return apiClient.post<TeeTimeBooking>('/api/v1/bookings/tee-time', booking);
  }

  /**
   * Get user's tee time bookings
   */
  static async getTeeTimeBookings(
    filters?: BookingFilters
  ): Promise<ApiResponse<PaginatedResponse<TeeTimeBooking>>> {
    const params = new URLSearchParams();
    
    if (filters?.status) params.set('status', filters.status);
    if (filters?.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.set('dateTo', filters.dateTo);
    if (filters?.courseId) params.set('courseId', filters.courseId);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/api/v1/bookings/tee-time?${queryString}` : '/api/v1/bookings/tee-time';
    
    return apiClient.get<PaginatedResponse<TeeTimeBooking>>(endpoint);
  }

  /**
   * Get a specific tee time booking
   */
  static async getTeeTimeBooking(bookingId: string): Promise<ApiResponse<TeeTimeBooking>> {
    return apiClient.get<TeeTimeBooking>(`/api/v1/bookings/tee-time/${bookingId}`);
  }

  /**
   * Cancel a tee time booking
   */
  static async cancelTeeTimeBooking(bookingId: string): Promise<ApiResponse<TeeTimeBooking>> {
    return apiClient.patch<TeeTimeBooking>(`/api/v1/bookings/tee-time/${bookingId}/cancel`);
  }

  // === DRIVING RANGE BOOKINGS ===

  /**
   * Get available range slots for a specific course and date
   */
  static async getAvailableRangeSlots(
    courseId: string,
    date: string
  ): Promise<ApiResponse<AvailableTimeSlot[]>> {
    return apiClient.get<AvailableTimeSlot[]>(
      `/api/v1/courses/${courseId}/available-range?date=${date}`
    );
  }

  /**
   * Book a driving range session
   */
  static async bookRange(booking: RangeBookingRequest): Promise<ApiResponse<RangeBooking>> {
    return apiClient.post<RangeBooking>('/api/v1/bookings/range', booking);
  }

  /**
   * Get user's range bookings
   */
  static async getRangeBookings(
    filters?: BookingFilters
  ): Promise<ApiResponse<PaginatedResponse<RangeBooking>>> {
    const params = new URLSearchParams();
    
    if (filters?.status) params.set('status', filters.status);
    if (filters?.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.set('dateTo', filters.dateTo);
    if (filters?.courseId) params.set('courseId', filters.courseId);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/api/v1/bookings/range?${queryString}` : '/api/v1/bookings/range';
    
    return apiClient.get<PaginatedResponse<RangeBooking>>(endpoint);
  }

  /**
   * Get a specific range booking
   */
  static async getRangeBooking(bookingId: string): Promise<ApiResponse<RangeBooking>> {
    return apiClient.get<RangeBooking>(`/api/v1/bookings/range/${bookingId}`);
  }

  /**
   * Update range booking (e.g., add more buckets)
   */
  static async updateRangeBooking(
    bookingId: string,
    updates: Partial<RangeBookingRequest>
  ): Promise<ApiResponse<RangeBooking>> {
    return apiClient.patch<RangeBooking>(`/api/v1/bookings/range/${bookingId}`, updates);
  }

  /**
   * Cancel a range booking
   */
  static async cancelRangeBooking(bookingId: string): Promise<ApiResponse<RangeBooking>> {
    return apiClient.patch<RangeBooking>(`/api/v1/bookings/range/${bookingId}/cancel`);
  }

  // === GENERAL BOOKING METHODS ===

  /**
   * Get all user bookings (both tee time and range)
   */
  static async getAllBookings(): Promise<ApiResponse<{
    teeTimeBookings: TeeTimeBooking[];
    rangeBookings: RangeBooking[];
  }>> {
    return apiClient.get('/api/v1/bookings/all');
  }

  /**
   * Get booking statistics for user
   */
  static async getBookingStats(): Promise<ApiResponse<{
    totalBookings: number;
    upcomingBookings: number;
    totalSpent: number;
    favoriteGourse: string;
  }>> {
    return apiClient.get('/api/v1/bookings/stats');
  }
}

export default BookingService;
