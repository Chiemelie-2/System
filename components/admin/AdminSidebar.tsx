// components/admin/AdminSidebar
'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useMobileMenu } from '@/components/layout/MobileMenuContext'
import { SignOutButton } from '@/components/auth/SignOutButton'

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  },
  {
    name: 'Verifications',
    href: '/admin/verifications',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    name: 'KYC Documents',
    href: '/admin/kyc',
    icon: 'M10 6H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-4M9 12h6m-6 4h3m5-12l4 4-6 6h-4v-4l6-6z',
  },
  {
    name: 'Balances',
    href: '/admin/balances',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    name: 'Deposit Requests',
    href: '/admin/deposit-requests',
    icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
  },
  {
    name: 'Transfer Requests',
    href: '/admin/transfer-requests',
    icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
  },
  {
    name: 'Deposit Accounts',
    href: '/admin/deposit-accounts',
    icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2z',
  },
  {
    name: 'Audit Logs',
    href: '/admin/audit-logs',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  },
]

interface AdminSidebarProps {
  adminEmail: string
  pendingCount: number
  pendingDepositCount?: number
  pendingTransferCount?: number
  role: string
}

function NavLinks({
  pathname,
  pendingCount,
  pendingDepositCount,
  pendingTransferCount,
  onNavigate,
}: {
  pathname: string | null
  pendingCount: number
  pendingDepositCount: number
  pendingTransferCount: number
  onNavigate?: () => void
}) {
  return (
    <>
      {navigation.map((item) => {
        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')

        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            )}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            {item.name}

            {item.name === 'Verifications' && pendingCount > 0 && (
              <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">
                {pendingCount}
              </span>
            )}
            {item.name === 'Deposit Requests' && pendingDepositCount > 0 && (
              <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">
                {pendingDepositCount}
              </span>
            )}
            {item.name === 'Transfer Requests' && pendingTransferCount > 0 && (
              <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">
                {pendingTransferCount}
              </span>
            )}
          </Link>
        )
      })}
    </>
  )
}

export function AdminSidebar({
  adminEmail,
  pendingCount,
  pendingDepositCount = 0,
  pendingTransferCount = 0,
  role,
}: AdminSidebarProps) {
  const pathname = usePathname()
  const { isOpen, close } = useMobileMenu()

  // Close the mobile drawer automatically whenever the route changes.
  useEffect(() => {
    close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <>
      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-gray-900 lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Admin navigation menu"
            >
              {/* Logo */}
              <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
                <Link href="/admin/dashboard" className="flex items-center gap-2" onClick={close}>
                  <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <span className="text-lg font-bold text-white">Admin</span>
                </Link>
                <button
                  onClick={close}
                  aria-label="Close menu"
                  className="p-1.5 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Admin Info */}
              <div className="px-6 py-4 border-b border-gray-800">
                <p className="text-sm text-gray-400 truncate">{adminEmail}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs bg-gray-700 text-gray-300 capitalize">
                  {role.toLowerCase()}
                </span>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                <NavLinks
                  pathname={pathname}
                  pendingCount={pendingCount}
                  pendingDepositCount={pendingDepositCount}
                  pendingTransferCount={pendingTransferCount}
                  onNavigate={close}
                />
              </nav>

              {/* Sign Out */}
              <div className="px-6 py-4 border-t border-gray-800">
                <SignOutButton className="flex items-center gap-2 w-full text-sm text-gray-400 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </SignOutButton>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-gray-900">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-800">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-lg font-bold text-white">Admin</span>
            </Link>
          </div>

          {/* Admin Info */}
          <div className="px-6 py-4 border-b border-gray-800">
            <p className="text-sm text-gray-400 truncate">{adminEmail}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs bg-gray-700 text-gray-300 capitalize">
              {role.toLowerCase()}
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <NavLinks
              pathname={pathname}
              pendingCount={pendingCount}
              pendingDepositCount={pendingDepositCount}
              pendingTransferCount={pendingTransferCount}
            />
          </nav>

          {/* Sign Out */}
          <div className="px-6 py-4 border-t border-gray-800">
            <SignOutButton className="flex items-center gap-2 w-full text-sm text-gray-400 hover:text-white transition-colors">
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