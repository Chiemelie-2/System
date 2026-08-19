// app/(customer)/dashboard/page.tsx
// ── Drop-in replacement ──
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AccountHeroCard } from '@/components/dashboard/AccountHeroCard'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { AccountInfoPanel } from '@/components/dashboard/AccountInfoPanel'
import { VerificationBanner } from '@/components/dashboard/VerificationBanner'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

/* ── Pending-review holding screen ── */
function PendingScreen({
  status,
}: {
  status: 'PENDING_REVIEW' | 'IN_REVIEW'
}) {
  const isPending = status === 'PENDING_REVIEW'
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 h-20 w-20 rounded-full
                        bg-gradient-to-br from-primary-50 to-blue-100
                        flex items-center justify-center shadow-sm">
          <svg
            className="w-10 h-10 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h2 className="font-display font-bold text-2xl text-primary-900 mb-2">
          {isPending ? 'Under Review' : 'Being Reviewed'}
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          {isPending
            ? 'Our team is verifying your documents. This typically takes 24–48 hours.'
            : 'Your documents are actively being reviewed by our compliance team.'}
        </p>

        {/* Steps */}
        <div className="text-left rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">
          {[
            {
              n: '1',
              title: 'Document Verification',
              desc: 'Our team reviews your submitted documents',
              done: status === 'IN_REVIEW',
            },
            {
              n: '2',
              title: 'Account Setup',
              desc: 'Your account number and details are generated',
              done: false,
            },
            {
              n: '3',
              title: 'Welcome Email',
              desc: "You'll receive a confirmation email with your details",
              done: false,
            },
          ].map((step) => (
            <div key={step.n} className="flex gap-4 items-start">
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                  ${step.done
                    ? 'bg-gold-500'
                    : 'bg-primary-50 border-2 border-primary-100'
                  }`}
              >
                {step.done ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-primary-700 font-bold text-xs">{step.n}</span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function DashboardPage() {
  const session = await auth()

  const [profile, account] = await Promise.all([
    prisma.customerProfile.findUnique({
      where: { userId: session?.user?.id },
    }),
    prisma.bankAccount.findFirst({
      where: { userId: session?.user?.id },
      include: {
        transactions: {
          take: 8,
          orderBy: { createdAt: 'desc' },
        },
      },
    }),
  ])

  /* Holding screen for unverified accounts */
  if (
    profile?.verificationStatus === 'PENDING_REVIEW' ||
    profile?.verificationStatus === 'IN_REVIEW'
  ) {
    return (
      <PendingScreen
        status={profile.verificationStatus as 'PENDING_REVIEW' | 'IN_REVIEW'}
      />
    )
  }

  const balance = account?.balance.toNumber() ?? 0
  const transactions = account?.transactions ?? []

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* ── Verification warning banners ── */}
      {profile?.verificationStatus && (
        <VerificationBanner status={profile.verificationStatus} />
      )}

      {/* ── Welcome row ── */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Welcome back
          </p>
          <h1 className="font-display font-bold text-2xl text-primary-900 mt-0.5">
            {profile?.firstName} {profile?.lastName}
          </h1>
        </div>
        {/* Desktop date */}
        <div className="hidden sm:block text-right">
          <p className="text-xs text-gray-400">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {account ? (
        <>
          {/* ── Hero account card (full-width, Citi-style) ── */}
          <AccountHeroCard
            balance={balance}
            accountNumber={account.accountNumber}
            routingNumber={account.routingNumber}
            accountType={account.accountType}
          />

          {/* ── Quick action buttons ── */}
          <QuickActions transfersEnabled={account.transfersEnabled} />

          {/* ── Two-column: transactions + account info ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Transactions (2/3) */}
            <div className="lg:col-span-2">
              <RecentTransactions transactions={transactions} />
            </div>

            {/* Account Info panel (1/3) */}
            <div className="lg:col-span-1">
              <AccountInfoPanel
                accountNumber={account.accountNumber}
                routingNumber={account.routingNumber}
                accountType={account.accountType}
                status={account.status}
              />
            </div>
          </div>
        </>
      ) : (
        /* No account yet */
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white
                        flex flex-col items-center justify-center py-16 px-8 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2z"/>
            </svg>
          </div>
          <h3 className="font-display font-bold text-lg text-gray-900 mb-1">
            Account being set up
          </h3>
          <p className="text-sm text-gray-400 max-w-xs">
            Your bank account is being created. You'll receive an email once it's ready.
          </p>
        </div>
      )}
    </div>
  )
}