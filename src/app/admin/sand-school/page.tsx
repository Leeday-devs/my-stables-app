'use client'

import { DualSandSchoolCalendar } from '@/components/admin/DualSandSchoolCalendar'

export default function AdminSandSchoolPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">Sand School Calendars</h1>
        <p className="text-muted-foreground">
          View and manage bookings for both Greenachers and Merydown sand schools.
        </p>
      </div>

      <DualSandSchoolCalendar />
    </div>
  )
}
