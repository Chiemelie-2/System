// components/dashboard/QuickActions.tsx
// ── New file. Path: app-src/components/dashboard/QuickActions.tsx ──
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface QuickActionsProps {
  transfersEnabled: boolean
}

const actions = [
  {
    label: 'Deposit',
    href: '/deposit',
    always: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
      </svg>
    ),
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 hover:bg-emerald-100',
  },
  {
    label: 'Transfer',
    href: '/transfer',
    needsTransfer: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
      </svg>
    ),
    color: 'text-blue-600',
    bg: 'bg-blue-50 hover:bg-blue-100',
  },
  {
    label: 'Transactions',
    href: '/transactions',
    always: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>
    ),
    color: 'text-violet-600',
    bg: 'bg-violet-50 hover:bg-violet-100',
  },
  {
    label: 'KYC',
    href: '/kyc',
    always: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
      </svg>
    ),
    color: 'text-amber-600',
    bg: 'bg-amber-50 hover:bg-amber-100',
  },
]

export function QuickActions({ transfersEnabled }: QuickActionsProps) {
  return (
    /* Horizontal scroll strip — Citi signature on mobile */
    <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
      {actions.map((action) => {
        const disabled = action.needsTransfer && !transfersEnabled
        return (
          <Link
            key={action.label}
            href={disabled ? '#' : action.href}
            aria-disabled={disabled}
            onClick={disabled ? (e) => e.preventDefault() : undefined}
            className={cn(
              'flex flex-col items-center gap-2 flex-shrink-0',
              'px-5 py-4 rounded-2xl border border-transparent',
              'transition-all duration-200 min-w-[88px]',
              disabled
                ? 'opacity-40 cursor-not-allowed bg-gray-50'
                : `${action.bg} cursor-pointer`
            )}
          >
            <div
              className={cn(
                'w-11 h-11 rounded-xl flex items-center justify-center bg-white shadow-sm',
                action.color
              )}
            >
              {action.icon}
            </div>
            <span className="text-[12px] font-semibold text-gray-700 whitespace-nowrap">
              {action.label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}