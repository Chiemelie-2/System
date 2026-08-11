// components/layout/Header.tsx
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
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Quick Balance View */}
        <div className="flex items-center gap-4">
          {account && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showBalance ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M21 12a9 9 0 01-9 9m0-9h.01" />
                  )}
                </svg>
              </button>
              <div>
                <p className="text-xs text-gray-500">Available Balance</p>
                <AnimatePresence mode="wait">
                  {showBalance ? (
                    <motion.p
                      key="balance"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-sm font-semibold text-gray-900"
                    >
                      {formatCurrency(account.balance)}
                    </motion.p>
                  ) : (
                    <motion.p
                      key="hidden"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-sm font-semibold text-gray-400"
                    >
                      ****
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">
              {userProfile?.firstName} {userProfile?.lastName}
            </p>
            <p className="text-xs text-gray-500">
              {account && maskAccountNumber(account.accountNumber)}
            </p>
          </div>
          {userProfile?.profilePhoto ? (
            <img 
              src={userProfile.profilePhoto} 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center ring-2 ring-gray-200">
              <span className="text-primary-800 font-medium text-xs">
                {userProfile?.firstName?.[0]}{userProfile?.lastName?.[0]}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}