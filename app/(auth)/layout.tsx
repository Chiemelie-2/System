// app/(auth)/layout.tsx
// ── Drop-in replacement. Path in project: app/(auth)/layout.tsx ──
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Sign in or create your Fiduciary account',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen relative flex flex-col bg-primary-950">

      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full
                        bg-primary-700/20 blur-3xl"/>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full
                        bg-gold-500/10 blur-3xl"/>
        {/* Fine grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600
                          flex items-center justify-center shadow-lg
                          group-hover:shadow-gold-500/30 transition-shadow duration-300">
            <span className="font-display font-bold text-white text-base">F</span>
          </div>
          <span className="font-display font-bold text-white text-xl tracking-tight">
            Fiduciary
          </span>
        </Link>
      </header>

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card wrapper for auth forms */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04]
                          backdrop-blur-sm shadow-2xl shadow-black/40 p-8">
            {children}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-white/30">
          © {new Date().getFullYear()} Fiduciary. All rights reserved.
        </p>
      </div>
    </div>
  )
}