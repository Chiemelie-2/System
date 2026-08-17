// components/admin/AdminSidebar.tsx
// ── Drop-in replacement. Path in project: components/admin/AdminSidebar.tsx ──
'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useMobileMenu } from '@/components/layout/MobileMenuContext'

const navigation = [
  { name: 'Dashboard',          href: '/admin/dashboard',         icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'Users',               href: '/admin/users',             icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { name: 'Verifications',       href: '/admin/verifications',     icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { name: 'KYC Documents',       href: '/admin/kyc',               icon: 'M10 6H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-4M9 12h6m-6 4h3m5-12l4 4-6 6h-4v-4l6-6z' },
  { name: 'Balances',            href: '/admin/balances',          icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { name: 'Deposit Requests',    href: '/admin/deposit-requests',  icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
  { name: 'Transfer Requests',   href: '/admin/transfer-requests', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
  { name: 'Deposit Accounts',    href: '/admin/deposit-accounts',  icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2z' },
  { name: 'Audit Logs',          href: '/admin/audit-logs',        icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
]

interface AdminSidebarProps {
  adminEmail: string
  pendingCount: number
  pendingDepositCount?: number
  pendingTransferCount?: number
  role: string
}

/* ── Logo shared component ── */
function FiduciaryAdminLogo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/admin/dashboard" onClick={onClick} className="flex items-center gap-2.5 group">
      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600
                      flex items-center justify-center shadow
                      group-hover:shadow-gold-400/30 transition-shadow duration-300">
        <span className="font-display font-bold text-white text-sm">F</span>
      </div>
      <div>
        <span className="font-display font-bold text-white text-base tracking-tight">Fiduciary</span>
        <div className="text-[10px] font-semibold tracking-widest text-gold-400/70 uppercase leading-none">
          Admin
        </div>
      </div>
    </Link>
  )
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
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:bg-white/[0.06] hover:text-gray-200'
            )}
          >
            <svg className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-gold-400' : '')}
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon}/>
            </svg>
            <span className="flex-1 truncate">{item.name}</span>

            {/* Badge indicators */}
            {item.name === 'Verifications' && pendingCount > 0 && (
              <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-danger-500 text-white">
                {pendingCount}
              </span>
            )}
            {item.name === 'Deposit Requests' && pendingDepositCount > 0 && (
              <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-danger-500 text-white">
                {pendingDepositCount}
              </span>
            )}
            {item.name === 'Transfer Requests' && pendingTransferCount > 0 && (
              <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-danger-500 text-white">
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

  useEffect(() => { close() }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  const SidebarInner = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex flex-col h-full bg-primary-950">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-white/[0.08]">
        <FiduciaryAdminLogo onClick={onNavigate}/>
        {onNavigate && (
          <button
            onClick={onNavigate}
            aria-label="Close menu"
            className="p-1.5 rounded-md text-gray-400 hover:bg-white/10 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>

      {/* Admin info */}
      <div className="px-5 py-4 border-b border-white/[0.08]">
        <p className="text-xs text-gray-400 truncate">{adminEmail}</p>
        <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold
                         tracking-wide uppercase bg-gold-500/20 text-gold-400">
          {role.toLowerCase()}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <NavLinks
          pathname={pathname}
          pendingCount={pendingCount}
          pendingDepositCount={pendingDepositCount}
          pendingTransferCount={pendingTransferCount}
          onNavigate={onNavigate}
        />
      </nav>

      {/* Sign out */}
      <div className="px-5 py-4 border-t border-white/[0.08]">
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-2 w-full text-sm text-gray-400
                       hover:text-white transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Sign Out
          </button>
        </form>
      </div>
    </div>
  )

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
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Admin navigation menu"
            >
              <SidebarInner onNavigate={close}/>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <SidebarInner/>
      </aside>
    </>
  )
}