'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CheckCircle, XCircle, MoreVertical, Ban, RefreshCw, Trash2 } from 'lucide-react'
import { approveUser, denyUser, suspendUser, reactivateUser, deleteUser } from '@/lib/actions/admin'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  full_name: string | null
  status: string
  role: string
}

interface UserActionsCellProps {
  user: User
}

export default function UserActionsCell({ user }: UserActionsCellProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const handleApprove = async () => {
    setIsProcessing(true)
    const result = await approveUser(user.id)

    if (result.success) {
      router.refresh()
    } else {
      alert(`Failed to approve user: ${result.error}`)
      setIsProcessing(false)
    }
  }

  const handleDeny = async () => {
    if (!confirm(`Are you sure you want to deny/suspend ${user.full_name || user.email}?`)) {
      return
    }

    setIsProcessing(true)
    const result = await denyUser(user.id)

    if (result.success) {
      router.refresh()
    } else {
      alert(`Failed to deny user: ${result.error}`)
      setIsProcessing(false)
    }
  }

  const handleSuspend = async () => {
    if (!confirm(`Are you sure you want to suspend ${user.full_name || user.email}? They will not be able to access the system.`)) {
      return
    }

    setIsProcessing(true)
    const result = await suspendUser(user.id)

    if (result.success) {
      router.refresh()
    } else {
      alert(`Failed to suspend user: ${result.error}`)
      setIsProcessing(false)
    }
  }

  const handleReactivate = async () => {
    if (!confirm(`Are you sure you want to reactivate ${user.full_name || user.email}?`)) {
      return
    }

    setIsProcessing(true)
    const result = await reactivateUser(user.id)

    if (result.success) {
      router.refresh()
    } else {
      alert(`Failed to reactivate user: ${result.error}`)
      setIsProcessing(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`⚠️ WARNING: Are you sure you want to permanently delete ${user.full_name || user.email}? This action cannot be undone and will remove all their data including bookings.`)) {
      return
    }

    // Double confirmation for safety
    if (!confirm(`This is your final confirmation. Type "DELETE" in your mind and click OK to permanently delete this user.`)) {
      return
    }

    setIsProcessing(true)
    const result = await deleteUser(user.id)

    if (result.success) {
      router.refresh()
    } else {
      alert(`Failed to delete user: ${result.error}`)
      setIsProcessing(false)
    }
  }

  if (user.status === 'PENDING_APPROVAL') {
    return (
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700"
          onClick={handleApprove}
          disabled={isProcessing}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-red-200 text-red-600"
          onClick={handleDeny}
          disabled={isProcessing}
        >
          <XCircle className="h-4 w-4 mr-1" />
          Deny
        </Button>
      </div>
    )
  }

  // For admins, don't show action menu
  if (user.role === 'ADMIN') {
    return (
      <div className="text-xs text-muted-foreground italic">
        Admin
      </div>
    )
  }

  // For active and suspended users, show dropdown menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isProcessing}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {user.status === 'ACTIVE' && (
          <DropdownMenuItem onClick={handleSuspend} className="text-orange-600">
            <Ban className="h-4 w-4 mr-2" />
            Suspend User
          </DropdownMenuItem>
        )}
        {user.status === 'SUSPENDED' && (
          <DropdownMenuItem onClick={handleReactivate} className="text-green-600">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reactivate User
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
