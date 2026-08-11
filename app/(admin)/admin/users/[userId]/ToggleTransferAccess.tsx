// app/(admin)/admin/users/[userId]/ToggleTransferAccess.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { toggleTransferAccess } from '@/features/admin/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function ToggleTransferAccess({
  userId,
  transfersEnabled,
}: {
  userId: string
  transfersEnabled: boolean
}) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleToggle = async () => {
    const action = transfersEnabled ? 'disable' : 'enable'

    if (!confirm(`Are you sure you want to ${action} transfers for this customer?`)) return

    setIsLoading(true)
    try {
      await toggleTransferAccess(userId, !transfersEnabled)
      toast.success(`Transfers ${action}d for this customer`)
      router.refresh()
    } catch (error) {
      toast.error('Failed to update transfer access')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={transfersEnabled ? 'danger' : 'primary'}
      onClick={handleToggle}
      isLoading={isLoading}
    >
      {transfersEnabled ? 'Disable Transfers' : 'Enable Transfers'}
    </Button>
  )
}