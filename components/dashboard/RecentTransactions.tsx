// components/dashboard/RecentTransactions.tsx
// ── New file. Path: app-src/components/dashboard/RecentTransactions.tsx ──
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Transaction {
  id: string
  transactionType: string
  amount: any
  description: string
  status: string
  createdAt: Date
}

function txIcon(type: string) {
  const isCredit = type === 'CREDIT' || type === 'DEPOSIT'
  const isTransfer = type === 'TRANSFER'
  if (isTransfer) {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
      </svg>
    )
  }
  if (isCredit) {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
      </svg>
    )
  }
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4"/>
    </svg>
  )
}

function txColors(type: string) {
  const isCredit = type === 'CREDIT' || type === 'DEPOSIT'
  const isTransfer = type === 'TRANSFER'
  if (isTransfer) return { icon: 'text-blue-600', bg: 'bg-blue-50', amount: 'text-blue-600' }
  if (isCredit) return { icon: 'text-emerald-600', bg: 'bg-emerald-50', amount: 'text-emerald-600' }
  return { icon: 'text-red-500', bg: 'bg-red-50', amount: 'text-red-500' }
}

export function RecentTransactions({
  transactions,
}: {
  transactions: Transaction[]
}) {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div>
          <h3 className="font-display font-bold text-[15px] text-primary-900">
            Recent Transactions
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Your latest account activity</p>
        </div>
        <Link
          href="/transactions"
          className="text-[12px] font-semibold text-primary-600 hover:text-primary-800
                     flex items-center gap-1 transition-colors"
        >
          View all
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>

      {/* List */}
      {transactions.length > 0 ? (
        <div className="divide-y divide-gray-50">
          {transactions.map((tx) => {
            const amount =
              typeof tx.amount === 'object' && typeof tx.amount.toNumber === 'function'
                ? tx.amount.toNumber()
                : parseFloat(tx.amount)
            const isCredit = tx.transactionType === 'CREDIT' || tx.transactionType === 'DEPOSIT'
            const colors = txColors(tx.transactionType)

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between px-5 py-3.5
                           hover:bg-gray-50/60 transition-colors"
              >
                {/* Icon + desc */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                      colors.bg,
                      colors.icon
                    )}
                  >
                    {txIcon(tx.transactionType)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-gray-900 truncate">
                      {tx.description}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {formatDate(tx.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Amount + status */}
                <div className="text-right flex-shrink-0 ml-4">
                  <p className={cn('text-[13px] font-bold', colors.amount)}>
                    {isCredit ? '+' : '-'}
                    {formatCurrency(Math.abs(amount))}
                  </p>
                  <p className="text-[10px] text-gray-400 capitalize mt-0.5">
                    {tx.status.toLowerCase()}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-14 text-center px-6">
          <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-3">
            <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-900">No transactions yet</p>
          <p className="text-xs text-gray-400 mt-1">Make a deposit to get started</p>
        </div>
      )}
    </div>
  )
}