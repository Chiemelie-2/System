// app/(admin)/admin/users/[userId]/ToggleUserStatus.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { toggleUserStatus } from '@/features/admin/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function ToggleUserStatus({ 
  userId, 
  currentStatus 
}: { 
  userId: string
  currentStatus: string 
}) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleToggle = async () => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    const action = newStatus === 'SUSPENDED' ? 'suspend' : 'activate'
    
    if (!confirm(`Are you sure you want to ${action} this user?`)) return
    
    setIsLoading(true)
    try {
      await toggleUserStatus(userId, newStatus)
      toast.success(`User ${action}d successfully`)
      router.refresh()
    } catch (error) {
      toast.error('Failed to update user status')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={currentStatus === 'ACTIVE' ? 'danger' : 'primary'}
      onClick={handleToggle}
      isLoading={isLoading}
    >
      {currentStatus === 'ACTIVE' ? 'Suspend User' : 'Activate User'}
    </Button>
  )
}