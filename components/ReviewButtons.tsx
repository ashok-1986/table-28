'use client'

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
  const handleClick = (platform: 'google' | 'tripadvisor') => {
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
        className="w-full py-4 px-6 bg-[#4285F4] text-white font-body font-semibold text-sm tracking-wider uppercase rounded-md hover:opacity-90 transition-opacity"
      >
        Leave a Google Review
      </button>
      <button
        onClick={() => handleClick('tripadvisor')}
        className="w-full py-4 px-6 bg-[#00AA6C] text-white font-body font-semibold text-sm tracking-wider uppercase rounded-md hover:opacity-90 transition-opacity"
      >
        Leave a TripAdvisor Review
      </button>
    </div>
  )
}