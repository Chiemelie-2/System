// app/(auth)/login/page.tsx
'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, getSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/forms/FormField'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z.string()
    .min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  // Only respect an explicit callbackUrl (e.g. redirected here from a
  // protected route). Otherwise leave it unset so we can pick the right
  // destination by role after login, instead of always defaulting to
  // the customer dashboard.
  const explicitCallbackUrl = searchParams.get('callbackUrl')
  const error = searchParams.get('error')
  const errorCode = searchParams.get('code')

  const methods = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        if (result.code === 'AccountSuspended') {
          toast.error('Your account is unable to sign in. Please contact support for assistance.')
        } else if (result.code === 'AccountDeactivated') {
          toast.error('Your account has been deactivated. Please contact support for assistance.')
        } else {
          toast.error('Invalid email or password')
        }
        return
      }

      // signIn() doesn't return the session/role directly — fetch it
      // fresh so we can route admins to /admin/dashboard rather than
      // always landing everyone on the customer dashboard.
      const session = await getSession()
      const role = session?.user?.role

      const destination =
        explicitCallbackUrl ||
        (role === 'ADMIN' || role === 'SUPER_ADMIN' ? '/admin/dashboard' : '/dashboard')

      toast.success('Welcome back!')
      router.push(destination)
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Error from URL params */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">
            {errorCode === 'AccountSuspended' && 'Your account has been suspended. Please contact support for assistance.'}
            {errorCode === 'AccountDeactivated' && 'Your account has been deactivated. Please contact support for assistance.'}
            {!errorCode && error === 'CredentialsSignin' && 'Invalid email or password'}
          </p>
        </div>
      )}

      <Card
        header={{
          title: 'Welcome back',
          description: 'Sign in to your banking account'
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

            <FormField
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              
              <Link 
                href="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>
        </FormProvider>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link 
              href="/register" 
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Open an account
            </Link>
          </p>
        </div>
      </Card>
    </>
  )
}