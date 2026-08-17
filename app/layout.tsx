// app/layout.tsx
import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { SkipLink } from '@/components/ui/SkipLink'
import { SessionProviderWrapper } from '@/components/providers/SessionProviderWrapper'
import { auth } from '@/lib/auth'
import './globals.css'

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
    <html lang="en" data-scroll-behavior="smooth">
      {/*
        Load Inter + Playfair Display from Google Fonts.
        Place the <link> tags in <head> for SSR performance.
      */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
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