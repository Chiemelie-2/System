// app/(admin)/admin/balances/AdjustBalanceForm.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { adjustBalance } from '@/features/admin/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface AdjustBalanceFormProps {
  accountId: string
}

export function AdjustBalanceForm({ accountId }: AdjustBalanceFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'CREDIT' | 'DEBIT'>('CREDIT')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setIsLoading(true)
    try {
      const result = await adjustBalance(accountId, numAmount, type, description)
      if (result.success) {
        toast.success(`Successfully ${type === 'CREDIT' ? 'added' : 'deducted'} ${amount}`)
        setIsOpen(false)
        setAmount('')
        setDescription('')
        router.refresh()
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to adjust balance')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button size="sm" onClick={() => setIsOpen(true)}>
        Adjust Balance
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Adjust Balance</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('CREDIT')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                type === 'CREDIT' 
                  ? 'bg-green-100 text-green-700 border-2 border-green-500' 
                  : 'bg-gray-100 text-gray-600 border-2 border-transparent'
              }`}
            >
              Add Funds
            </button>
            <button
              type="button"
              onClick={() => setType('DEBIT')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                type === 'DEBIT' 
                  ? 'bg-red-100 text-red-700 border-2 border-red-500' 
                  : 'bg-gray-100 text-gray-600 border-2 border-transparent'
              }`}
            >
              Deduct Funds
            </button>
          </div>

          <Input
            label="Amount ($)"
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Reason for adjustment..."
              className="input-field"
              rows={2}
              required
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1" isLoading={isLoading}>
              Confirm {type === 'CREDIT' ? 'Deposit' : 'Withdrawal'}
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}