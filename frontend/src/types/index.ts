// Golf Course Types
export interface Course {
  id: string
  name: string
  description: string
  address: string
  phone: string
  email: string
  website?: string
  holes: number
  par: number
  length: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Championship'
  greenFee: number
  image?: string
  amenities: string[]
  holeDetails: HoleDetail[]
  createdAt: Date
  updatedAt: Date
}

export interface HoleDetail {
  holeNumber: number
  par: number
  length: number
  handicap: number
  description?: string
  hazards: Hazard[]
}

export interface Hazard {
  type: 'water' | 'sand' | 'rough' | 'trees' | 'out-of-bounds'
  description: string
  position: 'left' | 'right' | 'center' | 'front' | 'back'
}

export interface CourseCondition {
  id: string
  courseId: string
  greenSpeed: number // 1-10 scale
  fairwayCondition: 'Poor' | 'Fair' | 'Good' | 'Excellent'
  roughCondition: 'Poor' | 'Fair' | 'Good' | 'Excellent'
  bunkerCondition: 'Poor' | 'Fair' | 'Good' | 'Excellent'
  weatherCondition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Windy' | 'Stormy'
  temperature: number
  windSpeed: number
  humidity: number
  lastUpdated: Date
}

// Booking Types
export interface TeeTimeBooking {
  id: string
  courseId: string
  userId: string
  date: Date
  time: string
  players: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  totalAmount: number
  paymentStatus: 'pending' | 'paid' | 'refunded'
  specialRequests?: string
  createdAt: Date
  updatedAt: Date
}

export interface RangeBooking {
  id: string
  userId: string
  courseId: string
  date: Date
  startTime: string
  duration: number // in minutes
  bucketSize: 'small' | 'medium' | 'large'
  bucketCount: number
  totalAmount: number
  status: 'active' | 'completed' | 'cancelled'
  createdAt: Date
}

// User Types
export interface User {
  id: string
  name: string
  email: string
  image?: string
  role: 'admin' | 'member' | 'staff'
  membershipType?: 'standard' | 'premium' | 'vip'
  membershipExpiry?: Date
  phone?: string
  address?: string
  handicap?: number
  preferences: UserPreferences
  createdAt: Date
  updatedAt: Date
}

export interface UserPreferences {
  preferredTeeTime: string
  preferredCourses: string[]
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
  playingStyle: 'casual' | 'competitive' | 'social'
}

// Analytics Types
export interface CourseAnalytics {
  courseId: string
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  bookingsCount: number
  revenue: number
  utilizationRate: number
  averageRating: number
  popularTimeSlots: TimeSlot[]
  memberGrowth: number
}

export interface TimeSlot {
  time: string
  bookingCount: number
  revenue: number
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form Types
export interface CourseFormData {
  name: string
  description: string
  address: string
  phone: string
  email: string
  website?: string
  holes: number
  par: number
  length: number
  difficulty: Course['difficulty']
  greenFee: number
  amenities: string[]
}

export interface BookingFormData {
  courseId: string
  date: string
  time: string
  players: number
  specialRequests?: string
}

export interface RangeBookingFormData {
  courseId: string
  date: string
  startTime: string
  duration: number
  bucketSize: RangeBooking['bucketSize']
  bucketCount: number
}
