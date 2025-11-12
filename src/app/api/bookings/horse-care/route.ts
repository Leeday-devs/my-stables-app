import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get request body
    const body = await request.json()
    const { horse_name, service_id, booking_date, notes } = body

    // Validate required fields
    if (!horse_name || !service_id || !booking_date) {
      return NextResponse.json(
        { error: 'Missing required fields: horse_name, service_id, booking_date' },
        { status: 400 }
      )
    }

    // Verify user is active
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('status')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (userData.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Your account is not active. Please wait for admin approval.' },
        { status: 403 }
      )
    }

    // Create the booking
    const { data: booking, error: bookingError } = await supabase
      .from('horse_care_bookings')
      .insert({
        user_id: user.id,
        horse_name,
        service_id,
        booking_date,
        notes: notes || null,
        status: 'PENDING',
        requested_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (bookingError) {
      console.error('Booking creation error:', bookingError)
      return NextResponse.json(
        { error: 'Failed to create booking. Please try again.' },
        { status: 500 }
      )
    }

    // TODO: Send notification to admins about new booking request

    return NextResponse.json(
      {
        message: 'Booking request submitted successfully',
        booking
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Unexpected error in booking API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
