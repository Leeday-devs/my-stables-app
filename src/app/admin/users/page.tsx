import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search } from 'lucide-react'
import { getAllUsers } from '@/lib/actions/admin'
import UserActionsCell from '@/components/admin/UserActionsCell'

export default async function UsersPage() {
  const users = await getAllUsers()

  const activeCount = users.filter(u => u.status === 'ACTIVE').length
  const pendingCount = users.filter(u => u.status === 'PENDING_APPROVAL').length
  const suspendedCount = users.filter(u => u.status === 'SUSPENDED').length

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="font-serif text-2xl md:text-3xl font-bold mb-2">User Management</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Manage user accounts, approve registrations, and view user activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 mb-6 max-w-lg md:max-w-none">
        <Card className="p-3">
          <p className="text-xs text-muted-foreground mb-1">Total Users</p>
          <p className="text-lg md:text-xl font-bold">{users.length}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted-foreground mb-1">Active Users</p>
          <p className="text-lg md:text-xl font-bold text-green-600">{activeCount}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted-foreground mb-1">Pending Approval</p>
          <p className="text-lg md:text-xl font-bold text-orange-600">{pendingCount}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted-foreground mb-1">Suspended</p>
          <p className="text-lg md:text-xl font-bold text-red-600">{suspendedCount}</p>
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

        {users.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.full_name || 'No name'}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.status === 'ACTIVE' ? (
                        <Badge className="bg-green-100 text-green-700">Active</Badge>
                      ) : user.status === 'SUSPENDED' ? (
                        <Badge className="bg-red-100 text-red-700">Suspended</Badge>
                      ) : (
                        <Badge className="bg-orange-100 text-orange-700">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.role === 'ADMIN' ? (
                        <Badge variant="secondary">Admin</Badge>
                      ) : (
                        <Badge variant="outline">User</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <UserActionsCell user={user} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  )
}
