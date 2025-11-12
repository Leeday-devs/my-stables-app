import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  ArrowLeft,
  Save,
  Lock
} from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <div>
          <h1 className="font-serif text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and personal information
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Summary Card */}
        <Card className="p-6 lg:col-span-1">
          <div className="text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-bold text-3xl mx-auto mb-4">
              SJ
            </div>
            <h2 className="font-heading text-xl font-semibold mb-1">Sarah Johnson</h2>
            <p className="text-sm text-muted-foreground mb-4">sarah.j@email.com</p>
            <Badge className="bg-green-100 text-green-700 mb-4">
              <Shield className="h-3 w-3 mr-1" />
              Active Member
            </Badge>

            <Separator className="my-4" />

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Member since Nov 2025</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Regular User</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Details */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="font-heading text-xl font-semibold mb-6">Personal Information</h2>

          <form className="space-y-6">
            {/* Name Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  defaultValue="Sarah"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  defaultValue="Johnson"
                />
              </div>
            </div>

            {/* Contact Fields */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  defaultValue="sarah.j@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  className="pl-10"
                  defaultValue="07XXX XXXXXX"
                />
              </div>
            </div>

            <Separator />

            {/* Horses Section */}
            <div>
              <h3 className="font-heading text-lg font-semibold mb-4">My Horses</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Thunder</p>
                    <p className="text-sm text-muted-foreground">Bay Gelding</p>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Spirit</p>
                    <p className="text-sm text-muted-foreground">Grey Mare</p>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
                <Button variant="outline" className="w-full" size="sm">
                  + Add Horse
                </Button>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Security Section */}
      <Card className="p-6 mt-6">
        <h2 className="font-heading text-xl font-semibold mb-6">Security Settings</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Lock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-muted-foreground">
                  Update your password to keep your account secure
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Change
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
