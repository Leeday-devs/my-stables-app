'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { createService, updateService, formatDuration } from '@/lib/actions/services'

interface Service {
  id: string
  name: string
  description: string | null
  price: number
  duration_minutes: number
  active: boolean
}

interface ServiceFormDialogProps {
  children?: React.ReactNode
  service?: Service
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function ServiceFormDialog({
  children,
  service,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ServiceFormDialogProps) {
  const router = useRouter()
  const [internalOpen, setInternalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [duration, setDuration] = useState('')

  // Use controlled or uncontrolled open state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = controlledOnOpenChange || setInternalOpen

  const isEditMode = !!service

  // Initialize form when service changes or dialog opens
  useEffect(() => {
    if (open && service) {
      setName(service.name)
      setDescription(service.description || '')
      setPrice(service.price.toString())
      setDuration(formatDuration(service.duration_minutes))
    } else if (open && !service) {
      // Reset form for new service
      setName('')
      setDescription('')
      setPrice('')
      setDuration('')
    }
    setError(null)
  }, [open, service])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = {
        name: name.trim(),
        description: description.trim() || undefined,
        price: parseFloat(price),
        duration: duration.trim(),
      }

      // Validation
      if (!formData.name) {
        setError('Service name is required')
        setIsSubmitting(false)
        return
      }

      if (!formData.price || formData.price <= 0) {
        setError('Please enter a valid price greater than 0')
        setIsSubmitting(false)
        return
      }

      if (!formData.duration) {
        setError('Duration is required (e.g., 30m, 1hr, 1.5h)')
        setIsSubmitting(false)
        return
      }

      let result
      if (isEditMode && service) {
        result = await updateService(service.id, formData)
      } else {
        result = await createService(formData)
      }

      if (result.success) {
        setOpen(false)
        router.refresh()
      } else {
        setError(result.error || 'An error occurred')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Edit Service' : 'Add New Service'}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? 'Update the service details below.'
                : 'Create a new horse care service that users can book.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Service Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">
                Service Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Grooming, Mucking Out, Clipping"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the service..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                rows={3}
              />
            </div>

            {/* Price and Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">
                  Price (£) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="10.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="duration">
                  Duration <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="duration"
                  placeholder="30m, 1hr, 1.5h"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Examples: 30m, 1hr, 1.5h, 90 minutes
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>{isEditMode ? 'Update Service' : 'Create Service'}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
