// app/(admin)/admin/deposit-requests/page.tsx
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/Card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { expireStaleDepositRequests } from '@/features/deposits/actions'
import { DepositRequestActions } from './DepositRequestActions'

export default async function DepositRequestsPage() {
  await expireStaleDepositRequests()

  const include = {
    user: { select: { email: true, profile: { select: { firstName: true, lastName: true } } } },
    account: { select: { accountNumber: true } },
    destinationAccount: { select: { bankName: true, accountNumber: true, accountName: true } },
  } as const

  const [awaitingPayment, processing, recent] = await Promise.all([
    prisma.depositRequest.findMany({
      where: { status: 'AWAITING_PAYMENT' },
      orderBy: { createdAt: 'asc' },
      include,
    }),
    prisma.depositRequest.findMany({
      where: { status: 'PROCESSING' },
      orderBy: { customerConfirmedAt: 'asc' },
      include,
    }),
    prisma.depositRequest.findMany({
      where: { status: { in: ['APPROVED', 'REJECTED', 'EXPIRED', 'CANCELLED'] } },
      orderBy: { updatedAt: 'desc' },
      take: 20,
      include,
    }),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Deposit Requests</h1>
        <p className="text-gray-600 mt-1">
          Approving a request credits the customer's balance immediately.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">
          Awaiting Your Confirmation {processing.length > 0 && `(${processing.length})`}
        </h2>
        {processing.length === 0 && (
          <Card>
            <p className="text-sm text-gray-500 text-center py-6">
              Nothing to confirm right now — customers show up here once they mark a request as paid.
            </p>
          </Card>
        )}
        {processing.map((r) => (
          <Card key={r.id}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-900">
                  {r.user.profile?.firstName} {r.user.profile?.lastName}
                </p>
                <p className="text-sm text-gray-500">{r.user.email}</p>
                <p className="text-xs text-gray-500 font-mono mt-1">
                  Acct {r.account.accountNumber} · {r.reference}
                </p>
                {r.destinationAccount && (
                  <p className="text-xs text-gray-500 mt-1">
                    Paid into {r.destinationAccount.bankName} — {r.destinationAccount.accountNumber}
                  </p>
                )}
                {r.note && <p className="text-xs text-gray-500 mt-1">"{r.note}"</p>}
                <p className="text-xs text-gray-400 mt-1">
                  Confirmed by customer {r.customerConfirmedAt ? formatDate(r.customerConfirmedAt) : '—'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-gray-900">{formatCurrency(r.amount.toNumber())}</span>
                <DepositRequestActions requestId={r.id} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">
          Awaiting Payment {awaitingPayment.length > 0 && `(${awaitingPayment.length})`}
        </h2>
        {awaitingPayment.length === 0 ? (
          <Card>
            <p className="text-sm text-gray-500 text-center py-6">No requests waiting on customer payment.</p>
          </Card>
        ) : (
          awaitingPayment.map((r) => (
            <Card key={r.id}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">
                    {r.user.profile?.firstName} {r.user.profile?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{r.user.email}</p>
                  <p className="text-xs text-gray-500 font-mono mt-1">{r.reference}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Window expires {formatDate(r.expiresAt)}
                  </p>
                </div>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(r.amount.toNumber())}</span>
              </div>
            </Card>
          ))
        )}
      </div>

      {recent.length > 0 && (
        <div className="space-y-2 pt-2">
          <h2 className="text-sm font-semibold text-gray-700">Recently Processed</h2>
          {recent.map((r) => (
            <Card key={r.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {r.user.profile?.firstName} {r.user.profile?.lastName} — {formatCurrency(r.amount.toNumber())}
                  </p>
                  <p className="text-xs text-gray-500 font-mono">{r.reference}</p>
                </div>
                <span
                  className={
                    r.status === 'APPROVED'
                      ? 'badge-success'
                      : r.status === 'REJECTED'
                        ? 'badge-danger'
                        : 'badge-warning'
                  }
                >
                  {r.status.charAt(0) + r.status.slice(1).toLowerCase()}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}