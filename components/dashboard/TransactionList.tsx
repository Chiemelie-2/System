// components/dashboard/TransactionList.tsx

interface TransactionListProps {
  transactions: any[]
}

export function TransactionList({
  transactions,
}: TransactionListProps) {
  return (
    <div className="bg-white rounded-lg border p-4">
      <h3 className="text-lg font-semibold mb-4">
        Recent Transactions
      </h3>

      {transactions.length === 0 ? (
        <p className="text-gray-500">
          No transactions available.
        </p>
      ) : (
        <div className="space-y-2">
          {transactions.map((transaction, index) => (
            <div
              key={transaction.id ?? index}
              className="border-b pb-2"
            >
              {transaction.description ?? 'Transaction'}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}