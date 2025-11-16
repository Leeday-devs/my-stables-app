-- Fix for "User profile not found" error during login
-- Run this in your Supabase SQL Editor

-- 1. First, let's verify the users table RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'users' AND schemaname = 'public';

-- 2. Check what policies exist
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'users' AND schemaname = 'public';

-- 3. Drop and recreate the "Users can view own record" policy to ensure it works
DROP POLICY IF EXISTS "Users can view own record" ON public.users;

CREATE POLICY "Users can view own record"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- 4. Verify the policy was created
SELECT policyname, cmd, qual::text
FROM pg_policies
WHERE tablename = 'users'
  AND schemaname = 'public'
  AND policyname = 'Users can view own record';

-- 5. Test query - This should return your user profile when logged in
-- (Run this while authenticated as a user to test)
SELECT id, email, role, status
FROM public.users
WHERE id = auth.uid();

-- If the above query returns no rows but you're logged in, there's an RLS issue
-- If it returns a row, the RLS policy is working correctly

-- 6. Check if there are any users with your email in the database
SELECT id, email, role, status, created_at
FROM public.users
ORDER BY created_at DESC
LIMIT 10;
