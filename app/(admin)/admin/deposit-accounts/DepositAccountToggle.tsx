// app/(admin)/admin/deposit-accounts/DepositAccountToggle.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { toggleDepositAccountActive } from '@/features/deposit-accounts/actions'
import { toast } from 'sonner'

export function DepositAccountToggle({
  accountId,
  isActive,
}: {
  accountId: string
  isActive: boolean
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleToggle = async () => {
    setIsSubmitting(true)
    try {
      await toggleDepositAccountActive(accountId, !isActive)
      toast.success(isActive ? 'Account deactivated' : 'Account activated')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update account')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleToggle} isLoading={isSubmitting}>
      {isActive ? 'Deactivate' : 'Activate'}
    </Button>
  )
}