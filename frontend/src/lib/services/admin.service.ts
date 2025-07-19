/**
 * Admin Service
 * Handles admin-specific operations and dashboard data
 */

import apiClient from '@/lib/api-client';
import type { User, TeeTimeBooking, RangeBooking, Course, ApiResponse, PaginatedResponse } from '@/types/api';

export interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  activeMembers: number;
  todaysBookings: number;
  monthlyRevenue: number;
  occupancyRate: number;
  popularCourses: Array<{
    courseId: string;
    courseName: string;
    bookingsCount: number;
  }>;
}

export interface RevenueReport {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  data: Array<{
    date: string;
    revenue: number;
    bookings: number;
  }>;
  totalRevenue: number;
  averageBookingValue: number;
}

export interface UserFilters {
  role?: string;
  membershipType?: string;
  status?: 'active' | 'inactive';
  search?: string;
}

export class AdminService {
  // === DASHBOARD & ANALYTICS ===

  /**
   * Get dashboard statistics
   */
  static async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return apiClient.get<DashboardStats>('/api/v1/admin/dashboard/stats');
  }

  /**
   * Get revenue report
   */
  static async getRevenueReport(
    period: 'daily' | 'weekly' | 'monthly' | 'yearly',
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<RevenueReport>> {
    const params = new URLSearchParams({ period });
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    
    return apiClient.get<RevenueReport>(`/api/v1/admin/reports/revenue?${params.toString()}`);
  }

  /**
   * Get booking analytics
   */
  static async getBookingAnalytics(courseId?: string): Promise<ApiResponse<{
    totalBookings: number;
    occupancyRate: number;
    peakHours: string[];
    cancellationRate: number;
    averageGroupSize: number;
  }>> {
    const endpoint = courseId 
      ? `/api/v1/admin/analytics/bookings?courseId=${courseId}`
      : '/api/v1/admin/analytics/bookings';
    
    return apiClient.get(endpoint);
  }

  // === USER MANAGEMENT ===

  /**
   * Get all users with filtering and pagination
   */
  static async getUsers(
    filters?: UserFilters,
    page = 1,
    limit = 20
  ): Promise<ApiResponse<PaginatedResponse<User>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (filters?.role) params.set('role', filters.role);
    if (filters?.membershipType) params.set('membershipType', filters.membershipType);
    if (filters?.status) params.set('status', filters.status);
    if (filters?.search) params.set('search', filters.search);
    
    return apiClient.get<PaginatedResponse<User>>(`/api/v1/admin/users?${params.toString()}`);
  }

  /**
   * Get a specific user
   */
  static async getUser(userId: string): Promise<ApiResponse<User>> {
    return apiClient.get<User>(`/api/v1/admin/users/${userId}`);
  }

  /**
   * Update user role
   */
  static async updateUserRole(userId: string, role: 'admin' | 'member' | 'staff'): Promise<ApiResponse<User>> {
    return apiClient.patch<User>(`/api/v1/admin/users/${userId}/role`, { role });
  }

  /**
   * Delete a user
   */
  static async deleteUser(userId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/api/v1/admin/users/${userId}`);
  }

  /**
   * Get user's booking history
   */
  static async getUserBookings(userId: string): Promise<ApiResponse<{
    teeTimeBookings: TeeTimeBooking[];
    rangeBookings: RangeBooking[];
  }>> {
    return apiClient.get(`/api/v1/admin/users/${userId}/bookings`);
  }

  // === BOOKING MANAGEMENT ===

  /**
   * Get all bookings with filtering
   */
  static async getAllBookings(
    page = 1,
    limit = 20,
    filters?: {
      status?: string;
      courseId?: string;
      dateFrom?: string;
      dateTo?: string;
      userId?: string;
    }
  ): Promise<ApiResponse<PaginatedResponse<TeeTimeBooking | RangeBooking>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (filters?.status) params.set('status', filters.status);
    if (filters?.courseId) params.set('courseId', filters.courseId);
    if (filters?.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.set('dateTo', filters.dateTo);
    if (filters?.userId) params.set('userId', filters.userId);
    
    return apiClient.get(`/api/v1/admin/bookings?${params.toString()}`);
  }

  /**
   * Cancel any booking (admin override)
   */
  static async cancelBooking(bookingId: string, reason?: string): Promise<ApiResponse<void>> {
    return apiClient.patch(`/api/v1/admin/bookings/${bookingId}/cancel`, { reason });
  }

  /**
   * Confirm a pending booking
   */
  static async confirmBooking(bookingId: string): Promise<ApiResponse<void>> {
    return apiClient.patch(`/api/v1/admin/bookings/${bookingId}/confirm`);
  }

  // === SYSTEM MANAGEMENT ===

  /**
   * Get system logs
   */
  static async getSystemLogs(
    page = 1,
    limit = 50,
    level?: 'info' | 'warning' | 'error'
  ): Promise<ApiResponse<PaginatedResponse<{
    timestamp: string;
    level: string;
    message: string;
    userId?: string;
    action?: string;
  }>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (level) params.set('level', level);
    
    return apiClient.get(`/api/v1/admin/logs?${params.toString()}`);
  }

  /**
   * Get system status
   */
  static async getSystemStatus(): Promise<ApiResponse<{
    status: 'healthy' | 'warning' | 'error';
    database: 'connected' | 'disconnected';
    lastBackup: string;
    uptime: number;
    version: string;
  }>> {
    return apiClient.get('/api/v1/admin/system/status');
  }

  /**
   * Export data (users, bookings, etc.)
   */
  static async exportData(
    type: 'users' | 'bookings' | 'revenue' | 'all',
    format: 'csv' | 'json' | 'xlsx' = 'csv'
  ): Promise<ApiResponse<{ downloadUrl: string }>> {
    return apiClient.post('/api/v1/admin/export', { type, format });
  }
}

export default AdminService;
