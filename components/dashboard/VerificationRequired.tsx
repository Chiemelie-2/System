// components/dashboard/VerificationRequired.tsx
import Link from 'next/link'
import { Card } from '@/components/ui/Card'

interface VerificationRequiredProps {
  action: string
  reason?: string
}

export function VerificationRequired({ action, reason }: VerificationRequiredProps) {
  return (
    <div className="max-w-lg mx-auto py-8">
      <Card>
        <div className="text-center py-6">
          <div className="mx-auto w-14 h-14 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Verification required</h1>
          <p className="text-sm text-gray-600 mt-2">
            You cannot {action} until your account is verified by an admin and your KYC document is
            verified.
          </p>
          {reason && <p className="text-sm text-gray-500 mt-2">{reason}</p>}
          <Link
            href="/kyc"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary-700 px-6 h-11 text-white text-sm font-semibold hover:bg-primary-800 transition-colors"
          >
            Go to KYC
          </Link>
        </div>
      </Card>
    </div>
  )
}
