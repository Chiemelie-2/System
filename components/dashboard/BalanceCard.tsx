// components/dashboard/BalanceCard.tsx
'use client'

import { useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BalanceCardProps {
  balance: number | string
  accountNumber: string
  className?: string
}

export function BalanceCard({ balance, accountNumber, className }: BalanceCardProps) {
  const [isHidden, setIsHidden] = useState(true)

  const numBalance = typeof balance === 'string' ? parseFloat(balance) : balance

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-800 to-primary-900 p-6 text-white shadow-lg',
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="40" />
        </svg>
      </div>

      {/* Card Content */}
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-primary-200">Available Balance</p>
          <button
            onClick={() => setIsHidden(!isHidden)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isHidden ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M21 12a9 9 0 01-9 9m0-9h.01" />
              )}
            </svg>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {isHidden ? (
            <motion.div
              key="hidden"
              initial={{ opacity: 0, filter: 'blur(5px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(5px)' }}
              className="text-3xl font-bold tracking-tight"
            >
              $****.**
            </motion.div>
          ) : (
            <motion.div
              key="visible"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-3xl font-bold tracking-tight"
            >
              {formatCurrency(numBalance)}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-xs text-primary-200">Account Number</p>
          <p className="text-sm font-mono tracking-wider">{accountNumber}</p>
        </div>
      </div>
    </motion.div>
  )
}