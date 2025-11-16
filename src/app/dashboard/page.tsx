'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Plus,
  Bell,
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
}

export default function UserDashboard() {
  const [userName, setUserName] = useState('User')
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    thisMonth: 0
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    const supabase = createClient()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch user name
      const { data: userData } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', user.id)
        .single()

      if (userData) {
        const firstName = userData.full_name?.split(' ')[0] || 'User'
        setUserName(firstName)
      }

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
        .order('booking_date', { ascending: true })

      // Fetch sand school bookings
      const { data: sandSchoolData } = await supabase
        .from('sand_school_bookings')
        .select('id, booking_date, start_time, status, duration_minutes')
        .eq('user_id', user.id)
        .order('booking_date', { ascending: true })

      // Transform and combine bookings
      const horseCareBookings: Booking[] = (horseCareData || []).map((booking: any) => {
        const service = Array.isArray(booking.services) ? booking.services[0] : booking.services
        return {
          id: booking.id,
          service: service?.name || 'Horse Care',
          horse: booking.horse_name,
          date: booking.booking_date,
          time: '09:00',
          status: booking.status as 'PENDING' | 'APPROVED' | 'DENIED'
        }
      })

      const sandSchoolBookings: Booking[] = (sandSchoolData || []).map(booking => ({
        id: booking.id,
        service: `Sand School (${booking.duration_minutes}min)`,
        horse: 'N/A',
        date: booking.booking_date,
        time: booking.start_time,
        status: booking.status as 'PENDING' | 'APPROVED' | 'DENIED'
      }))

      const allBookings = [...horseCareBookings, ...sandSchoolBookings]

      // Filter for upcoming bookings (future dates only)
      const today = new Date().toISOString().split('T')[0]
      const upcoming = allBookings
        .filter(b => b.date >= today && (b.status === 'APPROVED' || b.status === 'PENDING'))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3)

      setUpcomingBookings(upcoming)

      // Calculate stats
      const pending = allBookings.filter(b => b.status === 'PENDING').length
      const approved = allBookings.filter(b => b.status === 'APPROVED').length

      // This month bookings
      const now = new Date()
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
      const thisMonth = allBookings.filter(b => b.date >= firstDayOfMonth && b.date <= lastDayOfMonth).length

      setStats({ pending, approved, thisMonth })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">Welcome back, {userName}! 👋</h1>
        <p className="text-muted-foreground">
          Manage your bookings and schedule your next visit to the stable.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg bg-secondary/20">
              <Sparkles className="h-6 w-6 text-secondary" />
            </div>
          </div>
          <h3 className="font-heading text-xl font-semibold mb-2">Book Horse Care</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Book grooming or mucking out services for your horse
          </p>
          <Button asChild className="w-full">
            <Link href="/dashboard/bookings/horse-care">
              <Plus className="mr-2 h-4 w-4" />
              Book Service
            </Link>
          </Button>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg bg-primary/20">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="font-heading text-xl font-semibold mb-2">Book Sand School</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Reserve sand school time slots (30 min or 1 hour)
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard/bookings/sand-school">
              <Plus className="mr-2 h-4 w-4" />
              Book Slot
            </Link>
          </Button>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{loading ? '-' : stats.pending}</p>
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
              <p className="text-2xl font-bold">{loading ? '-' : stats.approved}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold">{loading ? '-' : stats.thisMonth}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Upcoming Bookings */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl font-semibold">Upcoming Bookings</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/bookings">View All</Link>
            </Button>
          </div>

          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="flex items-center gap-4 border-b pb-4 last:border-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  {booking.service === 'Sand School' ? (
                    <Calendar className="h-6 w-6 text-secondary" />
                  ) : (
                    <Sparkles className="h-6 w-6 text-secondary" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{booking.service}</p>
                    {booking.status === 'APPROVED' ? (
                      <Badge className="bg-green-100 text-green-700">Approved</Badge>
                    ) : (
                      <Badge className="bg-orange-100 text-orange-700">Pending</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {booking.horse !== 'N/A' && `${booking.horse} • `}{booking.date} at {booking.time}
                  </p>
                </div>
              </div>
            ))}

            {upcomingBookings.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No upcoming bookings</p>
              </div>
            )}
          </div>
        </Card>

        {/* Quick Info */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-600">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold mb-1">Important Information</h2>
              <p className="text-sm text-muted-foreground">
                Everything you need to know about your bookings
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-white rounded-lg border">
              <p className="text-sm font-medium mb-1">Booking Approval</p>
              <p className="text-xs text-muted-foreground">
                All bookings require admin approval. You'll be notified once reviewed.
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg border">
              <p className="text-sm font-medium mb-1">Sand School Hours</p>
              <p className="text-xs text-muted-foreground">
                Open daily from 8:00 AM to 6:00 PM. Book 30-minute or 1-hour slots.
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg border">
              <p className="text-sm font-medium mb-1">Horse Care Services</p>
              <p className="text-xs text-muted-foreground">
                Grooming (£10) and Mucking Out (£10) services available daily.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Important Notice */}
      <Card className="mt-6 p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900">Booking Approval Required</p>
            <p className="text-sm text-blue-700 mt-1">
              All bookings require admin approval. You'll receive a notification once your booking has been reviewed.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
