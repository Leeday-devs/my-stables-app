'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar, Sparkles, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { formatDuration } from '@/lib/utils/duration'

interface Service {
  id: string
  name: string
  description: string | null
  price: number
  duration_minutes: number
  active: boolean
}

export default function HorseCareBookingPage() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState('')
  const [horseName, setHorseName] = useState('')
  const [service, setService] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [isLoadingServices, setIsLoadingServices] = useState(true)

  // Fetch services on mount
  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch('/api/services')
        if (!response.ok) throw new Error('Failed to fetch services')
        const data = await response.json()
        setServices(data.services || [])
      } catch (err) {
        console.error('Error fetching services:', err)
        setError('Failed to load services')
      } finally {
        setIsLoadingServices(false)
      }
    }
    fetchServices()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/bookings/horse-care', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          horse_name: horseName,
          service_id: service,
          booking_date: selectedDate,
          notes: notes || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit booking')
      }

      setSuccess(true)
      // Reset form
      setHorseName('')
      setService('')
      setSelectedDate('')
      setNotes('')

      // Redirect to bookings page after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/bookings')
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">Book Horse Care Service</h1>
        <p className="text-muted-foreground">
          Book grooming or mucking out services for your horse.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Booking Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Selection */}
              <div className="space-y-2">
                <Label htmlFor="service">Select Service *</Label>
                <Select value={service} onValueChange={setService} disabled={isLoadingServices || services.length === 0}>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingServices ? "Loading services..." : services.length === 0 ? "No services available" : "Choose a service"} />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{s.name}</span>
                          <span className="ml-2 text-sm text-muted-foreground">
                            £{Number(s.price).toFixed(2)} • {formatDuration(s.duration_minutes)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Horse Name */}
              <div className="space-y-2">
                <Label htmlFor="horseName">Horse Name *</Label>
                <Input
                  id="horseName"
                  placeholder="Enter your horse's name"
                  value={horseName}
                  onChange={(e) => setHorseName(e.target.value)}
                  required
                />
              </div>

              {/* Date Selection */}
              <div className="space-y-2">
                <Label htmlFor="date">Preferred Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requirements or information..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Error Message */}
              {error && (
                <Card className="p-4 bg-destructive/10 border-destructive/20">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-destructive">Error</p>
                      <p className="text-destructive/90 mt-1">{error}</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Success Message */}
              {success && (
                <Card className="p-4 bg-green-50 border-green-200">
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-green-900">Success!</p>
                      <p className="text-green-700 mt-1">
                        Your booking request has been submitted. An admin will review it shortly. Redirecting...
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Important Notice */}
              {!success && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900">Approval Required</p>
                      <p className="text-blue-700 mt-1">
                        Your booking will be sent to our admin team for approval. You'll receive a notification once it's been reviewed.
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={!service || !horseName || !selectedDate || isSubmitting || success}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Calendar className="mr-2 h-4 w-4" />
                      Submit Booking Request
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Services Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-heading text-lg font-semibold mb-4">Available Services</h3>
            {isLoadingServices ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No services available at the moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {services.map((s) => (
                  <div key={s.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-secondary/10 flex-shrink-0">
                        <Sparkles className="h-4 w-4 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{s.name}</p>
                        {s.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">{formatDuration(s.duration_minutes)}</p>
                        <p className="text-lg font-bold text-secondary mt-1">£{Number(s.price).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6 bg-muted/30">
            <h3 className="font-heading text-lg font-semibold mb-3">How it Works</h3>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold flex-shrink-0">
                  1
                </span>
                <span>Select your service and preferred date</span>
              </li>
              <li className="flex gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold flex-shrink-0">
                  2
                </span>
                <span>Submit your booking request</span>
              </li>
              <li className="flex gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold flex-shrink-0">
                  3
                </span>
                <span>Admin reviews and approves/denies</span>
              </li>
              <li className="flex gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold flex-shrink-0">
                  4
                </span>
                <span>You receive a notification with the decision</span>
              </li>
            </ol>
          </Card>
        </div>
      </div>
    </div>
  )
}
