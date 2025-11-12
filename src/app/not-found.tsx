import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Horseshoe Icon */}
        <div className="flex justify-center">
          <svg
            className="w-24 h-24 text-secondary/30"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C7.58 2 4 5.58 4 10c0 1.5.5 3 1.2 4.2L4 22l2.5-1.5L8 22l1.5-1.5L11 22l1-2 1 2 1.5-1.5L16 22l1.5-1.5L20 22l-1.2-7.8c.7-1.2 1.2-2.7 1.2-4.2 0-4.42-3.58-8-8-8zm0 2c3.31 0 6 2.69 6 6 0 1-.3 2-.8 2.8l-.2.4.6 3.8-1-.6-1 .6-1-.6-1 .6-1-.6-1 .6-1-.6-1 .6.6-3.8-.2-.4c-.5-.8-.8-1.8-.8-2.8 0-3.31 2.69-6 6-6z" />
          </svg>
        </div>

        {/* Error Message */}
        <div className="space-y-3">
          <h1 className="font-serif text-6xl font-bold text-foreground">404</h1>
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-lg">
            Sorry, we couldn't find the page you're looking for. It may have been moved or doesn't exist.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default" size="lg" className="gap-2">
            <Link href="/">
              <Home className="w-5 h-5" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="javascript:history.back()">
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-sm text-muted-foreground pt-8">
          Need help? Contact your stable administrator.
        </p>
      </div>
    </div>
  )
}
