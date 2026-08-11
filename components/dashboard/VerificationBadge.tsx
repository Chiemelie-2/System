// components/dashboard/VerificationBadge.tsx
import { cn } from '@/lib/utils'

interface VerificationBadgeProps {
  status: string | undefined
  className?: string
}

const statusConfig = {
  PENDING_REVIEW: {
    label: 'Pending Review',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  IN_REVIEW: {
    label: 'In Review',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  APPROVED: {
    label: 'Verified',
    color: 'bg-green-50 text-green-700 border-green-200',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  REJECTED: {
    label: 'Rejected',
    color: 'bg-red-50 text-red-700 border-red-200',
    icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  NEEDS_RESUBMISSION: {
    label: 'Needs Resubmission',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z',
  },
}

export function VerificationBadge({ status, className }: VerificationBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING_REVIEW

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border',
      config.color,
      className
    )}>
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.icon} />
      </svg>
      {config.label}
    </span>
  )
}