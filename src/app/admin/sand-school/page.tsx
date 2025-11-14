'use client'

import { SandSchoolCalendar } from '@/components/admin/SandSchoolCalendar'

export default function AdminSandSchoolPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">Sand School Management</h1>
        <p className="text-muted-foreground">
          View and manage all sand school bookings in an interactive calendar.
        </p>
      </div>

      <SandSchoolCalendar />
    </div>
  )
}
