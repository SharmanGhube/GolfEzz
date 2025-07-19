/**
 * React Hooks for API Services
 * Custom hooks for easy integration with React components
 */

import { useState, useEffect, useCallback } from 'react';
import { AuthService, CourseService, BookingService, AdminService } from '@/lib/api';
import type { DashboardStats as AdminDashboardStats } from '@/lib/services/admin.service';
import type { 
  User, 
  Course, 
  TeeTimeBooking, 
  RangeBooking,
  LoginRequest,
  RegisterRequest
} from '@/types/api';

// === AUTH HOOKS ===

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await AuthService.login(credentials);
      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true };
      } else {
        setError(response.error || 'Login failed');
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await AuthService.register(data);
      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true };
      } else {
        setError(response.error || 'Registration failed');
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await AuthService.logout();
    setUser(null);
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!AuthService.isAuthenticated()) {
      setLoading(false);
      return;
    }

    try {
      const response = await AuthService.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: AuthService.isAuthenticated(),
    refreshProfile: fetchProfile,
  };
};

// === COURSE HOOKS ===

export const useCourses = (filters?: any) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchCourses = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await CourseService.getCourses(filters, { page, limit: pagination.limit });
      if (response.success && response.data) {
        setCourses(response.data.data);
        setPagination(prev => ({ 
          ...prev, 
          page,
          total: response.data?.total || 0,
          totalPages: response.data?.total_pages || 0
        }));
      } else {
        setError(response.error || 'Failed to fetch courses');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.limit]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    pagination,
    refetch: fetchCourses,
    nextPage: () => fetchCourses(pagination.page + 1),
    prevPage: () => fetchCourses(pagination.page - 1),
  };
};

export const useCourse = (courseId: string) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // TODO: Implement CourseService when ready
        // For now, set course to null
        setCourse(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  return { course, loading, error };
};

// === BOOKING HOOKS ===

export const useBookings = () => {
  const [teeTimeBookings, setTeeTimeBookings] = useState<TeeTimeBooking[]>([]);
  const [rangeBookings, setRangeBookings] = useState<RangeBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [teeTimeResponse, rangeResponse] = await Promise.all([
        BookingService.getTeeTimeBookings(),
        BookingService.getRangeBookings()
      ]);
      
      if (teeTimeResponse.success && teeTimeResponse.data) {
        setTeeTimeBookings(teeTimeResponse.data.data);
      }
      
      if (rangeResponse.success && rangeResponse.data) {
        setRangeBookings(rangeResponse.data.data);
      }
      
      if (!teeTimeResponse.success) {
        setError(teeTimeResponse.error || 'Failed to fetch tee time bookings');
      } else if (!rangeResponse.success) {
        setError(rangeResponse.error || 'Failed to fetch range bookings');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  const bookTeeTime = useCallback(async (booking: any) => {
    try {
      // TODO: Implement BookingService when ready
      await fetchBookings(); // Refresh bookings
      return { success: true, data: null };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Booking failed' };
    }
  }, [fetchBookings]);

  const bookRange = useCallback(async (booking: any) => {
    try {
      // TODO: Implement BookingService when ready
      await fetchBookings(); // Refresh bookings
      return { success: true, data: null };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Booking failed' };
    }
  }, [fetchBookings]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    teeTimeBookings,
    rangeBookings,
    loading,
    error,
    refetch: fetchBookings,
    bookTeeTime,
    bookRange,
  };
};

// === ADMIN HOOKS ===

export const useAdminDashboard = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await AdminService.getDashboardStats();
        if (response.success && response.data) {
          setStats(response.data);
        } else {
          setError(response.error || 'Failed to fetch dashboard stats');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};

// === UTILITY HOOKS ===

export const useApiCall = <T,>(apiFunction: () => Promise<any>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiFunction();
      if (response.success && response.data) {
        setData(response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.error || 'API call failed');
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'API call failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  return { data, loading, error, execute };
};
