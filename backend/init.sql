-- Initialize the database with default golf course data

-- Insert default golf course if it doesn't exist
INSERT INTO golf_courses (id, name, description, address, city, state, zip_code, phone, email, website, total_holes, par_total, course_rating, slope_rating, yardage_total, is_active, created_at, updated_at)
VALUES (
    1,
    'GolfEzz Country Club',
    'Premier golf course with challenging holes and beautiful scenery',
    '123 Golf Course Drive',
    'Springfield',
    'CA',
    '90210',
    '+1-555-GOLF-123',
    'info@golfezz.com',
    'https://golfezz.com',
    18,
    72,
    72.5,
    130,
    6800,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Insert holes for the default course
INSERT INTO holes (golf_course_id, hole_number, par, handicap, description, created_at, updated_at)
VALUES 
    (1, 1, 4, 10, 'Opening hole with water hazard on the right', NOW(), NOW()),
    (1, 2, 3, 18, 'Short par 3 with elevated green', NOW(), NOW()),
    (1, 3, 5, 2, 'Long par 5 with dogleg left', NOW(), NOW()),
    (1, 4, 4, 8, 'Challenging par 4 with bunkers', NOW(), NOW()),
    (1, 5, 3, 16, 'Island green par 3', NOW(), NOW()),
    (1, 6, 4, 6, 'Tree-lined fairway', NOW(), NOW()),
    (1, 7, 5, 4, 'Reachable par 5 in two', NOW(), NOW()),
    (1, 8, 4, 12, 'Narrow fairway with OB left', NOW(), NOW()),
    (1, 9, 4, 14, 'Finishing hole of front nine', NOW(), NOW()),
    (1, 10, 4, 9, 'Back nine opener', NOW(), NOW()),
    (1, 11, 3, 17, 'Downhill par 3', NOW(), NOW()),
    (1, 12, 5, 1, 'Signature hole - longest on course', NOW(), NOW()),
    (1, 13, 4, 5, 'Risk/reward par 4', NOW(), NOW()),
    (1, 14, 3, 15, 'Uphill par 3 to plateau green', NOW(), NOW()),
    (1, 15, 4, 11, 'Double dogleg par 4', NOW(), NOW()),
    (1, 16, 5, 3, 'Three-shot par 5', NOW(), NOW()),
    (1, 17, 4, 7, 'Penultimate hole', NOW(), NOW()),
    (1, 18, 4, 13, 'Finishing hole with grandstand', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Insert tee information for each hole
INSERT INTO tees (hole_id, tee_color, tee_name, yardage, rating, slope_rating, created_at, updated_at)
SELECT 
    h.id,
    'Championship',
    'Black Tees',
    CASE h.hole_number
        WHEN 1 THEN 420
        WHEN 2 THEN 185
        WHEN 3 THEN 540
        WHEN 4 THEN 390
        WHEN 5 THEN 165
        WHEN 6 THEN 375
        WHEN 7 THEN 520
        WHEN 8 THEN 410
        WHEN 9 THEN 385
        WHEN 10 THEN 395
        WHEN 11 THEN 175
        WHEN 12 THEN 580
        WHEN 13 THEN 400
        WHEN 14 THEN 195
        WHEN 15 THEN 405
        WHEN 16 THEN 525
        WHEN 17 THEN 415
        WHEN 18 THEN 435
    END,
    74.2,
    135,
    NOW(),
    NOW()
FROM holes h WHERE h.golf_course_id = 1
ON CONFLICT DO NOTHING;

-- Insert today's green conditions
INSERT INTO green_conditions (golf_course_id, date, green_speed, firmness_rating, moisture_level, weather_condition, temperature, wind_speed, wind_direction, notes, created_at, updated_at)
VALUES (
    1,
    CURRENT_DATE,
    9.5,
    7,
    6,
    'Partly Cloudy',
    72.5,
    8.2,
    'SW',
    'Excellent conditions for play. Greens are rolling true.',
    NOW(),
    NOW()
) ON CONFLICT (golf_course_id, date) DO UPDATE SET
    green_speed = EXCLUDED.green_speed,
    firmness_rating = EXCLUDED.firmness_rating,
    moisture_level = EXCLUDED.moisture_level,
    weather_condition = EXCLUDED.weather_condition,
    temperature = EXCLUDED.temperature,
    wind_speed = EXCLUDED.wind_speed,
    wind_direction = EXCLUDED.wind_direction,
    notes = EXCLUDED.notes,
    updated_at = NOW();
