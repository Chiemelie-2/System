// app/(customer)/deposit/page.tsx
// ── Drop-in replacement ──
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { expireStaleDepositRequests } from '@/features/deposits/actions'
import { DepositForm } from './DepositForm'

export const metadata = { title: 'Deposit' }

export default async function DepositPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  await expireStaleDepositRequests()

  const account = await prisma.bankAccount.findFirst({
    where: { userId: session.user.id, status: 'ACTIVE' },
  })

  if (!account) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
        <h1 className="font-display font-bold text-xl text-gray-900 mb-2">No Active Account</h1>
        <p className="text-sm text-gray-500">
          You need a verified, active account before you can request a deposit.
        </p>
      </div>
    )
  }

  const activeRequest = await prisma.depositRequest.findFirst({
    where: {
      userId: session.user.id,
      status: { in: ['AWAITING_PAYMENT', 'PROCESSING'] },
    },
    include: { destinationAccount: true },
    orderBy: { createdAt: 'desc' },
  })

  const recentRequests = await prisma.depositRequest.findMany({
    where: {
      accountId: account.id,
      status: { in: ['APPROVED', 'REJECTED', 'EXPIRED', 'CANCELLED'] },
    },
    orderBy: { updatedAt: 'desc' },
    take: 5,
  })

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Premium page header */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Account</p>
        <h1 className="font-display font-bold text-2xl text-primary-900 mt-0.5">Deposit Funds</h1>
        <p className="text-sm text-gray-400 mt-1">
          Fund your Fiduciary account securely
        </p>
      </div>

      <DepositForm
        accountNumber={account.accountNumber}
        routingNumber={account.routingNumber}
        accountType={account.accountType}
        balance={account.balance.toNumber()}
        activeRequest={
          activeRequest
            ? {
                id: activeRequest.id,
                amount: activeRequest.amount.toNumber(),
                reference: activeRequest.reference,
                status: activeRequest.status as 'AWAITING_PAYMENT' | 'PROCESSING',
                expiresAt: activeRequest.expiresAt.toISOString(),
                destination: activeRequest.destinationAccount
                  ? {
                      bankName: activeRequest.destinationAccount.bankName,
                      accountNumber: activeRequest.destinationAccount.accountNumber,
                      accountName: activeRequest.destinationAccount.accountName,
                    }
                  : null,
              }
            : null
        }
        recentRequests={recentRequests.map((r) => ({
          id: r.id,
          amount: r.amount.toNumber(),
          reference: r.reference,
          status: r.status,
          rejectReason: r.rejectReason,
        }))}
      />
    </div>
  )
}