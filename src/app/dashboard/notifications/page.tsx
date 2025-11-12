import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  CheckCircle,
  XCircle,
  Bell,
  Info,
  AlertCircle,
  ArrowLeft,
  Trash2
} from 'lucide-react'

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Booking Approved',
      message: 'Your grooming booking for Thunder has been approved by Lizzie',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'error',
      title: 'Booking Denied',
      message: 'Your sand school booking for 2025-11-05 at 3pm was denied. The time slot is no longer available.',
      time: '5 hours ago',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Account Activated',
      message: 'Welcome to My Stables! Your account has been activated by an administrator.',
      time: '1 day ago',
      read: true
    },
    {
      id: 4,
      type: 'success',
      title: 'Booking Approved',
      message: 'Your mucking out booking for Thunder has been approved',
      time: '2 days ago',
      read: true
    },
    {
      id: 5,
      type: 'warning',
      title: 'Booking Reminder',
      message: 'You have a grooming appointment tomorrow at 10:00 AM for Thunder',
      time: '3 days ago',
      read: true
    },
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-orange-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getNotificationBg = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100'
      case 'error':
        return 'bg-red-100'
      case 'warning':
        return 'bg-orange-100'
      default:
        return 'bg-blue-100'
    }
  }

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
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-serif text-3xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              Stay updated with your booking status and account activity
            </p>
          </div>
          <Button variant="outline" size="sm">
            Mark All as Read
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100">
              <Bell className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unread</p>
              <p className="text-2xl font-bold">{unreadCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{notifications.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`p-4 transition-all ${
              !notification.read ? 'border-l-4 border-l-secondary shadow-sm' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getNotificationBg(notification.type)} shrink-0`}>
                {getNotificationIcon(notification.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{notification.title}</h3>
                    {!notification.read && (
                      <Badge className="bg-secondary text-secondary-foreground text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {notification.time}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {notification.message}
                </p>
                <div className="flex gap-2">
                  {!notification.read && (
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      Mark as Read
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {notifications.length === 0 && (
          <Card className="p-12">
            <div className="text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="text-lg font-medium mb-1">No notifications</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
