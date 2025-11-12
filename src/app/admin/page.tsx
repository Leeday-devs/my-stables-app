import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

export default function AdminDashboard() {
  // Mock data - will be replaced with real Supabase data
  const stats = [
    {
      name: 'Pending Users',
      value: '3',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '+2 this week'
    },
    {
      name: 'Pending Bookings',
      value: '8',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+5 today'
    },
    {
      name: 'Revenue This Month',
      value: '£485',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+12% from last month'
    },
    {
      name: 'Active Users',
      value: '24',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+3 this month'
    },
  ]

  const pendingUsers = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.j@email.com', date: '2025-11-03' },
    { id: 2, name: 'Mike Peters', email: 'mike.p@email.com', date: '2025-11-04' },
    { id: 3, name: 'Emma Wilson', email: 'emma.w@email.com', date: '2025-11-05' },
  ]

  const pendingBookings = [
    { id: 1, user: 'John Smith', service: 'Grooming', horse: 'Thunder', date: '2025-11-06', price: '£10' },
    { id: 2, user: 'Lisa Brown', service: 'Mucking Out', horse: 'Star', date: '2025-11-06', price: '£10' },
    { id: 3, user: 'Tom Davis', service: 'Sand School', horse: 'N/A', date: '2025-11-07', price: '£5' },
    { id: 4, user: 'Anna Clark', service: 'Grooming', horse: 'Spirit', date: '2025-11-07', price: '£10' },
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
        {stats.map((stat) => (
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
            {pendingUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary font-semibold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-1 sm:gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 px-2 sm:px-3">
                    <CheckCircle className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Approve</span>
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 px-2 sm:px-3">
                    <XCircle className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Deny</span>
                  </Button>
                </div>
              </div>
            ))}
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
            {pendingBookings.slice(0, 4).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{booking.service}</p>
                    <Badge variant="outline" className="text-xs">{booking.price}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {booking.user} • {booking.horse !== 'N/A' ? `${booking.horse} • ` : ''}{booking.date}
                  </p>
                </div>
                <div className="flex gap-1 sm:gap-2 shrink-0">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0">
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 h-8 w-8 p-0">
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6 mt-6">
        <h2 className="font-heading text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3 pb-4 border-b">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Booking Approved</p>
              <p className="text-sm text-muted-foreground">
                You approved grooming for Thunder by Sarah Johnson
              </p>
              <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3 pb-4 border-b">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">New User Registration</p>
              <p className="text-sm text-muted-foreground">
                Emma Wilson registered and is pending approval
              </p>
              <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
              <Calendar className="h-4 w-4 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Sand School Booked</p>
              <p className="text-sm text-muted-foreground">
                Tom Davis booked sand school for tomorrow 2-3pm
              </p>
              <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
