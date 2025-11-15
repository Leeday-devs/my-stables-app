'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Edit, Power, PowerOff, Trash2 } from 'lucide-react'
import { toggleServiceStatus, deleteService } from '@/lib/actions/services'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ServiceFormDialog from './ServiceFormDialog'

interface Service {
  id: string
  name: string
  description: string | null
  price: number
  duration_minutes: number
  active: boolean
}

interface ServiceActionsCellProps {
  service: Service
}

export default function ServiceActionsCell({ service }: ServiceActionsCellProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const router = useRouter()

  const handleToggleStatus = async () => {
    const action = service.active ? 'deactivate' : 'activate'
    if (!confirm(`Are you sure you want to ${action} "${service.name}"?`)) {
      return
    }

    setIsProcessing(true)
    const result = await toggleServiceStatus(service.id, service.active)

    if (result.success) {
      router.refresh()
    } else {
      alert(`Failed to ${action} service: ${result.error}`)
    }
    setIsProcessing(false)
  }

  const handleDelete = async () => {
    if (!confirm(`⚠️ WARNING: Are you sure you want to permanently delete "${service.name}"? This action cannot be undone.`)) {
      return
    }

    setIsProcessing(true)
    const result = await deleteService(service.id)

    if (result.success) {
      router.refresh()
    } else {
      alert(`Failed to delete service: ${result.error}`)
      setIsProcessing(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" disabled={isProcessing}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Service
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggleStatus}>
            {service.active ? (
              <>
                <PowerOff className="h-4 w-4 mr-2" />
                Deactivate
              </>
            ) : (
              <>
                <Power className="h-4 w-4 mr-2" />
                Activate
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Service
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ServiceFormDialog
        service={service}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </>
  )
}
