import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Sparkles, Star, CheckCircle, Clock, Users } from 'lucide-react'

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
              Mearydown & Greenacres
            </p>
            <p className="text-lg md:text-xl mb-8 text-primary-foreground/90 font-light">
              Luxury mobile-first equestrian management. Book services, manage your stable,
              and track your horses with elegance and ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-heading text-base shadow-lg">
                <Link href="/auth/register">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white text-primary border-2 border-white hover:bg-white/90 font-heading text-base shadow-lg">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
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
            {/* Feature 1 */}
            <Card className="p-6 hover:shadow-lg transition-shadow border-border">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-muted-foreground">
                Book horse care services and sand school time slots with just a few taps.
                Mobile-first design optimized for use on-site.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="p-6 hover:shadow-lg transition-shadow border-border">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Admin Approval</h3>
              <p className="text-muted-foreground">
                All bookings require admin approval, ensuring complete control over
                your stable's schedule and operations.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="p-6 hover:shadow-lg transition-shadow border-border">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Horse Care Services</h3>
              <p className="text-muted-foreground">
                Book grooming, mucking out, and other services. Track each horse's
                care schedule with precision.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card className="p-6 hover:shadow-lg transition-shadow border-border">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Sand School Slots</h3>
              <p className="text-muted-foreground">
                Reserve sand school time in 30-minute or 1-hour slots. Real-time
                availability ensures no double bookings.
              </p>
            </Card>

            {/* Feature 5 */}
            <Card className="p-6 hover:shadow-lg transition-shadow border-border">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Revenue Tracking</h3>
              <p className="text-muted-foreground">
                Admins can track earnings per service, monitor accepted vs denied
                bookings, and analyze revenue trends.
              </p>
            </Card>

            {/* Feature 6 */}
            <Card className="p-6 hover:shadow-lg transition-shadow border-border">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">User Management</h3>
              <p className="text-muted-foreground">
                Complete admin control over user accounts. Approve new registrations
                and manage existing users with ease.
              </p>
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
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-serif text-2xl font-bold mb-2">My Stables</h3>
              <p className="text-muted-foreground text-sm">
                Premium equestrian management
              </p>
            </div>
            <div className="text-center md:text-right text-sm text-muted-foreground space-y-2">
              <p>&copy; 2025 My Stables. All rights reserved.</p>
              <div className="flex flex-wrap justify-center md:justify-end gap-4">
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
        </div>
      </footer>
    </div>
  )
}
