'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdminBookingForm } from '@/components/admin/AdminBookingForm'
import { CalendarDays, Sparkles } from 'lucide-react'

export default function AdminBookCustomerPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">Book Customer</h1>
        <p className="text-muted-foreground">
          Create bookings for existing customers or walk-in customers. All bookings created here are automatically approved.
        </p>
      </div>

      <Tabs defaultValue="sand-school" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="sand-school" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Sand School
          </TabsTrigger>
          <TabsTrigger value="horse-care" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Horse Care
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sand-school" className="mt-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Sand School Booking</h2>
            <p className="text-muted-foreground">
              Book sand school time slots for customers at Greenachers or Merydown.
            </p>
          </div>
          <AdminBookingForm bookingType="SAND_SCHOOL" />
        </TabsContent>

        <TabsContent value="horse-care" className="mt-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Horse Care Booking</h2>
            <p className="text-muted-foreground">
              Book horse care services for customers.
            </p>
          </div>
          <AdminBookingForm bookingType="HORSE_CARE" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
