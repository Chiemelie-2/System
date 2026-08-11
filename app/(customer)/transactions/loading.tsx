// app/(customer)/transactions/loading.tsx
import { TableSkeleton } from '@/components/ui/Skeleton'

export default function TransactionsLoading() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-32 bg-gray-200 rounded" />
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200">
        <TableSkeleton rows={8} columns={4} />
      </div>
    </div>
  )
}