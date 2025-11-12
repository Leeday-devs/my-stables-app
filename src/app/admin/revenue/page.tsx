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
import { DollarSign, TrendingUp, TrendingDown, CheckCircle, XCircle } from 'lucide-react'

export default function RevenuePage() {
  const adminRevenue = [
    { admin: 'Lizzie', accepted: 3, denied: 0, earnings: 30, lostRevenue: 0 },
    { admin: 'Jo', accepted: 2, denied: 1, earnings: 20, lostRevenue: 10 },
    { admin: 'Admin User (You)', accepted: 5, denied: 2, earnings: 50, lostRevenue: 20 },
  ]

  const revenueByService = [
    { service: 'Grooming', bookings: 7, revenue: 70 },
    { service: 'Mucking Out', bookings: 3, revenue: 30 },
    { service: 'Sand School', bookings: 5, revenue: 25 },
  ]

  const totalEarnings = adminRevenue.reduce((sum, admin) => sum + admin.earnings, 0)
  const totalLost = adminRevenue.reduce((sum, admin) => sum + admin.lostRevenue, 0)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">Revenue Tracking</h1>
        <p className="text-muted-foreground">
          Track earnings, monitor performance, and analyze revenue by admin and service.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-100">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <p className="text-2xl font-bold">£{totalEarnings}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-red-100">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lost Revenue</p>
              <p className="text-2xl font-bold text-red-600">£{totalLost}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold">
                {adminRevenue.reduce((sum, admin) => sum + admin.accepted, 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-orange-100">
              <XCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Denied</p>
              <p className="text-2xl font-bold">
                {adminRevenue.reduce((sum, admin) => sum + admin.denied, 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Admin Revenue Breakdown */}
      <Card className="p-6 mb-6">
        <h2 className="font-heading text-xl font-semibold mb-4">Revenue by Admin</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Track earnings and performance for each admin this month
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Admin</TableHead>
              <TableHead>Accepted Jobs</TableHead>
              <TableHead>Denied Jobs</TableHead>
              <TableHead>Earnings</TableHead>
              <TableHead>Lost Revenue</TableHead>
              <TableHead>Performance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminRevenue.map((admin) => (
              <TableRow key={admin.admin}>
                <TableCell className="font-medium">{admin.admin}</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-700">
                    {admin.accepted} jobs
                  </Badge>
                </TableCell>
                <TableCell>
                  {admin.denied > 0 ? (
                    <Badge variant="outline" className="text-orange-700">
                      {admin.denied} jobs
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">0 jobs</span>
                  )}
                </TableCell>
                <TableCell className="font-semibold text-green-600">£{admin.earnings}</TableCell>
                <TableCell className="text-red-600">
                  {admin.lostRevenue > 0 ? `£${admin.lostRevenue}` : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${(admin.accepted / (admin.accepted + admin.denied)) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {Math.round((admin.accepted / (admin.accepted + admin.denied)) * 100)}%
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm font-medium mb-2">Example Summary:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• <strong>Lizzie:</strong> accepted 3 grooming jobs this month at the price of £10 each earning £30 this month</li>
            <li>• <strong>Jo:</strong> accepted 2 jobs this month - denied one job all at £10 each earning £20 this month. Denied one job loss of revenue £10 this month</li>
          </ul>
        </div>
      </Card>

      {/* Revenue by Service */}
      <Card className="p-6">
        <h2 className="font-heading text-xl font-semibold mb-4">Revenue by Service</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Total Bookings</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Avg. per Booking</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {revenueByService.map((service) => (
              <TableRow key={service.service}>
                <TableCell className="font-medium">{service.service}</TableCell>
                <TableCell>{service.bookings}</TableCell>
                <TableCell className="font-semibold">£{service.revenue}</TableCell>
                <TableCell className="text-muted-foreground">
                  £{(service.revenue / service.bookings).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/50 font-semibold">
              <TableCell>Total</TableCell>
              <TableCell>
                {revenueByService.reduce((sum, s) => sum + s.bookings, 0)}
              </TableCell>
              <TableCell>
                £{revenueByService.reduce((sum, s) => sum + s.revenue, 0)}
              </TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm font-medium mb-2">Sand School Example:</p>
          <p className="text-sm text-muted-foreground">
            Sand school has been booked 5 times this month at £5 an hour earning £25 this month
          </p>
        </div>
      </Card>
    </div>
  )
}
