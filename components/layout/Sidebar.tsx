// components/layout/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { formatCurrency, maskAccountNumber } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useMobileMenu } from '@/components/layout/MobileMenuContext'
import { SignOutButton } from '@/components/auth/SignOutButton'

interface SidebarProps {
  userProfile: {
    firstName: string
    lastName: string
    profilePhoto: string | null
    verificationStatus: string
  } | null
  accountNumber: string | null
}

const navigation = [
  { 
    name: 'Overview', 
    href: '/dashboard', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  { 
    name: 'Transactions', 
    href: '/transactions', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    )
  },
  { 
    name: 'Deposit', 
    href: '/deposit', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    )
  },
  { 
    name: 'Transfer', 
    href: '/transfer', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    )
  },
  {
    name: 'KYC',
    href: '/kyc',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-4M9 12h6m-6 4h3m5-12l4 4-6 6h-4v-4l6-6z" />
      </svg>
    )
  },
  { 
    name: 'Profile', 
    href: '/profile', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
]

function SidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
              isActive
                ? 'bg-primary-50 text-primary-800'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <span className={cn(
              isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
            )}>
              {item.icon}
            </span>
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}

export function Sidebar({ userProfile, accountNumber }: SidebarProps) {
  const pathname = usePathname()
  const { isOpen: isMobileOpen, close: closeMobileMenu } = useMobileMenu()

  return (
    <>
      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/50"
              onClick={closeMobileMenu}
            />
            {/* Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
              className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white shadow-2xl"
            >
              {/* Logo + close */}
              <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                <Link href="/dashboard" className="flex items-center gap-2" onClick={closeMobileMenu}>
                  <div className="h-8 w-8 rounded-lg bg-primary-800 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">B</span>
                  </div>
                  <span className="text-lg font-bold text-primary-800">BankingSim</span>
                </Link>
                <button
                  onClick={closeMobileMenu}
                  aria-label="Close menu"
                  className="p-2 -mr-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* User Info */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  {userProfile?.profilePhoto ? (
                    <img
                      src={userProfile.profilePhoto}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-800 font-medium text-sm">
                        {userProfile?.firstName?.[0]}{userProfile?.lastName?.[0]}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {userProfile?.firstName} {userProfile?.lastName}
                    </p>
                    {accountNumber && (
                      <p className="text-xs text-gray-500">
                        {maskAccountNumber(accountNumber)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <SidebarNav pathname={pathname} onNavigate={closeMobileMenu} />

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200">
                <SignOutButton className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </SignOutButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary-800 flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-lg font-bold text-primary-800">BankingSim</span>
            </Link>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {userProfile?.profilePhoto ? (
                <img 
                  src={userProfile.profilePhoto} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-800 font-medium text-sm">
                    {userProfile?.firstName?.[0]}{userProfile?.lastName?.[0]}
                  </span>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {userProfile?.firstName} {userProfile?.lastName}
                </p>
                {accountNumber && (
                  <p className="text-xs text-gray-500">
                    {maskAccountNumber(accountNumber)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <SidebarNav pathname={pathname} />

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200">
            <SignOutButton className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </SignOutButton>
          </div>
        </div>
      </aside>
    </>
  )
}