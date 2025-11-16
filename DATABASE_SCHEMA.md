# My Stables - Database Schema Documentation

This document describes the complete database schema for the My Stables application. All tables should be created in your Supabase project.

## Overview

The application uses PostgreSQL (via Supabase) with Row Level Security (RLS) enabled on all tables.

---

## Table Schemas

### 1. users

Extends Supabase auth.users with application-specific fields.

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  status TEXT NOT NULL DEFAULT 'PENDING_APPROVAL' CHECK (status IN ('PENDING_APPROVAL', 'ACTIVE', 'SUSPENDED')),
  approved_by UUID REFERENCES public.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_status ON public.users(status);
CREATE INDEX idx_users_role ON public.users(role);
```

**RLS Policies:**
```sql
-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

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
```

---

### 2. services

Available horse care services.

```sql
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_services_active ON public.services(active);
```

**RLS Policies:**
```sql
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Everyone (authenticated) can view active services
CREATE POLICY "Users can view active services"
  ON public.services FOR SELECT
  USING (active = TRUE);

-- Admins can manage services
CREATE POLICY "Admins can manage services"
  ON public.services FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'ADMIN' AND status = 'ACTIVE'
    )
  );
```

---

### 3. horse_care_bookings

Bookings for horse care services (grooming, mucking, etc.).

```sql
CREATE TABLE public.horse_care_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  horse_name TEXT NOT NULL,
  service_id UUID NOT NULL REFERENCES public.services(id),
  booking_date DATE NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'DENIED')),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_by UUID REFERENCES public.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_horse_care_bookings_user ON public.horse_care_bookings(user_id);
CREATE INDEX idx_horse_care_bookings_status ON public.horse_care_bookings(status);
CREATE INDEX idx_horse_care_bookings_date ON public.horse_care_bookings(booking_date);
```

**RLS Policies:**
```sql
ALTER TABLE public.horse_care_bookings ENABLE ROW LEVEL SECURITY;

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
```

---

### 4. sand_school_bookings

Bookings for sand school time slots.

```sql
CREATE TABLE public.sand_school_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes IN (30, 60)),
  price DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'DENIED')),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_by UUID REFERENCES public.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Ensure no overlapping bookings
  CONSTRAINT no_overlapping_bookings EXCLUDE USING GIST (
    booking_date WITH =,
    tsrange(
      (booking_date || ' ' || start_time)::timestamp,
      (booking_date || ' ' || start_time)::timestamp + (duration_minutes || ' minutes')::interval
    ) WITH &&
  ) WHERE (status = 'APPROVED')
);

CREATE INDEX idx_sand_school_bookings_user ON public.sand_school_bookings(user_id);
CREATE INDEX idx_sand_school_bookings_status ON public.sand_school_bookings(status);
CREATE INDEX idx_sand_school_bookings_date ON public.sand_school_bookings(booking_date);
```

**RLS Policies:**
```sql
ALTER TABLE public.sand_school_bookings ENABLE ROW LEVEL SECURITY;

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
```

---

### 5. notifications

User notifications for booking approvals, denials, etc.

```sql
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('ACCOUNT_APPROVED', 'ACCOUNT_DENIED', 'BOOKING_APPROVED', 'BOOKING_DENIED')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  related_booking_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_notifications_created ON public.notifications(created_at DESC);
```

**RLS Policies:**
```sql
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admins can create notifications
CREATE POLICY "Admins can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'ADMIN' AND status = 'ACTIVE'
    )
  );
```

---

## Triggers

### Update updated_at timestamp

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_horse_care_bookings_updated_at
  BEFORE UPDATE ON public.horse_care_bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sand_school_bookings_updated_at
  BEFORE UPDATE ON public.sand_school_bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Auto-create user profile on signup

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## Initial Seed Data

### Create first admin user (Run after your first user signs up)

```sql
-- Replace 'your-user-uuid' with the actual UUID from auth.users
UPDATE public.users
SET
  role = 'ADMIN',
  status = 'ACTIVE',
  approved_at = NOW()
WHERE email = 'admin@mystables.com';
```

### Create default services

```sql
INSERT INTO public.services (name, description, price, duration_minutes, active)
VALUES
  ('Grooming', 'Full grooming service including brushing and hoof cleaning', 10.00, 60, TRUE),
  ('Mucking Out', 'Complete stable mucking out and fresh bedding', 10.00, 45, TRUE),
  ('Turnout', 'Horse turnout to paddock', 5.00, 30, TRUE),
  ('Tack Cleaning', 'Saddle and bridle cleaning', 8.00, 30, TRUE);
```

---

## Database Functions (Optional but Recommended)

### Get revenue statistics

```sql
CREATE OR REPLACE FUNCTION get_admin_revenue_stats(
  p_admin_id UUID,
  p_period_start TIMESTAMP WITH TIME ZONE,
  p_period_end TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (
  accepted_count BIGINT,
  denied_count BIGINT,
  total_earnings DECIMAL,
  lost_revenue DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE status = 'APPROVED') AS accepted_count,
    COUNT(*) FILTER (WHERE status = 'DENIED') AS denied_count,
    COALESCE(SUM(s.price) FILTER (WHERE b.status = 'APPROVED'), 0) AS total_earnings,
    COALESCE(SUM(s.price) FILTER (WHERE b.status = 'DENIED'), 0) AS lost_revenue
  FROM public.horse_care_bookings b
  JOIN public.services s ON b.service_id = s.id
  WHERE
    b.reviewed_by = p_admin_id
    AND b.reviewed_at BETWEEN p_period_start AND p_period_end;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Setup Checklist

1. [ ] Create all tables in order (users, services, bookings, notifications)
2. [ ] Enable RLS on all tables
3. [ ] Create all RLS policies
4. [ ] Set up triggers for updated_at and new user creation
5. [ ] Create seed data (admin user and default services)
6. [ ] Test policies by attempting operations as different user roles
7. [ ] Verify indexes are created for performance
8. [ ] Set up database backups in Supabase dashboard

---

## Security Notes

- **Never expose service_role_key in client code** - only use anon key on client
- All queries from client use RLS automatically
- Admin operations should be double-checked on server side
- Use prepared statements for all queries (Supabase does this automatically)
- Regularly audit RLS policies in production

---

## Migration Notes

When making schema changes in production:

1. Test in development/staging first
2. Create migration files with timestamps
3. Apply migrations during low-traffic periods
4. Always have a rollback plan
5. Update RLS policies if table structure changes

---

For questions or issues with the database schema, refer to the [Supabase Documentation](https://supabase.com/docs).
