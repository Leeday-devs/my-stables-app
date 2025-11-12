import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search, UserPlus, MoreVertical, CheckCircle, XCircle } from 'lucide-react'

export default function UsersPage() {
  const users = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.j@email.com', status: 'ACTIVE', joined: '2025-10-15' },
    { id: 2, name: 'John Smith', email: 'john.s@email.com', status: 'ACTIVE', joined: '2025-10-20' },
    { id: 3, name: 'Mike Peters', email: 'mike.p@email.com', status: 'PENDING_APPROVAL', joined: '2025-11-04' },
    { id: 4, name: 'Emma Wilson', email: 'emma.w@email.com', status: 'PENDING_APPROVAL', joined: '2025-11-05' },
    { id: 5, name: 'Lisa Brown', email: 'lisa.b@email.com', status: 'ACTIVE', joined: '2025-10-28' },
  ]

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="font-serif text-2xl md:text-3xl font-bold mb-2">User Management</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Manage user accounts, approve registrations, and view user activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 mb-6 max-w-lg md:max-w-none">
        <Card className="p-3">
          <p className="text-xs text-muted-foreground mb-1">Total Users</p>
          <p className="text-lg md:text-xl font-bold">{users.length}</p>
        </Card>
        <Card className="p-3 hidden md:block">
          <p className="text-xs text-muted-foreground mb-1">Active Users</p>
          <p className="text-lg md:text-xl font-bold">{users.filter(u => u.status === 'ACTIVE').length}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted-foreground mb-1">Pending Approval</p>
          <p className="text-lg md:text-xl font-bold text-orange-600">
            {users.filter(u => u.status === 'PENDING_APPROVAL').length}
          </p>
        </Card>
      </div>

      {/* Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-9" />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.status === 'ACTIVE' ? (
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  ) : (
                    <Badge className="bg-orange-100 text-orange-700">Pending</Badge>
                  )}
                </TableCell>
                <TableCell>{user.joined}</TableCell>
                <TableCell className="text-right">
                  {user.status === 'PENDING_APPROVAL' ? (
                    <div className="flex justify-end gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-200 text-red-600">
                        <XCircle className="h-4 w-4 mr-1" />
                        Deny
                      </Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
