// app/(customer)/profile/page.tsx
// ── Drop-in replacement ──
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { VerificationBadge } from '@/components/dashboard/VerificationBadge'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Profile' }

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5 border-b border-gray-50 last:border-0">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 flex-shrink-0 pt-0.5">
        {label}
      </p>
      <p className="text-[13px] font-semibold text-gray-800 text-right">
        {value || <span className="text-gray-300 font-normal">—</span>}
      </p>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50">
        <h3 className="font-display font-bold text-[15px] text-primary-900">{title}</h3>
      </div>
      <div className="px-5 py-2">{children}</div>
    </div>
  )
}

export default async function ProfilePage() {
  const session = await auth()

  const [profile, identification, address, account] = await Promise.all([
    prisma.customerProfile.findUnique({ where: { userId: session?.user?.id } }),
    prisma.identificationRecord.findUnique({ where: { userId: session?.user?.id } }),
    prisma.address.findUnique({ where: { userId: session?.user?.id } }),
    prisma.bankAccount.findFirst({ where: { userId: session?.user?.id } }),
  ])

  if (!profile) {
    return (
      <div className="text-center py-12 text-gray-500">Profile not found.</div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Page header */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Account</p>
        <h1 className="font-display font-bold text-2xl text-primary-900 mt-0.5">My Profile</h1>
        <p className="text-sm text-gray-400 mt-1">Your personal information and documents</p>
      </div>

      {/* Profile hero card */}
      <div className="rounded-2xl overflow-hidden shadow-sm">
        {/* Navy header strip */}
        <div className="bg-gradient-to-br from-primary-900 to-primary-800 px-6 pt-8 pb-14 relative">
          <div className="absolute top-4 right-5">
            <VerificationBadge status={profile.verificationStatus} />
          </div>
          {/* Arc decoration */}
          <svg className="absolute -right-8 -top-8 w-48 h-48 opacity-[0.06]" viewBox="0 0 200 200" fill="none">
            {[0,1,2,3].map(n => (
              <ellipse key={n} cx="200" cy="200" rx={60+n*35} ry={60+n*35} stroke="white" strokeWidth="1"/>
            ))}
          </svg>
        </div>

        {/* Avatar overlapping the strip */}
        <div className="bg-white px-6 pb-6 -mt-10 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            {/* Avatar */}
            {profile.profilePhoto ? (
              <img
                src={profile.profilePhoto}
                alt="Profile"
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-primary-50 ring-4 ring-white shadow-lg
                              flex items-center justify-center">
                <span className="font-display font-bold text-2xl text-primary-700">
                  {profile.firstName?.[0]}{profile.lastName?.[0]}
                </span>
              </div>
            )}
            <div className="pb-1">
              <h2 className="font-display font-bold text-xl text-primary-900">
                {profile.firstName}{' '}
                {profile.middleName ? profile.middleName + ' ' : ''}
                {profile.lastName}
              </h2>
              {account && (
                <p className="text-xs text-gray-400 mt-0.5 font-mono">
                  {account.accountNumber} · ID {account.customerId}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Personal info */}
      <Section title="Personal Information">
        <InfoRow label="Email" value={session?.user?.email} />
        <InfoRow label="Phone" value={profile.phoneNumber} />
        <InfoRow
          label="Date of Birth"
          value={
            profile.dateOfBirth
              ? new Date(profile.dateOfBirth).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : null
          }
        />
        <InfoRow label="Nationality" value={profile.nationality} />
      </Section>

      {/* Address */}
      {address && (
        <Section title="Address">
          <InfoRow label="Street" value={address.residentialAddress} />
          {address.apartmentSuite && (
            <InfoRow label="Apt / Suite" value={address.apartmentSuite} />
          )}
          <InfoRow label="City" value={address.city} />
          <InfoRow label="State" value={address.state} />
          <InfoRow label="Country" value={address.country} />
          {address.postalCode && (
            <InfoRow label="Postal Code" value={address.postalCode} />
          )}
        </Section>
      )}

      {/* Identification */}
      {identification && (
        <Section title="Identification Documents">
          <InfoRow
            label="Document Type"
            value={identification.idType.replace(/_/g, ' ')}
          />
          <InfoRow label="ID Number" value={identification.idNumber} />
        </Section>
      )}

      {/* Account info */}
      {account && (
        <Section title="Bank Account">
          <InfoRow label="Account Number" value={account.accountNumber} />
          <InfoRow label="Routing Number" value={account.routingNumber} />
          <InfoRow
            label="Account Type"
            value={account.accountType.charAt(0) + account.accountType.slice(1).toLowerCase()}
          />
          <div className="flex items-start justify-between gap-4 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Status</p>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                             text-[11px] font-bold bg-emerald-50 text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
              Active
            </span>
          </div>
        </Section>
      )}
    </div>
  )
}