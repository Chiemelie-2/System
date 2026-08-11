// app/(admin)/admin/transfer-requests/TransferRequestActions.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { approveTransferRequest, rejectTransferRequest } from '@/features/transactions/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function TransferRequestActions({ requestId }: { requestId: string }) {
  const router = useRouter()
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [showReject, setShowReject] = useState(false)
  const [reason, setReason] = useState('')

  const handleApprove = async () => {
    setIsApproving(true)
    try {
      await approveTransferRequest(requestId)
      toast.success('Transfer approved and delivered')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to approve transfer')
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for declining')
      return
    }
    setIsRejecting(true)
    try {
      await rejectTransferRequest(requestId, reason)
      toast.success('Transfer declined — funds returned to sender')
      setShowReject(false)
      setReason('')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to decline transfer')
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
          placeholder="Reason for declining"
          className="input-field text-sm"
        />
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => setShowReject(false)}>
            Cancel
          </Button>
          <Button variant="danger" className="flex-1" onClick={handleReject} isLoading={isRejecting}>
            Confirm Decline
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => setShowReject(true)}>
        Decline
      </Button>
      <Button onClick={handleApprove} isLoading={isApproving}>
        Approve
      </Button>
    </div>
  )
}