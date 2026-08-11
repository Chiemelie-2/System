// app/(admin)/admin/dashboard/page.tsx

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getStats() {
  try {
    const [
      totalUsers,
      activeUsers,
      suspendedUsers,
      pendingVerifications,
      approvedUsers,
      totalBalance,
      totalTransactions,
      recentUsers,
      recentTransactions,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { status: 'SUSPENDED' } }),
      prisma.customerProfile.count({ where: { verificationStatus: 'PENDING_REVIEW' } }),
      prisma.customerProfile.count({ where: { verificationStatus: 'APPROVED' } }),
      prisma.bankAccount.aggregate({ _sum: { balance: true } }),
      prisma.transaction.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          status: true,
          role: true,
          createdAt: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
              verificationStatus: true,
            }
          }
        }
      }),
      prisma.transaction.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          amount: true,
          transactionType: true,
          description: true,
          createdAt: true,
          account: {
            select: {
              accountNumber: true,
              user: {
                select: {
                  profile: {
                    select: {
                      firstName: true,
                      lastName: true,
                    }
                  }
                }
              }
            }
          }
        }
      }),
    ])

    return {
      totalUsers,
      activeUsers,
      suspendedUsers,
      pendingVerifications,
      approvedUsers,
      totalBalance: totalBalance._sum.balance || 0,
      totalTransactions,
      recentUsers,
      recentTransactions,
    }
  } catch (error) {
    console.error('Failed to fetch admin stats:', error)
    return {
      totalUsers: 0,
      activeUsers: 0,
      suspendedUsers: 0,
      pendingVerifications: 0,
      approvedUsers: 0,
      totalBalance: 0,
      totalTransactions: 0,
      recentUsers: [],
      recentTransactions: [],
    }
  }
}

export default async function AdminDashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
    redirect('/dashboard')
  }

  const stats = await getStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back{', '}
          <span className="font-medium">{session.user.email}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Link href="/admin/users" className="group">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">Total Users</span>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            <div className="flex gap-2 mt-2">
              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                {stats.activeUsers} active
              </span>
              {stats.suspendedUsers > 0 && (
                <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                  {stats.suspendedUsers} suspended
                </span>
              )}
            </div>
          </Card>
        </Link>

        {/* Pending Verifications */}
        <Link href="/admin/verifications" className="group">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">Pending KYC</span>
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.pendingVerifications}</p>
            <p className="text-xs text-gray-500 mt-2">
              {stats.approvedUsers} approved
            </p>
          </Card>
        </Link>

        {/* Total Balance */}
        <Link href="/admin/balances" className="group">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">Total Balances</span>
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ${Number(stats.totalBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {stats.totalTransactions} transactions
            </p>
          </Card>
        </Link>

        {/* Audit Logs */}
        <Link href="/admin/audit-logs" className="group">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">Audit Logs</span>
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">Active</p>
            <p className="text-xs text-gray-500 mt-2">System monitoring</p>
          </Card>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: 'Verify Users',
            href: '/admin/verifications',
            icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
            color: 'bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100',
            badge: stats.pendingVerifications,
          },
          {
            label: 'Manage Users',
            href: '/admin/users',
            icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
            color: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
          },
          {
            label: 'Adjust Balances',
            href: '/admin/balances',
            icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
            color: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100',
          },
          {
            label: 'View Logs',
            href: '/admin/audit-logs',
            icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
            color: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100',
          },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${action.color}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
            </svg>
            <span className="text-sm font-medium">{action.label}</span>
            {action.badge && action.badge > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                {action.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
            <Link href="/admin/users" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all →
            </Link>
          </div>
          
          {stats.recentUsers.length > 0 ? (
            <div className="space-y-3">
              {stats.recentUsers.map((user) => (
                <Link
                  key={user.id}
                  href={`/admin/users/${user.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-800 font-medium text-xs">
                        {user.profile?.firstName?.[0]}{user.profile?.lastName?.[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.profile?.firstName} {user.profile?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.profile?.verificationStatus === 'APPROVED'
                        ? 'bg-green-100 text-green-700'
                        : user.profile?.verificationStatus === 'PENDING_REVIEW'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.profile?.verificationStatus?.replace(/_/g, ' ') || 'No Profile'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">No users yet</p>
              <p className="text-xs text-gray-400 mt-1">New registrations will appear here</p>
            </div>
          )}
        </Card>

        {/* Recent Transactions */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <Link href="/admin/balances" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all →
            </Link>
          </div>

          {stats.recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {stats.recentTransactions.map((txn) => {
                const amount = Number(txn.amount)
                const isCredit = txn.transactionType === 'CREDIT'
                
                return (
                  <div
                    key={txn.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCredit ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <svg className={`w-4 h-4 ${isCredit ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {isCredit ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          )}
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{txn.description}</p>
                        <p className="text-xs text-gray-500">
                          {txn.account.user.profile?.firstName} • {txn.account.accountNumber}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${
                      isCredit ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isCredit ? '+' : '-'}${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">No transactions yet</p>
              <p className="text-xs text-gray-400 mt-1">Transactions will appear here after admin actions</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}