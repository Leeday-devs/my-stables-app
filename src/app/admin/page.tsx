import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { getPendingUsers, getPendingBookings, getAdminStats } from '@/lib/actions/admin'
import PendingUserCard from '@/components/admin/PendingUserCard'
import PendingBookingCard from '@/components/admin/PendingBookingCard'

export default async function AdminDashboard() {
  // Fetch real data from Supabase
  const [pendingUsers, pendingBookings, stats] = await Promise.all([
    getPendingUsers(),
    getPendingBookings(),
    getAdminStats()
  ])

  const statsDisplay = [
    {
      name: 'Pending Users',
      value: stats.pendingUsers.toString(),
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: `${pendingUsers.length} waiting`
    },
    {
      name: 'Pending Bookings',
      value: stats.pendingBookings.toString(),
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: 'Need review'
    },
    {
      name: 'Revenue This Month',
      value: `£${stats.monthlyRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: 'From approved bookings'
    },
    {
      name: 'Active Users',
      value: stats.activeUsers.toString(),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: 'Approved accounts'
    },
  ]

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your stable today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8 max-w-2xl">
        {statsDisplay.map((stat) => (
          <Card key={stat.name} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">{stat.name}</p>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Pending Approvals */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        {/* Pending User Registrations */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading text-xl font-semibold">Pending User Approvals</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {pendingUsers.length} users waiting for approval
              </p>
            </div>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              {pendingUsers.length} Pending
            </Badge>
          </div>

          <div className="space-y-4">
            {pendingUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <p>No pending user approvals</p>
              </div>
            ) : (
              pendingUsers.map((user) => (
                <PendingUserCard key={user.id} user={user} />
              ))
            )}
          </div>
        </Card>

        {/* Pending Bookings */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading text-xl font-semibold">Pending Bookings</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {pendingBookings.length} bookings awaiting approval
              </p>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {pendingBookings.length} Pending
            </Badge>
          </div>

          <div className="space-y-4">
            {pendingBookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <p>No pending bookings</p>
              </div>
            ) : (
              pendingBookings.slice(0, 4).map((booking) => (
                <PendingBookingCard key={booking.id} booking={booking} />
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6 mt-6">
        <h2 className="font-heading text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {pendingUsers.length === 0 && pendingBookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-2" />
              <p>No recent activity to display</p>
            </div>
          ) : (
            <>
              {pendingUsers.slice(0, 2).map((user) => (
                <div key={user.id} className="flex items-start gap-3 pb-4 border-b">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New User Registration</p>
                    <p className="text-sm text-muted-foreground">
                      {user.full_name || user.email} registered and is pending approval
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {pendingBookings.slice(0, 1).map((booking) => (
                <div key={booking.id} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                    <Calendar className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New Booking Request</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.user} requested {booking.service}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(booking.requestedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
