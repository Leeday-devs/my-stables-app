'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Global application error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontFamily: 'system-ui, sans-serif',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#f9fafb',
        }}>
          <div style={{
            maxWidth: '500px',
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              marginBottom: '16px',
              color: '#1f2937',
            }}>
              Critical Error
            </h1>
            <p style={{
              fontSize: '18px',
              marginBottom: '24px',
              color: '#6b7280',
            }}>
              We're sorry, but a critical error occurred. Please refresh the page or contact support.
            </p>
            {error.digest && (
              <p style={{
                fontSize: '14px',
                marginBottom: '24px',
                color: '#9ca3af',
                fontFamily: 'monospace',
              }}>
                Error ID: {error.digest}
              </p>
            )}
            <button
              onClick={reset}
              style={{
                backgroundColor: '#2A3C56',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                marginRight: '12px',
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                backgroundColor: 'white',
                color: '#2A3C56',
                padding: '12px 24px',
                borderRadius: '6px',
                border: '2px solid #2A3C56',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              Go Home
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
