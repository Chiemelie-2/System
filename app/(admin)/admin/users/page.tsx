// app/(admin)/admin/users/page.tsx
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/Card'
import { UserTable } from '@/components/admin/UserTable'

export const dynamic = 'force-dynamic'

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>
}) {
  const { search: searchParam, page: pageParam } = await searchParams
  const page = parseInt(pageParam || '1')
  const pageSize = 20
  const search = searchParam || ''

  const where = search ? {
    OR: [
      { email: { contains: search, mode: 'insensitive' as const } },
      { profile: { firstName: { contains: search, mode: 'insensitive' as const } } },
      { profile: { lastName: { contains: search, mode: 'insensitive' as const } } },
    ]
  } : {}

  const [users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      where: {
        ...where,
        role: 'USER' // Only show customers
      },
      include: {
        profile: {
          select: {
            firstName: true,
            lastName: true,
            profilePhoto: true,
            verificationStatus: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where: { ...where, role: 'USER' } })
  ])

  const totalPages = Math.ceil(totalUsers / pageSize)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">{totalUsers} total users</p>
        </div>
        
        {/* Search */}
        <form className="flex gap-2">
          <input
            name="search"
            defaultValue={search}
            placeholder="Search users..."
            className="input-field max-w-xs"
          />
          <button type="submit" className="btn-primary">Search</button>
        </form>
      </div>

      <Card>
        <UserTable users={users} />
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4 border-t border-gray-200 mt-4">
            {[...Array(totalPages)].map((_, i) => (
              <a
                key={i}
                href={`?page=${i + 1}${search ? `&search=${search}` : ''}`}
                className={`px-3 py-1 rounded text-sm ${
                  page === i + 1
                    ? 'bg-primary-100 text-primary-800 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </a>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}