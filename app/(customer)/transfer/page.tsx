// app/(customer)/transfer/page.tsx
// ── Drop-in replacement ──
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { TransferForm } from './TransferForm'
import { getKycGate } from '@/features/kyc/actions'
import { VerificationRequired } from '@/components/dashboard/VerificationRequired'

export const metadata = { title: 'Transfer' }

export default async function TransferPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const gate = await getKycGate(session.user.id)
  if (!gate.allowed) {
    return <VerificationRequired action="send money" reason={gate.reason} />
  }

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
          You need a verified, active account before you can transfer funds.
        </p>
      </div>
    )
  }

  const recentRequests = await prisma.transferRequest.findMany({
    where: { fromAccountId: account.id },
    orderBy: { createdAt: 'desc' },
    take: 8,
  })

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Premium page header */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Account</p>
        <h1 className="font-display font-bold text-2xl text-primary-900 mt-0.5">Transfer Funds</h1>
        <p className="text-sm text-gray-400 mt-1">
          Send money to any Fiduciary account
        </p>
      </div>

      <TransferForm
        fromAccountNumber={account.accountNumber}
        fromBalance={account.balance.toNumber()}
        transfersEnabled={account.transfersEnabled}
        recentRequests={recentRequests.map((r) => ({
          id: r.id,
          amount: r.amount.toNumber(),
          toAccountNumber: r.toAccountNumber,
          reference: r.reference,
          status: r.status,
          rejectReason: r.rejectReason,
          createdAt: r.createdAt.toISOString(),
        }))}
      />
    </div>
  )
}