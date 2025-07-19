/**
 * Course Service
 * Handles golf course data and operations
 */

import apiClient from '@/lib/api-client';
import type { Course, CourseCondition, ApiResponse, PaginatedResponse } from '@/types/api';

export interface CourseFilters {
  difficulty?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  search?: string;
}

export interface CoursePagination {
  page?: number;
  limit?: number;
}

export class CourseService {
  /**
   * Get all courses with optional filters and pagination
   */
  static async getCourses(
    filters?: CourseFilters,
    pagination?: CoursePagination
  ): Promise<ApiResponse<PaginatedResponse<Course>>> {
    const params = new URLSearchParams();
    
    // Add pagination
    if (pagination?.page) params.set('page', pagination.page.toString());
    if (pagination?.limit) params.set('limit', pagination.limit.toString());
    
    // Add filters
    if (filters?.difficulty) params.set('difficulty', filters.difficulty);
    if (filters?.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    if (filters?.search) params.set('search', filters.search);
    if (filters?.amenities?.length) params.set('amenities', filters.amenities.join(','));
    
    const queryString = params.toString();
    const endpoint = queryString ? `/api/v1/courses?${queryString}` : '/api/v1/courses';
    
    return apiClient.get<PaginatedResponse<Course>>(endpoint);
  }

  /**
   * Get a single course by ID
   */
  static async getCourse(courseId: string): Promise<ApiResponse<Course>> {
    return apiClient.get<Course>(`/api/v1/courses/${courseId}`);
  }

  /**
   * Get course conditions
   */
  static async getCourseConditions(courseId: string): Promise<ApiResponse<CourseCondition>> {
    return apiClient.get<CourseCondition>(`/api/v1/courses/${courseId}/conditions`);
  }

  /**
   * Create a new course (Admin only)
   */
  static async createCourse(courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Course>> {
    return apiClient.post<Course>('/api/v1/admin/courses', courseData);
  }

  /**
   * Update a course (Admin only)
   */
  static async updateCourse(courseId: string, courseData: Partial<Course>): Promise<ApiResponse<Course>> {
    return apiClient.put<Course>(`/api/v1/admin/courses/${courseId}`, courseData);
  }

  /**
   * Delete a course (Admin only)
   */
  static async deleteCourse(courseId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/api/v1/admin/courses/${courseId}`);
  }

  /**
   * Update course conditions (Admin/Staff only)
   */
  static async updateCourseConditions(
    courseId: string,
    conditions: Partial<CourseCondition>
  ): Promise<ApiResponse<CourseCondition>> {
    return apiClient.put<CourseCondition>(`/api/v1/admin/courses/${courseId}/conditions`, conditions);
  }

  /**
   * Get featured courses
   */
  static async getFeaturedCourses(): Promise<ApiResponse<Course[]>> {
    return apiClient.get<Course[]>('/api/v1/courses/featured');
  }

  /**
   * Search courses by name or location
   */
  static async searchCourses(query: string): Promise<ApiResponse<Course[]>> {
    return apiClient.get<Course[]>(`/api/v1/courses/search?q=${encodeURIComponent(query)}`);
  }
}

export default CourseService;
