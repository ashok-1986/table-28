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
  }

  return (
    <div className="flex flex-col gap-4">
      <a
        href={GOOGLE_REVIEW_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleClick('google')}
        className="w-full py-4 px-6 bg-[#4285F4] text-white font-body font-semibold text-sm tracking-wider uppercase rounded-md hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] duration-200 focus-visible:ring-2 focus-visible:ring-white outline-none flex items-center justify-center gap-3 shadow-md"
      >
        <svg className="w-5 h-5 flex-shrink-0 bg-white p-[2px] rounded-full" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M43.61 24.32c0-1.62-.15-3.19-.42-4.71H24v8.94h11.01c-.47 2.53-1.9 4.67-4.04 6.1l7.56 5.86c4.42-4.07 6.98-10.1 6.98-16.19z"/>
          <path fill="#34A853" d="M24 38.5c-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48c6.48 0 11.93-2.13 15.89-5.81l-7.56-5.86C30.13 37.66 27.22 38.5 24 38.5z"/>
          <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.98-6.19z"/>
        </svg>
        <span>Leave a Google Review</span>
        <span className="sr-only">(opens in a new tab)</span>
      </a>
      <a
        href={TRIPADVISOR_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleClick('tripadvisor')}
        className="w-full py-4 px-6 bg-[#00AA6C] text-white font-body font-semibold text-sm tracking-wider uppercase rounded-md hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] duration-200 focus-visible:ring-2 focus-visible:ring-white outline-none flex items-center justify-center gap-3 shadow-md"
      >
        <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 63.997 64" aria-hidden="true">
          <g transform="matrix(.568111 0 0 .568111 -18.190262 12.840025)">
            <path d="M88.28 0C73.612 0 60.36 3.694 49.91 10.523l-17.58.016s4.148 5.537 5.494 11.12L82.318 55.8l5.972 8.928 6.03-9.004 44.596-34.088c1.324-5.62 5.52-11.23 5.52-11.23l-18.734-.013C115.194 3.603 102.424 0 88.278 0z" fill="#000a12"/>
            <path d="M115.484 10.318a28.015 28.015 0 0 0-8.839 1.695 27.91 27.91 0 0 0-15.777 14.603c-1.418 3.075-2.22 6.326-2.475 9.597C87.35 21.873 75.515 10.497 60.98 10.2c8.04-3.44 17.278-5.3 27.29-5.3 10.08 0 19.18 1.817 27.213 5.418" fill="#fcc40f"/>
            <g stroke="#000a12">
              <circle r="25.132" cy="39.396" cx="60.072" fill="#fff" strokeWidth="5.847"/>
              <circle r="11.3" cy="39.396" cx="60.072" fill="none" strokeWidth="5.102"/>
            </g>
            <circle r="4.667" cy="39.396" cx="60.072" fill="#ef6a45"/>
            <g stroke="#000a12">
              <circle r="25.132" cy="39.346" cx="116.615" fill="#fff" strokeWidth="5.847"/>
              <circle r="11.3" cy="39.346" cx="116.615" fill="none" strokeWidth="5.102"/>
            </g>
            <circle r="4.667" cy="39.346" cx="116.615" fill="#00b087"/>
          </g>
        </svg>
        <span>Leave a TripAdvisor Review</span>
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </div>
  )
}