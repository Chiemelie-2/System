// components/forms/FormField.tsx
'use client'

import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/Input'

interface FormFieldProps {
  name: string
  label: string
  type?: string
  max?: string
  min?: string
  placeholder?: string
  hint?: string
  disabled?: boolean
}

export function FormField({ 
  name, 
  label, 
  type = 'text', 
  placeholder, 
  hint,
  max,
  min,
  disabled 
}: FormFieldProps) {
  const { register, formState: { errors } } = useFormContext()
  
  const error = errors[name]?.message as string | undefined

  return (
    <Input
      {...register(name)}
      label={label}
      type={type}
      placeholder={placeholder}
      hint={hint}
      error={error}
      max={max}
      min={min}
      disabled={disabled}
    />
  )
}