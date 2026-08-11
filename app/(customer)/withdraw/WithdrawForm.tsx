// app/(customer)/withdraw/WithdrawForm.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AmountInput } from '@/components/forms/AmountInput'
import { TransactionReceipt } from '@/components/forms/TransactionReceipt'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

const withdrawSchema = z.object({
  amount: z.string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Enter a valid amount')
    .refine((val) => parseFloat(val) <= 50000, 'Maximum withdrawal is $50,000'),
  description: z.string().max(200).optional(),
})

type WithdrawForm = z.infer<typeof withdrawSchema>

const QUICK_AMOUNTS = [20, 50, 100, 200, 500, 1000]

export function WithdrawForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [transactionDetails, setTransactionDetails] = useState<any>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<WithdrawForm>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: { amount: '', description: '' }
  })

  const watchedAmount = watch('amount')
  const numAmount = watchedAmount ? parseFloat(watchedAmount) : 0

  const onSubmit = async (data: WithdrawForm) => {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setTransactionDetails({
      type: 'withdrawal',
      amount: parseFloat(data.amount),
      fromAccount: '****4582',
      description: data.description || 'Cash Withdrawal',
      reference: `WTH-${Date.now().toString(36).toUpperCase()}`,
      date: new Date(),
    })
    
    setShowReceipt(true)
    setIsSubmitting(false)
  }

  const handleNewTransaction = () => {
    setShowReceipt(false)
    setTransactionDetails(null)
    reset()
  }

  if (showReceipt && transactionDetails) {
    return (
      <div className="max-w-lg mx-auto py-8">
        <TransactionReceipt
          {...transactionDetails}
          onClose={() => window.location.href = '/dashboard'}
          onNewTransaction={handleNewTransaction}
        />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Withdraw Funds</h1>
            <p className="text-sm text-gray-500">Withdraw virtual funds from your account</p>
          </div>
        </div>
      </motion.div>

      {/* Balance Warning */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">Available Balance</p>
            <p className="text-lg font-bold text-gray-900">$12,450.00</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <AmountInput
              label="Withdrawal Amount"
              placeholder="0.00"
              error={errors.amount?.message}
              {...register('amount')}
            />
            
            <div className="flex gap-2 mt-3 flex-wrap">
              {QUICK_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setValue('amount', amount.toString(), { shouldValidate: true })}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    watchedAmount === amount.toString()
                      ? 'bg-red-100 text-red-800 border-2 border-red-500'
                      : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:border-gray-300'
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              {...register('description')}
              placeholder="Reason for withdrawal?"
              rows={2}
              className="input-field resize-none"
            />
          </div>

          {numAmount > 500 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex gap-3">
              <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-xs font-medium text-orange-800">Large Withdrawal Alert</p>
                <p className="text-xs text-orange-700 mt-0.5">
                  Withdrawals over $500 require admin approval and may take 24-48 hours to process.
                </p>
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-3">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-yellow-700">
              <strong>Simulation Mode:</strong> This is not a real withdrawal. Funds will be deducted by an administrator.
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full text-lg py-3"
            variant="danger"
            isLoading={isSubmitting}
            disabled={!watchedAmount}
          >
            {watchedAmount 
              ? `Withdraw $${parseFloat(watchedAmount).toLocaleString()}`
              : 'Enter an Amount'
            }
          </Button>
        </form>
      </Card>
    </div>
  )
}