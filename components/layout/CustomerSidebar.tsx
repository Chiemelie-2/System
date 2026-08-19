// components/layout/CustomerSidebar.tsx
// ── New file. Path: app-src/components/layout/CustomerSidebar.tsx ──
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useMobileMenu } from '@/components/layout/MobileMenuContext'
import { signOutAction } from '@/features/auth/signout'

interface CustomerSidebarProps {
  userProfile: {
    firstName: string
    lastName: string
    profilePhoto: string | null
    verificationStatus: string
  } | null
  accountNumber: string | null
}

const navItems = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
      </svg>
    ),
  },
  {
    label: 'Transactions',
    href: '/transactions',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>
    ),
  },
  {
    label: 'Deposit',
    href: '/deposit',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
      </svg>
    ),
  },
  {
    label: 'Transfer',
    href: '/transfer',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
      </svg>
    ),
  },
  {
    label: 'KYC',
    href: '/kyc',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
      </svg>
    ),
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
      </svg>
    ),
  },
]

/* ─── Logo ─── */
function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/dashboard"
      onClick={onClick}
      className="flex items-center gap-2.5 group"
    >
      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600
                      flex items-center justify-center shadow-md
                      group-hover:shadow-gold-400/30 transition-shadow duration-300">
        <span className="font-display font-bold text-white text-base">F</span>
      </div>
      <span className="font-display font-bold text-primary-900 text-lg tracking-tight">
        Fiduciary
      </span>
    </Link>
  )
}

/* ─── Avatar ─── */
function Avatar({
  profile,
  size = 'md',
}: {
  profile: CustomerSidebarProps['userProfile']
  size?: 'sm' | 'md'
}) {
  const dim = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'
  if (profile?.profilePhoto) {
    return (
      <img
        src={profile.profilePhoto}
        alt="Profile"
        className={`${dim} rounded-full object-cover ring-2 ring-gold-300`}
      />
    )
  }
  return (
    <div
      className={`${dim} rounded-full bg-primary-50 ring-2 ring-gold-300
                  flex items-center justify-center font-bold text-primary-800`}
    >
      {profile?.firstName?.[0]}
      {profile?.lastName?.[0]}
    </div>
  )
}

/* ─── Nav links ─── */
function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <nav className="flex-1 px-3 py-4 space-y-0.5">
      {navItems.map((item) => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
              active
                ? 'bg-primary-50 text-primary-800'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <span
              className={cn(
                'transition-colors duration-200',
                active
                  ? 'text-gold-600'
                  : 'text-gray-400 group-hover:text-primary-600'
              )}
            >
              {item.icon}
            </span>
            {item.label}
            {active && (
              <div className="ml-auto h-1.5 w-1.5 rounded-full bg-gold-500" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}

/* ─── Sign-out button (uses Server Action — fixes broken logout) ─── */
function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="flex w-full items-center gap-2 px-3 py-2 rounded-xl
                   text-sm font-medium text-gray-400
                   hover:bg-red-50 hover:text-red-600 transition-all duration-200"
      >
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
        Sign Out
      </button>
    </form>
  )
}

export function CustomerSidebar({
  userProfile,
  accountNumber,
}: CustomerSidebarProps) {
  const pathname = usePathname()
  const { isOpen, close } = useMobileMenu()

  return (
    <>
      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={close}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
              className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between h-16 px-5 border-b border-gray-100">
                <Logo onClick={close} />
                <button
                  onClick={close}
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              {/* User info */}
              <div className="px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Avatar profile={userProfile} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {userProfile?.firstName} {userProfile?.lastName}
                    </p>
                    {accountNumber && (
                      <p className="text-xs text-gray-400 font-mono">
                        ••••{accountNumber.slice(-4)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <NavLinks pathname={pathname} onNavigate={close} />

              <div className="px-4 py-4 border-t border-gray-100">
                <SignOutButton />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col h-full bg-white border-r border-gray-100 shadow-sm">
          {/* Logo */}
          <div className="flex items-center h-16 px-5 border-b border-gray-100">
            <Logo />
          </div>

          {/* User info */}
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Avatar profile={userProfile} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {userProfile?.firstName} {userProfile?.lastName}
                </p>
                {accountNumber && (
                  <p className="text-xs text-gray-400 font-mono">
                    ••••{accountNumber.slice(-4)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <NavLinks pathname={pathname} />

          {/* Bottom: sign out */}
          <div className="px-4 py-4 border-t border-gray-100">
            <SignOutButton />
          </div>
        </div>
      </aside>
    </>
  )
}