'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import {
  Calendar,
  Sparkles,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  ArrowLeft,
  Loader2
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Booking {
  id: string
  service: string
  horse: string
  date: string
  time: string
  status: 'PENDING' | 'APPROVED' | 'DENIED'
  price: string
  type: 'horse_care' | 'sand_school'
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    const supabase = createClient()

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch horse care bookings
      const { data: horseCareData } = await supabase
        .from('horse_care_bookings')
        .select(`
          id,
          booking_date,
          status,
          horse_name,
          services (name, price)
        `)
        .eq('user_id', user.id)
        .order('booking_date', { ascending: false })

      // Fetch sand school bookings
      const { data: sandSchoolData } = await supabase
        .from('sand_school_bookings')
        .select('id, booking_date, start_time, status, price, duration_minutes, yard')
        .eq('user_id', user.id)
        .order('booking_date', { ascending: false })

      // Transform horse care bookings
      const horseCareBookings: Booking[] = (horseCareData || []).map((booking: any) => {
        const service = Array.isArray(booking.services) ? booking.services[0] : booking.services
        return {
          id: booking.id,
          service: service?.name || 'Horse Care',
          horse: booking.horse_name,
          date: booking.booking_date,
          time: '09:00', // Could be enhanced with actual time if stored
          status: booking.status as 'PENDING' | 'APPROVED' | 'DENIED',
          price: `£${service?.price || 0}`,
          type: 'horse_care' as const
        }
      })

      // Transform sand school bookings
      const sandSchoolBookings: Booking[] = (sandSchoolData || []).map(booking => ({
        id: booking.id,
        service: `Sand School - ${booking.yard === 'GREENACHERS' ? 'Greenachers' : 'Merydown'} (${booking.duration_minutes}min)`,
        horse: 'N/A',
        date: booking.booking_date,
        time: booking.start_time,
        status: booking.status as 'PENDING' | 'APPROVED' | 'DENIED',
        price: `£${booking.price}`,
        type: 'sand_school' as const
      }))

      // Combine and sort by date
      const allBookings = [...horseCareBookings, ...sandSchoolBookings].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )

      setBookings(allBookings)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const pendingBookings = bookings.filter(b => b.status === 'PENDING')
  const approvedBookings = bookings.filter(b => b.status === 'APPROVED')
  const deniedBookings = bookings.filter(b => b.status === 'DENIED')

  const renderBooking = (booking: Booking) => (
    <div key={booking.id} className="flex items-center gap-4 border-b pb-4 last:border-0">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
        {booking.type === 'sand_school' ? (
          <Calendar className="h-6 w-6 text-secondary" />
        ) : (
          <Sparkles className="h-6 w-6 text-secondary" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium">{booking.service}</p>
          <Badge variant="outline" className="text-xs">{booking.price}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {booking.horse !== 'N/A' && `${booking.horse} • `}{booking.date} at {booking.time}
        </p>
      </div>
      <div>
        {booking.status === 'APPROVED' && (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )}
        {booking.status === 'PENDING' && (
          <Badge className="bg-orange-100 text-orange-700">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )}
        {booking.status === 'DENIED' && (
          <Badge className="bg-red-100 text-red-700">
            <XCircle className="h-3 w-3 mr-1" />
            Denied
          </Badge>
        )}
      </div>
    </div>
  )

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold mb-2">My Bookings</h1>
            <p className="text-muted-foreground">
              View and manage all your booking requests
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/dashboard/bookings/horse-care">
                <Plus className="h-4 w-4 mr-2" />
                Book Horse Care
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/bookings/sand-school">
                <Plus className="h-4 w-4 mr-2" />
                Book Sand School
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{pendingBookings.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold">{approvedBookings.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Denied</p>
              <p className="text-2xl font-bold">{deniedBookings.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Loading State */}
      {loading && (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-3" />
            <p>Loading your bookings...</p>
          </div>
        </Card>
      )}

      {/* Bookings Tabs */}
      {!loading && (
        <Card className="p-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingBookings.length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({approvedBookings.length})</TabsTrigger>
              <TabsTrigger value="denied">Denied ({deniedBookings.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {bookings.length > 0 ? (
                bookings.map(renderBooking)
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No bookings yet</p>
                  <p className="text-sm mt-2">Get started by booking a service!</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {pendingBookings.length > 0 ? (
                pendingBookings.map(renderBooking)
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No pending bookings</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              {approvedBookings.length > 0 ? (
                approvedBookings.map(renderBooking)
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No approved bookings</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="denied" className="space-y-4">
              {deniedBookings.length > 0 ? (
                deniedBookings.map(renderBooking)
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <XCircle className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No denied bookings</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  )
}
