import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Settings,
  DollarSign,
  Clock,
  Mail,
  Bell,
  Shield,
  Save,
  Database
} from 'lucide-react'

export default function AdminSettingsPage() {
  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your stable's configuration and preferences
        </p>
      </div>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        {/* Pricing Settings */}
        <Card className="p-4 md:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-green-100">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold">Service Pricing</h2>
              <p className="text-sm text-muted-foreground">Set prices for your services</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="grooming-price">Grooming</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                <Input
                  id="grooming-price"
                  type="number"
                  className="pl-7"
                  defaultValue="10"
                  step="0.50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mucking-price">Mucking Out</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                <Input
                  id="mucking-price"
                  type="number"
                  className="pl-7"
                  defaultValue="10"
                  step="0.50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sand-school-30">Sand School (30 min)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                <Input
                  id="sand-school-30"
                  type="number"
                  className="pl-7"
                  defaultValue="5"
                  step="0.50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sand-school-60">Sand School (60 min)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                <Input
                  id="sand-school-60"
                  type="number"
                  className="pl-7"
                  defaultValue="8"
                  step="0.50"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Business Hours */}
        <Card className="p-4 md:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue-100">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold">Business Hours</h2>
              <p className="text-sm text-muted-foreground">Set your operating hours</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="open-time">Opening Time</Label>
                <Input
                  id="open-time"
                  type="time"
                  defaultValue="08:00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="close-time">Closing Time</Label>
                <Input
                  id="close-time"
                  type="time"
                  defaultValue="18:00"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Operating Days</Label>
              <div className="grid grid-cols-2 gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <label key={day} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={day !== 'Sunday'}
                      className="rounded"
                    />
                    <span className="text-sm">{day}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Email Notifications */}
        <Card className="p-4 md:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-purple-100">
              <Mail className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold">Email Settings</h2>
              <p className="text-sm text-muted-foreground">Configure notification emails</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input
                id="admin-email"
                type="email"
                defaultValue="admin@mystables.com"
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Email Notifications</Label>
              <div className="space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm">New user registrations</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm">New booking requests</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm">Booking confirmations</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm">Daily summary report</span>
                  <input type="checkbox" className="rounded" />
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* System Settings */}
        <Card className="p-4 md:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-orange-100">
              <Settings className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold">System Settings</h2>
              <p className="text-sm text-muted-foreground">General system configuration</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stable-name">Stable Name</Label>
              <Input
                id="stable-name"
                type="text"
                defaultValue="My Stables"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-advance">Maximum Advance Booking (days)</Label>
              <Input
                id="max-advance"
                type="number"
                defaultValue="30"
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Auto-Approval Settings</Label>
              <div className="space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm font-medium">Auto-approve bookings</p>
                    <p className="text-xs text-muted-foreground">Skip manual approval for trusted users</p>
                  </div>
                  <input type="checkbox" className="rounded" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm font-medium">Auto-approve new users</p>
                    <p className="text-xs text-muted-foreground">Automatically activate new accounts</p>
                  </div>
                  <input type="checkbox" className="rounded" />
                </label>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Database Management */}
      <Card className="p-4 md:p-6 mt-4 md:mt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-red-100">
            <Database className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-semibold">Database Management</h2>
            <p className="text-sm text-muted-foreground">Backup and maintenance operations</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline">
            Export Database
          </Button>
          <Button variant="outline">
            View Activity Logs
          </Button>
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
            Clear Old Notifications
          </Button>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4 md:mt-6">
        <Button variant="outline" className="w-full sm:w-auto">
          Reset to Defaults
        </Button>
        <Button className="w-full sm:w-auto sm:min-w-32">
          <Save className="h-4 w-4 mr-2" />
          Save All Changes
        </Button>
      </div>
    </div>
  )
}
