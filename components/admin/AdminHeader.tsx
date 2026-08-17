// components/admin/AdminHeader.tsx
// ── Drop-in replacement. Path in project: components/admin/AdminHeader.tsx ──
'use client'

import { useMobileMenu } from '@/components/layout/MobileMenuContext'

interface AdminHeaderProps {
  email: string
}

export function AdminHeader({ email }: AdminHeaderProps) {
  const { isOpen, toggle } = useMobileMenu()

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">

        {/* Left: hamburger + title */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            className="lg:hidden p-2 -ml-2 rounded-lg text-gray-500
                       hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              )}
            </svg>
          </button>

          <div className="hidden sm:block">
            <h1 className="text-[15px] font-bold text-primary-900 tracking-tight">
              Fiduciary
              <span className="ml-2 px-2 py-0.5 rounded-md text-[10px] font-bold
                               tracking-widest uppercase bg-gold-100 text-gold-700">
                Admin
              </span>
            </h1>
          </div>
        </div>

        {/* Right: admin info */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-gray-800">Administrator</p>
            <p className="text-[11px] text-gray-400 truncate max-w-[180px]">{email}</p>
          </div>
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-primary-950 flex items-center justify-center
                          ring-2 ring-gold-400/30">
            <svg className="w-4 h-4 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
        </div>
      </div>
    </header>
  )
}