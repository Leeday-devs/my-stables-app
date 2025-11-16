'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar, Clock, AlertCircle, Loader2, CheckCircle2, CalendarDays } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { SandSchoolCalendar } from '@/components/admin/SandSchoolCalendar'

export default function SandSchoolBookingPage() {
  const [selectedDate, setSelectedDate] = useState('')
  const [duration, setDuration] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const getPrice = () => {
    if (duration === '30') return '£2.50'
    if (duration === '60') return '£5.00'
    return '-'
  }

  // Fetch available time slots when date or duration changes
  useEffect(() => {
    if (selectedDate && duration) {
      fetchAvailableSlots()
    } else {
      setAvailableSlots([])
      setSelectedTime('')
    }
  }, [selectedDate, duration])

  const fetchAvailableSlots = async () => {
    setLoadingSlots(true)
    setSelectedTime('')

    try {
      const response = await fetch(
        `/api/bookings/sand-school?date=${selectedDate}&duration=${duration}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch available slots')
      }

      const data = await response.json()
      setAvailableSlots(data.availableSlots || [])
    } catch (error) {
      console.error('Error fetching slots:', error)
      toast({
        title: 'Error',
        description: 'Failed to load available time slots. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate || !duration || !selectedTime) {
      toast({
        title: 'Missing Information',
        description: 'Please select a date, duration, and time slot.',
        variant: 'destructive',
      })
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/bookings/sand-school', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate,
          startTime: selectedTime,
          duration: Number(duration),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to create booking')
      }

      toast({
        title: 'Booking Submitted!',
        description: 'Your sand school booking has been submitted for review.',
      })

      // Redirect to bookings page after a short delay
      setTimeout(() => {
        router.push('/dashboard/bookings')
      }, 1500)
    } catch (error) {
      console.error('Error creating booking:', error)
      toast({
        title: 'Booking Failed',
        description: error instanceof Error ? error.message : 'Failed to submit booking. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">Book Sand School</h1>
        <p className="text-muted-foreground">
          Reserve sand school time slots (30 minutes or 1 hour).
        </p>
      </div>

      {/* Calendar View - Shows all bookings */}
      <div className="mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">View Current Bookings</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Check which time slots are already booked before making your reservation.
          </p>
          <SandSchoolCalendar />
        </Card>
      </div>

      {/* Booking Form Section */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Make a Booking</h2>
        <p className="text-muted-foreground">Select your preferred date, duration, and time slot.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Booking Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Selection */}
              <div className="space-y-2">
                <Label htmlFor="date">Select Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              {/* Duration Selection */}
              <div className="space-y-2">
                <Label htmlFor="duration">Duration *</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">
                      <div className="flex items-center justify-between w-full">
                        <span>30 minutes</span>
                        <span className="ml-4 text-sm text-muted-foreground">£2.50</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="60">
                      <div className="flex items-center justify-between w-full">
                        <span>1 hour</span>
                        <span className="ml-4 text-sm text-muted-foreground">£5.00</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Display */}
              {duration && (
                <Card className="p-4 bg-secondary/10 border-secondary/20">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Price:</span>
                    <span className="text-2xl font-bold text-secondary">{getPrice()}</span>
                  </div>
                </Card>
              )}

              {/* Available Time Slots */}
              <div className="space-y-2">
                <Label>Available Time Slots *</Label>

                {!selectedDate || !duration ? (
                  <div className="p-4 border rounded-lg text-center text-muted-foreground text-sm">
                    Please select a date and duration to view available time slots
                  </div>
                ) : loadingSlots ? (
                  <div className="p-8 border rounded-lg flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading available slots...</span>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="p-4 border rounded-lg text-center text-muted-foreground text-sm bg-red-50 border-red-200">
                    <AlertCircle className="h-5 w-5 mx-auto mb-2 text-red-600" />
                    No available time slots for this date and duration. Please try another date.
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-96 overflow-y-auto p-2 border rounded-lg">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot}
                          type="button"
                          variant={selectedTime === slot ? 'default' : 'outline'}
                          size="sm"
                          className="text-xs"
                          onClick={() => setSelectedTime(slot)}
                        >
                          {selectedTime === slot && (
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                          )}
                          {slot}
                        </Button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {availableSlots.length} slot{availableSlots.length !== 1 ? 's' : ''} available.
                      Click a time slot to select it.
                    </p>
                  </>
                )}
              </div>

              {/* Important Notice */}
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">Approval Required</p>
                    <p className="text-blue-700 mt-1">
                      All sand school bookings require admin approval. You'll be notified once reviewed.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={!selectedDate || !duration || !selectedTime || submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Calendar className="mr-2 h-4 w-4" />
                      Submit Booking Request
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-heading text-lg font-semibold mb-4">Pricing</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <p className="font-medium">30 Minutes</p>
                  <p className="text-sm text-muted-foreground">Half hour session</p>
                </div>
                <p className="text-xl font-bold text-secondary">£2.50</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">1 Hour</p>
                  <p className="text-sm text-muted-foreground">Full hour session</p>
                </div>
                <p className="text-xl font-bold text-secondary">£5.00</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-muted/30">
            <h3 className="font-heading text-lg font-semibold mb-3">Sand School Info</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Open daily from 8:00 AM to 6:00 PM</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>30-minute and 1-hour slots available</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Real-time availability checking</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>No double bookings - guaranteed</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Instant booking confirmation</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
