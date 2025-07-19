-- Migration: Update User table for comprehensive admin/member system
-- Version: 001_update_user_system
-- Description: Updates User table to support role-based access control, admin features, and enhanced member functionality

-- Add new columns to users table
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','inactive','suspended')),
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS membership_id VARCHAR(50) UNIQUE,
  ADD COLUMN IF NOT EXISTS membership_status VARCHAR(20),
  ADD COLUMN IF NOT EXISTS admin_level VARCHAR(50),
  ADD COLUMN IF NOT EXISTS can_manage_courses BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS can_manage_users BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS can_manage_pricing BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS can_view_analytics BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS google_id VARCHAR(100) UNIQUE,
  ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255),
  ADD COLUMN IF NOT EXISTS password_reset_expiry TIMESTAMP,
  ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS two_factor_secret VARCHAR(255);

-- Update role column constraint
ALTER TABLE users ALTER COLUMN role SET NOT NULL;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('member','admin','super_admin'));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);
CREATE INDEX IF NOT EXISTS idx_users_membership_id ON users(membership_id);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_last_login_at ON users(last_login_at);

-- Create tee_time_slots table
CREATE TABLE IF NOT EXISTS tee_time_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_players INTEGER DEFAULT 4,
    available_slots INTEGER DEFAULT 1,
    price DECIMAL(10,2),
    is_available BOOLEAN DEFAULT TRUE,
    slot_type VARCHAR(20) DEFAULT 'regular' CHECK (slot_type IN ('regular','premium','tournament'))
);

CREATE INDEX IF NOT EXISTS idx_tee_time_slots_course_id ON tee_time_slots(course_id);
CREATE INDEX IF NOT EXISTS idx_tee_time_slots_date ON tee_time_slots(date);
CREATE INDEX IF NOT EXISTS idx_tee_time_slots_available ON tee_time_slots(is_available);

-- Create course_pricing table
CREATE TABLE IF NOT EXISTS course_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    pricing_type VARCHAR(20) NOT NULL CHECK (pricing_type IN ('weekday','weekend','holiday','peak','off_peak')),
    start_date DATE,
    end_date DATE,
    time_slot_start TIME,
    time_slot_end TIME,
    base_price DECIMAL(10,2) NOT NULL,
    member_price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_course_pricing_course_id ON course_pricing(course_id);
CREATE INDEX IF NOT EXISTS idx_course_pricing_type ON course_pricing(pricing_type);
CREATE INDEX IF NOT EXISTS idx_course_pricing_active ON course_pricing(is_active);

-- Create range_pricing table
CREATE TABLE IF NOT EXISTS range_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    bucket_size VARCHAR(20) NOT NULL CHECK (bucket_size IN ('small','medium','large','jumbo')),
    ball_count INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    member_price DECIMAL(10,2) NOT NULL,
    duration INTEGER, -- minutes allowed per bucket
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_range_pricing_course_id ON range_pricing(course_id);
CREATE INDEX IF NOT EXISTS idx_range_pricing_bucket_size ON range_pricing(bucket_size);
CREATE INDEX IF NOT EXISTS idx_range_pricing_active ON range_pricing(is_active);

-- Create admin_activity table for audit logs
CREATE TABLE IF NOT EXISTS admin_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(50) NOT NULL,
    resource_id UUID,
    description TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    changes JSONB
);

CREATE INDEX IF NOT EXISTS idx_admin_activity_admin_id ON admin_activity(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_action ON admin_activity(action);
CREATE INDEX IF NOT EXISTS idx_admin_activity_resource ON admin_activity(resource);
CREATE INDEX IF NOT EXISTS idx_admin_activity_created_at ON admin_activity(created_at);

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    data_type VARCHAR(20) DEFAULT 'string' CHECK (data_type IN ('string','number','boolean','json')),
    category VARCHAR(50) DEFAULT 'general',
    is_public BOOLEAN DEFAULT FALSE,
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(key);
CREATE INDEX IF NOT EXISTS idx_system_settings_category ON system_settings(category);
CREATE INDEX IF NOT EXISTS idx_system_settings_public ON system_settings(is_public);

-- Create membership_plans table
CREATE TABLE IF NOT EXISTS membership_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    billing_cycle VARCHAR(20) DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly','yearly')),
    features TEXT[],
    booking_advantage INTEGER DEFAULT 0, -- days in advance
    discount_percent DECIMAL(5,2) DEFAULT 0,
    max_bookings_month INTEGER DEFAULT 0, -- 0 = unlimited
    includes_range BOOLEAN DEFAULT FALSE,
    includes_cart BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_membership_plans_active ON membership_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_membership_plans_billing_cycle ON membership_plans(billing_cycle);

-- Create user_course_management junction table for admin course assignments
CREATE TABLE IF NOT EXISTS user_course_management (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT NOW(),
    assigned_by UUID REFERENCES users(id),
    PRIMARY KEY (user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_user_course_mgmt_user_id ON user_course_management(user_id);
CREATE INDEX IF NOT EXISTS idx_user_course_mgmt_course_id ON user_course_management(course_id);

-- Update courses table with new pricing and management fields
ALTER TABLE courses 
  ADD COLUMN IF NOT EXISTS green_fee_weekday DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS green_fee_weekend DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS green_fee_holiday DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cart_fee DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS club_rental_fee DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS range_ball_price DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS member_discount DECIMAL(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS booking_advance_days INTEGER DEFAULT 14,
  ADD COLUMN IF NOT EXISTS max_players_per_slot INTEGER DEFAULT 4,
  ADD COLUMN IF NOT EXISTS slot_duration INTEGER DEFAULT 15,
  ADD COLUMN IF NOT EXISTS open_time TIME DEFAULT '06:00',
  ADD COLUMN IF NOT EXISTS close_time TIME DEFAULT '19:00',
  ADD COLUMN IF NOT EXISTS images TEXT[];

-- Remove the old green_fee column if it exists
ALTER TABLE courses DROP COLUMN IF EXISTS green_fee;

-- Create default admin user if none exists
INSERT INTO users (
    email, 
    name, 
    password, 
    role, 
    status, 
    admin_level,
    can_manage_courses,
    can_manage_users,
    can_manage_pricing,
    can_view_analytics,
    email_verified
) 
SELECT 
    'admin@golfezz.com',
    'System Administrator',
    '$2a$12$LQv3c1yqBwEHxgdX7s95SO7GJuUYXCZNmVX7DIX7VnhDOSLR6zK.e', -- password: admin123
    'super_admin',
    'active',
    'super_admin',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE role IN ('admin', 'super_admin')
);

-- Insert default membership plans
INSERT INTO membership_plans (name, description, price, billing_cycle, features, booking_advantage, discount_percent, max_bookings_month, includes_range, includes_cart)
VALUES 
    ('Basic Membership', 'Free membership with standard access', 0, 'monthly', ARRAY['Standard booking access', 'Email notifications'], 0, 0, 4, FALSE, FALSE),
    ('Premium Membership', 'Enhanced membership with additional benefits', 29, 'monthly', ARRAY['Priority booking', 'Range access', 'Course condition updates', 'Member discounts'], 7, 10, 12, TRUE, FALSE),
    ('VIP Membership', 'Complete access with all premium features', 59, 'monthly', ARRAY['Priority booking', 'Unlimited range access', 'Free cart rental', 'Premium support', 'Member events'], 14, 15, 0, TRUE, TRUE)
ON CONFLICT DO NOTHING;

-- Insert default system settings
INSERT INTO system_settings (key, value, description, category, is_public)
VALUES 
    ('site_name', 'GolfEzz', 'Site name displayed in the application', 'general', TRUE),
    ('max_booking_advance_days', '30', 'Maximum days in advance a member can book', 'booking', FALSE),
    ('default_slot_duration', '15', 'Default tee time slot duration in minutes', 'booking', FALSE),
    ('enable_online_payments', 'true', 'Enable online payment processing', 'payment', FALSE),
    ('require_email_verification', 'true', 'Require email verification for new accounts', 'auth', FALSE),
    ('default_member_discount', '5', 'Default discount percentage for members', 'pricing', FALSE)
ON CONFLICT (key) DO NOTHING;

-- Update existing users to have proper role constraints
UPDATE users SET role = 'member' WHERE role NOT IN ('member', 'admin', 'super_admin') OR role IS NULL;

COMMIT;
