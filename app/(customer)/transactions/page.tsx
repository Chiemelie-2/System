// app/(customer)/transactions/page.tsx
// ── Drop-in replacement ──
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { TransactionType } from '@prisma/client'

export const dynamic = 'force-dynamic'

function txMeta(type: string) {
  const isCredit = type === 'CREDIT' || type === 'DEPOSIT'
  const isTransfer = type === 'TRANSFER'
  if (isTransfer) return {
    label: 'Transfer',
    bg: 'bg-blue-50', icon: 'text-blue-500',
    amount: 'text-blue-600',
    iconPath: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
    sign: '-',
  }
  if (isCredit) return {
    label: 'Credit',
    bg: 'bg-emerald-50', icon: 'text-emerald-500',
    amount: 'text-emerald-600',
    iconPath: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
    sign: '+',
  }
  return {
    label: 'Debit',
    bg: 'bg-red-50', icon: 'text-red-500',
    amount: 'text-red-600',
    iconPath: 'M20 12H4',
    sign: '-',
  }
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; page?: string }>
}) {
  const session = await auth()
  const { type, page: pageParam } = await searchParams
  const page = parseInt(pageParam || '1')
  const pageSize = 20

  const account = await prisma.bankAccount.findFirst({
    where: { userId: session?.user?.id },
  })

  if (!account) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2z"/>
          </svg>
        </div>
        <h2 className="font-display font-bold text-xl text-gray-900">No Account Found</h2>
        <p className="text-gray-500 text-sm mt-1">Your account is still being set up.</p>
      </div>
    )
  }

  const whereClause = {
    accountId: account.id,
    ...(type && type !== 'ALL' ? { transactionType: type as TransactionType } : {}),
  }

  const [transactions, totalCount] = await Promise.all([
    prisma.transaction.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.transaction.count({ where: whereClause }),
  ])

  const totalPages = Math.ceil(totalCount / pageSize)

  const tabs = [
    { key: 'ALL', label: 'All' },
    { key: 'CREDIT', label: 'Credits' },
    { key: 'DEBIT', label: 'Debits' },
    { key: 'TRANSFER', label: 'Transfers' },
  ]

  const activeTab = type || 'ALL'

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Account</p>
          <h1 className="font-display font-bold text-2xl text-primary-900 mt-0.5">
            Transaction History
          </h1>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs text-gray-400">Account</p>
          <p className="text-sm font-mono font-semibold text-gray-700">
            ••••{account.accountNumber.slice(-4)}
          </p>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total transactions', value: totalCount.toString() },
          { label: 'Showing page', value: `${page} / ${Math.max(totalPages, 1)}` },
          { label: 'Per page', value: pageSize.toString() },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl bg-white border border-gray-100 shadow-sm px-4 py-3 text-center"
          >
            <p className="font-display font-bold text-xl text-primary-900">{s.value}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs — Citi style horizontal pill row */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={tab.key === 'ALL' ? '/transactions' : `?type=${tab.key}`}
            className={cn(
              'flex-shrink-0 px-5 py-2 rounded-full text-[13px] font-semibold transition-all duration-200',
              activeTab === tab.key
                ? 'bg-primary-800 text-white shadow-sm'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-primary-200 hover:text-primary-700'
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Transaction list */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        {transactions.length > 0 ? (
          <>
            <div className="divide-y divide-gray-50">
                  {transactions.map((tx) => {
                  const meta = txMeta(tx.transactionType)
                  const amount = tx.amount.toNumber()

                  return (
                  <div
                    key={tx.id}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors"
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0',
                        meta.bg, meta.icon
                      )}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d={meta.iconPath}/>
                      </svg>
                    </div>

                    {/* Description + date */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-gray-900 truncate">
                        {tx.description}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {formatDate(tx.createdAt)}
                      </p>
                    </div>

                    {/* Type badge */}
                    <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full
                                     text-[10px] font-bold uppercase tracking-wide
                                     bg-gray-100 text-gray-500">
                      {meta.label}
                    </span>

                    {/* Amount + status */}
                    <div className="text-right flex-shrink-0">
                      <p className={cn('text-[14px] font-bold', meta.amount)}>
                        {meta.sign}{formatCurrency(Math.abs(amount))}
                      </p>
                      <p className="text-[10px] text-gray-400 capitalize mt-0.5">
                        {tx.status.toLowerCase()}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-50">
                <Link
                  href={`?page=${Math.max(1, page - 1)}${type ? `&type=${type}` : ''}`}
                  className={cn(
                    'flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors',
                    page <= 1
                      ? 'text-gray-300 pointer-events-none'
                      : 'text-primary-700 hover:bg-primary-50'
                  )}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                  </svg>
                  Previous
                </Link>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    const p = i + 1
                    return (
                      <Link
                        key={p}
                        href={`?page=${p}${type ? `&type=${type}` : ''}`}
                        className={cn(
                          'w-8 h-8 flex items-center justify-center rounded-lg text-[12px] font-semibold transition-colors',
                          page === p
                            ? 'bg-primary-800 text-white'
                            : 'text-gray-500 hover:bg-gray-100'
                        )}
                      >
                        {p}
                      </Link>
                    )
                  })}
                </div>

                <Link
                  href={`?page=${Math.min(totalPages, page + 1)}${type ? `&type=${type}` : ''}`}
                  className={cn(
                    'flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors',
                    page >= totalPages
                      ? 'text-gray-300 pointer-events-none'
                      : 'text-primary-700 hover:bg-primary-50'
                  )}
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <p className="font-display font-bold text-lg text-gray-900">No transactions found</p>
            <p className="text-sm text-gray-400 mt-1 max-w-xs">
              {activeTab === 'ALL'
                ? 'Make a deposit to see your first transaction here.'
                : `No ${activeTab.toLowerCase()} transactions yet.`}
            </p>
            <Link
              href="/deposit"
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                         bg-primary-800 text-white text-[13px] font-bold
                         hover:bg-primary-900 transition-colors"
            >
              Make a deposit
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}