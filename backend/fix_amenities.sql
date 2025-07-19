-- Fix amenities column migration from JSONB to TEXT[]
-- Drop the column and recreate it as text[]

-- First, let's see what's in the current amenities column
-- SELECT amenities, pg_typeof(amenities) FROM courses;

-- Drop the old column
ALTER TABLE courses DROP COLUMN IF EXISTS amenities;

-- Add the new column as text array
ALTER TABLE courses ADD COLUMN amenities text[] DEFAULT '{}'::text[];
