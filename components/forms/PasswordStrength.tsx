// components/forms/PasswordStrength.tsx
'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface PasswordStrengthProps {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const [strength, setStrength] = useState(0)

  useEffect(() => {
    let score = 0
    
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    
    setStrength(Math.min(score, 4))
  }, [password])

  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
  const strengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-400',
    'bg-green-600',
  ]

  if (!password) return null

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors duration-300',
              i < strength ? strengthColors[strength - 1] : 'bg-gray-200'
            )}
          />
        ))}
      </div>
      <p className={cn(
        'text-xs',
        strength <= 1 ? 'text-red-600' : 
        strength <= 3 ? 'text-yellow-600' : 
        'text-green-600'
      )}>
        {strengthLabels[strength - 1] || 'Weak'}
      </p>
    </div>
  )
}