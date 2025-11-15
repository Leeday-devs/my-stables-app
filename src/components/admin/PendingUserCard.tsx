'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle } from 'lucide-react'
import { approveUser, denyUser } from '@/lib/actions/admin'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  created_at: string
}

interface PendingUserCardProps {
  user: User
}

export default function PendingUserCard({ user }: PendingUserCardProps) {
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
    if (!confirm(`Are you sure you want to deny ${user.full_name || user.email}?`)) {
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

  const initials = user.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : user.email.substring(0, 2).toUpperCase()

  return (
    <div className="flex items-center justify-between border-b pb-4 last:border-0">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary font-semibold">
          {initials}
        </div>
        <div>
          <p className="font-medium">{user.full_name || 'No name provided'}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          {user.phone && (
            <p className="text-xs text-muted-foreground">{user.phone}</p>
          )}
        </div>
      </div>
      <div className="flex gap-1 sm:gap-2">
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700 px-2 sm:px-3"
          onClick={handleApprove}
          disabled={isProcessing}
        >
          <CheckCircle className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Approve</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-red-200 text-red-600 hover:bg-red-50 px-2 sm:px-3"
          onClick={handleDeny}
          disabled={isProcessing}
        >
          <XCircle className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Deny</span>
        </Button>
      </div>
    </div>
  )
}
