// app/(customer)/dashboard/page.tsx
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BalanceCard } from '@/components/dashboard/BalanceCard'
import { AccountInfo } from '@/components/dashboard/AccountInfo'
import { VerificationBadge } from '@/components/dashboard/VerificationBadge'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { TransactionList } from '@/components/dashboard/TransactionList'

export default async function DashboardPage() {
  const session = await auth()
  
  const [profile, account] = await Promise.all([
    prisma.customerProfile.findUnique({
      where: { userId: session?.user?.id }
    }),
    prisma.bankAccount.findFirst({
      where: { userId: session?.user?.id },
      include: {
        transactions: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      }
    })
  ])
  
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center gap-4">
        {profile?.profilePhoto && (
          <img 
            src={profile.profilePhoto} 
            alt="Profile" 
            className="w-16 h-16 rounded-full ring-2 ring-blue-500"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">
            Welcome, {profile?.firstName}
          </h1>
          <VerificationBadge status={profile?.verificationStatus} />
        </div>
      </div>
      
      {/* Account Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <BalanceCard
            balance={account?.balance?.toNumber() ?? 0}
            accountNumber={account?.accountNumber ?? ''}
          />
        <AccountInfo 
          accountNumber={account?.accountNumber}
          routingNumber={account?.routingNumber}
          customerId={account?.customerId}
        />
      </div>
      
      {/* Quick Actions */}
      <QuickActions />
      
      {/* Recent Transactions */}
      {account?.transactions && (
        <TransactionList transactions={account.transactions} />
      )}
    </div>
  )
}