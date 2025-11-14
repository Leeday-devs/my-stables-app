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

    // Parse request body
    const body = await request.json()
    const { date, startTime, duration } = body

    // Validate required fields
    if (!date || !startTime || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields: date, startTime, and duration are required' },
        { status: 400 }
      )
    }

    // Validate duration (must be 30 or 60 minutes)
    if (![30, 60].includes(Number(duration))) {
      return NextResponse.json(
        { error: 'Invalid duration. Must be 30 or 60 minutes' },
        { status: 400 }
      )
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      )
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(startTime)) {
      return NextResponse.json(
        { error: 'Invalid time format. Use HH:MM (24-hour format)' },
        { status: 400 }
      )
    }

    // Validate date is not in the past
    const bookingDate = new Date(`${date}T${startTime}`)
    const now = new Date()
    if (bookingDate < now) {
      return NextResponse.json(
        { error: 'Cannot book time slots in the past' },
        { status: 400 }
      )
    }

    // Calculate end time
    const endTime = new Date(bookingDate.getTime() + Number(duration) * 60000)
      .toTimeString()
      .substring(0, 5)

    // Check for conflicting bookings
    const { data: conflicts, error: conflictError } = await supabase
      .from('sand_school_bookings')
      .select('id, start_time, duration_minutes, status')
      .eq('booking_date', date)
      .neq('status', 'DENIED')
      .gte('start_time', startTime)
      .lte('start_time', endTime)

    if (conflictError) {
      console.error('Error checking conflicts:', conflictError)
      return NextResponse.json(
        { error: 'Failed to check booking availability' },
        { status: 500 }
      )
    }

    // Advanced conflict checking: check if new booking overlaps with existing bookings
    if (conflicts && conflicts.length > 0) {
      for (const conflict of conflicts) {
        const conflictStart = new Date(`${date}T${conflict.start_time}`)
        const conflictEnd = new Date(conflictStart.getTime() + conflict.duration_minutes * 60000)
        const newStart = new Date(`${date}T${startTime}`)
        const newEnd = new Date(newStart.getTime() + Number(duration) * 60000)

        // Check for any overlap
        if (
          (newStart >= conflictStart && newStart < conflictEnd) ||
          (newEnd > conflictStart && newEnd <= conflictEnd) ||
          (newStart <= conflictStart && newEnd >= conflictEnd)
        ) {
          return NextResponse.json(
            {
              error: 'Time slot conflict',
              message: 'This time slot is already booked or overlaps with an existing booking',
              conflictingBooking: {
                startTime: conflict.start_time,
                duration: conflict.duration_minutes,
                status: conflict.status
              }
            },
            { status: 409 }
          )
        }
      }
    }

    // Calculate price based on duration
    const price = Number(duration) === 30 ? 2.50 : 5.00

    // Create the booking
    const { data: booking, error: insertError } = await supabase
      .from('sand_school_bookings')
      .insert({
        user_id: user.id,
        booking_date: date,
        start_time: startTime,
        duration_minutes: Number(duration),
        price,
        status: 'PENDING'
      })
      .select('*')
      .single()

    if (insertError) {
      console.error('Error creating booking:', insertError)

      // Check if it's a unique constraint violation (RLS policy preventing double booking)
      if (insertError.code === '23505' || insertError.message?.includes('duplicate')) {
        return NextResponse.json(
          { error: 'Time slot conflict', message: 'This time slot is already booked' },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to create booking', details: insertError.message },
        { status: 500 }
      )
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Sand school booking created successfully',
        booking: {
          id: booking.id,
          date: booking.booking_date,
          startTime: booking.start_time,
          endTime,
          duration: booking.duration_minutes,
          price: booking.price,
          status: booking.status
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Unexpected error in sand school booking:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET endpoint to fetch available time slots for a specific date
export async function GET(request: NextRequest) {
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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const duration = searchParams.get('duration') || '30'

    if (!date) {
      return NextResponse.json(
        { error: 'Missing required parameter: date' },
        { status: 400 }
      )
    }

    // Fetch all bookings for this date (excluding denied bookings)
    const { data: bookings, error: fetchError } = await supabase
      .from('sand_school_bookings')
      .select('start_time, duration_minutes')
      .eq('booking_date', date)
      .in('status', ['PENDING', 'APPROVED'])
      .order('start_time', { ascending: true })

    if (fetchError) {
      console.error('Error fetching bookings:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      )
    }

    // Generate all possible time slots (8:00 AM to 6:00 PM in 30-minute intervals)
    const allSlots: string[] = []
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`

        // Don't include slots that would end after 6:00 PM
        const slotEndTime = new Date(`${date}T${timeSlot}`)
        slotEndTime.setMinutes(slotEndTime.getMinutes() + Number(duration))
        const endHour = slotEndTime.getHours()
        const endMinute = slotEndTime.getMinutes()

        if (endHour < 18 || (endHour === 18 && endMinute === 0)) {
          allSlots.push(timeSlot)
        }
      }
    }

    // Check which slots are available
    const availableSlots = allSlots.filter(slot => {
      const slotStart = new Date(`${date}T${slot}`)
      const slotEnd = new Date(slotStart.getTime() + Number(duration) * 60000)

      // Check if this slot conflicts with any existing booking
      const hasConflict = bookings?.some(booking => {
        const bookingStart = new Date(`${date}T${booking.start_time}`)
        const bookingEnd = new Date(bookingStart.getTime() + booking.duration_minutes * 60000)

        // Check for overlap
        return (
          (slotStart >= bookingStart && slotStart < bookingEnd) ||
          (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
          (slotStart <= bookingStart && slotEnd >= bookingEnd)
        )
      })

      return !hasConflict
    })

    // Return available and booked slots
    return NextResponse.json({
      date,
      duration: Number(duration),
      availableSlots,
      bookedSlots: bookings?.map(b => ({
        startTime: b.start_time,
        duration: b.duration_minutes
      })) || []
    })

  } catch (error) {
    console.error('Unexpected error fetching time slots:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
