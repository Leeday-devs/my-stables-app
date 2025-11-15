-- ============================================================================
-- DATABASE SETUP VERIFICATION FOR USER REGISTRATION
-- ============================================================================
-- Run this in your Supabase SQL Editor to verify the setup
-- ============================================================================

-- 1. Check if users table exists with correct structure
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'users'
ORDER BY ordinal_position;

-- Expected columns:
-- id (uuid, NOT NULL)
-- email (text, NOT NULL, UNIQUE)
-- full_name (text, NULLABLE)
-- phone (text, NULLABLE)
-- role (text, NOT NULL, DEFAULT 'USER')
-- status (text, NOT NULL, DEFAULT 'PENDING_APPROVAL')
-- approved_by (uuid, NULLABLE)
-- approved_at (timestamp, NULLABLE)
-- created_at (timestamp, NOT NULL)
-- updated_at (timestamp, NOT NULL)

-- ============================================================================
-- 2. Check if the CHECK constraint exists for status field
-- ============================================================================
SELECT
  con.conname AS constraint_name,
  pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
WHERE nsp.nspname = 'public'
  AND rel.relname = 'users'
  AND con.contype = 'c'  -- CHECK constraint
  AND pg_get_constraintdef(con.oid) LIKE '%status%';

-- Expected: CHECK (status IN ('PENDING_APPROVAL', 'ACTIVE', 'SUSPENDED'))

-- ============================================================================
-- 3. Check if the database trigger exists
-- ============================================================================
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND trigger_name = 'on_auth_user_created';

-- Expected: Trigger that calls handle_new_user() function

-- ============================================================================
-- 4. Check if the trigger function exists
-- ============================================================================
SELECT
  routine_name,
  routine_type,
  routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'handle_new_user';

-- ============================================================================
-- 5. Check RLS (Row Level Security) policies
-- ============================================================================
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
WHERE schemaname = 'public'
  AND tablename = 'users';

-- Expected policies:
-- - "Anyone can register" (INSERT policy)
-- - "Users can view their own profile" (SELECT policy)
-- - "Users can update their own profile" (UPDATE policy)

-- ============================================================================
-- 6. Check if RLS is enabled on users table
-- ============================================================================
SELECT
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'users';

-- Expected: rowsecurity = true

-- ============================================================================
-- IF SETUP IS MISSING, RUN THESE COMMANDS TO CREATE IT
-- ============================================================================

-- STEP 1: Create or verify the trigger function
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- User already exists, skip insert
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 2: Create the trigger (if it doesn't exist)
-- ============================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- STEP 3: Verify RLS policies are correct
-- ============================================================================

-- Enable RLS if not already enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if you want to recreate them
-- DROP POLICY IF EXISTS "Anyone can register" ON public.users;
-- DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
-- DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;

-- Create the registration policy
CREATE POLICY "Anyone can register"
  ON public.users FOR INSERT
  WITH CHECK (
    role = 'USER' AND
    status = 'PENDING_APPROVAL'
  );

-- Create the select policy
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Create the update policy
CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    -- Users cannot change their own role or status
    role = (SELECT role FROM public.users WHERE id = auth.uid()) AND
    status = (SELECT status FROM public.users WHERE id = auth.uid())
  );

-- ============================================================================
-- TESTING QUERIES
-- ============================================================================

-- Test 1: Check if a test user exists
SELECT id, email, full_name, phone, role, status, created_at
FROM public.users
LIMIT 5;

-- Test 2: Verify status values are correct
SELECT DISTINCT status FROM public.users;
-- Should only return: PENDING_APPROVAL, ACTIVE, SUSPENDED

-- Test 3: Count users by status
SELECT status, COUNT(*) as count
FROM public.users
GROUP BY status;

-- ============================================================================
-- CLEANUP (OPTIONAL - Use with caution!)
-- ============================================================================

-- To remove a test user (if needed):
-- DELETE FROM auth.users WHERE email = 'test@example.com';
-- Note: This will cascade to public.users if foreign key is set up

-- ============================================================================
-- NOTES
-- ============================================================================
-- 1. The trigger is OPTIONAL - the client code handles profile creation too
-- 2. If the trigger exists, the client code will gracefully handle duplicates
-- 3. The status field MUST be 'PENDING_APPROVAL' (not 'PENDING')
-- 4. RLS policies ensure users can only see/edit their own data
-- 5. Only admins can approve users (change status to ACTIVE)
-- ============================================================================
