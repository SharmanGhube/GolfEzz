export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  phone?: string
  date_of_birth?: string
  handicap?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Role {
  id: number
  name: string
  description: string
}

export interface GolfCourse {
  id: number
  name: string
  description: string
  address: string
  city: string
  state: string
  zip_code: string
  phone: string
  email: string
  website: string
  total_holes: number
  par_total: number
  course_rating: number
  slope_rating: number
  yardage_total: number
  is_active: boolean
}

export interface Hole {
  id: number
  golf_course_id: number
  hole_number: number
  par: number
  handicap: number
  description: string
}

export interface TeeTimeSlot {
  id: number
  golf_course_id: number
  date: string
  time: string
  max_players: number
  price: number
  is_available: boolean
  tee_type: string
  is_weekend: boolean
  is_primetime: boolean
}

export interface Booking {
  id: number
  user_id: number
  tee_time_slot_id: number
  booking_number: string
  total_players: number
  total_amount: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  booking_date: string
  notes?: string
  tee_time_slot?: TeeTimeSlot
  players?: BookingPlayer[]
}

export interface BookingPlayer {
  id: number
  booking_id: number
  user_id?: number
  first_name: string
  last_name: string
  email?: string
  phone?: string
  handicap?: number
  is_guest: boolean
}

export interface RangeSession {
  id: number
  user_id: number
  start_time: string
  end_time?: string
  duration_minutes?: number
  total_amount: number
  status: 'active' | 'completed' | 'cancelled'
  bay_number?: number
  notes?: string
  ball_buckets?: BallBucket[]
  equipment?: RangeEquipment[]
}

export interface BallBucket {
  id: number
  range_session_id: number
  bucket_size: string
  ball_count: number
  price: number
  is_returned: boolean
  returned_at?: string
}

export interface RangeEquipment {
  id: number
  range_session_id: number
  equipment_type: string
  equipment_name: string
  quantity: number
  price: number
  is_returned: boolean
  returned_at?: string
  condition?: string
}

export interface GreenCondition {
  id: number
  golf_course_id: number
  date: string
  green_speed: number
  firmness_rating: number
  moisture_level: number
  weather_condition: string
  temperature: number
  wind_speed: number
  wind_direction: string
  notes?: string
}

export interface Membership {
  id: number
  user_id: number
  membership_type_id: number
  membership_number: string
  start_date: string
  end_date: string
  status: 'active' | 'suspended' | 'expired' | 'cancelled'
  auto_renew: boolean
  membership_type?: MembershipType
}

export interface MembershipType {
  id: number
  name: string
  description: string
  monthly_fee: number
  annual_fee?: number
  initiation_fee?: number
  tee_time_discount: number
  range_discount: number
  max_advance_bookings: number
  includes_range: boolean
  includes_cart: boolean
  guest_policy?: string
  is_active: boolean
}

export interface Payment {
  id: number
  booking_id?: number
  range_session_id?: number
  membership_id?: number
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  transaction_id?: string
  payment_date: string
  description?: string
}

export interface DashboardStats {
  total_bookings: number
  total_revenue: number
  active_members: number
  upcoming_bookings: number
  range_sessions_today: number
  green_speed: number
}

export interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
  count?: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  first_name: string
  last_name: string
  email: string
  phone?: string
  password: string
  date_of_birth?: string
  handicap?: number
}

export interface LoginResponse {
  token: string
  refresh_token: string
  user: User
  expires_at: string
}

export interface CreateBookingRequest {
  tee_time_slot_id: number
  players: BookingPlayerRequest[]
  notes?: string
}

export interface BookingPlayerRequest {
  user_id?: number
  first_name: string
  last_name: string
  email?: string
  phone?: string
  handicap?: number
  is_guest: boolean
}
