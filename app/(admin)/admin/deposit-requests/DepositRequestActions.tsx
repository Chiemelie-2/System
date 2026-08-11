// app/(admin)/admin/deposit-requests/DepositRequestActions.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { approveDepositRequest, rejectDepositRequest } from '@/features/deposits/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function DepositRequestActions({ requestId }: { requestId: string }) {
  const router = useRouter()
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [showReject, setShowReject] = useState(false)
  const [reason, setReason] = useState('')

  const handleApprove = async () => {
    setIsApproving(true)
    try {
      await approveDepositRequest(requestId)
      toast.success('Deposit approved and credited to the account')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to approve deposit')
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for rejection')
      return
    }
    setIsRejecting(true)
    try {
      await rejectDepositRequest(requestId, reason)
      toast.success('Deposit request rejected')
      setShowReject(false)
      setReason('')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to reject deposit')
    } finally {
      setIsRejecting(false)
    }
  }

  if (showReject) {
    return (
      <div className="flex flex-col gap-2 min-w-[220px]">
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for rejection"
          className="input-field text-sm"
        />
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => setShowReject(false)}>
            Cancel
          </Button>
          <Button variant="danger" className="flex-1" onClick={handleReject} isLoading={isRejecting}>
            Confirm Reject
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => setShowReject(true)}>
        Reject
      </Button>
      <Button onClick={handleApprove} isLoading={isApproving}>
        Approve
      </Button>
    </div>
  )
}