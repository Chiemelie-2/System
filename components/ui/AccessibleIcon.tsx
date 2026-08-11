// components/ui/AccessibleIcon.tsx
import { cn } from '@/lib/utils'

interface AccessibleIconProps {
  label: string
  children: React.ReactNode
  className?: string
}

export function AccessibleIcon({ label, children, className }: AccessibleIconProps) {
  return (
    <span 
      role="img" 
      aria-label={label}
      className={cn('inline-flex', className)}
    >
      {children}
    </span>
  )
}