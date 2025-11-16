'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Home,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { HorseHead } from '@/components/icons/HorseHead'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { name: 'My Bookings', href: '/dashboard/bookings', icon: Calendar },
  { name: 'Book Services', href: '/dashboard/bookings/horse-care', icon: Sparkles },
  { name: 'Book Sand School', href: '/dashboard/bookings/sand-school', icon: Calendar },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
]

export function UserNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userName, setUserName] = useState('User')
  const [userInitials, setUserInitials] = useState('U')
  const [userStatus, setUserStatus] = useState('Member')
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    const supabase = createClient()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch user profile
      const { data: userData } = await supabase
        .from('users')
        .select('full_name, status')
        .eq('id', user.id)
        .single()

      if (userData) {
        setUserName(userData.full_name || 'User')

        // Generate initials from name
        const nameParts = (userData.full_name || 'U').split(' ')
        const initials = nameParts.map((part: string) => part[0]).join('').toUpperCase().slice(0, 2)
        setUserInitials(initials)

        // Set user status
        setUserStatus(userData.status === 'ACTIVE' ? 'Active Member' : 'Pending Approval')
      }

      // Fetch unread notification count (placeholder - will need notifications table)
      // For now, set to 0 as we don't have notifications implemented yet
      setNotificationCount(0)
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="xl:hidden bg-primary text-primary-foreground border-b border-primary-foreground/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <HorseHead className="w-7 h-7" />
            <h1 className="font-serif text-xl font-bold">My Stables</h1>
          </div>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="bg-white/95 text-primary hover:bg-white shadow-sm"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Menu Drawer */}
        <div className={cn(
          "fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-primary text-primary-foreground z-50 transform transition-transform duration-300 ease-in-out",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="p-4 space-y-2 h-full overflow-y-auto flex flex-col pt-20">
            <div className="flex-1 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-secondary text-secondary-foreground'
                        : 'text-primary-foreground/90 hover:bg-primary-foreground/10'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                    {item.name === 'Notifications' && notificationCount > 0 && (
                      <Badge className="ml-auto bg-red-500 text-white">{notificationCount}</Badge>
                    )}
                  </Link>
                )
              })}
            </div>
            <div className="border-t border-primary-foreground/10 pt-4 mt-auto">
              <div className="flex items-center gap-3 rounded-lg bg-primary-foreground/5 p-3 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-semibold text-sm">
                  {userInitials}
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium">{userName}</p>
                  <p className="text-xs text-primary-foreground/70">{userStatus}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start text-primary-foreground/90 hover:bg-primary-foreground/10"
                size="sm"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden xl:flex h-full w-64 flex-col bg-primary text-primary-foreground">
        {/* Logo */}
        <div className="flex flex-col border-b border-primary-foreground/10 px-6 py-5">
          <h1 className="font-serif text-xl font-bold leading-tight">My Stables</h1>
          <p className="text-xs text-primary-foreground/70 mt-1">User Portal</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-primary-foreground/90 hover:bg-primary-foreground/10 hover:text-primary-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
                {item.name === 'Notifications' && notificationCount > 0 && (
                  <Badge className="ml-auto bg-red-500 text-white">{notificationCount}</Badge>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Info */}
        <div className="border-t border-primary-foreground/10 p-4">
          <div className="flex items-center gap-3 rounded-lg bg-primary-foreground/5 p-3 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-semibold text-sm">
              {userInitials}
            </div>
            <div className="flex-1 text-sm">
              <p className="font-medium">{userName}</p>
              <p className="text-xs text-primary-foreground/70">{userStatus}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-primary-foreground/90 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            size="sm"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </>
  )
}
