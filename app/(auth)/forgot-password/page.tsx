// app/(auth)/forgot-password/page.tsx (update the onSubmit function)
'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { requestPasswordReset } from '@/features/auth/actions'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/forms/FormField'
import { toast } from 'sonner'
import Link from 'next/link'

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
})

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const methods = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: { email: string }) => {
    setIsLoading(true)
    try {
      const result = await requestPasswordReset(data)
      if (result.success) {
        setIsSubmitted(true)
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card
        header={{
          title: 'Check Your Email',
          description: 'If an account exists, we sent a reset link'
        }}
      >
        <div className="text-center py-4">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Check your email for the reset link. It expires in 1 hour.
          </p>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Try another email
          </button>
        </div>
      </Card>
    )
  }

  return (
    <Card
      header={{
        title: 'Forgot Password',
        description: 'Enter your email and we\'ll send you a reset link'
      }}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="email"
            label="Email Address"
            type="email"
            placeholder="you@example.com"
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Send Reset Link
          </Button>
        </form>
      </FormProvider>

      <div className="mt-6 text-center">
        <Link href="/login" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          Back to Sign In
        </Link>
      </div>
    </Card>
  )
}