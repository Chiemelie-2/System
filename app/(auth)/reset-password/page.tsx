// app/(auth)/reset-password/page.tsx
'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { resetPassword } from '@/features/auth/actions'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/forms/FormField'
import { PasswordStrength } from '@/components/forms/PasswordStrength'
import { toast } from 'sonner'
import Link from 'next/link'

const resetSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[0-9]/, 'Must contain number'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  const methods = useForm({
    resolver: zodResolver(resetSchema),
  })

  const onSubmit = async (data: any) => {
    if (!token) {
      toast.error('Invalid reset link')
      return
    }

    setIsLoading(true)
    try {
      const result = await resetPassword({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })

      if (result.success) {
        setIsComplete(true)
        toast.success('Password reset successfully')
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <Card
        header={{
          title: 'Invalid Reset Link',
          description: 'This password reset link is invalid or missing.'
        }}
      >
        <div className="text-center py-4">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <Link href="/forgot-password" className="btn-primary inline-block">
            Request New Reset Link
          </Link>
        </div>
      </Card>
    )
  }

  if (isComplete) {
    return (
      <Card
        header={{
          title: 'Password Reset Complete',
          description: 'Your password has been successfully reset'
        }}
      >
        <div className="text-center py-4">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            You can now sign in with your new password.
          </p>
          <Link href="/login" className="btn-primary inline-block">
            Sign In
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <Card
      header={{
        title: 'Reset Your Password',
        description: 'Enter your new password below'
      }}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <FormField
              name="password"
              label="New Password"
              type="password"
              placeholder="Enter new password"
            />
            <PasswordStrength password={password} />
          </div>

          <FormField
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Reset Password
          </Button>
        </form>
      </FormProvider>
    </Card>
  )
}