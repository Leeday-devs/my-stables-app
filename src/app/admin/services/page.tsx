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
import { Plus } from 'lucide-react'
import { getAllServices } from '@/lib/actions/services'
import { formatDuration } from '@/lib/utils/duration'
import ServiceActionsCell from '@/components/admin/ServiceActionsCell'
import ServiceFormDialog from '@/components/admin/ServiceFormDialog'

export default async function ServicesPage() {
  const services = await getAllServices()

  const activeCount = services.filter(s => s.active).length
  const inactiveCount = services.filter(s => !s.active).length

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold mb-2">Service Management</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage horse care services offered to clients.
          </p>
        </div>
        <ServiceFormDialog>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Service
          </Button>
        </ServiceFormDialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 mb-6 max-w-lg md:max-w-none">
        <Card className="p-3">
          <p className="text-xs text-muted-foreground mb-1">Total Services</p>
          <p className="text-lg md:text-xl font-bold">{services.length}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted-foreground mb-1">Active</p>
          <p className="text-lg md:text-xl font-bold text-green-600">{activeCount}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted-foreground mb-1">Inactive</p>
          <p className="text-lg md:text-xl font-bold text-orange-600">{inactiveCount}</p>
        </Card>
      </div>

      {/* Table */}
      <Card className="p-6">
        {services.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="mb-4">No services found</p>
            <ServiceFormDialog>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Service
              </Button>
            </ServiceFormDialog>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">
                      {service.name}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {service.description || '-'}
                    </TableCell>
                    <TableCell>
                      {formatDuration(service.duration_minutes)}
                    </TableCell>
                    <TableCell className="font-semibold">
                      £{Number(service.price).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {service.active ? (
                        <Badge className="bg-green-100 text-green-700">Active</Badge>
                      ) : (
                        <Badge className="bg-orange-100 text-orange-700">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <ServiceActionsCell service={service} />
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
