// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { SkipLink } from '@/components/ui/SkipLink'
import { SessionProviderWrapper } from '@/components/providers/SessionProviderWrapper'
import { auth } from '@/lib/auth'
import './globals.css'

const inter = {
  className: '',
}

export const metadata: Metadata = {
  title: {
    default: 'BankingSim - Digital Banking Simulation',
    template: '%s | BankingSim'
  },
  description: 'A professional digital banking simulation platform for portfolio and educational use.',
  keywords: ['banking', 'simulation', 'fintech', 'portfolio', 'demo'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en" className={inter.className}>
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