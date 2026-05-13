import type { Metadata } from 'next'
import { PostHogProvider } from '@/components/PostHogProvider'
import { Cormorant_Garamond, Urbanist, DM_Mono } from 'next/font/google'
import './globals.css'

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
      <body className="min-h-screen font-body">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  )
}