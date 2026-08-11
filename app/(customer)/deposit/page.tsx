// app/(customer)/deposit/page.tsx
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { expireStaleDepositRequests } from '@/features/deposits/actions'
import { DepositForm } from './DepositForm'

export default async function DepositPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  // Flip any requests whose 1-hour payment window has passed before we read anything.
  await expireStaleDepositRequests()

  const account = await prisma.bankAccount.findFirst({
    where: { userId: session.user.id, status: 'ACTIVE' },
  })

  if (!account) {
    return (
      <div className="max-w-lg mx-auto py-12 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">No Active Account</h1>
        <p className="text-sm text-gray-600">
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
  )
}