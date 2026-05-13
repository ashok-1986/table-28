'use client'

import { useState } from 'react'
import { GOOGLE_REVIEW_URL, TRIPADVISOR_URL, type QRSource } from '@/lib/constants'
import { posthog } from '@/lib/posthog'

interface ReviewButtonsProps {
  source: QRSource
}

function getDevice(): 'iOS' | 'Android' | 'other' {
  if (typeof window === 'undefined') return 'other'
  const ua = navigator.userAgent
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS'
  if (ua.includes('Android')) return 'Android'
  return 'other'
}

export function ReviewButtons({ source }: ReviewButtonsProps) {
  const [loadingPlatform, setLoadingPlatform] = useState<'google' | 'tripadvisor' | null>(null)

  const handleClick = (platform: 'google' | 'tripadvisor') => {
    if (loadingPlatform) return
    setLoadingPlatform(platform)

    const timestamp = new Date().toISOString()

    try {
      posthog.capture('review_button_clicked', {
        platform,
        source,
        device: getDevice(),
        timestamp,
      })
    } catch (err) {
      console.error('PostHog capture failed:', err)
    }

    const url = platform === 'google' ? GOOGLE_REVIEW_URL : TRIPADVISOR_URL
    window.location.href = url
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => handleClick('google')}
        aria-label="Leave a Google review"
        disabled={loadingPlatform !== null}
        className="w-full py-4 px-6 bg-[#4285F4] text-white font-body font-semibold text-sm tracking-wider uppercase rounded-md hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loadingPlatform === 'google' ? 'Redirecting...' : 'Leave a Google Review'}
      </button>
      <button
        onClick={() => handleClick('tripadvisor')}
        aria-label="Leave a TripAdvisor review"
        disabled={loadingPlatform !== null}
        className="w-full py-4 px-6 bg-[#00AA6C] text-white font-body font-semibold text-sm tracking-wider uppercase rounded-md hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loadingPlatform === 'tripadvisor' ? 'Redirecting...' : 'Leave a TripAdvisor Review'}
      </button>
    </div>
  )
}
