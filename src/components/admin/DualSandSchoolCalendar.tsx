'use client'

import { SandSchoolCalendar } from './SandSchoolCalendar'

export function DualSandSchoolCalendar() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Greenachers Calendar */}
      <div>
        <SandSchoolCalendar yard="GREENACHERS" />
      </div>

      {/* Merydown Calendar */}
      <div>
        <SandSchoolCalendar yard="MERYDOWN" />
      </div>
    </div>
  )
}
