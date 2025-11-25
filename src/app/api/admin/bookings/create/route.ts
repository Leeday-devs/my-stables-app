import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    // Verify user is an admin
    const { data: adminData, error: adminError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (adminError || !adminData || adminData.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { booking_type, user_id, customer_name, customer_phone, is_walk_in } = body

    // Validate booking type
    if (!['SAND_SCHOOL', 'HORSE_CARE'].includes(booking_type)) {
      return NextResponse.json(
        { error: 'Invalid booking_type. Must be SAND_SCHOOL or HORSE_CARE' },
        { status: 400 }
      )
    }

    // Validate customer info: either user_id OR walk-in customer details
    if (!user_id && (!is_walk_in || !customer_name || !customer_phone)) {
      return NextResponse.json(
        { error: 'Must provide either user_id or walk-in customer details (customer_name, customer_phone, is_walk_in: true)' },
        { status: 400 }
      )
    }

    // If user_id is provided, verify the user exists
    if (user_id) {
      const { data: customerData, error: customerError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user_id)
        .single()

      if (customerError || !customerData) {
        return NextResponse.json(
          { error: 'User not found with provided user_id' },
          { status: 404 }
        )
      }
    }

    // Handle Sand School Booking
    if (booking_type === 'SAND_SCHOOL') {
      const { yard, booking_date, start_time, duration_minutes } = body

      // Validate required fields
      if (!booking_date || !start_time || !duration_minutes || !yard) {
        return NextResponse.json(
          { error: 'Missing required fields for sand school booking: yard, booking_date, start_time, duration_minutes' },
          { status: 400 }
        )
      }

      // Validate yard
      if (!['GREENACHERS', 'MERYDOWN'].includes(yard)) {
        return NextResponse.json(
          { error: 'Invalid yard. Must be GREENACHERS or MERYDOWN' },
          { status: 400 }
        )
      }

      // Validate duration
      if (![30, 60].includes(Number(duration_minutes))) {
        return NextResponse.json(
          { error: 'Invalid duration. Must be 30 or 60 minutes' },
          { status: 400 }
        )
      }

      // Calculate price
      const price = Number(duration_minutes) === 30 ? 2.50 : 5.00

      // Calculate end time for conflict checking
      const startDateTime = new Date(`${booking_date}T${start_time}`)
      const endDateTime = new Date(startDateTime.getTime() + Number(duration_minutes) * 60000)
      const endTime = endDateTime.toTimeString().substring(0, 5)

      // Check for conflicting bookings
      const { data: conflicts, error: conflictError } = await supabase
        .from('sand_school_bookings')
        .select('id, start_time, duration_minutes')
        .eq('booking_date', booking_date)
        .eq('yard', yard)
        .in('status', ['PENDING', 'APPROVED'])

      if (conflictError) {
        console.error('Error checking conflicts:', conflictError)
        return NextResponse.json(
          { error: 'Failed to check booking availability' },
          { status: 500 }
        )
      }

      // Check for overlaps
      if (conflicts && conflicts.length > 0) {
        for (const conflict of conflicts) {
          const conflictStart = new Date(`${booking_date}T${conflict.start_time}`)
          const conflictEnd = new Date(conflictStart.getTime() + conflict.duration_minutes * 60000)

          // Check for any overlap
          if (
            (startDateTime >= conflictStart && startDateTime < conflictEnd) ||
            (endDateTime > conflictStart && endDateTime <= conflictEnd) ||
            (startDateTime <= conflictStart && endDateTime >= conflictEnd)
          ) {
            return NextResponse.json(
              { error: 'Time slot conflict - this time is already booked' },
              { status: 409 }
            )
          }
        }
      }

      // Create sand school booking (automatically approved)
      const { data: booking, error: bookingError } = await supabase
        .from('sand_school_bookings')
        .insert({
          user_id: user_id || null,
          booking_date,
          start_time,
          duration_minutes: Number(duration_minutes),
          price,
          yard,
          status: 'APPROVED',  // Auto-approve admin bookings
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          requested_at: new Date().toISOString(),
          // Walk-in customer fields
          customer_name: is_walk_in ? customer_name : null,
          customer_phone: is_walk_in ? customer_phone : null,
          is_walk_in: is_walk_in || false,
        })
        .select('*')
        .single()

      if (bookingError) {
        console.error('Error creating sand school booking:', bookingError)
        return NextResponse.json(
          { error: 'Failed to create booking', details: bookingError.message },
          { status: 500 }
        )
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Sand school booking created successfully',
          booking
        },
        { status: 201 }
      )
    }

    // Handle Horse Care Booking
    if (booking_type === 'HORSE_CARE') {
      const { horse_name, service_id, booking_date } = body

      // Validate required fields
      if (!horse_name || !service_id || !booking_date) {
        return NextResponse.json(
          { error: 'Missing required fields for horse care booking: horse_name, service_id, booking_date' },
          { status: 400 }
        )
      }

      // Verify service exists
      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .select('id, active')
        .eq('id', service_id)
        .single()

      if (serviceError || !serviceData) {
        return NextResponse.json(
          { error: 'Service not found with provided service_id' },
          { status: 404 }
        )
      }

      if (!serviceData.active) {
        return NextResponse.json(
          { error: 'This service is no longer active' },
          { status: 400 }
        )
      }

      // Create horse care booking (automatically approved)
      const { data: booking, error: bookingError } = await supabase
        .from('horse_care_bookings')
        .insert({
          user_id: user_id || null,
          horse_name,
          service_id,
          booking_date,
          status: 'APPROVED',  // Auto-approve admin bookings
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          requested_at: new Date().toISOString(),
          // Walk-in customer fields
          customer_name: is_walk_in ? customer_name : null,
          customer_phone: is_walk_in ? customer_phone : null,
          is_walk_in: is_walk_in || false,
        })
        .select('*')
        .single()

      if (bookingError) {
        console.error('Error creating horse care booking:', bookingError)
        return NextResponse.json(
          { error: 'Failed to create booking', details: bookingError.message },
          { status: 500 }
        )
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Horse care booking created successfully',
          booking
        },
        { status: 201 }
      )
    }

  } catch (error) {
    console.error('Unexpected error in admin booking creation:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
