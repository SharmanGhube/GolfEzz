import axios from 'axios'
import {
  User,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  Booking,
  CreateBookingRequest,
  TeeTimeSlot,
  RangeSession,
  BallBucket,
  RangeEquipment,
  GreenCondition,
  DashboardStats,
  ApiResponse,
} from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await authApi.refreshToken(refreshToken)
          localStorage.setItem('token', response.token)
          localStorage.setItem('user', JSON.stringify(response.user))
          
          originalRequest.headers.Authorization = `Bearer ${response.token}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
        }
      }
    }
    
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials)
    if (response.data.refresh_token) {
      localStorage.setItem('refreshToken', response.data.refresh_token)
    }
    return response.data
  },

  register: async (userData: RegisterRequest): Promise<{ user: User; message: string }> => {
    const response = await api.post<{ user: User; message: string }>('/auth/register', userData)
    return response.data
  },

  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/refresh', { refresh_token: refreshToken })
    return response.data
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/auth/profile')
    return response.data
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/auth/change-password', {
      old_password: oldPassword,
      new_password: newPassword,
    })
    return response.data
  },
}

// Booking API
export const bookingApi = {
  create: async (bookingData: CreateBookingRequest): Promise<{ booking: Booking; message: string }> => {
    const response = await api.post<{ booking: Booking; message: string }>('/bookings', bookingData)
    return response.data
  },

  getMyBookings: async (): Promise<{ bookings: Booking[]; count: number }> => {
    const response = await api.get<{ bookings: Booking[]; count: number }>('/bookings/my')
    return response.data
  },

  getById: async (id: number): Promise<Booking> => {
    const response = await api.get<Booking>(`/bookings/${id}`)
    return response.data
  },

  cancel: async (id: number): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(`/bookings/${id}/cancel`)
    return response.data
  },

  getAvailableSlots: async (courseId: number, date: string): Promise<{ slots: TeeTimeSlot[]; count: number }> => {
    const response = await api.get<{ slots: TeeTimeSlot[]; count: number }>(
      `/bookings/available-slots?course_id=${courseId}&date=${date}`
    )
    return response.data
  },
}

// Range API
export const rangeApi = {
  startSession: async (sessionData: { bay_number?: number; notes?: string }): Promise<{ session: RangeSession; message: string }> => {
    const response = await api.post<{ session: RangeSession; message: string }>('/range/sessions', sessionData)
    return response.data
  },

  getActiveSessions: async (): Promise<{ sessions: RangeSession[]; count: number }> => {
    const response = await api.get<{ sessions: RangeSession[]; count: number }>('/range/sessions/active')
    return response.data
  },

  getSession: async (id: number): Promise<RangeSession> => {
    const response = await api.get<RangeSession>(`/range/sessions/${id}`)
    return response.data
  },

  endSession: async (id: number): Promise<{ session: RangeSession; message: string }> => {
    const response = await api.post<{ session: RangeSession; message: string }>(`/range/sessions/${id}/end`)
    return response.data
  },

  addBallBucket: async (sessionId: number, bucketData: {
    bucket_size: string
    ball_count: number
    price: number
  }): Promise<{ bucket: BallBucket; message: string }> => {
    const response = await api.post<{ bucket: BallBucket; message: string }>(`/range/sessions/${sessionId}/buckets`, bucketData)
    return response.data
  },

  addEquipment: async (sessionId: number, equipmentData: {
    equipment_type: string
    equipment_name: string
    quantity: number
    price: number
  }): Promise<{ equipment: RangeEquipment; message: string }> => {
    const response = await api.post<{ equipment: RangeEquipment; message: string }>(`/range/sessions/${sessionId}/equipment`, equipmentData)
    return response.data
  },
}

// Course API
export const courseApi = {
  getGreenConditions: async (): Promise<GreenCondition[]> => {
    const response = await api.get<GreenCondition[]>('/public/green-conditions')
    return response.data
  },

  getCourses: async (): Promise<any[]> => {
    const response = await api.get<any[]>('/public/courses')
    return response.data
  },

  getCourseById: async (id: number): Promise<any> => {
    const response = await api.get<any>(`/public/courses/${id}`)
    return response.data
  },
}

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/dashboard/stats')
    return response.data
  },

  getRecentActivity: async (): Promise<any[]> => {
    const response = await api.get<any[]>('/dashboard/recent-activity')
    return response.data
  },
}

export default api
