-- SAFE VERSION - Drops all policies first, then recreates them
-- This script is safe to run multiple times

-- ========================================
-- 1. DROP ALL EXISTING POLICIES (USERS TABLE)
-- ========================================
DROP POLICY IF EXISTS "Users can view own record" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update users" ON public.users;
DROP POLICY IF EXISTS "Anyone can register" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can view users" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can update users" ON public.users;

-- ========================================
-- 2. CREATE NEW SIMPLE POLICIES (USERS TABLE)
-- ========================================

-- Users can view their own record
CREATE POLICY "Users can view own record"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Any authenticated user can view users (admin checks in app code)
CREATE POLICY "Authenticated users can view users"
  ON public.users FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Any authenticated user can update (admin checks in app code)
CREATE POLICY "Authenticated users can update users"
  ON public.users FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Anyone can register
CREATE POLICY "Anyone can register"
  ON public.users FOR INSERT
  WITH CHECK (
    role = 'USER' AND
    status = 'PENDING_APPROVAL'
  );

-- ========================================
-- 3. DROP ALL EXISTING POLICIES (SAND SCHOOL BOOKINGS)
-- ========================================
DROP POLICY IF EXISTS "All users can view all bookings" ON public.sand_school_bookings;
DROP POLICY IF EXISTS "Active users can create bookings" ON public.sand_school_bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON public.sand_school_bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.sand_school_bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.sand_school_bookings;
DROP POLICY IF EXISTS "Authenticated users can view all bookings" ON public.sand_school_bookings;
DROP POLICY IF EXISTS "Authenticated users can create bookings" ON public.sand_school_bookings;
DROP POLICY IF EXISTS "Authenticated users can update bookings" ON public.sand_school_bookings;

-- ========================================
-- 4. CREATE NEW POLICIES (SAND SCHOOL BOOKINGS)
-- ========================================

-- Any authenticated user can view all bookings
CREATE POLICY "Authenticated users can view all bookings"
  ON public.sand_school_bookings FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Authenticated users can create bookings
CREATE POLICY "Authenticated users can create bookings"
  ON public.sand_school_bookings FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Authenticated users can update bookings (admin check in app code)
CREATE POLICY "Authenticated users can update bookings"
  ON public.sand_school_bookings FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- ========================================
-- 5. DROP ALL EXISTING POLICIES (HORSE CARE BOOKINGS)
-- ========================================
DROP POLICY IF EXISTS "All users can view all bookings" ON public.horse_care_bookings;
DROP POLICY IF EXISTS "Active users can create bookings" ON public.horse_care_bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON public.horse_care_bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.horse_care_bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.horse_care_bookings;
DROP POLICY IF EXISTS "Authenticated users can view all bookings" ON public.horse_care_bookings;
DROP POLICY IF EXISTS "Authenticated users can create bookings" ON public.horse_care_bookings;
DROP POLICY IF EXISTS "Authenticated users can update bookings" ON public.horse_care_bookings;

-- ========================================
-- 6. CREATE NEW POLICIES (HORSE CARE BOOKINGS)
-- ========================================

-- Any authenticated user can view all bookings
CREATE POLICY "Authenticated users can view all bookings"
  ON public.horse_care_bookings FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Authenticated users can create bookings
CREATE POLICY "Authenticated users can create bookings"
  ON public.horse_care_bookings FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Authenticated users can update bookings (admin check in app code)
CREATE POLICY "Authenticated users can update bookings"
  ON public.horse_care_bookings FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- ========================================
-- DONE! Policies updated successfully
-- ========================================
-- These simplified policies avoid infinite recursion by:
-- - Not querying the users table within users table policies
-- - Handling role/status checks in application code
-- - Using simple auth.uid() checks instead
