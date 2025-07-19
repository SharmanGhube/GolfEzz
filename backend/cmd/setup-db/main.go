package main

import (
	"fmt"
	"log"

	"golf-ezz-backend/internal/config"
	"golf-ezz-backend/internal/database"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Connect to database
	err := database.Connect(cfg)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	fmt.Println("Database connected successfully")
	fmt.Println("Creating additional tables for role-based system...")

	// Create tee_time_slots table
	err = database.DB.Exec(`
		CREATE TABLE IF NOT EXISTS tee_time_slots (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			created_at TIMESTAMPTZ DEFAULT NOW(),
			updated_at TIMESTAMPTZ DEFAULT NOW(),
			deleted_at TIMESTAMPTZ,
			course_id UUID NOT NULL REFERENCES courses(id),
			date DATE NOT NULL,
			time_slot TIME NOT NULL,
			max_players INTEGER DEFAULT 4,
			booked_players INTEGER DEFAULT 0,
			status TEXT DEFAULT 'available' CHECK (status IN ('available', 'booked', 'blocked')),
			price DECIMAL(10,2) DEFAULT 0.00,
			special_pricing BOOLEAN DEFAULT false,
			created_by UUID REFERENCES users(id),
			booking_id UUID,
			member_only BOOLEAN DEFAULT false,
			weather_dependent BOOLEAN DEFAULT false,
			notes TEXT
		);
	`).Error
	if err != nil {
		log.Printf("Error creating tee_time_slots table: %v", err)
	} else {
		fmt.Println("✅ tee_time_slots table created")
	}

	// Create course_pricing table
	err = database.DB.Exec(`
		CREATE TABLE IF NOT EXISTS course_pricing (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			created_at TIMESTAMPTZ DEFAULT NOW(),
			updated_at TIMESTAMPTZ DEFAULT NOW(),
			deleted_at TIMESTAMPTZ,
			course_id UUID NOT NULL REFERENCES courses(id),
			pricing_type TEXT NOT NULL CHECK (pricing_type IN ('weekday', 'weekend', 'holiday', 'member', 'guest', 'twilight')),
			player_type TEXT NOT NULL CHECK (player_type IN ('member', 'guest', 'student', 'senior')),
			price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
			time_start TIME,
			time_end TIME,
			season_start DATE,
			season_end DATE,
			is_active BOOLEAN DEFAULT true,
			description TEXT,
			min_players INTEGER DEFAULT 1,
			max_players INTEGER DEFAULT 4,
			advance_booking_days INTEGER DEFAULT 30,
			cancellation_policy TEXT
		);
	`).Error
	if err != nil {
		log.Printf("Error creating course_pricing table: %v", err)
	} else {
		fmt.Println("✅ course_pricing table created")
	}

	// Create range_pricing table
	err = database.DB.Exec(`
		CREATE TABLE IF NOT EXISTS range_pricing (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			created_at TIMESTAMPTZ DEFAULT NOW(),
			updated_at TIMESTAMPTZ DEFAULT NOW(),
			deleted_at TIMESTAMPTZ,
			course_id UUID NOT NULL REFERENCES courses(id),
			service_type TEXT NOT NULL CHECK (service_type IN ('range_balls', 'lessons', 'equipment_rental')),
			pricing_tier TEXT CHECK (pricing_tier IN ('small', 'medium', 'large', 'unlimited')),
			player_type TEXT NOT NULL CHECK (player_type IN ('member', 'guest', 'student', 'senior')),
			price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
			quantity INTEGER,
			unit TEXT,
			time_start TIME,
			time_end TIME,
			is_active BOOLEAN DEFAULT true,
			description TEXT,
			min_age INTEGER,
			max_age INTEGER
		);
	`).Error
	if err != nil {
		log.Printf("Error creating range_pricing table: %v", err)
	} else {
		fmt.Println("✅ range_pricing table created")
	}

	// Create admin_activities table
	err = database.DB.Exec(`
		CREATE TABLE IF NOT EXISTS admin_activities (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			created_at TIMESTAMPTZ DEFAULT NOW(),
			updated_at TIMESTAMPTZ DEFAULT NOW(),
			deleted_at TIMESTAMPTZ,
			admin_id UUID NOT NULL REFERENCES users(id),
			activity_type TEXT NOT NULL CHECK (activity_type IN ('course_update', 'pricing_change', 'user_management', 'system_config', 'booking_management', 'content_update')),
			description TEXT NOT NULL,
			details JSONB,
			target_type TEXT,
			target_id UUID,
			ip_address INET,
			user_agent TEXT,
			status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'failed', 'pending')),
			severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical'))
		);
	`).Error
	if err != nil {
		log.Printf("Error creating admin_activities table: %v", err)
	} else {
		fmt.Println("✅ admin_activities table created")
	}

	// Create system_settings table
	err = database.DB.Exec(`
		CREATE TABLE IF NOT EXISTS system_settings (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			created_at TIMESTAMPTZ DEFAULT NOW(),
			updated_at TIMESTAMPTZ DEFAULT NOW(),
			deleted_at TIMESTAMPTZ,
			setting_key TEXT UNIQUE NOT NULL,
			setting_value TEXT,
			data_type TEXT DEFAULT 'string' CHECK (data_type IN ('string', 'integer', 'boolean', 'json', 'decimal')),
			category TEXT DEFAULT 'general',
			description TEXT,
			is_public BOOLEAN DEFAULT false,
			is_editable BOOLEAN DEFAULT true,
			created_by UUID REFERENCES users(id),
			updated_by UUID REFERENCES users(id)
		);
	`).Error
	if err != nil {
		log.Printf("Error creating system_settings table: %v", err)
	} else {
		fmt.Println("✅ system_settings table created")
	}

	// Create membership_plans table
	err = database.DB.Exec(`
		CREATE TABLE IF NOT EXISTS membership_plans (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			created_at TIMESTAMPTZ DEFAULT NOW(),
			updated_at TIMESTAMPTZ DEFAULT NOW(),
			deleted_at TIMESTAMPTZ,
			name TEXT NOT NULL,
			description TEXT,
			price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
			billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'quarterly', 'annually', 'lifetime')),
			features JSONB,
			max_bookings_per_month INTEGER,
			advance_booking_days INTEGER DEFAULT 30,
			guest_privileges BOOLEAN DEFAULT false,
			range_access BOOLEAN DEFAULT true,
			priority_booking BOOLEAN DEFAULT false,
			is_active BOOLEAN DEFAULT true,
			is_featured BOOLEAN DEFAULT false,
			sort_order INTEGER DEFAULT 0,
			terms_and_conditions TEXT
		);
	`).Error
	if err != nil {
		log.Printf("Error creating membership_plans table: %v", err)
	} else {
		fmt.Println("✅ membership_plans table created")
	}

	// Create indexes
	fmt.Println("Creating indexes...")
	indexes := []string{
		"CREATE INDEX IF NOT EXISTS idx_tee_time_slots_course_date ON tee_time_slots(course_id, date);",
		"CREATE INDEX IF NOT EXISTS idx_tee_time_slots_status ON tee_time_slots(status);",
		"CREATE INDEX IF NOT EXISTS idx_course_pricing_course ON course_pricing(course_id);",
		"CREATE INDEX IF NOT EXISTS idx_range_pricing_course ON range_pricing(course_id);",
		"CREATE INDEX IF NOT EXISTS idx_admin_activities_admin ON admin_activities(admin_id);",
		"CREATE INDEX IF NOT EXISTS idx_admin_activities_type ON admin_activities(activity_type);",
		"CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(setting_key);",
		"CREATE INDEX IF NOT EXISTS idx_membership_plans_active ON membership_plans(is_active);",
	}

	for _, index := range indexes {
		err = database.DB.Exec(index).Error
		if err != nil {
			log.Printf("Error creating index: %v", err)
		}
	}

	// Insert default system settings
	fmt.Println("Inserting default system settings...")
	settings := []string{
		"INSERT INTO system_settings (setting_key, setting_value, data_type, category, description, is_public) VALUES ('site_name', 'GolfEzz', 'string', 'general', 'Website name', true) ON CONFLICT (setting_key) DO NOTHING;",
		"INSERT INTO system_settings (setting_key, setting_value, data_type, category, description, is_public) VALUES ('max_advance_booking_days', '30', 'integer', 'booking', 'Maximum days in advance for booking', false) ON CONFLICT (setting_key) DO NOTHING;",
		"INSERT INTO system_settings (setting_key, setting_value, data_type, category, description, is_public) VALUES ('default_booking_duration', '240', 'integer', 'booking', 'Default booking duration in minutes', false) ON CONFLICT (setting_key) DO NOTHING;",
		"INSERT INTO system_settings (setting_key, setting_value, data_type, category, description, is_public) VALUES ('allow_guest_booking', 'true', 'boolean', 'booking', 'Allow guest bookings', false) ON CONFLICT (setting_key) DO NOTHING;",
		"INSERT INTO system_settings (setting_key, setting_value, data_type, category, description, is_public) VALUES ('course_open_time', '06:00:00', 'string', 'course', 'Course opening time', true) ON CONFLICT (setting_key) DO NOTHING;",
		"INSERT INTO system_settings (setting_key, setting_value, data_type, category, description, is_public) VALUES ('course_close_time', '20:00:00', 'string', 'course', 'Course closing time', true) ON CONFLICT (setting_key) DO NOTHING;",
	}

	for _, setting := range settings {
		err = database.DB.Exec(setting).Error
		if err != nil {
			log.Printf("Error inserting setting: %v", err)
		}
	}

	// Insert default membership plans
	fmt.Println("Inserting default membership plans...")
	plans := []string{
		"INSERT INTO membership_plans (name, description, price, billing_cycle, features, max_bookings_per_month, advance_booking_days, guest_privileges, priority_booking, is_active, sort_order) VALUES ('Basic Member', 'Basic membership with standard access', 99.00, 'monthly', '{\"cart_access\": true, \"range_discount\": 10}', 8, 14, false, false, true, 1) ON CONFLICT DO NOTHING;",
		"INSERT INTO membership_plans (name, description, price, billing_cycle, features, max_bookings_per_month, advance_booking_days, guest_privileges, priority_booking, is_active, sort_order) VALUES ('Premium Member', 'Premium membership with enhanced benefits', 199.00, 'monthly', '{\"cart_access\": true, \"range_discount\": 20, \"pro_shop_discount\": 15}', 15, 30, true, true, true, 2) ON CONFLICT DO NOTHING;",
		"INSERT INTO membership_plans (name, description, price, billing_cycle, features, max_bookings_per_month, advance_booking_days, guest_privileges, priority_booking, is_active, sort_order) VALUES ('VIP Member', 'VIP membership with all privileges', 399.00, 'monthly', '{\"cart_access\": true, \"range_discount\": 30, \"pro_shop_discount\": 25, \"valet_service\": true}', -1, 60, true, true, true, 3) ON CONFLICT DO NOTHING;",
	}

	for _, plan := range plans {
		err = database.DB.Exec(plan).Error
		if err != nil {
			log.Printf("Error inserting membership plan: %v", err)
		}
	}

	fmt.Println("\n✅ Database setup completed successfully!")
	fmt.Println("🎯 Role-based system is now ready with:")
	fmt.Println("   - Enhanced user table with admin permissions")
	fmt.Println("   - Tee time slot management")
	fmt.Println("   - Course and range pricing")
	fmt.Println("   - Admin activity logging")
	fmt.Println("   - System settings")
	fmt.Println("   - Membership plans")
}
