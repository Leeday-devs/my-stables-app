'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  CalendarDays
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { HorseHead } from '@/components/icons/HorseHead'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
  { name: 'Sand School', href: '/admin/sand-school', icon: CalendarDays },
  { name: 'Revenue', href: '/admin/revenue', icon: DollarSign },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = () => {
    // Clear any admin session/auth data here if needed
    // For now, just navigate to the landing page
    router.push('/')
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="xl:hidden bg-primary text-primary-foreground border-b border-primary-foreground/10">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-nowrap">
              <div className="w-6 h-6 flex-shrink-0">
                <HorseHead className="w-6 h-6" />
              </div>
              <h1 className="font-serif text-base font-bold whitespace-nowrap">My Stables</h1>
            </div>
            <p className="text-xs text-primary-foreground/70 ml-8">Admin Panel</p>
          </div>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="bg-white/95 text-primary hover:bg-white shadow-sm h-9 w-9 flex-shrink-0"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
          <div className="p-4 space-y-2 h-full overflow-y-auto pt-20">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
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
                </Link>
              )
            })}
            <Separator className="bg-primary-foreground/10 my-3" />
            <div className="flex items-center gap-3 rounded-lg bg-primary-foreground/5 p-3 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-semibold text-sm">
                A
              </div>
              <div className="flex-1 text-sm">
                <p className="font-medium">Admin User</p>
                <p className="text-xs text-primary-foreground/70">Admin</p>
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

      {/* Desktop Sidebar */}
      <div className="hidden xl:flex h-full w-64 flex-col bg-primary text-primary-foreground">
        {/* Logo */}
        <div className="flex flex-col border-b border-primary-foreground/10 px-6 py-5">
          <h1 className="font-serif text-xl font-bold leading-tight">My Stables</h1>
          <p className="text-xs text-primary-foreground/70 mt-1">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
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
              </Link>
            )
          })}
        </nav>

        <Separator className="bg-primary-foreground/10" />

        {/* User Info */}
        <div className="p-4">
          <div className="flex items-center gap-3 rounded-lg bg-primary-foreground/5 p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-semibold text-sm">
              A
            </div>
            <div className="flex-1 text-sm">
              <p className="font-medium">Admin User</p>
              <p className="text-xs text-primary-foreground/70">admin@mystables.com</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="mt-2 w-full justify-start text-primary-foreground/90 hover:bg-primary-foreground/10 hover:text-primary-foreground"
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
