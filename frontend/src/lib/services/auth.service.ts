/**
 * Authentication Service
 * Handles login, registration, and user management
 */

import apiClient from '@/lib/api-client';
import type { User, ApiResponse, RegisterRequest, LoginRequest } from '@/types/api';

export interface AuthResponse {
  user: User;
  token: string;
}

export class AuthService {
  /**
   * Login with email and password
   */
  static async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/login', credentials);
    
    if (response.success && response.data?.token) {
      // Store token for future requests
      apiClient.setAuthToken(response.data.token);
    }
    
    return response;
  }

  /**
   * Register a new user
   */
  static async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/register', data);
    
    if (response.success && response.data?.token) {
      // Store token for future requests
      apiClient.setAuthToken(response.data.token);
    }
    
    return response;
  }

  /**
   * Get current user profile
   */
  static async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/api/v1/auth/profile');
  }

  /**
   * Update user profile
   */
  static async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put<User>('/api/v1/auth/profile', data);
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      await apiClient.post('/api/v1/auth/logout');
    } finally {
      // Always clear token, even if API call fails
      apiClient.clearAuthToken();
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('golf-app-token');
  }
}

export default AuthService;
