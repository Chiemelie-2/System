// components/dashboard/TransactionRow.tsx
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface TransactionRowProps {
  transaction: {
    id: string
    transactionType: string
    amount: any
    description: string
    status: string
    createdAt: Date
  }
}

export function TransactionRow({ transaction }: TransactionRowProps) {
  const amount = typeof transaction.amount === 'string' 
    ? parseFloat(transaction.amount) 
    : transaction.amount
    
  const isCredit = transaction.transactionType === 'CREDIT' || transaction.transactionType === 'DEPOSIT'

  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 transition-colors rounded-lg">
      <div className="flex items-center gap-3">
        <div className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center',
          isCredit ? 'bg-green-100' : 'bg-red-100'
        )}>
          <svg 
            className={cn('w-5 h-5', isCredit ? 'text-green-600' : 'text-red-600')} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {isCredit ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            )}
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
          <p className="text-xs text-gray-500">{formatDate(transaction.createdAt)}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={cn(
          'text-sm font-semibold',
          isCredit ? 'text-green-600' : 'text-red-600'
        )}>
          {isCredit ? '+' : '-'}{formatCurrency(Math.abs(amount))}
        </p>
        <p className="text-xs text-gray-500 capitalize">{transaction.status.toLowerCase()}</p>
      </div>
    </div>
  )
}