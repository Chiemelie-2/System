// components/admin/StatsCard.tsx
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatsCard({ title, value, description, icon, trend, className }: StatsCardProps) {
  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow', className)}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
        {trend && (
          <div className="flex items-center gap-1">
            <svg 
              className={cn('w-4 h-4', trend.isPositive ? 'text-green-500' : 'text-red-500')} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {trend.isPositive ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              )}
            </svg>
            <span className={cn('text-xs font-medium', trend.isPositive ? 'text-green-600' : 'text-red-600')}>
              {trend.value}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}