// app/layout.tsx
// ── Drop-in replacement ──
//
// FIX: Removed the explicit <head> block. In the Next.js App Router, <head>
// is managed automatically. Placing font <link> tags inside an explicit <head>
// creates a second HTML tree that conflicts with the GlobalError component
// (which also renders <html><body>), causing the hydration error:
//   "You are mounting a new html component when a previous one has not unmounted"
//
// Google Fonts are now loaded via next/font/google — the correct approach for
// the App Router — which injects them at build time with zero layout shift.

import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Toaster } from 'sonner'
import { SkipLink } from '@/components/ui/SkipLink'
import { SessionProviderWrapper } from '@/components/providers/SessionProviderWrapper'
import { auth } from '@/lib/auth'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Fiduciary — Private Banking & Wealth Management',
    template: '%s | Fiduciary',
  },
  description:
    'Fiduciary delivers institutional-grade digital banking with precision, trust, and uncompromising security.',
  keywords: ['banking', 'wealth management', 'private banking', 'fintech', 'fiduciary'],
  authors: [{ name: 'Fiduciary' }],
  creator: 'Fiduciary',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${playfair.variable}`}
    >
      {/* No explicit <head> here — Next.js App Router handles it automatically */}
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <SessionProviderWrapper session={session}>
          <SkipLink />
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={4000}
          />
        </SessionProviderWrapper>
      </body>
    </html>
  )
}