-- Verify RLS Policies for My Stables Application
-- Run this in your Supabase SQL Editor to check if policies are correctly set up

-- 1. Check if RLS is enabled on the users table
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'users' AND schemaname = 'public';
-- Expected: rowsecurity = true

-- 2. List all policies on the users table
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'users' AND schemaname = 'public'
ORDER BY policyname;

-- Expected policies:
-- - "Users can view own record" (SELECT)
-- - "Users can update own profile" (UPDATE)
-- - "Admins can view all users" (SELECT)
-- - "Admins can update users" (UPDATE)
-- - "Anyone can register" (INSERT)

-- 3. Check if RLS is enabled on sand_school_bookings table
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'sand_school_bookings' AND schemaname = 'public';
-- Expected: rowsecurity = true

-- 4. List all policies on sand_school_bookings table
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'sand_school_bookings' AND schemaname = 'public'
ORDER BY policyname;

-- Expected policies:
-- - "Users can view own bookings" (SELECT)
-- - "Active users can create bookings" (INSERT)
-- - "Admins can view all bookings" (SELECT)
-- - "Admins can update bookings" (UPDATE)

-- 5. If policies are missing, create them:

-- For users table:
-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to recreate them)
DROP POLICY IF EXISTS "Users can view own record" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update users" ON public.users;
DROP POLICY IF EXISTS "Anyone can register" ON public.users;

-- Users can view their own record
CREATE POLICY "Users can view own record"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own non-sensitive fields
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    role = (SELECT role FROM public.users WHERE id = auth.uid()) AND
    status = (SELECT status FROM public.users WHERE id = auth.uid())
  );

-- Admins can view all users
CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'ADMIN' AND status = 'ACTIVE'
    )
  );

-- Admins can update user status and roles
CREATE POLICY "Admins can update users"
  ON public.users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'ADMIN' AND status = 'ACTIVE'
    )
  );

-- Anyone can insert (for registration)
CREATE POLICY "Anyone can register"
  ON public.users FOR INSERT
  WITH CHECK (
    role = 'USER' AND
    status = 'PENDING_APPROVAL'
  );

-- For sand_school_bookings table:
ALTER TABLE public.sand_school_bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own bookings" ON public.sand_school_bookings;
DROP POLICY IF EXISTS "Active users can create bookings" ON public.sand_school_bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.sand_school_bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON public.sand_school_bookings;
DROP POLICY IF EXISTS "All users can view all bookings" ON public.sand_school_bookings;

-- All authenticated users can view ALL bookings (so they can see which slots are taken)
CREATE POLICY "All users can view all bookings"
  ON public.sand_school_bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
    )
  );

-- Active users can create bookings for themselves only
CREATE POLICY "Active users can create bookings"
  ON public.sand_school_bookings FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND status = 'ACTIVE'
    )
  );

-- Only admins can update bookings (approve/deny)
CREATE POLICY "Admins can update bookings"
  ON public.sand_school_bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'ADMIN' AND status = 'ACTIVE'
    )
  );

-- For horse_care_bookings table:
ALTER TABLE public.horse_care_bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own bookings" ON public.horse_care_bookings;
DROP POLICY IF EXISTS "Active users can create bookings" ON public.horse_care_bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.horse_care_bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON public.horse_care_bookings;
DROP POLICY IF EXISTS "All users can view all bookings" ON public.horse_care_bookings;

-- All authenticated users can view ALL bookings
CREATE POLICY "All users can view all bookings"
  ON public.horse_care_bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
    )
  );

-- Active users can create bookings for themselves only
CREATE POLICY "Active users can create bookings"
  ON public.horse_care_bookings FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND status = 'ACTIVE'
    )
  );

-- Only admins can update bookings (approve/deny)
CREATE POLICY "Admins can update bookings"
  ON public.horse_care_bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'ADMIN' AND status = 'ACTIVE'
    )
  );
