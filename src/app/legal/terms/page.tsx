import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service - My Stables',
  description: 'Terms of Service for My Stables application',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>

        <h1 className="font-serif text-4xl font-bold mb-6">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-slate max-w-none space-y-6">
          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using My Stables ("the Service"), you accept and agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p>
              My Stables provides an equestrian management platform that allows users to book horse care services
              and sand school time slots, subject to administrator approval. The Service facilitates communication
              and booking management between stable users and administrators.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p>To use the Service, you must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create an account with accurate information</li>
              <li>Maintain the security of your password</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Wait for administrator approval before accessing full features</li>
            </ul>
            <p className="mt-4">
              You must be at least 18 years old to create an account. Accounts may be suspended or terminated
              for violation of these terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">4. Booking Policy</h2>
            <p>All bookings are subject to the following conditions:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>All booking requests require administrator approval</li>
              <li>Approved bookings constitute a binding agreement</li>
              <li>Cancellation policies are set by the stable administrator</li>
              <li>Users must arrive on time for booked services</li>
              <li>Payment terms are determined by the stable management</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">5. User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Service for any unlawful purpose</li>
              <li>Impersonate any person or entity</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Attempt to gain unauthorized access to the system</li>
              <li>Submit false or misleading booking information</li>
              <li>Harass, abuse, or harm other users or staff</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">6. Administrator Rights</h2>
            <p>
              Stable administrators have the right to approve or deny any user registration or booking request
              at their sole discretion. They may also modify pricing, available services, and booking policies
              as needed for stable operations.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">7. Intellectual Property</h2>
            <p>
              The Service, including its original content, features, and functionality, is owned by My Stables
              and is protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">8. Liability and Disclaimers</h2>
            <p>
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. We do not guarantee uninterrupted
              or error-free service. We are not liable for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Service interruptions or technical failures</li>
              <li>Loss of data or bookings</li>
              <li>Disputes between users and administrators</li>
              <li>Injuries or damages occurring at the stable</li>
              <li>Third-party actions or omissions</li>
            </ul>
            <p className="mt-4">
              Your use of the Service is at your own risk. The stable administrator is responsible for all
              safety policies and procedures at the physical premises.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">9. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless My Stables, its operators, and affiliates from any claims,
              damages, or expenses arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">10. Payment and Fees</h2>
            <p>
              Pricing for services is set by the stable administrator. Payment arrangements are made directly
              with the stable. We reserve the right to charge for premium features in the future with prior notice.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">11. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service immediately, without prior
              notice, for conduct that we believe violates these Terms or is harmful to other users, us, or
              third parties, or for any other reason at our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of material changes
              via email or through the Service. Continued use of the Service after changes constitutes acceptance
              of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">13. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of England and Wales,
              without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">14. Contact Information</h2>
            <p>
              For questions about these Terms, please contact your stable administrator or reach out to us at:
            </p>
            <p className="font-semibold mt-4">
              LeeDayDevs@gmail.com
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground text-center">
            By using My Stables, you agree to these Terms of Service and our{' '}
            <Link href="/legal/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
