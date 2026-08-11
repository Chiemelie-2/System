// components/forms/AmountInput.tsx
'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface AmountInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  currency?: string
}

export const AmountInput = forwardRef<HTMLInputElement, AmountInputProps>(
  ({ label, error, currency = '$', className, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-gray-500 text-lg font-medium">{currency}</span>
          </div>
          <input
            ref={ref}
            type="number"
            step="0.01"
            min="0.01"
            className={cn(
              'input-field pl-10 text-lg font-medium',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-600 animate-fade-in">{error}</p>
        )}
      </div>
    )
  }
)

AmountInput.displayName = 'AmountInput'