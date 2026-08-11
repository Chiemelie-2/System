// components/ui/Card.tsx
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  header?: {
    title: string
    description?: string
  }
  footer?: React.ReactNode
}

export function Card({ children, className, header, footer }: CardProps) {
  return (
    <div className={cn('card', className)}>
      {header && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">{header.title}</h2>
          {header.description && (
            <p className="mt-1 text-sm text-gray-500">{header.description}</p>
          )}
        </div>
      )}
      {children}
      {footer && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  )
}