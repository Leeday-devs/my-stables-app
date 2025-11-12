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
import { Calendar, Clock, AlertCircle } from 'lucide-react'
import { useState } from 'react'

export default function SandSchoolBookingPage() {
  const [selectedDate, setSelectedDate] = useState('')
  const [duration, setDuration] = useState('')

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00'
  ]

  const getPrice = () => {
    if (duration === '30') return '£2.50'
    if (duration === '60') return '£5.00'
    return '-'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Sand school booking request submitted!')
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">Book Sand School</h1>
        <p className="text-muted-foreground">
          Reserve sand school time slots (30 minutes or 1 hour).
        </p>
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
                <Label>Available Time Slots</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-96 overflow-y-auto p-2 border rounded-lg">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Click a time slot to select it (feature coming soon)
                </p>
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
                <Button type="submit" className="flex-1" disabled={!selectedDate || !duration}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Submit Booking Request
                </Button>
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
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
                <span className="text-primary">•</span>
                <span>Open daily from 8:00 AM to 6:00 PM</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>30-minute and 1-hour slots available</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Real-time availability checking</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>No double bookings guaranteed</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
