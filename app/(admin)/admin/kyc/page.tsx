// app/(admin)/admin/kyc/page.tsx
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/Card'
import { KycActions } from './KycActions'

export const dynamic = 'force-dynamic'

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  VERIFIED: 'bg-green-50 text-green-800 border-green-200',
  REJECTED: 'bg-red-50 text-red-800 border-red-200',
}

export default async function AdminKycPage() {
  const documents = await prisma.kycDocument.findMany({
    include: {
      user: {
        select: {
          email: true,
          profile: { select: { firstName: true, lastName: true } },
        },
      },
    },
    orderBy: [{ status: 'asc' }, { createdAt: 'asc' }],
  })

  const pendingCount = documents.filter((d) => d.status === 'PENDING').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">KYC Documents</h1>
        <p className="text-gray-600 mt-1">
          {pendingCount} document{pendingCount !== 1 ? 's' : ''} pending review
        </p>
      </div>

      {documents.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900">Nothing to review</h3>
            <p className="text-gray-500 mt-1">No KYC documents have been uploaded yet</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {doc.user.profile?.firstName} {doc.user.profile?.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{doc.user.email}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {doc.documentType === 'DRIVERS_LICENSE' ? "Driver's License" : 'ID Card'} •
                      Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                    {doc.status === 'REJECTED' && doc.rejectReason && (
                      <p className="text-xs text-red-600 mt-1">Reason: {doc.rejectReason}</p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full border text-xs font-semibold ${STATUS_STYLES[doc.status]}`}
                  >
                    {doc.status}
                  </span>
                </div>

                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={doc.fileUrl}
                    alt="KYC document"
                    className="max-h-64 rounded-lg border border-gray-200 object-contain"
                  />
                </a>

                {doc.status !== 'VERIFIED' && <KycActions userId={doc.userId} />}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
