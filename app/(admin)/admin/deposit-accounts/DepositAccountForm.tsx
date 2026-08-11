// app/(admin)/admin/deposit-accounts/DepositAccountForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { createDepositAccount } from '@/features/deposit-accounts/actions'
import { toast } from 'sonner'

export function DepositAccountForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bankName.trim() || !accountNumber.trim() || !accountName.trim()) {
      toast.error('Fill in all three fields.')
      return
    }

    setIsSubmitting(true)
    try {
      await createDepositAccount({ bankName, accountNumber, accountName })
      toast.success('Deposit account added.')
      setBankName('')
      setAccountNumber('')
      setAccountName('')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add account')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Bank Name</label>
        <input
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          placeholder="e.g. GTBank"
          className="input-field"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Account Number</label>
        <input
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="0123456789"
          className="input-field font-mono"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Account Name</label>
        <input
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          placeholder="Company Ltd"
          className="input-field"
        />
      </div>
      <div className="sm:col-span-3">
        <Button type="submit" isLoading={isSubmitting}>
          Add Account
        </Button>
      </div>
    </form>
  )
}