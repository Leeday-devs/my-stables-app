'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Calendar, Clock, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { SandSchoolBooking } from '@/types'

interface CalendarBooking extends SandSchoolBooking {
  user_email?: string
  user_name?: string
}

export function SandSchoolCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [bookings, setBookings] = useState<CalendarBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'day' | 'week'>('week')

  // Time slots from 8:00 AM to 6:00 PM
  const timeSlots = Array.from({ length: 21 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8
    const minute = (i % 2) * 30
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  })

  // Get week dates
  const getWeekDates = (date: Date) => {
    const week = []
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay()) // Start on Sunday

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      week.push(day)
    }
    return week
  }

  const weekDates = viewMode === 'week' ? getWeekDates(currentDate) : [currentDate]

  // Fetch bookings for the current week/day
  useEffect(() => {
    fetchBookings()
  }, [currentDate, viewMode])

  const fetchBookings = async () => {
    setLoading(true)
    const supabase = createClient()

    try {
      const dates = weekDates.map(d => d.toISOString().split('T')[0])

      const { data, error } = await supabase
        .from('sand_school_bookings')
        .select(`
          *,
          users (
            email,
            full_name
          )
        `)
        .in('booking_date', dates)
        .order('booking_date', { ascending: true })
        .order('start_time', { ascending: true })

      if (error) throw error

      // Transform data to include user info
      const transformedBookings = data?.map(booking => ({
        ...booking,
        user_email: booking.users?.email,
        user_name: booking.users?.full_name || 'Unknown User'
      })) || []

      setBookings(transformedBookings)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  // Navigate weeks/days
  const navigatePrevious = () => {
    const newDate = new Date(currentDate)
    if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() - 7)
    } else {
      newDate.setDate(currentDate.getDate() - 1)
    }
    setCurrentDate(newDate)
  }

  const navigateNext = () => {
    const newDate = new Date(currentDate)
    if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + 7)
    } else {
      newDate.setDate(currentDate.getDate() + 1)
    }
    setCurrentDate(newDate)
  }

  const navigateToday = () => {
    setCurrentDate(new Date())
  }

  // Get bookings for a specific date and time
  const getBookingForSlot = (date: Date, time: string): CalendarBooking | undefined => {
    const dateStr = date.toISOString().split('T')[0]
    return bookings.find(booking => {
      if (booking.booking_date !== dateStr) return false

      const bookingStart = new Date(`${booking.booking_date}T${booking.start_time}`)
      const bookingEnd = new Date(bookingStart.getTime() + booking.duration_minutes * 60000)
      const slotTime = new Date(`${dateStr}T${time}`)

      return slotTime >= bookingStart && slotTime < bookingEnd
    })
  }

  // Check if a time slot is the start of a booking
  const isBookingStart = (booking: CalendarBooking | undefined, time: string): boolean => {
    return booking?.start_time === time
  }

  // Calculate how many 30-minute slots a booking spans
  const getBookingSpan = (booking: CalendarBooking): number => {
    return booking.duration_minutes / 30
  }

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    })
  }

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'DENIED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Sand School Calendar</h2>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'day' ? 'week' : 'day')}
            >
              {viewMode === 'day' ? 'Week View' : 'Day View'}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={navigatePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={navigateToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={navigateNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="font-medium">
            {viewMode === 'week'
              ? `${formatDate(weekDates[0])} - ${formatDate(weekDates[6])}`
              : formatDate(currentDate)
            }
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12 text-muted-foreground">
          Loading bookings...
        </div>
      )}

      {/* Calendar Grid */}
      {!loading && (
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Day Headers */}
            <div className="grid gap-1 mb-2" style={{
              gridTemplateColumns: `80px repeat(${weekDates.length}, 1fr)`
            }}>
              <div className="text-sm font-medium text-muted-foreground p-2">Time</div>
              {weekDates.map((date, index) => (
                <div
                  key={index}
                  className={`text-center p-2 rounded-t-lg ${
                    date.toDateString() === new Date().toDateString()
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="text-sm font-medium">
                    {date.toLocaleDateString('en-GB', { weekday: 'short' })}
                  </div>
                  <div className="text-lg font-bold">
                    {date.getDate()}
                  </div>
                </div>
              ))}
            </div>

            {/* Time Slots Grid */}
            <div className="border rounded-lg overflow-hidden">
              {timeSlots.map((time, timeIndex) => (
                <div
                  key={time}
                  className="grid gap-1 border-b last:border-b-0"
                  style={{
                    gridTemplateColumns: `80px repeat(${weekDates.length}, 1fr)`
                  }}
                >
                  {/* Time Label */}
                  <div className="text-xs text-muted-foreground p-2 flex items-center justify-center border-r bg-muted/30">
                    <Clock className="h-3 w-3 mr-1" />
                    {time}
                  </div>

                  {/* Day Cells */}
                  {weekDates.map((date, dateIndex) => {
                    const booking = getBookingForSlot(date, time)
                    const isStart = booking && isBookingStart(booking, time)
                    const span = booking ? getBookingSpan(booking) : 0

                    // Skip rendering if this cell is part of a multi-slot booking but not the start
                    if (booking && !isStart) {
                      return <div key={dateIndex} className="border-r last:border-r-0" />
                    }

                    return (
                      <div
                        key={dateIndex}
                        className="border-r last:border-r-0 relative min-h-[60px]"
                        style={isStart ? {
                          gridRow: `span ${span}`,
                        } : undefined}
                      >
                        {isStart && booking && (
                          <div
                            className={`absolute inset-1 rounded-md p-2 border ${getStatusColor(booking.status)}`}
                          >
                            <div className="text-xs font-medium truncate">
                              {booking.user_name}
                            </div>
                            <div className="text-xs flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3" />
                              {booking.start_time} ({booking.duration_minutes}min)
                            </div>
                            <Badge
                              variant="secondary"
                              className="text-xs mt-1"
                            >
                              {booking.status}
                            </Badge>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 flex-wrap text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100 border border-green-200" />
          <span className="text-muted-foreground">Approved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-200" />
          <span className="text-muted-foreground">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-100 border border-red-200" />
          <span className="text-muted-foreground">Denied</span>
        </div>
      </div>
    </Card>
  )
}
