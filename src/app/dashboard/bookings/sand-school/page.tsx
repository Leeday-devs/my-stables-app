'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { SandSchoolCalendar } from '@/components/admin/SandSchoolCalendar'

export default function SandSchoolBookingPage() {
  const [yard, setYard] = useState<'GREENACHERS' | 'MERYDOWN'>('GREENACHERS')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [duration, setDuration] = useState('30')
  const [submitting, setSubmitting] = useState(false)
  const [calendarKey, setCalendarKey] = useState(0)
  const { toast } = useToast()
  const router = useRouter()

  const getPrice = () => {
    if (duration === '30') return '£2.50'
    if (duration === '60') return '£5.00'
    return '-'
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleSlotClick = (date: string, time: string) => {
    setSelectedDate(date)
    setSelectedTime(time)
    setDuration('30') // Default to 30 minutes
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
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
          yard: yard,
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

      setDialogOpen(false)

      // Refresh calendar
      setCalendarKey(prev => prev + 1)

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
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
      {/* Header with Yard Selection */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold mb-1">Book Sand School</h1>
            <p className="text-sm text-muted-foreground">
              Click on any available time slot in the calendar to book
            </p>
          </div>

          {/* Yard Selection */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Select Arena:</span>
            <Select value={yard} onValueChange={(value: 'GREENACHERS' | 'MERYDOWN') => setYard(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Choose arena" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GREENACHERS">Greenachers</SelectItem>
                <SelectItem value="MERYDOWN">Merydown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <Card className="p-3 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-medium text-blue-900">Approval Required</p>
                <p className="text-blue-700">All bookings need admin approval</p>
              </div>
            </div>
          </Card>

          <Card className="p-3 bg-green-50 border-green-200">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-medium text-green-900">30 Minutes</p>
                <p className="text-green-700">£2.50 per half hour session</p>
              </div>
            </div>
          </Card>

          <Card className="p-3 bg-green-50 border-green-200">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-medium text-green-900">1 Hour</p>
                <p className="text-green-700">£5.00 per full hour session</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Calendar - Main Focus */}
      <SandSchoolCalendar
        key={calendarKey}
        yard={yard}
        clickableSlots={true}
        onSlotClick={handleSlotClick}
      />

      {/* Booking Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogDescription>
              Review your booking details and select duration
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Booking Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Arena:</span>
                <Badge variant="secondary">{yard === 'GREENACHERS' ? 'Greenachers' : 'Merydown'}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Date:</span>
                <span className="text-sm">{selectedDate && formatDate(selectedDate)}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Time:</span>
                <span className="text-sm font-mono">{selectedTime}</span>
              </div>
            </div>

            {/* Duration Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration</label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes - £2.50</SelectItem>
                  <SelectItem value="60">1 hour - £5.00</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Display */}
            <Card className="p-4 bg-secondary/10 border-secondary/20">
              <div className="flex items-center justify-between">
                <span className="font-medium">Total Price:</span>
                <span className="text-2xl font-bold text-secondary">{getPrice()}</span>
              </div>
            </Card>

            {/* Important Notice */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-medium text-blue-900">Approval Required</p>
                  <p className="text-blue-700 mt-0.5">
                    Your booking will be reviewed by an administrator. You'll be notified once approved.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Confirm Booking
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
