// app/(admin)/layout.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { MobileMenuProvider } from '@/components/layout/MobileMenuContext'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
    redirect('/dashboard')
  }

  // NOTE: `TransferRequest` isn't in prisma/schema.prisma yet, so
  // `prisma.transferRequest` is undefined at runtime. Guarding this call
  // keeps every admin route from crashing until the model + migration
  // are added (see the "Transfer Requests" nav item for the follow-up).
  const [pendingCount, pendingDepositCount, pendingTransferCount] = await Promise.all([
    prisma.customerProfile.count({
      where: { verificationStatus: { in: ['PENDING_REVIEW', 'IN_REVIEW'] } },
    }),
    prisma.depositRequest.count({ where: { status: 'PROCESSING' } }),
    prisma.transferRequest?.count({ where: { status: 'PENDING' } }) ?? Promise.resolve(0),
  ])

  return (
    <MobileMenuProvider>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar 
          adminEmail={session.user.email || ''}
          pendingCount={pendingCount}
          pendingDepositCount={pendingDepositCount}
          pendingTransferCount={pendingTransferCount}
          role={session.user.role}
        />
        
        <div className="lg:pl-64">
          <AdminHeader email={session.user.email || ''} />
          
          <main className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </MobileMenuProvider>
  )
}