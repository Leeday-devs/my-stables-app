# User Registration Fix - Testing Guide

## What Was Fixed

### 1. **Critical Bug Fixed** ✅
- **Issue**: Registration was using `status: 'PENDING'` which the database rejected
- **Fix**: Changed to `status: 'PENDING_APPROVAL'` (matches database constraint)
- **File**: `src/app/auth/register/page.tsx` (line 76)

### 2. **Smart Error Handling Added** ✅
- **Issue**: If database trigger auto-creates profile, manual insert would fail
- **Fix**: Added duplicate key detection (error code `23505`)
- **Behavior**: Now gracefully handles both scenarios:
  - ✅ Database trigger creates profile → Client code detects duplicate and continues
  - ✅ No database trigger → Client code creates profile successfully

### 3. **Better Error Messages** ✅
- Users now see specific error messages instead of generic "contact support"
- Console logging added for debugging

---

## Testing Steps

### Prerequisites
Before testing, ensure your Supabase database is set up correctly.

#### Option A: Quick Check (Recommended)
1. Open Supabase Dashboard → SQL Editor
2. Run this query:
```sql
SELECT column_name, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'status';
```
3. Verify the default is `'PENDING_APPROVAL'`

#### Option B: Full Verification
1. Open Supabase Dashboard → SQL Editor
2. Copy all contents from `DATABASE_SETUP_VERIFICATION.sql`
3. Run the verification queries one by one
4. If anything is missing, run the setup commands at the bottom of the file

---

## Test Case 1: New User Registration (Happy Path)

### Steps:
1. **Navigate to registration page**
   - URL: `http://localhost:3000/auth/register` (or your deployment URL)

2. **Fill out the form with test data:**
   ```
   First Name: Test
   Last Name: User
   Email: testuser@example.com (use a unique email)
   Phone: 07123456789
   Password: TestPassword123!
   Confirm Password: TestPassword123!
   ```

3. **Click "Create Account"**

### Expected Results:
- ✅ Button shows "Creating Account..." with loading spinner
- ✅ Success message appears: "Registration successful! Your account is pending admin approval. Redirecting to login..."
- ✅ Page redirects to login after 3 seconds
- ❌ **NO ERROR** "Failed to create user profile"

### Verify in Database:
1. Open Supabase Dashboard → Table Editor → `users` table
2. Find the newly created user
3. Verify:
   - ✅ `email` = `testuser@example.com`
   - ✅ `full_name` = `Test User`
   - ✅ `phone` = `07123456789`
   - ✅ `role` = `USER`
   - ✅ `status` = `PENDING_APPROVAL` ⭐ **THIS IS THE KEY FIX**
   - ✅ `created_at` and `updated_at` are set

---

## Test Case 2: Duplicate Email

### Steps:
1. Try to register again with the same email from Test Case 1

### Expected Results:
- ❌ Error message from Supabase: "User already registered" or similar
- ✅ Error is displayed in red box on the form
- ✅ No navigation away from registration page

---

## Test Case 3: Password Mismatch

### Steps:
1. Fill out form with different passwords in "Password" and "Confirm Password"

### Expected Results:
- ❌ Error message: "Passwords do not match!"
- ✅ Form does not submit
- ✅ No API calls are made

---

## Test Case 4: User Cannot Login (Pending Approval)

### Steps:
1. Navigate to login page: `http://localhost:3000/auth/login`
2. Try to log in with the test user credentials:
   ```
   Email: testuser@example.com
   Password: TestPassword123!
   ```

### Expected Results:
- ❌ Login should fail (status is still `PENDING_APPROVAL`)
- ✅ User should see authentication error

> **Note**: This is expected behavior. Users must be approved by admin first.

---

## Test Case 5: Admin Approves User

### Steps:
1. Open Supabase Dashboard → Table Editor → `users` table
2. Find the test user
3. Edit the row:
   - Change `status` from `PENDING_APPROVAL` to `ACTIVE`
   - Optionally set `approved_at` to current timestamp
   - Optionally set `approved_by` to an admin user ID
4. Save changes

### Verify Login Works:
1. Navigate to login page
2. Log in with test user credentials
3. Expected Results:
   - ✅ Login succeeds
   - ✅ User is redirected to `/dashboard`
   - ✅ User can access all features

---

## Test Case 6: Database Trigger Scenario (Advanced)

**Only if you have the database trigger set up**

### Setup:
1. Run the trigger creation SQL from `DATABASE_SETUP_VERIFICATION.sql`

### Steps:
1. Register a new user with unique email
2. Check browser console (F12 → Console tab)

### Expected Results:
- ✅ Registration succeeds
- ✅ Console shows: "User profile already created by database trigger"
- ✅ No error displayed to user
- ✅ User profile exists in database with correct status

This confirms the duplicate key handling works correctly!

---

## Troubleshooting

### Issue: Still seeing "Failed to create user profile"

#### Solution 1: Check Database Constraint
```sql
-- Run in Supabase SQL Editor
SELECT pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conname LIKE '%users_status%' OR conrelid = 'public.users'::regclass;
```
Look for: `CHECK (status IN ('PENDING_APPROVAL', 'ACTIVE', 'SUSPENDED'))`

#### Solution 2: Check RLS Policies
```sql
-- Run in Supabase SQL Editor
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'users' AND policyname = 'Anyone can register';
```
The `with_check` should include `status = 'PENDING_APPROVAL'`

#### Solution 3: Check Error Details
1. Open browser console (F12)
2. Look for red error messages
3. Check Network tab for the failed request
4. Look for detailed error message in the response

### Issue: Different error message

#### If you see: "new row violates check constraint"
- The database constraint is rejecting the insert
- Verify you're using `PENDING_APPROVAL` (not `PENDING`)
- Check that the code change was applied correctly

#### If you see: "duplicate key value violates unique constraint"
- This means the user already exists
- If you just created the user, this is expected
- Check if a database trigger is creating the profile

#### If you see: "permission denied for table users"
- RLS policies are blocking the insert
- Verify the "Anyone can register" policy exists
- Check that `role = 'USER'` and `status = 'PENDING_APPROVAL'` in the policy

---

## Quick Verification Checklist

After deploying the fix, verify:

- [ ] Code uses `status: 'PENDING_APPROVAL'` (not `PENDING`)
- [ ] Database has CHECK constraint for status values
- [ ] RLS policy "Anyone can register" exists and is enabled
- [ ] Can register new user without errors
- [ ] User appears in database with correct status
- [ ] User cannot login until approved
- [ ] User can login after admin sets status to ACTIVE

---

## Database Trigger Status

### Check if trigger exists:
```sql
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

### Recommendations:
- **✅ WITH trigger**: Better UX, profile created automatically, phone number included
- **✅ WITHOUT trigger**: Also works, client code creates profile manually
- **⚠️ Either way works** thanks to the duplicate key handling!

---

## Success Criteria

Your fix is working correctly when:
1. ✅ Users can register without "Failed to create user profile" error
2. ✅ New users have `status = 'PENDING_APPROVAL'` in database
3. ✅ No console errors during registration
4. ✅ Users cannot login until approved
5. ✅ Users can login after approval

---

## Need Help?

If tests fail:
1. Check browser console for detailed errors
2. Check Supabase logs (Dashboard → Logs)
3. Verify environment variables are set correctly
4. Run the full database verification SQL script
5. Review the code changes in `src/app/auth/register/page.tsx`

The fix is comprehensive and should resolve the issue. Good luck with testing! 🎉
