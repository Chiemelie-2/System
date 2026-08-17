// components/layout/Header.tsx
// ── Drop-in replacement. Path in project: components/layout/Header.tsx ──
'use client'

import { useState } from 'react'
import { formatCurrency, maskAccountNumber } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useMobileMenu } from '@/components/layout/MobileMenuContext'

interface HeaderProps {
  userProfile: {
    firstName: string
    lastName: string
    profilePhoto: string | null
  } | null
  account: {
    balance: any
    accountNumber: string
  } | null
}

export function Header({ userProfile, account }: HeaderProps) {
  const [showBalance, setShowBalance] = useState(false)
  const { toggle: toggleMobileMenu, isOpen: isMobileMenuOpen } = useMobileMenu()

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">

        {/* Mobile hamburger */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-gray-500
                     hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            )}
          </svg>
        </button>

        {/* Balance quick-view */}
        <div className="flex items-center gap-4">
          {account && (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                aria-label={showBalance ? 'Hide balance' : 'Show balance'}
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showBalance ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  )}
                </svg>
              </button>
              <div>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                  Balance
                </p>
                <AnimatePresence mode="wait">
                  {showBalance ? (
                    <motion.p
                      key="balance"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm font-bold text-primary-800"
                    >
                      {formatCurrency(account.balance)}
                    </motion.p>
                  ) : (
                    <motion.p
                      key="hidden"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm font-bold text-gray-300 tracking-widest"
                    >
                      ••••••
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* User info + avatar */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[13px] font-semibold text-gray-900">
              {userProfile?.firstName} {userProfile?.lastName}
            </p>
            <p className="text-[11px] text-gray-400 font-mono">
              {account && maskAccountNumber(account.accountNumber)}
            </p>
          </div>
          {userProfile?.profilePhoto ? (
            <img
              src={userProfile.profilePhoto}
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-gold-300"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center
                            ring-2 ring-gold-300">
              <span className="text-primary-800 font-bold text-xs">
                {userProfile?.firstName?.[0]}{userProfile?.lastName?.[0]}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}