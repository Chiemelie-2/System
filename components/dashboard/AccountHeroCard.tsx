// components/dashboard/AccountHeroCard.tsx
// ── New file. Path: app-src/components/dashboard/AccountHeroCard.tsx ──
'use client'

import { useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface AccountHeroCardProps {
  balance: number
  accountNumber: string
  routingNumber: string
  accountType: string
}

export function AccountHeroCard({
  balance,
  accountNumber,
  routingNumber,
  accountType,
}: AccountHeroCardProps) {
  const [showBalance, setShowBalance] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  function copy(value: string, label: string) {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(label)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl
                 bg-gradient-to-br from-primary-900 via-primary-800 to-[#1a2a6e]
                 text-white shadow-xl shadow-primary-900/30"
    >
      {/* Background arc pattern (Citi-style) */}
      <svg
        className="absolute -right-16 -top-16 w-72 h-72 opacity-[0.06]"
        viewBox="0 0 300 300"
        fill="none"
      >
        {[0, 1, 2, 3, 4, 5].map((n) => (
          <ellipse
            key={n}
            cx="300"
            cy="300"
            rx={70 + n * 40}
            ry={70 + n * 40}
            stroke="white"
            strokeWidth="1"
          />
        ))}
      </svg>
      <svg
        className="absolute -left-20 -bottom-20 w-64 h-64 opacity-[0.04]"
        viewBox="0 0 300 300"
        fill="none"
      >
        {[0, 1, 2, 3].map((n) => (
          <ellipse
            key={n}
            cx="0"
            cy="300"
            rx={80 + n * 50}
            ry={80 + n * 50}
            stroke="white"
            strokeWidth="1"
          />
        ))}
      </svg>

      <div className="relative p-6 sm:p-8">
        {/* Top row */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] text-white/50 uppercase">
              Fiduciary {accountType.toLowerCase()} account
            </p>
            <p className="text-[13px] text-white/60 mt-0.5 font-mono">
              ••••{accountNumber.slice(-4)}
            </p>
          </div>
          {/* Gold F badge */}
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600
                          flex items-center justify-center shadow-lg">
            <span className="font-display font-bold text-white text-sm">F</span>
          </div>
        </div>

        {/* Balance */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-white/50 uppercase">
              Available Balance
            </p>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-1 rounded-md hover:bg-white/10 transition-colors"
              aria-label={showBalance ? 'Hide balance' : 'Show balance'}
            >
              <svg className="w-3.5 h-3.5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showBalance ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                )}
              </svg>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {showBalance ? (
              <motion.p
                key="shown"
                initial={{ opacity: 0, filter: 'blur(8px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(8px)' }}
                className="font-display font-bold text-[clamp(2rem,6vw,3rem)]
                           leading-none tracking-tight"
              >
                {formatCurrency(balance)}
              </motion.p>
            ) : (
              <motion.p
                key="hidden"
                initial={{ opacity: 0, filter: 'blur(8px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(8px)' }}
                className="font-display font-bold text-[clamp(2rem,6vw,3rem)]
                           leading-none tracking-tight text-white/20"
              >
                ₦•••,•••.••
              </motion.p>
            )}
          </AnimatePresence>

          {/* Gold progress-bar underline (Citi signature) */}
          <div className="mt-4 h-0.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-gradient-to-r from-gold-400 to-gold-500 rounded-full"/>
          </div>
        </div>

        {/* Account details row */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
          {/* Account number */}
          <button
            onClick={() => copy(accountNumber, 'account')}
            className="text-left group"
          >
            <p className="text-[10px] tracking-widest text-white/40 uppercase font-medium">
              Account No.
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-sm font-mono font-semibold text-white/80 group-hover:text-white transition-colors">
                {accountNumber}
              </p>
              <svg
                className="w-3 h-3 text-white/30 group-hover:text-gold-400 transition-colors"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </div>
            {copied === 'account' && (
              <p className="text-[10px] text-gold-400 mt-0.5">Copied!</p>
            )}
          </button>

          {/* Routing number */}
          <button
            onClick={() => copy(routingNumber, 'routing')}
            className="text-left group"
          >
            <p className="text-[10px] tracking-widest text-white/40 uppercase font-medium">
              Routing No.
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-sm font-mono font-semibold text-white/80 group-hover:text-white transition-colors">
                {routingNumber}
              </p>
              <svg
                className="w-3 h-3 text-white/30 group-hover:text-gold-400 transition-colors"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </div>
            {copied === 'routing' && (
              <p className="text-[10px] text-gold-400 mt-0.5">Copied!</p>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}