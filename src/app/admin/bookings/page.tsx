'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CheckCircle, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface HorseCareBooking {
  id: string
  user: string
  service: string
  horse: string
  date: string
  time: string
  price: string
  isWalkIn: boolean
}

interface SandSchoolBooking {
  id: string
  user: string
  time: string
  date: string
  price: string
  yard: string
  isWalkIn: boolean
}

export default function BookingsPage() {
  const [horseCareBookings, setHorseCareBookings] = useState<HorseCareBooking[]>([])
  const [sandSchoolBookings, setSandSchoolBookings] = useState<SandSchoolBooking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    const supabase = createClient()

    try {
      // Fetch approved horse care bookings
      const { data: horseCareData } = await supabase
        .from('horse_care_bookings')
        .select(`
          id,
          booking_date,
          horse_name,
          user_id,
          is_walk_in,
          customer_name,
          users (full_name),
          services (name, price)
        `)
        .eq('status', 'APPROVED')
        .order('booking_date', { ascending: false })

      // Fetch approved sand school bookings
      const { data: sandSchoolData } = await supabase
        .from('sand_school_bookings')
        .select(`
          id,
          booking_date,
          start_time,
          duration_minutes,
          price,
          yard,
          user_id,
          is_walk_in,
          customer_name,
          users (full_name)
        `)
        .eq('status', 'APPROVED')
        .order('booking_date', { ascending: false })

      // Transform horse care bookings
      const transformedHorseCare: HorseCareBooking[] = (horseCareData || []).map((booking: any) => {
        const user = Array.isArray(booking.users) ? booking.users[0] : booking.users
        const service = Array.isArray(booking.services) ? booking.services[0] : booking.services
        return {
          id: booking.id,
          user: booking.is_walk_in ? `${booking.customer_name} (Walk-in)` : (user?.full_name || 'Unknown User'),
          service: service?.name || 'Horse Care',
          horse: booking.horse_name,
          date: booking.booking_date,
          time: '09:00', // Default time for horse care
          price: `£${service?.price || 0}`,
          isWalkIn: booking.is_walk_in || false
        }
      })

      // Transform sand school bookings
      const transformedSandSchool: SandSchoolBooking[] = (sandSchoolData || []).map((booking: any) => {
        const user = Array.isArray(booking.users) ? booking.users[0] : booking.users
        const endTime = calculateEndTime(booking.start_time, booking.duration_minutes)
        return {
          id: booking.id,
          user: booking.is_walk_in ? `${booking.customer_name} (Walk-in)` : (user?.full_name || 'Unknown User'),
          time: `${booking.start_time}-${endTime}`,
          date: booking.booking_date,
          price: `£${booking.price}`,
          yard: booking.yard === 'GREENACHERS' ? 'Greenachers' : 'Merydown',
          isWalkIn: booking.is_walk_in || false
        }
      })

      setHorseCareBookings(transformedHorseCare)
      setSandSchoolBookings(transformedSandSchool)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + durationMinutes
    const endHours = Math.floor(totalMinutes / 60)
    const endMinutes = totalMinutes % 60
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">Confirmed Bookings</h1>
        <p className="text-muted-foreground">
          View all approved bookings for horse care services and sand school.
        </p>
      </div>

      {loading ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-3" />
            <p>Loading bookings...</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Horse Care Bookings */}
          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h2 className="font-heading text-xl font-semibold">Horse Care Bookings</h2>
            </div>
            <div className="overflow-x-auto">
              {horseCareBookings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No approved horse care bookings yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Horse</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {horseCareBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.user}</TableCell>
                        <TableCell>{booking.service}</TableCell>
                        <TableCell>{booking.horse}</TableCell>
                        <TableCell>{booking.date}</TableCell>
                        <TableCell>{booking.time}</TableCell>
                        <TableCell>{booking.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </Card>

          {/* Sand School Bookings */}
          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h2 className="font-heading text-xl font-semibold">Sand School Bookings</h2>
            </div>
            <div className="overflow-x-auto">
              {sandSchoolBookings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No approved sand school bookings yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Yard</TableHead>
                      <TableHead>Time Slot</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sandSchoolBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.user}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{booking.yard}</Badge>
                        </TableCell>
                        <TableCell>{booking.time}</TableCell>
                        <TableCell>{booking.date}</TableCell>
                        <TableCell>{booking.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
