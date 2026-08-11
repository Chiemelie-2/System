// app/(admin)/admin/balances/page.tsx
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import { AdjustBalanceForm } from './AdjustBalanceForm'

export const dynamic = 'force-dynamic'

export default async function BalancesPage() {
  const accounts = await prisma.bankAccount.findMany({
    include: {
      user: {
        select: {
          email: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Balance Management</h1>
        <p className="text-gray-600 mt-1">Add or deduct virtual funds from accounts</p>
      </div>

      <div className="space-y-4">
        {accounts.map((account) => (
          <Card key={account.id}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-900">
                  {account.user.profile?.firstName} {account.user.profile?.lastName}
                </p>
                <p className="text-sm text-gray-500">{account.user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">Account:</span>
                  <span className="text-xs font-mono font-medium">{account.accountNumber}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Current Balance</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(account.balance.toNumber())}
                  </p>
                </div>
                
                <AdjustBalanceForm accountId={account.id} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}