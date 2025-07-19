// API Types for Golf Course Management System

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: 'member' | 'admin' | 'super_admin';
  status: 'active' | 'inactive' | 'suspended';
  email_verified: boolean;
  email_verified_at?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  
  // Member-specific fields
  membership_id?: string;
  membership_type?: string;
  membership_expiry?: string;
  membership_status?: string;
  handicap?: number;
  preferences?: UserPreferences;
  
  // Admin-specific fields
  admin_level?: string;
  can_manage_courses?: boolean;
  can_manage_users?: boolean;
  can_manage_pricing?: boolean;
  can_view_analytics?: boolean;
  last_login_at?: string;
  
  // Authentication fields
  two_factor_enabled?: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  preferred_tee_time: string;
  preferred_courses: string[];
  notifications: NotificationSettings;
  playing_style: string;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  holes: number;
  par: number;
  length: number;
  difficulty: string;
  image?: string;
  images: string[];
  amenities: string[];
  hole_details: HoleDetail[];
  
  // Pricing fields
  green_fee_weekday: number;
  green_fee_weekend: number;
  green_fee_holiday: number;
  cart_fee: number;
  club_rental_fee: number;
  range_ball_price: number;
  member_discount: number;
  
  // Course settings
  is_active: boolean;
  booking_advance_days: number;
  max_players_per_slot: number;
  slot_duration: number;
  open_time: string;
  close_time: string;
  
  conditions?: CourseCondition[];
  created_at: string;
  updated_at: string;
}

export interface HoleDetail {
  hole_number: number;
  par: number;
  length: number;
  handicap: number;
  description?: string;
  hazards: Hazard[];
}

export interface Hazard {
  type: string;
  description: string;
  position: string;
}

export interface CourseCondition {
  id: string;
  course_id: string;
  green_speed: number;
  fairway_condition: string;
  rough_condition: string;
  bunker_condition: string;
  weather_condition: string;
  temperature: number;
  wind_speed: number;
  humidity: number;
  last_updated: string;
}

export interface TeeTimeBooking {
  id: string;
  course_id: string;
  course?: Course;
  user_id: string;
  user?: User;
  date: string;
  time: string;
  players: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'refunded';
  special_requests?: string;
  checked_in: boolean;
  check_in_time?: string;
  created_at: string;
  updated_at: string;
}

export interface RangeBooking {
  id: string;
  user_id: string;
  user?: User;
  course_id: string;
  course?: Course;
  date: string;
  start_time: string;
  duration: number;
  bucket_size: string;
  bucket_count: number;
  total_amount: number;
  status: 'active' | 'completed' | 'cancelled';
  used_buckets: number;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  booking_id?: string;
  range_booking_id?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  transaction_id?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  user?: User;
  course_id: string;
  course?: Course;
  rating: number;
  comment?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  read_at?: string;
  data?: string;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: 'member' | 'admin';
  phone?: string;
  address?: string;
  date_of_birth?: string;
  membership_type?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AvailabilityRequest {
  course_id: string;
  date: string;
}

export interface BookingRequest {
  course_id: string;
  date: string;
  time: string;
  players: number;
  special_requests?: string;
}

export interface DashboardStats {
  // Common stats
  total_bookings: number;
  total_revenue: number;
  active_members: number;
  course_utilization: number;
  popular_times: string[];
  revenue_trend: Array<{ date: string; revenue: number }>;
  booking_trend: Array<{ date: string; bookings: number }>;
  
  // Admin-specific stats
  pending_bookings?: number;
  cancelled_bookings?: number;
  new_members_this_month?: number;
  average_rating?: number;
  system_health?: 'good' | 'warning' | 'critical';
  recent_activities?: AdminActivity[];
  
  // Member-specific stats
  user_bookings?: number;
  user_spending?: number;
  favorite_courses?: string[];
  upcoming_bookings?: TeeTimeBooking[];
  membership_status?: string;
  membership_expiry?: string;
}

// New types for role-based system
export interface TeeTimeSlot {
  id: string;
  course_id: string;
  date: string;
  time_slot: string;
  max_players: number;
  booked_players: number;
  status: 'available' | 'booked' | 'blocked';
  price: number;
  special_pricing: boolean;
  created_by?: string;
  booking_id?: string;
  member_only: boolean;
  weather_dependent: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CoursePricing {
  id: string;
  course_id: string;
  pricing_type: 'weekday' | 'weekend' | 'holiday' | 'member' | 'guest' | 'twilight';
  player_type: 'member' | 'guest' | 'student' | 'senior';
  price: number;
  time_start?: string;
  time_end?: string;
  season_start?: string;
  season_end?: string;
  is_active: boolean;
  description?: string;
  min_players: number;
  max_players: number;
  advance_booking_days: number;
  cancellation_policy?: string;
  created_at: string;
  updated_at: string;
}

export interface RangePricing {
  id: string;
  course_id: string;
  service_type: 'range_balls' | 'lessons' | 'equipment_rental';
  pricing_tier?: 'small' | 'medium' | 'large' | 'unlimited';
  player_type: 'member' | 'guest' | 'student' | 'senior';
  price: number;
  quantity?: number;
  unit?: string;
  time_start?: string;
  time_end?: string;
  is_active: boolean;
  description?: string;
  min_age?: number;
  max_age?: number;
  created_at: string;
  updated_at: string;
}

export interface AdminActivity {
  id: string;
  admin_id: string;
  admin?: User;
  activity_type: 'course_update' | 'pricing_change' | 'user_management' | 'system_config' | 'booking_management' | 'content_update';
  description: string;
  details?: any;
  target_type?: string;
  target_id?: string;
  ip_address?: string;
  user_agent?: string;
  status: 'completed' | 'failed' | 'pending';
  severity: 'info' | 'warning' | 'error' | 'critical';
  created_at: string;
  updated_at: string;
}

export interface SystemSettings {
  id: string;
  setting_key: string;
  setting_value?: string;
  data_type: 'string' | 'integer' | 'boolean' | 'json' | 'decimal';
  category: string;
  description?: string;
  is_public: boolean;
  is_editable: boolean;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  billing_cycle: 'monthly' | 'quarterly' | 'annually' | 'lifetime';
  features?: any;
  max_bookings_per_month?: number;
  advance_booking_days: number;
  guest_privileges: boolean;
  range_access: boolean;
  priority_booking: boolean;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  terms_and_conditions?: string;
  created_at: string;
  updated_at: string;
}
