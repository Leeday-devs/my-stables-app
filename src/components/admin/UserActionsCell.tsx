'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, MoreVertical } from 'lucide-react'
import { approveUser, denyUser } from '@/lib/actions/admin'
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

  return (
    <Button variant="ghost" size="sm">
      <MoreVertical className="h-4 w-4" />
    </Button>
  )
}
