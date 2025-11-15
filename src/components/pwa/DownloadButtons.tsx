'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function DownloadButtons() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase()
    const iOS = /iphone|ipad|ipod/.test(userAgent)

    setIsIOS(iOS)

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Listen for beforeinstallprompt event (Android/Chrome)
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    // Handle iOS differently
    if (isIOS) {
      alert(
        'To install on iOS:\n\n' +
        '1. Tap the Share button (⎘) at the bottom of your screen\n' +
        '2. Scroll down and tap "Add to Home Screen"\n' +
        '3. Tap "Add" in the top right corner\n\n' +
        'The app will appear on your home screen!'
      )
      return
    }

    // Handle Android/Chrome
    if (!deferredPrompt) {
      // If no install prompt, show instructions
      alert('To install: Tap the menu button (⋮) and select "Add to Home Screen" or "Install App"')
      return
    }

    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    }

    setDeferredPrompt(null)
  }

  // Don't show if already installed
  if (isInstalled) {
    return null
  }

  return (
    <div className="flex flex-col items-center gap-3 mt-6">
      <Button
        onClick={handleInstall}
        size="default"
        className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-heading shadow-lg button-hover-lift button-shimmer"
      >
        <Download className="mr-2 h-4 w-4" />
        Download the App
      </Button>
    </div>
  )
}
