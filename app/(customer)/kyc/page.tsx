// app/(customer)/kyc/page.tsx
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { KycForm } from './KycForm'

export const dynamic = 'force-dynamic'

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  VERIFIED: 'bg-green-50 text-green-800 border-green-200',
  REJECTED: 'bg-red-50 text-red-800 border-red-200',
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pending review',
  VERIFIED: 'Verified',
  REJECTED: 'Rejected',
}

export default async function KycPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const kyc = await prisma.kycDocument.findUnique({
    where: { userId: session.user.id },
  })

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">KYC Verification</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload one document — Driver&apos;s License or ID Card. Withdrawals and transfers
          are enabled once your account and this document are verified.
        </p>
      </div>

      {kyc && (
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500">Document</p>
              <p className="text-sm font-medium text-gray-900">
                {kyc.documentType === 'DRIVERS_LICENSE' ? "Driver's License" : 'ID Card'}
              </p>
              {kyc.status === 'REJECTED' && kyc.rejectReason && (
                <p className="text-xs text-red-600 mt-2">Reason: {kyc.rejectReason}</p>
              )}
            </div>
            <span
              className={`px-3 py-1 rounded-full border text-xs font-semibold ${STATUS_STYLES[kyc.status]}`}
            >
              {STATUS_LABEL[kyc.status]}
            </span>
          </div>
        </Card>
      )}

      {kyc?.status !== 'VERIFIED' && (
        <Card header={{ title: kyc ? 'Replace document' : 'Upload document' }}>
          <KycForm />
        </Card>
      )}
    </div>
  )
}
