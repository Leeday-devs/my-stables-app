'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Helper function to parse duration string to minutes
function parseDurationToMinutes(duration: string): number {
  const cleaned = duration.toLowerCase().trim()

  // Match patterns like: 30m, 1hr, 1.5h, 90 minutes, etc.
  const hourMatch = cleaned.match(/^(\d+\.?\d*)\s*h(?:r|ours?)?$/i)
  const minuteMatch = cleaned.match(/^(\d+)\s*m(?:in|inutes?)?$/i)

  if (hourMatch) {
    return Math.round(parseFloat(hourMatch[1]) * 60)
  } else if (minuteMatch) {
    return parseInt(minuteMatch[1])
  }

  // Default: try to parse as number (assume minutes)
  const num = parseInt(cleaned)
  return isNaN(num) ? 60 : num
}

// Helper function to format minutes to readable duration
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  } else if (minutes % 60 === 0) {
    return `${minutes / 60} hr`
  } else {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}min`
  }
}

// Check if user is admin
async function isAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return false

  const { data: adminUser } = await supabase
    .from('users')
    .select('role, status')
    .eq('id', user.id)
    .single()

  return adminUser?.role === 'ADMIN' && adminUser?.status === 'ACTIVE'
}

export async function getAllServices() {
  const supabase = await createClient()
  const admin = await isAdmin()

  let query = supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false })

  // Non-admins only see active services
  if (!admin) {
    query = query.eq('active', true)
  }

  const { data: services, error } = await query

  if (error) {
    console.error('Error fetching services:', error)
    return []
  }

  return services || []
}

export async function createService(formData: {
  name: string
  description?: string
  price: number
  duration: string
}) {
  const supabase = await createClient()

  // Check admin authorization
  const admin = await isAdmin()
  if (!admin) {
    return { success: false, error: 'Unauthorized' }
  }

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Validate inputs
  if (!formData.name || !formData.price) {
    return { success: false, error: 'Name and price are required' }
  }

  if (formData.price <= 0) {
    return { success: false, error: 'Price must be greater than 0' }
  }

  // Parse duration to minutes
  const durationMinutes = parseDurationToMinutes(formData.duration)

  // Insert service
  const { error } = await supabase
    .from('services')
    .insert({
      name: formData.name,
      description: formData.description || null,
      price: formData.price,
      duration_minutes: durationMinutes,
      active: true,
      created_by: user.id
    })

  if (error) {
    console.error('Error creating service:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/services')
  revalidatePath('/dashboard/bookings/horse-care')

  return { success: true }
}

export async function updateService(
  serviceId: string,
  formData: {
    name: string
    description?: string
    price: number
    duration: string
  }
) {
  const supabase = await createClient()

  // Check admin authorization
  const admin = await isAdmin()
  if (!admin) {
    return { success: false, error: 'Unauthorized' }
  }

  // Validate inputs
  if (!formData.name || !formData.price) {
    return { success: false, error: 'Name and price are required' }
  }

  if (formData.price <= 0) {
    return { success: false, error: 'Price must be greater than 0' }
  }

  // Parse duration to minutes
  const durationMinutes = parseDurationToMinutes(formData.duration)

  // Update service
  const { error } = await supabase
    .from('services')
    .update({
      name: formData.name,
      description: formData.description || null,
      price: formData.price,
      duration_minutes: durationMinutes
    })
    .eq('id', serviceId)

  if (error) {
    console.error('Error updating service:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/services')
  revalidatePath('/dashboard/bookings/horse-care')

  return { success: true }
}

export async function toggleServiceStatus(serviceId: string, currentStatus: boolean) {
  const supabase = await createClient()

  // Check admin authorization
  const admin = await isAdmin()
  if (!admin) {
    return { success: false, error: 'Unauthorized' }
  }

  // Toggle the active status
  const { error } = await supabase
    .from('services')
    .update({ active: !currentStatus })
    .eq('id', serviceId)

  if (error) {
    console.error('Error toggling service status:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/services')
  revalidatePath('/dashboard/bookings/horse-care')

  return { success: true }
}

export async function deleteService(serviceId: string) {
  const supabase = await createClient()

  // Check admin authorization
  const admin = await isAdmin()
  if (!admin) {
    return { success: false, error: 'Unauthorized' }
  }

  // Check if service is used in any bookings
  const { data: bookings } = await supabase
    .from('horse_care_bookings')
    .select('id')
    .eq('service_id', serviceId)
    .limit(1)

  if (bookings && bookings.length > 0) {
    return {
      success: false,
      error: 'Cannot delete service that has existing bookings. Consider deactivating it instead.'
    }
  }

  // Delete service
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', serviceId)

  if (error) {
    console.error('Error deleting service:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/services')
  revalidatePath('/dashboard/bookings/horse-care')

  return { success: true }
}
