// app/(admin)/admin/audit-logs/page.tsx
import { getAuditLogs } from '@/features/admin/audit'
import { Card } from '@/components/ui/Card'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = parseInt(pageParam || '1')
  const { logs, total, pageSize, totalPages } = await getAuditLogs(page)

  const actionColors: Record<string, string> = {
    APPROVE_CUSTOMER: 'bg-green-100 text-green-700',
    REJECT_CUSTOMER: 'bg-red-100 text-red-700',
    ADD_FUNDS: 'bg-blue-100 text-blue-700',
    DEDUCT_FUNDS: 'bg-orange-100 text-orange-700',
    SUSPEND_USER: 'bg-red-100 text-red-700',
    ACTIVATE_USER: 'bg-green-100 text-green-700',
    USER_LOGIN: 'bg-gray-100 text-gray-700',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-gray-600 mt-1">{total} total log entries</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(log.createdAt)}
                    <br />
                    <span className="text-xs">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">{log.admin.email}</p>
                    <p className="text-xs text-gray-500 capitalize">{log.admin.role.toLowerCase()}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      actionColors[log.action] || 'bg-gray-100 text-gray-700'
                    }`}>
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.targetUserId || '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {log.details ? (
                      <pre className="text-xs max-w-xs truncate">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4 border-t border-gray-200 mt-4">
            {[...Array(totalPages)].map((_, i) => (
              <a
                key={i}
                href={`?page=${i + 1}`}
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