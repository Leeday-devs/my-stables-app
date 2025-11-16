'use client'

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
  Lock,
  Loader2,
  Clock
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [userStatus, setUserStatus] = useState<'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED'>('PENDING_APPROVAL')
  const [userRole, setUserRole] = useState('USER')
  const [memberSince, setMemberSince] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    const supabase = createClient()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUserEmail(user.email || '')

      const { data: userData } = await supabase
        .from('users')
        .select('full_name, phone, status, role, created_at')
        .eq('id', user.id)
        .single()

      if (userData) {
        setFullName(userData.full_name || '')
        const nameParts = (userData.full_name || '').split(' ')
        setFirstName(nameParts[0] || '')
        setLastName(nameParts.slice(1).join(' ') || '')
        setPhone(userData.phone || '')
        setUserStatus(userData.status)
        setUserRole(userData.role)

        // Format member since date
        if (userData.created_at) {
          const date = new Date(userData.created_at)
          setMemberSince(date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }))
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const supabase = createClient()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const updatedFullName = `${firstName} ${lastName}`.trim()

      const { error } = await supabase
        .from('users')
        .update({
          full_name: updatedFullName,
          phone: phone
        })
        .eq('id', user.id)

      if (error) throw error

      setFullName(updatedFullName)

      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const getInitials = () => {
    return fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
  }

  const getStatusBadge = () => {
    switch (userStatus) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-700"><Shield className="h-3 w-3 mr-1" />Active Member</Badge>
      case 'PENDING_APPROVAL':
        return <Badge className="bg-orange-100 text-orange-700"><Clock className="h-3 w-3 mr-1" />Pending Approval</Badge>
      case 'SUSPENDED':
        return <Badge className="bg-red-100 text-red-700">Suspended</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-3" />
            <p>Loading profile...</p>
          </div>
        </Card>
      </div>
    )
  }
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
              {getInitials()}
            </div>
            <h2 className="font-heading text-xl font-semibold mb-1">{fullName || 'User'}</h2>
            <p className="text-sm text-muted-foreground mb-4">{userEmail}</p>
            <div className="mb-4">
              {getStatusBadge()}
            </div>

            <Separator className="my-4" />

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Member since {memberSince || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{userRole === 'ADMIN' ? 'Administrator' : 'Regular User'}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Details */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="font-heading text-xl font-semibold mb-6">Personal Information</h2>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Name Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
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
                  value={userEmail}
                  disabled
                  title="Email cannot be changed"
                />
              </div>
              <p className="text-xs text-muted-foreground">Email address cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  className="pl-10"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07XXX XXXXXX"
                />
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="submit" className="flex-1" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={fetchProfile} disabled={saving}>
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
