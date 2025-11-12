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
  Bell
} from 'lucide-react'

export default function UserDashboard() {
  const upcomingBookings = [
    { id: 1, service: 'Grooming', horse: 'Thunder', date: '2025-11-06', time: '10:00', status: 'APPROVED' },
    { id: 2, service: 'Sand School', horse: 'N/A', date: '2025-11-08', time: '14:00', status: 'PENDING' },
  ]

  const recentNotifications = [
    { id: 1, message: 'Your grooming booking for Thunder has been approved by Lizzie', time: '2 hours ago', type: 'success' },
    { id: 2, message: 'Welcome to My Stables! Your account has been activated', time: '1 day ago', type: 'info' },
  ]

  return (
    <div className="p-4 md:p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">Welcome back, Sarah! 👋</h1>
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
              <p className="text-2xl font-bold">1</p>
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
              <p className="text-2xl font-bold">5</p>
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
              <p className="text-2xl font-bold">8</p>
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

        {/* Recent Notifications */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl font-semibold">Recent Notifications</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/notifications">
                <Bell className="h-4 w-4 mr-1" />
                View All
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {recentNotifications.map((notification) => (
              <div key={notification.id} className="flex gap-3 border-b pb-4 last:border-0">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  notification.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {notification.type === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Bell className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                </div>
              </div>
            ))}
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
