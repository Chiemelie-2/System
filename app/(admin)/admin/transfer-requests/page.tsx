// app/(admin)/admin/transfer-requests/page.tsx
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/Card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { TransferRequestActions } from './TransferRequestActions'

export default async function TransferRequestsPage() {
  const include = {
    user: { select: { email: true, profile: { select: { firstName: true, lastName: true } } } },
    fromAccount: { select: { accountNumber: true } },
    toAccount: { select: { accountNumber: true } },
  } as const

  const [pending, recent] = await Promise.all([
    prisma.transferRequest.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'asc' },
      include,
    }),
    prisma.transferRequest.findMany({
      where: { status: { in: ['APPROVED', 'REJECTED'] } },
      orderBy: { updatedAt: 'desc' },
      take: 20,
      include,
    }),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transfer Requests</h1>
        <p className="text-gray-600 mt-1">
          Funds are already deducted from the sender for every request below. Approving
          delivers them to the recipient; declining returns them to the sender.
        </p>
      </div>

      <div className="space-y-4">
        {pending.length === 0 && (
          <Card>
            <p className="text-sm text-gray-500 text-center py-6">No pending transfer requests.</p>
          </Card>
        )}
        {pending.map((r) => (
          <Card key={r.id}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-900">
                  {r.user.profile?.firstName} {r.user.profile?.lastName}
                </p>
                <p className="text-sm text-gray-500">{r.user.email}</p>
                <p className="text-xs text-gray-500 font-mono mt-1">
                  {r.fromAccount.accountNumber} → {r.toAccountNumber}
                  {!r.toAccount && (
                    <span className="ml-2 text-amber-600">(not found in this system)</span>
                  )}
                </p>
                {r.description && <p className="text-xs text-gray-500 mt-1">"{r.description}"</p>}
                <p className="text-xs text-gray-400 mt-1">
                  Requested {formatDate(r.createdAt)} · {r.reference}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-gray-900">{formatCurrency(r.amount.toNumber())}</span>
                <TransferRequestActions requestId={r.id} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {recent.length > 0 && (
        <div className="space-y-2 pt-4">
          <h2 className="text-sm font-semibold text-gray-700">Recently Processed</h2>
          {recent.map((r) => (
            <Card key={r.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {r.user.profile?.firstName} {r.user.profile?.lastName} — {formatCurrency(r.amount.toNumber())}
                  </p>
                  <p className="text-xs text-gray-500 font-mono">{r.reference}</p>
                  {r.status === 'REJECTED' && r.rejectReason && (
                    <p className="text-xs text-red-500 mt-0.5">{r.rejectReason}</p>
                  )}
                </div>
                <span className={r.status === 'APPROVED' ? 'badge-success' : 'badge-danger'}>
                  {r.status === 'APPROVED' ? 'Approved' : 'Rejected'}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}