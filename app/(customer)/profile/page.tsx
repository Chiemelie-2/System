// app/(customer)/profile/page.tsx
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/Card'
import { VerificationBadge } from '@/components/dashboard/VerificationBadge'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const session = await auth()

  const [profile, identification, address, account] = await Promise.all([
    prisma.customerProfile.findUnique({ where: { userId: session?.user?.id } }),
    prisma.identificationRecord.findUnique({ where: { userId: session?.user?.id } }),
    prisma.address.findUnique({ where: { userId: session?.user?.id } }),
    prisma.bankAccount.findFirst({ where: { userId: session?.user?.id } }),
  ])

  if (!profile) {
    return <div>Profile not found</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-1">Manage your personal information</p>
      </div>

      {/* Profile Header */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {profile.profilePhoto ? (
            <img src={profile.profilePhoto} alt="Profile" className="w-24 h-24 rounded-full object-cover ring-4 ring-primary-100" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-800 font-bold text-2xl">
                {profile.firstName?.[0]}{profile.lastName?.[0]}
              </span>
            </div>
          )}
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold text-gray-900">
              {profile.firstName} {profile.middleName ? profile.middleName + ' ' : ''}{profile.lastName}
            </h2>
            <VerificationBadge status={profile.verificationStatus} className="mt-2" />
            {account && (
              <p className="text-sm text-gray-600 mt-2">
                Account: {account.accountNumber} • Customer ID: {account.customerId}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card header={{ title: 'Personal Information' }}>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-500">Email</dt>
            <dd className="text-sm font-medium text-gray-900">{session?.user?.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Phone</dt>
            <dd className="text-sm font-medium text-gray-900">{profile.phoneNumber || '—'}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Date of Birth</dt>
            <dd className="text-sm font-medium text-gray-900">
              {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Nationality</dt>
            <dd className="text-sm font-medium text-gray-900">{profile.nationality || '—'}</dd>
          </div>
        </dl>
      </Card>

      {/* Address */}
      {address && (
        <Card header={{ title: 'Address' }}>
          <p className="text-sm text-gray-900">
            {address.residentialAddress}
            {address.apartmentSuite && `, ${address.apartmentSuite}`}
            <br />
            {address.city}, {address.state}
            <br />
            {address.country} {address.postalCode && `- ${address.postalCode}`}
          </p>
        </Card>
      )}

      {/* Documents */}
      {identification && (
        <Card header={{ title: 'Identification Documents' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-500">ID Type</dt>
              <dd className="text-sm font-medium text-gray-900">{identification.idType.replace('_', ' ')}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">ID Number</dt>
              <dd className="text-sm font-medium text-gray-900">{identification.idNumber}</dd>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}