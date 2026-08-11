// app/(customer)/dashboard/page.tsx
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BalanceCard } from '@/components/dashboard/BalanceCard'
import { VerificationBadge } from '@/components/dashboard/VerificationBadge'
import { TransactionRow } from '@/components/dashboard/TransactionRow'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'

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
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    }),
  ])

  // If still pending review, show waiting screen
  if (profile?.verificationStatus === 'PENDING_REVIEW' || profile?.verificationStatus === 'IN_REVIEW') {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Under Review</h2>
        <p className="text-gray-600 mb-4">
          Your account is being reviewed by our team. This usually takes 24-48 hours.
        </p>
        <VerificationBadge status={profile.verificationStatus} />
        
        <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200 text-left">
          <h3 className="font-semibold text-gray-900 mb-4">What happens next?</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-800 font-bold text-sm">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Document Verification</p>
                <p className="text-xs text-gray-500">Our team reviews your submitted documents</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-800 font-bold text-sm">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Account Setup</p>
                <p className="text-xs text-gray-500">Your account number and details are generated</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-800 font-bold text-sm">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Welcome Email</p>
                <p className="text-xs text-gray-500">You'll receive a confirmation email with your account details</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {profile?.profilePhoto && (
            <img 
              src={profile.profilePhoto} 
              alt="Profile" 
              className="w-16 h-16 rounded-full object-cover ring-2 ring-primary-100"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {profile?.firstName}! 👋
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <VerificationBadge status={profile?.verificationStatus} />
              {profile?.verificationStatus === 'APPROVED' && (
                <span className="text-xs text-gray-500">• Account verified</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Account Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        {account ? (
          <>
            <BalanceCard 
              balance={account.balance.toNumber()}
              accountNumber={account.accountNumber}
            />
            <Card className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Account Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Account Number</span>
                  <span className="text-sm font-mono font-medium text-gray-900">
                    {account.accountNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Routing Number</span>
                  <span className="text-sm font-mono font-medium text-gray-900">
                    {account.routingNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Account Type</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {account.accountType.toLowerCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="badge-success">Active</span>
                </div>
              </div>
            </Card>
          </>
        ) : (
          <Card>
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Account Yet</h3>
              <p className="text-sm text-gray-600">
                Your account is being set up. You'll be notified once it's ready.
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      {account && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Deposit', href: '/deposit', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6', color: 'bg-green-50 text-green-600', disabled: false },
            { label: 'Transfer', href: '/transfer', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', color: 'bg-blue-50 text-blue-600', disabled: !account.transfersEnabled },
            { label: 'Statements', href: '/transactions', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'bg-purple-50 text-purple-600', disabled: false },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.disabled ? '#' : action.href}
              onClick={action.disabled ? (e) => e.preventDefault() : undefined}
              aria-disabled={action.disabled}
              title={action.disabled ? 'Transfers are currently disabled on your account' : undefined}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 bg-white transition-all ${
                action.disabled
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">{action.label}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Recent Transactions */}
      {account && account.transactions.length > 0 && (
        <Card
          header={{
            title: 'Recent Transactions',
            description: 'Your latest account activity',
          }}
          footer={
            <Link 
              href="/transactions" 
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all transactions →
            </Link>
          }
        >
          <div className="divide-y divide-gray-100">
            {account.transactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}