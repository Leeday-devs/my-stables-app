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
import { CheckCircle } from 'lucide-react'

export default function BookingsPage() {
  // Only showing approved bookings
  const horseCareBookings = [
    { id: 2, user: 'Lisa Brown', service: 'Mucking Out', horse: 'Star', date: '2025-11-06', time: '09:00', price: '£10' },
    { id: 4, user: 'Emma Wilson', service: 'Grooming', horse: 'Thunder', date: '2025-11-08', time: '10:30', price: '£10' },
    { id: 5, user: 'Mike Taylor', service: 'Mucking Out', horse: 'Spirit', date: '2025-11-09', time: '08:00', price: '£10' },
  ]

  const sandSchoolBookings = [
    { id: 2, user: 'Sarah Johnson', time: '10:00-10:30', date: '2025-11-08', price: '£2.50' },
    { id: 3, user: 'John Smith', time: '14:00-15:00', date: '2025-11-09', price: '£5' },
    { id: 4, user: 'Anna Clark', time: '11:00-12:00', date: '2025-11-10', price: '£5' },
  ]

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">Confirmed Bookings</h1>
        <p className="text-muted-foreground">
          View all approved bookings for horse care services and sand school.
        </p>
      </div>

      <div className="space-y-6">
        {/* Horse Care Bookings */}
        <Card className="p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h2 className="font-heading text-xl font-semibold">Horse Care Bookings</h2>
          </div>
          <div className="overflow-x-auto">
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
          </div>
        </Card>

        {/* Sand School Bookings */}
        <Card className="p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h2 className="font-heading text-xl font-semibold">Sand School Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Time Slot</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sandSchoolBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.user}</TableCell>
                    <TableCell>{booking.time}</TableCell>
                    <TableCell>{booking.date}</TableCell>
                    <TableCell>{booking.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  )
}
