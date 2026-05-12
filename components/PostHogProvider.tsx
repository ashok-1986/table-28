'use client'

import { useRef } from 'react'
import { initPostHog } from '@/lib/posthog'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false)

  if (!initialized.current) {
    initialized.current = true
    initPostHog()
  }

  return <>{children}</>
}