'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { SandSchoolBooking, Yard } from '@/types'

interface CalendarBooking extends SandSchoolBooking {
  user_email?: string
  user_name?: string
}

interface SandSchoolCalendarProps {
  yard: Yard
  onSlotClick?: (date: string, time: string) => void
  clickableSlots?: boolean
}

export function SandSchoolCalendar({ yard, onSlotClick, clickableSlots = false }: SandSchoolCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [bookings, setBookings] = useState<CalendarBooking[]>([])
  const [loading, setLoading] = useState(true)
  // Default to day view on mobile, week view on desktop
  const [viewMode, setViewMode] = useState<'day' | 'week'>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 'day' : 'week'
    }
    return 'week'
  })

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
  }, [currentDate, viewMode, yard])

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
        .eq('yard', yard)
        .in('status', ['PENDING', 'APPROVED'])
        .order('booking_date', { ascending: true })
        .order('start_time', { ascending: true })

      if (error) throw error

      // Transform data to include user info
      const transformedBookings = data?.map((booking: any) => {
        const user = Array.isArray(booking.users) ? booking.users[0] : booking.users
        return {
          ...booking,
          user_email: user?.email,
          // Show customer_name for walk-ins, otherwise show user name
          user_name: booking.is_walk_in ? booking.customer_name : (user?.full_name || 'Unknown User')
        }
      }) || []

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
    <Card className="p-3 sm:p-4 lg:p-6 w-full">
      {/* Header */}
      <div className="mb-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-lg sm:text-xl font-bold">{yard === 'GREENACHERS' ? 'Greenachers' : 'Merydown'} Sand School</h2>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'day' ? 'week' : 'day')}
            className="text-xs"
          >
            {viewMode === 'day' ? 'Week View' : 'Day View'}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <Button variant="outline" size="sm" onClick={navigatePrevious} className="flex-1 sm:flex-none">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={navigateToday} className="flex-1 sm:flex-none text-xs">
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={navigateNext} className="flex-1 sm:flex-none">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="font-medium text-xs sm:text-sm text-center sm:text-right">
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
        <div className="overflow-x-auto -mx-3 sm:mx-0 w-full">
          <div className={viewMode === 'week' ? 'min-w-[650px]' : 'min-w-full'}>
            {/* Day Headers */}
            <div className="grid gap-0.5 mb-2" style={{
              gridTemplateColumns: viewMode === 'day' ? '50px 1fr' : `50px repeat(${weekDates.length}, minmax(80px, 1fr))`
            }}>
              <div className="text-[10px] sm:text-xs font-medium text-muted-foreground p-1 sm:p-2">Time</div>
              {weekDates.map((date, index) => (
                <div
                  key={index}
                  className={`text-center p-1 sm:p-2 rounded-t-lg ${
                    date.toDateString() === new Date().toDateString()
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="text-[10px] sm:text-xs font-medium">
                    {date.toLocaleDateString('en-GB', { weekday: viewMode === 'day' ? 'long' : 'short' })}
                  </div>
                  <div className="text-sm sm:text-base font-bold">
                    {date.getDate()}
                  </div>
                  {viewMode === 'day' && (
                    <div className="text-[10px]">
                      {date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Time Slots Grid */}
            <div className="border rounded-lg overflow-hidden">
              {timeSlots.map((time) => (
                <div
                  key={time}
                  className="grid gap-0.5 border-b last:border-b-0"
                  style={{
                    gridTemplateColumns: viewMode === 'day' ? '50px 1fr' : `50px repeat(${weekDates.length}, minmax(80px, 1fr))`
                  }}
                >
                  {/* Time Label */}
                  <div className="text-xs text-muted-foreground p-1 flex items-center justify-center border-r bg-muted/30">
                    <Clock className="h-2.5 w-2.5 mr-0.5 hidden sm:inline" />
                    <span className="text-[10px]">{time}</span>
                  </div>

                  {/* Day Cells */}
                  {weekDates.map((date, dateIndex) => {
                    const booking = getBookingForSlot(date, time)
                    const isStart = booking && isBookingStart(booking, time)
                    const span = booking ? getBookingSpan(booking) : 0
                    const dateStr = date.toISOString().split('T')[0]
                    const isPastSlot = new Date(`${dateStr}T${time}`) < new Date()
                    const isClickable = clickableSlots && !booking && !isPastSlot

                    // Skip rendering if this cell is part of a multi-slot booking but not the start
                    if (booking && !isStart) {
                      return <div key={dateIndex} className="border-r last:border-r-0" />
                    }

                    return (
                      <div
                        key={dateIndex}
                        className={`border-r last:border-r-0 relative min-h-[45px] ${
                          isClickable ? 'cursor-pointer hover:bg-primary/5 transition-colors' : ''
                        }`}
                        style={isStart ? {
                          gridRow: `span ${span}`,
                        } : undefined}
                        onClick={() => {
                          if (isClickable && onSlotClick) {
                            onSlotClick(dateStr, time)
                          }
                        }}
                      >
                        {isStart && booking && (
                          <div
                            className={`absolute inset-0.5 rounded-md p-1 border ${getStatusColor(booking.status)}`}
                          >
                            <div className="text-[10px] font-medium truncate">
                              {booking.user_name}
                            </div>
                            <div className="text-[9px] flex items-center gap-0.5 mt-0.5">
                              <Clock className="h-2 w-2" />
                              <span className="truncate">{booking.start_time} ({booking.duration_minutes}m)</span>
                            </div>
                            <Badge
                              variant="secondary"
                              className="text-[8px] mt-0.5 h-3.5 px-1"
                            >
                              {booking.status}
                            </Badge>
                          </div>
                        )}
                        {isClickable && (
                          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 hover:text-primary/40 transition-colors pointer-events-none">
                            <span className="text-lg font-light">+</span>
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
      <div className="mt-4 flex items-center gap-3 flex-wrap text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-green-100 border border-green-200" />
          <span className="text-muted-foreground">Approved</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-200" />
          <span className="text-muted-foreground">Pending</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-100 border border-red-200" />
          <span className="text-muted-foreground">Denied</span>
        </div>
        {clickableSlots && (
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-muted-foreground">💡 Click empty slots to book</span>
          </div>
        )}
      </div>
    </Card>
  )
}
