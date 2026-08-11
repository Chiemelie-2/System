// app/(admin)/admin/users/[userId]/page.tsx
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { VerificationBadge } from '@/components/dashboard/VerificationBadge'
import { ToggleUserStatus } from './ToggleUserStatus'
import { ToggleTransferAccess } from './ToggleTransferAccess'

export default async function UserDetailPage({
  params,
}: {
  params: { userId: string }
}) {
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    include: {
      profile: true,
      identification: true,
      address: true,
      accounts: {
        include: {
          transactions: {
            take: 10,
            orderBy: { createdAt: 'desc' }
          }
        }
      }
    }
  })

  if (!user) notFound()

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <a href="/admin/users" className="text-sm text-primary-600 hover:text-primary-700">
        ← Back to Users
      </a>

      {/* User Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {user.profile?.profilePhoto && (
            <img src={user.profile.profilePhoto} alt="" className="w-16 h-16 rounded-full" />
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.profile?.firstName} {user.profile?.lastName}
            </h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
        <ToggleUserStatus userId={user.id} currentStatus={user.status} />
      </div>

      {user.accounts[0] && (
        <div className="flex justify-end">
          <ToggleTransferAccess
            userId={user.id}
            transfersEnabled={user.accounts[0].transfersEnabled}
          />
        </div>
      )}

      {/* Account Info */}
      {user.accounts.map((account) => (
        <Card key={account.id} header={{ title: 'Account Information' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Account Number</p>
              <p className="font-mono font-medium">{account.accountNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Balance</p>
              <p className="font-bold text-lg">{formatCurrency(account.balance)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Customer ID</p>
              <p className="font-mono text-sm">{account.customerId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                account.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {account.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Transfers</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                account.transfersEnabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {account.transfersEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </Card>
      ))}

      {/* Verification Status */}
      {user.profile && (
        <Card header={{ title: 'Verification Status' }}>
          <div className="flex items-center gap-3">
            <VerificationBadge status={user.profile.verificationStatus} />
            {user.profile.verificationStatus === 'PENDING_REVIEW' && (
              <a href="/admin/verifications" className="text-sm text-primary-600">
                Review →
              </a>
            )}
          </div>
        </Card>
      )}

      {/* Recent Transactions */}
      {user.accounts[0]?.transactions.length > 0 && (
        <Card header={{ title: 'Recent Transactions' }}>
          <div className="space-y-2">
            {user.accounts[0].transactions.map((txn) => (
              <div key={txn.id} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium">{txn.description}</p>
                  <p className="text-xs text-gray-500">{formatDate(txn.createdAt)}</p>
                </div>
                <span className={`font-semibold ${
                  txn.transactionType === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {txn.transactionType === 'CREDIT' ? '+' : '-'}{formatCurrency(Number(txn.amount))}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}