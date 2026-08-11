// app/(auth)/verify-email/page.tsx
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'

interface VerifyEmailPageProps {
  searchParams: { token?: string }
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const token = searchParams.token

  if (!token) {
    return (
      <Card
        header={{
          title: 'Check your email',
          description: 'We sent a verification link to your email address'
        }}
      >
        <div className="text-center py-4">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-600">
            Please check your email and click the verification link to activate your account.
          </p>
        </div>
      </Card>
    )
  }

  try {
    // Find and validate token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    })

    if (!verificationToken || verificationToken.expires < new Date()) {
      return (
        <Card
          header={{
            title: 'Invalid or expired link',
            description: 'This verification link is no longer valid'
          }}
        >
          <div className="text-center py-4">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              The verification link is invalid or has expired. Please request a new one.
            </p>
            <Link href="/register" className="btn-primary inline-block">
              Register Again
            </Link>
          </div>
        </Card>
      )
    }

    // Verify user email
    await prisma.user.update({
      where: { id: verificationToken.identifier },
      data: { emailVerified: new Date() }
    })

    // Delete used token
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id }
    })

    return (
      <Card
        header={{
          title: 'Email Verified!',
          description: 'Your email has been verified successfully'
        }}
      >
        <div className="text-center py-4">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Your email has been verified. You can now sign in to your account.
          </p>
          <Link href="/login" className="btn-primary inline-block">
            Sign In
          </Link>
        </div>
      </Card>
    )
  } catch (error) {
    return (
      <Card
        header={{
          title: 'Something went wrong',
          description: 'We could not verify your email'
        }}
      >
        <div className="text-center py-4">
          <p className="text-sm text-gray-600 mb-4">
            Please try again or contact support.
          </p>
          <Link href="/login" className="btn-secondary inline-block">
            Back to Login
          </Link>
        </div>
      </Card>
    )
  }
}