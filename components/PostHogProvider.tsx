'use client'

import { useEffect, useState } from 'react'
import { initPostHog, posthog } from '@/lib/posthog'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!initialized) {
      initPostHog()
      setInitialized(true)
    }
  }, [initialized])

  return <>{children}</>
}