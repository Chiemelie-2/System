// app/(customer)/layout.tsx
// ── Drop-in replacement ──
//
// FIX: Removed `await signOut()` from the layout body.
// signOut() writes a cookie to clear the session. Cookie writes are only
// permitted inside Server Actions and Route Handlers — calling signOut()
// directly in a Server Component (layout) throws:
//   "Cookies can only be modified in a Server Action or Route Handler"
//
// The fix: redirect suspended/deactivated users to a dedicated route
// /api/auth/force-signout?code=... which is a Route Handler and is
// therefore allowed to call signOut().

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CustomerSidebar } from '@/components/layout/CustomerSidebar'
import { CustomerHeader } from '@/components/layout/CustomerHeader'
import { MobileMenuProvider } from '@/components/layout/MobileMenuContext'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Dashboard',
    template: '%s | Fiduciary',
  },
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

  // Live account-status check — JWT tokens don't auto-expire on suspension.
  // We check the DB on every layout render to catch suspensions between requests.
  const liveUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { status: true },
  })

  if (!liveUser || liveUser.status !== 'ACTIVE') {
    // Cannot call signOut() here (Server Component, not a Server Action).
    // Redirect to the Route Handler which is allowed to write the session cookie.
    const code =
      liveUser?.status === 'SUSPENDED'
        ? 'AccountSuspended'
        : 'AccountDeactivated'
    redirect(`/api/auth/force-signout?code=${code}`)
  }

  const profile = await prisma.customerProfile.findUnique({
    where: { userId: session.user.id },
    select: {
      firstName: true,
      lastName: true,
      profilePhoto: true,
      verificationStatus: true,
    },
  })

  const account = await prisma.bankAccount.findFirst({
    where: { userId: session.user.id },
    select: { accountNumber: true, balance: true },
  })

  const serializedAccount = account
    ? {
        accountNumber: account.accountNumber,
        balance: account.balance.toNumber(),
      }
    : null

  return (
    <MobileMenuProvider>
      <div className="min-h-screen bg-[#f4f6fb]">
        <CustomerSidebar
          userProfile={profile}
          accountNumber={serializedAccount?.accountNumber ?? null}
        />
        <div className="lg:pl-64 flex flex-col min-h-screen">
          <CustomerHeader
            userProfile={profile}
            account={serializedAccount}
          />
          <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </MobileMenuProvider>
  )
}