'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function DownloadButtons() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase()
    const iOS = /iphone|ipad|ipod/.test(userAgent)
    const android = /android/.test(userAgent)

    setIsIOS(iOS)
    setIsAndroid(android)

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

  const handleAndroidInstall = async () => {
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

  const handleIOSInstall = () => {
    // Show iOS install instructions
    alert(
      'To install on iOS:\n\n' +
      '1. Tap the Share button (⎘) at the bottom of your screen\n' +
      '2. Scroll down and tap "Add to Home Screen"\n' +
      '3. Tap "Add" in the top right corner\n\n' +
      'The app will appear on your home screen!'
    )
  }

  // Don't show if already installed
  if (isInstalled) {
    return null
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <p className="text-sm text-primary-foreground/80">Download the App</p>
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Android Button */}
        {(isAndroid || (!isIOS && !isAndroid)) && (
          <Button
            onClick={handleAndroidInstall}
            variant="outline"
            size="lg"
            className="bg-white/95 text-primary border-2 border-white hover:bg-white shadow-lg flex items-center gap-3 font-heading"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.523 15.341c-.538 0-.969.426-.969.949 0 .523.431.949.969.949.537 0 .969-.426.969-.949 0-.523-.432-.949-.969-.949zm-11.046 0c-.538 0-.969.426-.969.949 0 .523.431.949.969.949.537 0 .969-.426.969-.949 0-.523-.432-.949-.969-.949zm11.209-6.695c.124-.164.135-.388.028-.566l-1.127-1.914a.452.452 0 00-.609-.166.454.454 0 00-.166.609l1.127 1.914a.402.402 0 00.747-.877zm-10.698 0a.402.402 0 00.747.877l1.127-1.914a.454.454 0 00-.166-.609.452.452 0 00-.609.166l-1.127 1.914a.409.409 0 00.028.566zM12 2c-.538 0-.969.426-.969.949v1.898c0 .523.431.949.969.949.537 0 .969-.426.969-.949V2.949c0-.523-.432-.949-.969-.949zm0 4.746a5.33 5.33 0 00-5.31 5.31v3.798h10.62v-3.798A5.33 5.33 0 0012 6.746zm8.123 5.31v3.798H21.5v-3.798h-1.377zm-17.746 0H1v3.798h1.377v-3.798zm16.746 5.698H4.877v2.849c0 .934.756 1.69 1.69 1.69h1.31v3.798c0 .523.431.949.969.949.537 0 .969-.426.969-.949v-3.798h2.37v3.798c0 .523.431.949.969.949.537 0 .969-.426.969-.949v-3.798h1.31c.934 0 1.69-.756 1.69-1.69v-2.849z"/>
            </svg>
            <div className="text-left">
              <div className="text-xs opacity-70">Get it on</div>
              <div className="font-semibold">Android</div>
            </div>
          </Button>
        )}

        {/* iOS Button */}
        {(isIOS || (!isIOS && !isAndroid)) && (
          <Button
            onClick={handleIOSInstall}
            variant="outline"
            size="lg"
            className="bg-white/95 text-primary border-2 border-white hover:bg-white shadow-lg flex items-center gap-3 font-heading"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            <div className="text-left">
              <div className="text-xs opacity-70">Download on the</div>
              <div className="font-semibold">App Store</div>
            </div>
          </Button>
        )}
      </div>
    </div>
  )
}
