import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle } from 'lucide-react'
import { DownloadButtons } from '@/components/pwa/DownloadButtons'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1920&h=1080&fit=crop"
            alt="Beautiful horse in stable"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary/70"></div>
        </div>
        <div className="container relative mx-auto px-4 py-20 md:py-32 text-primary-foreground">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Premium Equestrian Management
            </Badge>
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-2 tracking-tight">
              My Stables
            </h1>
            <p className="font-serif text-4xl md:text-6xl font-bold mb-6 text-primary-foreground tracking-tight">
              Greenacres
            </p>
            <p className="text-lg md:text-xl mb-8 text-primary-foreground/90 font-light">
              Luxury mobile-first equestrian management. Book services, manage your stable,
              and track your horses with elegance and ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-heading text-base shadow-lg button-hover-lift button-shimmer">
                <Link href="/auth/register">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white text-primary border-2 border-white hover:bg-white/90 font-heading text-base shadow-lg button-hover-lift button-shimmer">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
            <DownloadButtons />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Decorative Horseshoes */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <svg className="absolute top-10 left-10 w-24 h-24 text-amber-500 rotate-12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C7.58 2 4 5.58 4 10c0 1.5.5 3 1.2 4.2L4 22l2.5-1.5L8 22l1.5-1.5L11 22l1-2 1 2 1.5-1.5L16 22l1.5-1.5L20 22l-1.2-7.8c.7-1.2 1.2-2.7 1.2-4.2 0-4.42-3.58-8-8-8zm0 2c3.31 0 6 2.69 6 6 0 1-.3 2-.8 2.8l-.2.4.6 3.8-1-.6-1 .6-1-.6-1 .6-1-.6-1 .6-1-.6-1 .6.6-3.8-.2-.4c-.5-.8-.8-1.8-.8-2.8 0-3.31 2.69-6 6-6z"/>
          </svg>
          <svg className="absolute top-32 right-20 w-32 h-32 text-amber-500 -rotate-45" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C7.58 2 4 5.58 4 10c0 1.5.5 3 1.2 4.2L4 22l2.5-1.5L8 22l1.5-1.5L11 22l1-2 1 2 1.5-1.5L16 22l1.5-1.5L20 22l-1.2-7.8c.7-1.2 1.2-2.7 1.2-4.2 0-4.42-3.58-8-8-8zm0 2c3.31 0 6 2.69 6 6 0 1-.3 2-.8 2.8l-.2.4.6 3.8-1-.6-1 .6-1-.6-1 .6-1-.6-1 .6-1-.6-1 .6.6-3.8-.2-.4c-.5-.8-.8-1.8-.8-2.8 0-3.31 2.69-6 6-6z"/>
          </svg>
          <svg className="absolute bottom-20 left-1/4 w-28 h-28 text-amber-500 rotate-90" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C7.58 2 4 5.58 4 10c0 1.5.5 3 1.2 4.2L4 22l2.5-1.5L8 22l1.5-1.5L11 22l1-2 1 2 1.5-1.5L16 22l1.5-1.5L20 22l-1.2-7.8c.7-1.2 1.2-2.7 1.2-4.2 0-4.42-3.58-8-8-8zm0 2c3.31 0 6 2.69 6 6 0 1-.3 2-.8 2.8l-.2.4.6 3.8-1-.6-1 .6-1-.6-1 .6-1-.6-1 .6-1-.6-1 .6.6-3.8-.2-.4c-.5-.8-.8-1.8-.8-2.8 0-3.31 2.69-6 6-6z"/>
          </svg>
          <svg className="absolute bottom-40 right-16 w-20 h-20 text-amber-500 -rotate-12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C7.58 2 4 5.58 4 10c0 1.5.5 3 1.2 4.2L4 22l2.5-1.5L8 22l1.5-1.5L11 22l1-2 1 2 1.5-1.5L16 22l1.5-1.5L20 22l-1.2-7.8c.7-1.2 1.2-2.7 1.2-4.2 0-4.42-3.58-8-8-8zm0 2c3.31 0 6 2.69 6 6 0 1-.3 2-.8 2.8l-.2.4.6 3.8-1-.6-1 .6-1-.6-1 .6-1-.6-1 .6-1-.6-1 .6.6-3.8-.2-.4c-.5-.8-.8-1.8-.8-2.8 0-3.31 2.69-6 6-6z"/>
          </svg>
        </div>
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Manage Your Yard
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From booking services to tracking revenue, My Stables provides a complete
              solution for equestrian management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 - Easy Booking */}
            <Card className="group p-6 hover:shadow-2xl transition-all duration-300 border-2 border-secondary/30 hover:border-secondary bg-gradient-to-br from-card to-secondary/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-amber-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                    <path d="M12 11c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-5 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" opacity="0.6"/>
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold mb-2 text-foreground group-hover:text-secondary transition-colors">Easy Booking</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Book horse care services and sand school time slots with just a few taps.
                  Mobile-first design optimized for use on-site.
                </p>
              </div>
            </Card>

            {/* Feature 2 - Admin Approval */}
            <Card className="group p-6 hover:shadow-2xl transition-all duration-300 border-2 border-secondary/30 hover:border-secondary bg-gradient-to-br from-card to-secondary/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-amber-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C7.58 2 4 5.58 4 10c0 1.5.5 3 1.2 4.2L4 22l2.5-1.5L8 22l1.5-1.5L11 22l1-2 1 2 1.5-1.5L16 22l1.5-1.5L20 22l-1.2-7.8c.7-1.2 1.2-2.7 1.2-4.2 0-4.42-3.58-8-8-8zm0 2c3.31 0 6 2.69 6 6 0 1-.3 2-.8 2.8l-.2.4.6 3.8-1-.6-1 .6-1-.6-1 .6-1-.6-1 .6-1-.6-1 .6.6-3.8-.2-.4c-.5-.8-.8-1.8-.8-2.8 0-3.31 2.69-6 6-6z"/>
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold mb-2 text-foreground group-hover:text-secondary transition-colors">Admin Approval</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All bookings require admin approval, ensuring complete control over
                  your stable's schedule and operations.
                </p>
              </div>
            </Card>

            {/* Feature 3 - Horse Care Services */}
            <Card className="group p-6 hover:shadow-2xl transition-all duration-300 border-2 border-secondary/30 hover:border-secondary bg-gradient-to-br from-card to-secondary/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-amber-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" opacity="0.3"/>
                    <ellipse cx="12" cy="13" rx="4" ry="2.5" fill="currentColor" opacity="0.6"/>
                    <path d="M8 13c0-2.21 1.79-4 4-4s4 1.79 4 4"/>
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold mb-2 text-foreground group-hover:text-secondary transition-colors">Horse Care Services</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Book grooming, mucking out, and other services. Track each horse's
                  care schedule with precision.
                </p>
              </div>
            </Card>

            {/* Feature 4 - Sand School Slots */}
            <Card className="group p-6 hover:shadow-2xl transition-all duration-300 border-2 border-secondary/30 hover:border-secondary bg-gradient-to-br from-card to-secondary/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-amber-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M2 18h20M4 18v-6l4-4 4 4 4-4 4 4v6M8 12V8M16 12V8"/>
                    <rect x="3" y="18" width="18" height="2" fill="currentColor" opacity="0.5"/>
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold mb-2 text-foreground group-hover:text-secondary transition-colors">Sand School Slots</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Reserve sand school time in 30-minute or 1-hour slots. Real-time
                  availability ensures no double bookings.
                </p>
              </div>
            </Card>

            {/* Feature 5 - Revenue Tracking */}
            <Card className="group p-6 hover:shadow-2xl transition-all duration-300 border-2 border-secondary/30 hover:border-secondary bg-gradient-to-br from-card to-secondary/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-amber-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm7 6c-1.65 0-3-1.35-3-3V3h6v8c0 1.65-1.35 3-3 3zm7-6c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold mb-2 text-foreground group-hover:text-secondary transition-colors">Revenue Tracking</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Admins can track earnings per service, monitor accepted vs denied
                  bookings, and analyze revenue trends.
                </p>
              </div>
            </Card>

            {/* Feature 6 - User Management */}
            <Card className="group p-6 hover:shadow-2xl transition-all duration-300 border-2 border-secondary/30 hover:border-secondary bg-gradient-to-br from-card to-secondary/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-amber-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    <circle cx="18" cy="8" r="2.5" opacity="0.6"/>
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold mb-2 text-foreground group-hover:text-secondary transition-colors">User Management</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Complete admin control over user accounts. Approve new registrations
                  and manage existing users with ease.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              See What You'll Get
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Intuitive interfaces designed for both users and administrators,
              accessible from any device.
            </p>
          </div>

          <div className="space-y-12">
            {/* User Dashboard Preview */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="rounded-xl overflow-hidden shadow-2xl border border-border">
                  <Image
                    src="/user-dashboard-screenshot-v2.png"
                    alt="User Dashboard Preview"
                    width={1280}
                    height={800}
                    className="w-full h-auto"
                  />
                </div>
              </div>
              <div className="order-1 md:order-2">
                <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
                  User Portal
                </Badge>
                <h3 className="font-serif text-2xl md:text-3xl font-bold mb-4">
                  Elegant User Experience
                </h3>
                <p className="text-muted-foreground mb-4">
                  Your customers enjoy a clean, mobile-optimized interface to book services,
                  manage their horses, and track their bookings.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Quick access to all services and bookings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Real-time notifications and updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Seamless mobile and desktop experience</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Admin Dashboard Preview */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  Admin Panel
                </Badge>
                <h3 className="font-serif text-2xl md:text-3xl font-bold mb-4">
                  Powerful Admin Control
                </h3>
                <p className="text-muted-foreground mb-4">
                  Comprehensive admin tools to manage your stable operations, approve bookings,
                  and track revenue—all from one dashboard.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Manage users and approve registrations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Review and approve booking requests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Track revenue and analyze trends</span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="rounded-xl overflow-hidden shadow-2xl border border-border">
                  <Image
                    src="/admin-dashboard-screenshot-v2.png"
                    alt="Admin Dashboard Preview"
                    width={1280}
                    height={800}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Preview Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Perfect for Mobile
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Designed mobile-first, so you can manage everything on-site,
              right from your phone.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 md:gap-12 justify-center items-center md:items-start">
            {/* User Mobile Preview */}
            <div className="flex flex-col items-center w-full max-w-[280px] md:max-w-[320px]">
              <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
                User Mobile
              </Badge>
              <div className="relative w-full aspect-[375/812]">
                {/* Phone Frame */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2.5rem] shadow-2xl transform scale-105"></div>
                <div className="relative bg-white rounded-[2rem] p-1.5 shadow-xl h-full">
                  <div className="rounded-[1.5rem] overflow-hidden border-2 border-gray-900 h-full">
                    <Image
                      src="/user-mobile-screenshot-v2.png"
                      alt="User Mobile Preview"
                      width={375}
                      height={812}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground text-center">
                Book services and manage horses on the go
              </p>
            </div>

            {/* Admin Mobile Preview */}
            <div className="flex flex-col items-center w-full max-w-[280px] md:max-w-[320px]">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                Admin Mobile
              </Badge>
              <div className="relative w-full aspect-[375/812]">
                {/* Phone Frame */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2.5rem] shadow-2xl transform scale-105"></div>
                <div className="relative bg-white rounded-[2rem] p-1.5 shadow-xl h-full">
                  <div className="rounded-[1.5rem] overflow-hidden border-2 border-gray-900 h-full">
                    <Image
                      src="/admin-mobile-screenshot-v2.png"
                      alt="Admin Mobile Preview"
                      width={375}
                      height={812}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground text-center">
                Full admin control from anywhere
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Development Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="relative isolate overflow-hidden rounded-3xl shadow-2xl">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900"></div>

            {/* Decorative Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <svg className="absolute top-8 right-8 w-32 h-32 text-white rotate-12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C7.58 2 4 5.58 4 10c0 1.5.5 3 1.2 4.2L4 22l2.5-1.5L8 22l1.5-1.5L11 22l1-2 1 2 1.5-1.5L16 22l1.5-1.5L20 22l-1.2-7.8c.7-1.2 1.2-2.7 1.2-4.2 0-4.42-3.58-8-8-8zm0 2c3.31 0 6 2.69 6 6 0 1-.3 2-.8 2.8l-.2.4.6 3.8-1-.6-1 .6-1-.6-1 .6-1-.6-1 .6-1-.6-1 .6.6-3.8-.2-.4c-.5-.8-.8-1.8-.8-2.8 0-3.31 2.69-6 6-6z"/>
              </svg>
              <svg className="absolute bottom-12 left-12 w-40 h-40 text-white -rotate-45" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C7.58 2 4 5.58 4 10c0 1.5.5 3 1.2 4.2L4 22l2.5-1.5L8 22l1.5-1.5L11 22l1-2 1 2 1.5-1.5L16 22l1.5-1.5L20 22l-1.2-7.8c.7-1.2 1.2-2.7 1.2-4.2 0-4.42-3.58-8-8-8zm0 2c3.31 0 6 2.69 6 6 0 1-.3 2-.8 2.8l-.2.4.6 3.8-1-.6-1 .6-1-.6-1 .6-1-.6-1 .6-1-.6-1 .6.6-3.8-.2-.4c-.5-.8-.8-1.8-.8-2.8 0-3.31 2.69-6 6-6z"/>
              </svg>
            </div>

            {/* Content */}
            <div className="relative px-6 py-16 sm:px-16 sm:py-24 lg:px-24 lg:py-32">
              <div className="mx-auto max-w-3xl text-center">
                <Badge className="mb-6 bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30">
                  Custom Development
                </Badge>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                  Looking for your own equestrian management solution?
                </h2>
                <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                  Every stable is unique. Get a bespoke equestrian management application
                  tailored precisely to your yard's workflow, services, and requirements.
                  From booking systems to revenue tracking, we'll build exactly what you need.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-white/70">Visit Website</p>
                      <a
                        href="https://leeday.uk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold hover:underline"
                      >
                        leeday.uk
                      </a>
                    </div>
                  </div>

                  <div className="hidden sm:block w-px h-12 bg-white/30"></div>

                  <div className="flex items-center gap-3 text-white">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-white/70">Email Us</p>
                      <a
                        href="mailto:leedaydevs@gmail.com"
                        className="font-semibold hover:underline"
                      >
                        leedaydevs@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="hidden sm:block w-px h-12 bg-white/30"></div>

                  <div className="flex items-center gap-3 text-white">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-white/70">WhatsApp</p>
                      <a
                        href="https://wa.me/447586266007"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold hover:underline"
                      >
                        07586 266007
                      </a>
                    </div>
                  </div>
                </div>

                <p className="text-white/60 text-sm mb-6">
                  Built & maintained by LD Development
                </p>

                <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-3 text-white/80 text-sm max-w-md mx-auto">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Tailored Solutions</span>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Mobile-First Design</span>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Ongoing Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 bg-background overflow-hidden">
        {/* Decorative Horseshoes */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
          <svg className="absolute top-16 left-1/4 w-28 h-28 text-amber-500 rotate-45" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C7.58 2 4 5.58 4 10c0 1.5.5 3 1.2 4.2L4 22l2.5-1.5L8 22l1.5-1.5L11 22l1-2 1 2 1.5-1.5L16 22l1.5-1.5L20 22l-1.2-7.8c.7-1.2 1.2-2.7 1.2-4.2 0-4.42-3.58-8-8-8zm0 2c3.31 0 6 2.69 6 6 0 1-.3 2-.8 2.8l-.2.4.6 3.8-1-.6-1 .6-1-.6-1 .6-1-.6-1 .6-1-.6-1 .6.6-3.8-.2-.4c-.5-.8-.8-1.8-.8-2.8 0-3.31 2.69-6 6-6z"/>
          </svg>
          <svg className="absolute bottom-20 right-1/4 w-24 h-24 text-amber-500 -rotate-30" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C7.58 2 4 5.58 4 10c0 1.5.5 3 1.2 4.2L4 22l2.5-1.5L8 22l1.5-1.5L11 22l1-2 1 2 1.5-1.5L16 22l1.5-1.5L20 22l-1.2-7.8c.7-1.2 1.2-2.7 1.2-4.2 0-4.42-3.58-8-8-8zm0 2c3.31 0 6 2.69 6 6 0 1-.3 2-.8 2.8l-.2.4.6 3.8-1-.6-1 .6-1-.6-1 .6-1-.6-1 .6-1-.6-1 .6.6-3.8-.2-.4c-.5-.8-.8-1.8-.8-2.8 0-3.31 2.69-6 6-6z"/>
          </svg>
        </div>
        <div className="container mx-auto max-w-4xl text-center relative">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
            Ready to Elevate Your Stable Management?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join My Stables today and experience premium equestrian management
            designed for the modern stable yard.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 font-heading text-base">
            <Link href="/auth/register">Create Your Account</Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Account activation requires admin approval
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="container mx-auto max-w-6xl space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-serif text-2xl font-bold mb-2">My Stables</h3>
              <p className="text-muted-foreground text-sm">
                Premium equestrian management
              </p>
            </div>
            <div className="text-center md:text-right text-sm text-muted-foreground space-y-2">
              <p>&copy; 2025 My Stables. All rights reserved.</p>
              <div className="flex flex-wrap justify-center md:justify-end gap-2">
                <Link href="/legal/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <span>·</span>
                <Link href="/legal/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="text-center text-sm text-muted-foreground">
            <p className="flex flex-wrap justify-center items-center gap-2">
              <span className="font-semibold text-foreground">Built & Maintained by LD Development</span>
              <span>•</span>
              <span>Hosting Easy Ltd</span>
              <span>•</span>
              <span>3rd Floor 86-90, Paul Street, London EC2A 4NE</span>
              <span>•</span>
              <a href="mailto:LeeDayDevs@gmail.com" className="hover:text-secondary transition-colors">
                LeeDayDevs@gmail.com
              </a>
              <span>•</span>
              <a href="tel:07586266007" className="hover:text-secondary transition-colors">
                07586 266007
              </a>
              <span>•</span>
              <a href="https://leeday.uk" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                leeday.uk
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
