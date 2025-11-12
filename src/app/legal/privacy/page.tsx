import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy - My Stables',
  description: 'Privacy Policy for My Stables application',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>

        <h1 className="font-serif text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-slate max-w-none space-y-6">
          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Welcome to My Stables ("we," "our," or "us"). We are committed to protecting your personal information
              and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard
              your information when you use our equestrian management application.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <p>We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (name, email address, password)</li>
              <li>Profile information</li>
              <li>Booking details (dates, services, horse information)</li>
              <li>Communication preferences and notifications</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process bookings and manage your account</li>
              <li>Send you notifications about bookings and account status</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Analyze usage patterns to improve user experience</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">4. Data Storage and Security</h2>
            <p>
              Your data is stored securely using Supabase, a trusted cloud database provider. We implement
              industry-standard security measures including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encrypted data transmission (HTTPS/SSL)</li>
              <li>Secure password hashing</li>
              <li>Row-level security policies</li>
              <li>Regular security audits</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">5. Data Sharing and Disclosure</h2>
            <p>
              We do not sell your personal information. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>With stable administrators for booking management purposes</li>
              <li>With service providers who assist in operating our application</li>
              <li>When required by law or to protect our legal rights</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your account and data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">7. Cookies and Tracking</h2>
            <p>
              We use essential cookies and similar tracking technologies to maintain your session and ensure
              application functionality. We may also use analytics cookies to understand how users interact
              with our service.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">8. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services and comply
              with legal obligations. Booking history may be retained for financial and regulatory purposes.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">9. Children's Privacy</h2>
            <p>
              Our services are not directed to individuals under the age of 18. We do not knowingly collect
              personal information from children.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by
              posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact
              your stable administrator or reach out to us at:
            </p>
            <p className="font-semibold mt-4">
              [Your Contact Email Address]
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground text-center">
            By using My Stables, you agree to this Privacy Policy and our{' '}
            <Link href="/legal/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
