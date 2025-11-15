'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle } from 'lucide-react'
import { approveBooking, denyBooking } from '@/lib/actions/admin'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Booking {
  id: string
  type: 'horse_care' | 'sand_school'
  user: string
  service: string
  horse: string
  date: string
  price: string
}

interface PendingBookingCardProps {
  booking: Booking
}

export default function PendingBookingCard({ booking }: PendingBookingCardProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const handleApprove = async () => {
    setIsProcessing(true)
    const result = await approveBooking(booking.id, booking.type)

    if (result.success) {
      router.refresh()
    } else {
      alert(`Failed to approve booking: ${result.error}`)
      setIsProcessing(false)
    }
  }

  const handleDeny = async () => {
    if (!confirm(`Are you sure you want to deny this ${booking.service} booking?`)) {
      return
    }

    setIsProcessing(true)
    const result = await denyBooking(booking.id, booking.type)

    if (result.success) {
      router.refresh()
    } else {
      alert(`Failed to deny booking: ${result.error}`)
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex items-center justify-between border-b pb-4 last:border-0">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium">{booking.service}</p>
          <Badge variant="outline" className="text-xs">{booking.price}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {booking.user} • {booking.horse !== 'N/A' ? `${booking.horse} • ` : ''}{booking.date}
        </p>
      </div>
      <div className="flex gap-1 sm:gap-2 shrink-0">
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0"
          onClick={handleApprove}
          disabled={isProcessing}
        >
          <CheckCircle className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-red-200 text-red-600 hover:bg-red-50 h-8 w-8 p-0"
          onClick={handleDeny}
          disabled={isProcessing}
        >
          <XCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
