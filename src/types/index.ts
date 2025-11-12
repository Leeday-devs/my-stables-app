// User types
export type UserRole = 'USER' | 'ADMIN'
export type UserStatus = 'PENDING_APPROVAL' | 'ACTIVE' | 'SUSPENDED'

export interface User {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: UserRole
  status: UserStatus
  approved_by: string | null
  approved_at: string | null
  created_at: string
}

// Service types
export interface Service {
  id: string
  name: string
  description: string | null
  price: number
  duration_minutes: number
  active: boolean
  created_by: string | null
  created_at: string
}

// Booking types
export type BookingStatus = 'PENDING' | 'APPROVED' | 'DENIED'

export interface HorseCareBooking {
  id: string
  user_id: string
  horse_name: string
  service_id: string
  booking_date: string
  status: BookingStatus
  requested_at: string
  reviewed_by: string | null
  reviewed_at: string | null
  review_notes: string | null
  // Relations
  user?: User
  service?: Service
  reviewer?: User
}

export interface SandSchoolBooking {
  id: string
  user_id: string
  booking_date: string
  start_time: string
  duration_minutes: 30 | 60
  price: number
  status: BookingStatus
  requested_at: string
  reviewed_by: string | null
  reviewed_at: string | null
  review_notes: string | null
  // Relations
  user?: User
  reviewer?: User
}

// Notification types
export type NotificationType = 'ACCOUNT_APPROVED' | 'BOOKING_APPROVED' | 'BOOKING_DENIED'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  message: string
  read: boolean
  created_at: string
  related_booking_id: string | null
}

// Revenue tracking
export interface AdminRevenue {
  admin_id: string
  admin_name: string
  accepted_count: number
  denied_count: number
  total_earnings: number
  lost_revenue: number
  period_start: string
  period_end: string
}
