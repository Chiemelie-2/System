// app/(customer)/transactions/page.tsx
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/Card'
import { TransactionRow } from '@/components/dashboard/TransactionRow'
import { formatCurrency } from '@/lib/utils'
import { TransactionType } from '@prisma/client'

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
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">No Account Found</h2>
        <p className="text-gray-600 mt-2">Your account is still being set up.</p>
      </div>
    )
  }

  const whereClause = {
    accountId: account.id,
    ...(type && { transactionType: type as TransactionType }),
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
        <p className="text-gray-600 mt-1">View all your account transactions</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['ALL', 'CREDIT', 'DEBIT'].map((t) => (
          <a
            key={t}
            href={t === 'ALL' ? '/transactions' : `?type=${t}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              (t === 'ALL' && !type) || type === t
                ? 'bg-primary-100 text-primary-800'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {t === 'ALL' ? 'All' : t.charAt(0) + t.slice(1).toLowerCase()}
          </a>
        ))}
      </div>

      {/* Transactions List */}
      <Card>
        {transactions.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {transactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-900 font-medium">No transactions yet</p>
            <p className="text-gray-500 text-sm mt-1">Your transactions will appear here</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4 border-t border-gray-200">
            {[...Array(totalPages)].map((_, i) => (
              <a
                key={i}
                href={`?page=${i + 1}${type ? `&type=${type}` : ''}`}
                className={`px-3 py-1 rounded text-sm ${
                  page === i + 1
                    ? 'bg-primary-100 text-primary-800 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </a>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}