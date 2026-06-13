import type { Metadata } from 'next'
import { Cormorant_Garamond, Urbanist, DM_Mono } from 'next/font/google'
import { PostHogProvider } from '@/components/PostHogProvider'
import './globals.css'

/**
 * Font optimization using next/font/google.
 * This allows Next.js to self-host fonts, eliminating 3rd party requests to Google Fonts.
 * It also prevents layout shift by automatically generating font-face rules with 'swap' display.
 * Expected performance impact: ~100-300ms faster LCP, 0 CLS from fonts.
 */
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-urbanist',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Table Twenty Eight | Leave a Review',
  description: 'Share your dining experience at Table Twenty Eight',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${urbanist.variable} ${dmMono.variable}`}>
      <body className={`${urbanist.className} min-h-screen`}>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  )
}