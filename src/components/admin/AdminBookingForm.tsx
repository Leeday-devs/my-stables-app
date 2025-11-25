'use client'

import { useState, useEffect } from 'react'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Calendar, Clock, Loader2, CheckCircle2, User, UserPlus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'
import { User as UserType, Service } from '@/types'

type BookingType = 'SAND_SCHOOL' | 'HORSE_CARE'
type CustomerType = 'existing' | 'walk-in'

interface AdminBookingFormProps {
  bookingType: BookingType
  onSuccess?: () => void
}

export function AdminBookingForm({ bookingType, onSuccess }: AdminBookingFormProps) {
  const [customerType, setCustomerType] = useState<CustomerType>('existing')
  const [users, setUsers] = useState<UserType[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [loadingServices, setLoadingServices] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  // Form fields for existing user
  const [selectedUserId, setSelectedUserId] = useState('')

  // Form fields for walk-in customer
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')

  // Common fields
  const [bookingDate, setBookingDate] = useState('')

  // Sand school specific fields
  const [yard, setYard] = useState<'GREENACHERS' | 'MERYDOWN'>('GREENACHERS')
  const [startTime, setStartTime] = useState('')
  const [duration, setDuration] = useState('')
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  // Horse care specific fields
  const [horseName, setHorseName] = useState('')
  const [serviceId, setServiceId] = useState('')

  // Fetch users on mount
  useEffect(() => {
    fetchUsers()
    if (bookingType === 'HORSE_CARE') {
      fetchServices()
    }
  }, [bookingType])

  // Fetch available slots when sand school fields change
  useEffect(() => {
    if (bookingType === 'SAND_SCHOOL' && bookingDate && duration) {
      fetchAvailableSlots()
    }
  }, [bookingDate, duration, yard, bookingType])

  const fetchUsers = async () => {
    setLoadingUsers(true)
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('status', 'ACTIVE')
        .order('full_name', { ascending: true })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      })
    } finally {
      setLoadingUsers(false)
    }
  }

  const fetchServices = async () => {
    setLoadingServices(true)
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('active', true)
        .order('name', { ascending: true })

      if (error) throw error
      setServices(data || [])
    } catch (error) {
      console.error('Error fetching services:', error)
      toast({
        title: 'Error',
        description: 'Failed to load services',
        variant: 'destructive',
      })
    } finally {
      setLoadingServices(false)
    }
  }

  const fetchAvailableSlots = async () => {
    setLoadingSlots(true)
    setStartTime('')

    try {
      const response = await fetch(
        `/api/bookings/sand-school?date=${bookingDate}&duration=${duration}&yard=${yard}`
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
        description: 'Failed to load available time slots',
        variant: 'destructive',
      })
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate customer selection
    if (customerType === 'existing' && !selectedUserId) {
      toast({
        title: 'Missing Information',
        description: 'Please select a customer',
        variant: 'destructive',
      })
      return
    }

    if (customerType === 'walk-in' && (!customerName || !customerPhone)) {
      toast({
        title: 'Missing Information',
        description: 'Please provide customer name and phone number',
        variant: 'destructive',
      })
      return
    }

    // Validate booking-specific fields
    if (bookingType === 'SAND_SCHOOL') {
      if (!bookingDate || !startTime || !duration || !yard) {
        toast({
          title: 'Missing Information',
          description: 'Please fill in all sand school booking fields',
          variant: 'destructive',
        })
        return
      }
    } else {
      if (!horseName || !serviceId || !bookingDate) {
        toast({
          title: 'Missing Information',
          description: 'Please fill in all horse care booking fields',
          variant: 'destructive',
        })
        return
      }
    }

    setSubmitting(true)

    try {
      const requestBody: any = {
        booking_type: bookingType,
        user_id: customerType === 'existing' ? selectedUserId : null,
        customer_name: customerType === 'walk-in' ? customerName : null,
        customer_phone: customerType === 'walk-in' ? customerPhone : null,
        is_walk_in: customerType === 'walk-in',
      }

      if (bookingType === 'SAND_SCHOOL') {
        requestBody.yard = yard
        requestBody.booking_date = bookingDate
        requestBody.start_time = startTime
        requestBody.duration_minutes = Number(duration)
      } else {
        requestBody.horse_name = horseName
        requestBody.service_id = serviceId
        requestBody.booking_date = bookingDate
      }

      const response = await fetch('/api/admin/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking')
      }

      toast({
        title: 'Success!',
        description: `${bookingType === 'SAND_SCHOOL' ? 'Sand school' : 'Horse care'} booking created successfully`,
      })

      // Reset form
      resetForm()

      // Call success callback
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      toast({
        title: 'Booking Failed',
        description: error instanceof Error ? error.message : 'Failed to create booking',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setSelectedUserId('')
    setCustomerName('')
    setCustomerPhone('')
    setBookingDate('')
    setStartTime('')
    setDuration('')
    setHorseName('')
    setServiceId('')
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Type Selection */}
        <div className="space-y-3">
          <Label>Customer Type *</Label>
          <RadioGroup value={customerType} onValueChange={(value) => setCustomerType(value as CustomerType)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="existing" id="existing" />
              <Label htmlFor="existing" className="flex items-center gap-2 font-normal cursor-pointer">
                <User className="h-4 w-4" />
                Existing Customer
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="walk-in" id="walk-in" />
              <Label htmlFor="walk-in" className="flex items-center gap-2 font-normal cursor-pointer">
                <UserPlus className="h-4 w-4" />
                Walk-in Customer
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Existing Customer Selection */}
        {customerType === 'existing' && (
          <div className="space-y-2">
            <Label htmlFor="user">Select Customer *</Label>
            {loadingUsers ? (
              <div className="p-4 border rounded-lg flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading customers...</span>
              </div>
            ) : (
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a customer" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name || user.email} {user.phone ? `(${user.phone})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {/* Walk-in Customer Fields */}
        {customerType === 'walk-in' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="customer-name">Customer Name *</Label>
              <Input
                id="customer-name"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-phone">Customer Phone *</Label>
              <Input
                id="customer-phone"
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Enter phone number"
                required
              />
            </div>
          </>
        )}

        {/* Sand School Booking Fields */}
        {bookingType === 'SAND_SCHOOL' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="yard">Select Sand School *</Label>
              <Select value={yard} onValueChange={(value: 'GREENACHERS' | 'MERYDOWN') => setYard(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GREENACHERS">Greenachers</SelectItem>
                  <SelectItem value="MERYDOWN">Merydown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Booking Date *</Label>
              <Input
                id="date"
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration *</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes (£2.50)</SelectItem>
                  <SelectItem value="60">1 hour (£5.00)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Available Time Slots */}
            <div className="space-y-2">
              <Label>Available Time Slots *</Label>
              {!bookingDate || !duration ? (
                <div className="p-4 border rounded-lg text-center text-muted-foreground text-sm">
                  Please select a date and duration to view available time slots
                </div>
              ) : loadingSlots ? (
                <div className="p-8 border rounded-lg flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading available slots...</span>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="p-4 border rounded-lg text-center text-sm bg-red-50 border-red-200 text-red-900">
                  No available time slots for this date and duration
                </div>
              ) : (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2 max-h-64 overflow-y-auto p-2 border rounded-lg">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot}
                      type="button"
                      variant={startTime === slot ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs"
                      onClick={() => setStartTime(slot)}
                    >
                      {startTime === slot && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {slot}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Horse Care Booking Fields */}
        {bookingType === 'HORSE_CARE' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="horse-name">Horse Name *</Label>
              <Input
                id="horse-name"
                type="text"
                value={horseName}
                onChange={(e) => setHorseName(e.target.value)}
                placeholder="Enter horse name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Select Service *</Label>
              {loadingServices ? (
                <div className="p-4 border rounded-lg flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading services...</span>
                </div>
              ) : (
                <Select value={serviceId} onValueChange={setServiceId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} - £{service.price} ({service.duration_minutes} min)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="booking-date">Booking Date *</Label>
              <Input
                id="booking-date"
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </>
        )}

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="flex-1"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Booking...
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Create Booking (Auto-Approved)
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            disabled={submitting}
          >
            Clear Form
          </Button>
        </div>
      </form>
    </Card>
  )
}
