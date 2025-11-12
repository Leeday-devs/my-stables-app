'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <AlertCircle className="w-16 h-16 text-destructive" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-3">
          <h1 className="font-serif text-4xl font-bold text-foreground">
            Something Went Wrong
          </h1>
          <p className="text-muted-foreground text-lg">
            We're sorry, but something unexpected happened. Please try again.
          </p>
          {error.digest && (
            <p className="text-sm text-muted-foreground font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            variant="default"
            size="lg"
            className="gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/">
              <Home className="w-5 h-5" />
              Go Home
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-sm text-muted-foreground pt-8">
          If this problem persists, please contact your stable administrator.
        </p>
      </div>
    </div>
  )
}
