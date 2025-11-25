-- Migration: Add Yard Support and Walk-In Customer Support
-- Date: 2025-01-16
-- Description: Adds yard field to sand_school_bookings and walk-in customer support to both booking tables

-- ===========================================================================
-- PART 1: Add Yard Field to Sand School Bookings
-- ===========================================================================

-- Enable btree_gist extension (required for TEXT in GIST constraints)
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Add yard column to sand_school_bookings
ALTER TABLE public.sand_school_bookings
ADD COLUMN yard TEXT NOT NULL DEFAULT 'GREENACHERS'
CHECK (yard IN ('GREENACHERS', 'MERYDOWN'));

-- Create index for yard filtering (improves query performance)
CREATE INDEX idx_sand_school_bookings_yard ON public.sand_school_bookings(yard);

-- Create an immutable function to calculate booking time range
CREATE OR REPLACE FUNCTION booking_time_range(
  p_date date,
  p_start_time time,
  p_duration_minutes integer
)
RETURNS tsrange
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT tsrange(
    (p_date + p_start_time)::timestamp,
    (p_date + p_start_time)::timestamp + (p_duration_minutes || ' minutes')::interval
  )
$$;

-- Update constraint to prevent overlapping bookings PER YARD
-- This allows the same time slot to be booked on different yards
ALTER TABLE public.sand_school_bookings
DROP CONSTRAINT IF EXISTS no_overlapping_bookings;

ALTER TABLE public.sand_school_bookings
ADD CONSTRAINT no_overlapping_bookings_per_yard EXCLUDE USING GIST (
  yard WITH =,
  booking_date WITH =,
  booking_time_range(booking_date, start_time, duration_minutes) WITH &&
) WHERE (status = 'APPROVED');

-- ===========================================================================
-- PART 2: Add Walk-In Customer Support
-- ===========================================================================

-- Add optional walk-in customer fields to horse_care_bookings
ALTER TABLE public.horse_care_bookings
ADD COLUMN customer_name TEXT,
ADD COLUMN customer_phone TEXT,
ADD COLUMN is_walk_in BOOLEAN DEFAULT FALSE;

-- Add optional walk-in customer fields to sand_school_bookings
ALTER TABLE public.sand_school_bookings
ADD COLUMN customer_name TEXT,
ADD COLUMN customer_phone TEXT,
ADD COLUMN is_walk_in BOOLEAN DEFAULT FALSE;

-- Modify constraint: user_id can be NULL for walk-ins
ALTER TABLE public.horse_care_bookings
ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE public.sand_school_bookings
ALTER COLUMN user_id DROP NOT NULL;

-- Add check constraint: either user_id OR walk-in fields must be present
ALTER TABLE public.horse_care_bookings
ADD CONSTRAINT user_or_walkin_required CHECK (
  (user_id IS NOT NULL) OR (is_walk_in = TRUE AND customer_name IS NOT NULL)
);

ALTER TABLE public.sand_school_bookings
ADD CONSTRAINT user_or_walkin_required CHECK (
  (user_id IS NOT NULL) OR (is_walk_in = TRUE AND customer_name IS NOT NULL)
);

-- ===========================================================================
-- PART 3: Update RLS Policies
-- ===========================================================================

-- Update horse_care_bookings insert policy to allow admins to create walk-in bookings
DROP POLICY IF EXISTS "Active users can create bookings" ON public.horse_care_bookings;
DROP POLICY IF EXISTS "Authenticated users can create bookings" ON public.horse_care_bookings;

CREATE POLICY "Active users or admins can create bookings"
ON public.horse_care_bookings FOR INSERT
WITH CHECK (
  -- Regular users can create for themselves
  (auth.uid() = user_id AND user_id IN (
    SELECT id FROM public.users WHERE status = 'ACTIVE'
  ))
  OR
  -- Admins can create for anyone (including walk-ins with null user_id)
  (auth.uid() IN (
    SELECT id FROM public.users WHERE role = 'ADMIN' AND status = 'ACTIVE'
  ))
);

-- Update sand_school_bookings insert policy to allow admins to create walk-in bookings
DROP POLICY IF EXISTS "Active users can create bookings" ON public.sand_school_bookings;
DROP POLICY IF EXISTS "Authenticated users can create bookings" ON public.sand_school_bookings;

CREATE POLICY "Active users or admins can create bookings"
ON public.sand_school_bookings FOR INSERT
WITH CHECK (
  -- Regular users can create for themselves
  (auth.uid() = user_id AND user_id IN (
    SELECT id FROM public.users WHERE status = 'ACTIVE'
  ))
  OR
  -- Admins can create for anyone (including walk-ins with null user_id)
  (auth.uid() IN (
    SELECT id FROM public.users WHERE role = 'ADMIN' AND status = 'ACTIVE'
  ))
);

-- ===========================================================================
-- PART 4: Data Migration (set existing bookings to GREENACHERS)
-- ===========================================================================

-- All existing sand school bookings are set to GREENACHERS by the DEFAULT clause above
-- This comment confirms that no additional UPDATE is needed

-- ===========================================================================
-- END OF MIGRATION
-- ===========================================================================

-- Verification queries (run these to verify the migration):
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'sand_school_bookings' AND column_name IN ('yard', 'customer_name', 'customer_phone', 'is_walk_in');

-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'horse_care_bookings' AND column_name IN ('customer_name', 'customer_phone', 'is_walk_in', 'user_id');
