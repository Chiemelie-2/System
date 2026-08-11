// app/(admin)/admin/kyc/KycActions.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { verifyKycDocument, rejectKycDocument } from '@/features/kyc/actions'

export function KycActions({ userId }: { userId: string }) {
  const router = useRouter()
  const [isVerifying, setIsVerifying] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [showRejectReason, setShowRejectReason] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const handleVerify = async () => {
    setIsVerifying(true)
    try {
      await verifyKycDocument(userId)
      toast.success('KYC verified')
      router.refresh()
    } catch {
      toast.error('Failed to verify KYC document')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection')
      return
    }
    setIsRejecting(true)
    try {
      await rejectKycDocument(userId, rejectReason)
      toast.success('KYC rejected')
      setShowRejectReason(false)
      setRejectReason('')
      router.refresh()
    } catch {
      toast.error('Failed to reject KYC document')
    } finally {
      setIsRejecting(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <Button onClick={handleVerify} isLoading={isVerifying} className="flex-1">
          Verify KYC
        </Button>
        <Button variant="danger" onClick={() => setShowRejectReason(true)} disabled={isVerifying}>
          Reject
        </Button>
      </div>

      {showRejectReason && (
        <div className="space-y-2 p-3 bg-red-50 rounded-lg border border-red-200">
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Reason for rejection..."
            className="w-full px-3 py-2 border border-red-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500"
            rows={2}
          />
          <div className="flex gap-2">
            <Button size="sm" variant="danger" onClick={handleReject} isLoading={isRejecting}>
              Confirm Reject
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowRejectReason(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
