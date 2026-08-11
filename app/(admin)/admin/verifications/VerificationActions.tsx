// app/(admin)/admin/verifications/VerificationActions.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { approveCustomer, rejectCustomer } from '@/features/admin/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface VerificationActionsProps {
  userId: string
}

export function VerificationActions({ userId }: VerificationActionsProps) {
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [showRejectReason, setShowRejectReason] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const router = useRouter()

  const handleApprove = async () => {
    setIsApproving(true)
    try {
      const result = await approveCustomer(userId)
      if (result.success) {
        toast.success('Customer approved and account created')
        router.refresh()
      }
    } catch (error) {
      toast.error('Failed to approve customer')
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection')
      return
    }
    
    setIsRejecting(true)
    try {
      const result = await rejectCustomer(userId, rejectReason)
      if (result.success) {
        toast.success('Customer rejected')
        setShowRejectReason(false)
        setRejectReason('')
        router.refresh()
      }
    } catch (error) {
      toast.error('Failed to reject customer')
    } finally {
      setIsRejecting(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <Button 
          onClick={handleApprove}
          isLoading={isApproving}
          className="flex-1"
        >
          Approve & Create Account
        </Button>
        <Button 
          variant="danger"
          onClick={() => setShowRejectReason(true)}
          disabled={isApproving}
        >
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
            <Button 
              size="sm" 
              variant="danger"
              onClick={handleReject}
              isLoading={isRejecting}
            >
              Confirm Reject
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setShowRejectReason(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}