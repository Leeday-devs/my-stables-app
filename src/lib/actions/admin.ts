'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getPendingUsers() {
  const supabase = await createClient()

  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .eq('status', 'PENDING_APPROVAL')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching pending users:', error)
    return []
  }

  return users || []
}

export async function getAllUsers() {
  const supabase = await createClient()

  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
    return []
  }

  return users || []
}

export async function approveUser(userId: string) {
  const supabase = await createClient()

  // Get current user (admin)
  const { data: { user: currentUser } } = await supabase.auth.getUser()

  if (!currentUser) {
    return { success: false, error: 'Not authenticated' }
  }

  // Check if current user is admin
  const { data: adminUser } = await supabase
    .from('users')
    .select('role, status')
    .eq('id', currentUser.id)
    .single()

  if (!adminUser || adminUser.role !== 'ADMIN' || adminUser.status !== 'ACTIVE') {
    return { success: false, error: 'Unauthorized' }
  }

  // Update user status
  const { error } = await supabase
    .from('users')
    .update({
      status: 'ACTIVE',
      approved_by: currentUser.id,
      approved_at: new Date().toISOString()
    })
    .eq('id', userId)

  if (error) {
    console.error('Error approving user:', error)
    return { success: false, error: error.message }
  }

  // Create notification for the user
  await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type: 'ACCOUNT_APPROVED',
      title: 'Account Approved',
      message: 'Your account has been approved! You can now book services.',
      read: false
    })

  revalidatePath('/admin')
  revalidatePath('/admin/users')

  return { success: true }
}

export async function denyUser(userId: string) {
  const supabase = await createClient()

  // Get current user (admin)
  const { data: { user: currentUser } } = await supabase.auth.getUser()

  if (!currentUser) {
    return { success: false, error: 'Not authenticated' }
  }

  // Check if current user is admin
  const { data: adminUser } = await supabase
    .from('users')
    .select('role, status')
    .eq('id', currentUser.id)
    .single()

  if (!adminUser || adminUser.role !== 'ADMIN' || adminUser.status !== 'ACTIVE') {
    return { success: false, error: 'Unauthorized' }
  }

  // Update user status to SUSPENDED
  const { error } = await supabase
    .from('users')
    .update({
      status: 'SUSPENDED',
      approved_by: currentUser.id,
      approved_at: new Date().toISOString()
    })
    .eq('id', userId)

  if (error) {
    console.error('Error denying user:', error)
    return { success: false, error: error.message }
  }

  // Create notification for the user
  await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type: 'ACCOUNT_DENIED',
      title: 'Account Denied',
      message: 'Your account registration has been denied. Please contact support for more information.',
      read: false
    })

  revalidatePath('/admin')
  revalidatePath('/admin/users')

  return { success: true }
}

export async function getPendingBookings() {
  const supabase = await createClient()

  // Get horse care bookings
  const { data: horseCareBookings, error: hcError } = await supabase
    .from('horse_care_bookings')
    .select(`
      *,
      user:users!user_id(full_name, email),
      service:services(name, price)
    `)
    .eq('status', 'PENDING')
    .order('requested_at', { ascending: false })

  if (hcError) {
    console.error('Error fetching horse care bookings:', hcError)
  }

  // Get sand school bookings
  const { data: sandSchoolBookings, error: ssError } = await supabase
    .from('sand_school_bookings')
    .select(`
      *,
      user:users!user_id(full_name, email)
    `)
    .eq('status', 'PENDING')
    .order('requested_at', { ascending: false })

  if (ssError) {
    console.error('Error fetching sand school bookings:', ssError)
  }

  // Combine and format bookings
  const allBookings = [
    ...(horseCareBookings || []).map(booking => ({
      id: booking.id,
      type: 'horse_care' as const,
      user: booking.is_walk_in ? `${booking.customer_name} (Walk-in)` : (booking.user?.full_name || 'Unknown'),
      service: booking.service?.name || 'Unknown Service',
      horse: booking.horse_name,
      date: booking.booking_date,
      price: `£${booking.service?.price || 0}`,
      requestedAt: booking.requested_at,
      isWalkIn: booking.is_walk_in || false
    })),
    ...(sandSchoolBookings || []).map(booking => ({
      id: booking.id,
      type: 'sand_school' as const,
      user: booking.is_walk_in ? `${booking.customer_name} (Walk-in)` : (booking.user?.full_name || 'Unknown'),
      service: `Sand School - ${booking.yard === 'GREENACHERS' ? 'Greenachers' : 'Merydown'}`,
      horse: 'N/A',
      date: booking.booking_date,
      price: `£${booking.price || 0}`,
      requestedAt: booking.requested_at,
      isWalkIn: booking.is_walk_in || false,
      yard: booking.yard
    }))
  ]

  // Sort by requested date
  allBookings.sort((a, b) =>
    new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
  )

  return allBookings
}

export async function approveBooking(bookingId: string, bookingType: 'horse_care' | 'sand_school') {
  const supabase = await createClient()

  // Get current user (admin)
  const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser()

  if (authError || !currentUser) {
    console.error('Auth error in approveBooking:', authError)
    return { success: false, error: 'Not authenticated' }
  }

  // Check if current user is admin
  const { data: adminUser, error: userError } = await supabase
    .from('users')
    .select('role, status')
    .eq('id', currentUser.id)
    .single()

  if (userError) {
    console.error('Error fetching admin user:', userError)
    return { success: false, error: `Database error: ${userError.message}` }
  }

  if (!adminUser || adminUser.role !== 'ADMIN' || adminUser.status !== 'ACTIVE') {
    console.error('Authorization failed:', { adminUser })
    return { success: false, error: 'Unauthorized' }
  }

  const table = bookingType === 'horse_care' ? 'horse_care_bookings' : 'sand_school_bookings'

  // Get booking details for notification
  const { data: booking } = await supabase
    .from(table)
    .select('user_id')
    .eq('id', bookingId)
    .single()

  // Update booking status
  const { error } = await supabase
    .from(table)
    .update({
      status: 'APPROVED',
      reviewed_by: currentUser.id,
      reviewed_at: new Date().toISOString()
    })
    .eq('id', bookingId)

  if (error) {
    console.error('Error approving booking:', error)
    return { success: false, error: error.message }
  }

  // Create notification
  if (booking) {
    await supabase
      .from('notifications')
      .insert({
        user_id: booking.user_id,
        type: 'BOOKING_APPROVED',
        title: 'Booking Approved',
        message: 'Your booking has been approved!',
        related_booking_id: bookingId,
        read: false
      })
  }

  revalidatePath('/admin')
  revalidatePath('/admin/bookings')

  return { success: true }
}

export async function denyBooking(bookingId: string, bookingType: 'horse_care' | 'sand_school') {
  const supabase = await createClient()

  // Get current user (admin)
  const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser()

  if (authError || !currentUser) {
    console.error('Auth error in denyBooking:', authError)
    return { success: false, error: 'Not authenticated' }
  }

  // Check if current user is admin
  const { data: adminUser, error: userError } = await supabase
    .from('users')
    .select('role, status')
    .eq('id', currentUser.id)
    .single()

  if (userError) {
    console.error('Error fetching admin user:', userError)
    return { success: false, error: `Database error: ${userError.message}` }
  }

  if (!adminUser || adminUser.role !== 'ADMIN' || adminUser.status !== 'ACTIVE') {
    console.error('Authorization failed:', { adminUser })
    return { success: false, error: 'Unauthorized' }
  }

  const table = bookingType === 'horse_care' ? 'horse_care_bookings' : 'sand_school_bookings'

  // Get booking details for notification
  const { data: booking } = await supabase
    .from(table)
    .select('user_id')
    .eq('id', bookingId)
    .single()

  // Update booking status
  const { error } = await supabase
    .from(table)
    .update({
      status: 'DENIED',
      reviewed_by: currentUser.id,
      reviewed_at: new Date().toISOString()
    })
    .eq('id', bookingId)

  if (error) {
    console.error('Error denying booking:', error)
    return { success: false, error: error.message }
  }

  // Create notification
  if (booking) {
    await supabase
      .from('notifications')
      .insert({
        user_id: booking.user_id,
        type: 'BOOKING_DENIED',
        title: 'Booking Denied',
        message: 'Your booking has been denied. Please contact us for more information.',
        related_booking_id: bookingId,
        read: false
      })
  }

  revalidatePath('/admin')
  revalidatePath('/admin/bookings')

  return { success: true }
}

export async function suspendUser(userId: string) {
  const supabase = await createClient()

  // Get current user (admin)
  const { data: { user: currentUser } } = await supabase.auth.getUser()

  if (!currentUser) {
    return { success: false, error: 'Not authenticated' }
  }

  // Check if current user is admin
  const { data: adminUser } = await supabase
    .from('users')
    .select('role, status')
    .eq('id', currentUser.id)
    .single()

  if (!adminUser || adminUser.role !== 'ADMIN' || adminUser.status !== 'ACTIVE') {
    return { success: false, error: 'Unauthorized' }
  }

  // Get target user to check if they're an admin
  const { data: targetUser } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single()

  if (!targetUser) {
    return { success: false, error: 'User not found' }
  }

  if (targetUser.role === 'ADMIN') {
    return { success: false, error: 'Cannot suspend admin users' }
  }

  // Update user status to SUSPENDED
  const { error } = await supabase
    .from('users')
    .update({
      status: 'SUSPENDED',
      approved_by: currentUser.id,
      approved_at: new Date().toISOString()
    })
    .eq('id', userId)

  if (error) {
    console.error('Error suspending user:', error)
    return { success: false, error: error.message }
  }

  // Create notification for the user
  await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type: 'ACCOUNT_SUSPENDED',
      title: 'Account Suspended',
      message: 'Your account has been suspended. Please contact support for more information.',
      read: false
    })

  revalidatePath('/admin')
  revalidatePath('/admin/users')

  return { success: true }
}

export async function reactivateUser(userId: string) {
  const supabase = await createClient()

  // Get current user (admin)
  const { data: { user: currentUser } } = await supabase.auth.getUser()

  if (!currentUser) {
    return { success: false, error: 'Not authenticated' }
  }

  // Check if current user is admin
  const { data: adminUser } = await supabase
    .from('users')
    .select('role, status')
    .eq('id', currentUser.id)
    .single()

  if (!adminUser || adminUser.role !== 'ADMIN' || adminUser.status !== 'ACTIVE') {
    return { success: false, error: 'Unauthorized' }
  }

  // Update user status to ACTIVE
  const { error } = await supabase
    .from('users')
    .update({
      status: 'ACTIVE',
      approved_by: currentUser.id,
      approved_at: new Date().toISOString()
    })
    .eq('id', userId)

  if (error) {
    console.error('Error reactivating user:', error)
    return { success: false, error: error.message }
  }

  // Create notification for the user
  await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type: 'ACCOUNT_REACTIVATED',
      title: 'Account Reactivated',
      message: 'Your account has been reactivated. You can now access all services.',
      read: false
    })

  revalidatePath('/admin')
  revalidatePath('/admin/users')

  return { success: true }
}

export async function deleteUser(userId: string) {
  const supabase = await createClient()

  // Get current user (admin)
  const { data: { user: currentUser } } = await supabase.auth.getUser()

  if (!currentUser) {
    return { success: false, error: 'Not authenticated' }
  }

  // Check if current user is admin
  const { data: adminUser } = await supabase
    .from('users')
    .select('role, status')
    .eq('id', currentUser.id)
    .single()

  if (!adminUser || adminUser.role !== 'ADMIN' || adminUser.status !== 'ACTIVE') {
    return { success: false, error: 'Unauthorized' }
  }

  // Get target user to check if they're an admin
  const { data: targetUser } = await supabase
    .from('users')
    .select('role, email')
    .eq('id', userId)
    .single()

  if (!targetUser) {
    return { success: false, error: 'User not found' }
  }

  if (targetUser.role === 'ADMIN') {
    return { success: false, error: 'Cannot delete admin users' }
  }

  // Prevent deleting yourself
  if (userId === currentUser.id) {
    return { success: false, error: 'Cannot delete your own account' }
  }

  // Delete the user (cascade will handle related records)
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId)

  if (error) {
    console.error('Error deleting user:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/users')

  return { success: true }
}

export async function getAdminStats() {
  const supabase = await createClient()

  // Get pending users count
  const { count: pendingUsersCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'PENDING_APPROVAL')

  // Get active users count
  const { count: activeUsersCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'ACTIVE')

  // Get pending bookings count (both types)
  const { count: pendingHorseCareCount } = await supabase
    .from('horse_care_bookings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'PENDING')

  const { count: pendingSandSchoolCount } = await supabase
    .from('sand_school_bookings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'PENDING')

  const pendingBookingsCount = (pendingHorseCareCount || 0) + (pendingSandSchoolCount || 0)

  // Calculate this month's revenue (approved bookings)
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { data: approvedHorseCare } = await supabase
    .from('horse_care_bookings')
    .select('service:services(price)')
    .eq('status', 'APPROVED')
    .gte('reviewed_at', startOfMonth.toISOString())

  const { data: approvedSandSchool } = await supabase
    .from('sand_school_bookings')
    .select('price')
    .eq('status', 'APPROVED')
    .gte('reviewed_at', startOfMonth.toISOString())

  const horseCareRevenue = approvedHorseCare?.reduce((sum, booking: any) =>
    sum + (Number(booking.service?.price) || 0), 0) || 0

  const sandSchoolRevenue = approvedSandSchool?.reduce((sum, booking: any) =>
    sum + (Number(booking.price) || 0), 0) || 0

  const totalRevenue = horseCareRevenue + sandSchoolRevenue

  return {
    pendingUsers: pendingUsersCount || 0,
    activeUsers: activeUsersCount || 0,
    pendingBookings: pendingBookingsCount,
    monthlyRevenue: totalRevenue
  }
}
