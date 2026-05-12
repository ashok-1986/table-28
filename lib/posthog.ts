import posthog from 'posthog-js'

export function initPostHog() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.posthog.com'

  if (!key) {
    console.warn('NEXT_PUBLIC_POSTHOG_KEY not set')
    return null
  }

  posthog.init(key, {
    api_host: host,
    person_profiles: 'identified_only',
    autocapture: false,
  })

  return posthog
}

export { posthog }