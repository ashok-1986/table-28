'use client'

import { useState } from 'react'
import { ReviewButtons } from '@/components/ReviewButtons'
import { QR_SOURCES, type QRSource } from '@/lib/constants'

export default function LandingPage() {
  const [source] = useState<QRSource>(() => {
    if (typeof window === 'undefined') return 'unknown'
    const src = new URLSearchParams(window.location.search).get('src')
    return (src && QR_SOURCES.includes(src as typeof QR_SOURCES[number]))
      ? (src as QRSource)
      : 'unknown'
  })

  return (
    <main className="min-h-screen flex flex-col">
      <header className="bg-[#0D2414] py-8 px-6 text-center">
        <h1 className="font-display text-3xl font-light italic text-[#C9A84C]">
          Table Twenty Eight
        </h1>
        <p className="mt-2 text-sm text-[rgba(234,230,216,0.6)] font-body">
          Merchant Square, Glasgow
        </p>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <p className="font-body text-lg text-[#EAE6D8] mb-8 leading-relaxed">
            Thank you for dining with us.<br />
            We would love to hear about your experience.
          </p>

          <ReviewButtons source={source} />

          <p className="mt-8 text-xs text-[rgba(234,230,216,0.4)] font-body">
            Your feedback helps us improve and helps other diners make informed choices.
          </p>
        </div>
      </div>

      <footer className="py-6 text-center">
        <p className="text-xs text-[rgba(234,230,216,0.3)] font-mono">
          © 2026 Table Twenty Eight
        </p>
      </footer>
    </main>
  )
}