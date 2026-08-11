// app/(customer)/layout.tsx
import { auth, signOut } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { MobileNav } from '@/components/layout/MobileNav'
import { MobileMenuProvider } from '@/components/layout/MobileMenuContext'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Dashboard',
    template: '%s | BankingSim'
  }
}

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  // Re-check live account status on every request. JWT sessions don't
  // automatically expire when an admin suspends an account mid-session,
  // so without this check a suspended user would stay logged in and
  // able to use the app until their token naturally expires.
  const liveUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { status: true },
  })

  if (!liveUser || liveUser.status !== 'ACTIVE') {
    const code = liveUser?.status === 'SUSPENDED' ? 'AccountSuspended' : 'AccountDeactivated'
    await signOut({ redirectTo: `/login?error=CredentialsSignin&code=${code}` })
  }

  // Fetch user profile for sidebar
  const profile = await prisma.customerProfile.findUnique({
    where: { userId: session.user.id },
    select: {
      firstName: true,
      lastName: true,
      profilePhoto: true,
      verificationStatus: true,
    }
  })

  const account = await prisma.bankAccount.findFirst({
    where: { userId: session.user.id },
    select: {
      accountNumber: true,
      balance: true,
    }
  })

  // Client Components can only receive plain, serializable props. Prisma's
  // `balance` field is a Decimal class instance, not a plain number, so it
  // must be converted before crossing the server -> client boundary.
  const serializedAccount = account
    ? { accountNumber: account.accountNumber, balance: account.balance.toNumber() }
    : null

  return (
    <MobileMenuProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Desktop Sidebar + Mobile Drawer */}
        <Sidebar
          userProfile={profile}
          accountNumber={serializedAccount?.accountNumber ?? null}
        />

        {/* Main Content */}
        <div className="lg:pl-64">
          <Header
            userProfile={profile}
            account={serializedAccount}
          />

          <main className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>

        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </MobileMenuProvider>
  )
}