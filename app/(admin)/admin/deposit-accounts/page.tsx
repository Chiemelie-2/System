// app/(admin)/admin/deposit-accounts/page.tsx
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/Card'
import { formatDate } from '@/lib/utils'
import { DepositAccountForm } from './DepositAccountForm'
import { DepositAccountToggle } from './DepositAccountToggle'

export default async function DepositAccountsPage() {
  const accounts = await prisma.depositDestinationAccount.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const activeCount = accounts.filter((a) => a.isActive).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Deposit Accounts</h1>
        <p className="text-gray-600 mt-1">
          These are the accounts customers are told to pay into when they request a deposit.
          Only active accounts are assigned to new requests.
        </p>
      </div>

      {activeCount === 0 && (
        <Card>
          <p className="text-sm text-red-600">
            No active deposit accounts. Customers won't be able to request a deposit until you
            add or activate at least one.
          </p>
        </Card>
      )}

      <Card>
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Add Deposit Account</h3>
        <DepositAccountForm />
      </Card>

      <div className="space-y-3">
        {accounts.map((account) => (
          <Card key={account.id}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-900">{account.bankName}</p>
                <p className="text-sm text-gray-600 font-mono">{account.accountNumber}</p>
                <p className="text-sm text-gray-500">{account.accountName}</p>
                <p className="text-xs text-gray-400 mt-1">Added {formatDate(account.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={account.isActive ? 'badge-success' : 'badge-warning'}>
                  {account.isActive ? 'Active' : 'Inactive'}
                </span>
                <DepositAccountToggle accountId={account.id} isActive={account.isActive} />
              </div>
            </div>
          </Card>
        ))}
        {accounts.length === 0 && (
          <Card>
            <p className="text-sm text-gray-500 text-center py-6">No deposit accounts yet.</p>
          </Card>
        )}
      </div>
    </div>
  )
}