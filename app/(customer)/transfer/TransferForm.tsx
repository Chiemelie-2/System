// app/(customer)/transfer/TransferForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AmountInput } from '@/components/forms/AmountInput'
import { requestTransfer } from '@/features/transactions/actions'
import { formatCurrency, maskAccountNumber } from '@/lib/utils'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

const transferSchema = z.object({
  toAccount: z.string()
    .min(1, 'Account number is required')
    .regex(/^\d{10}$/, 'Enter a valid 10-digit account number'),
  amount: z.string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Enter a valid amount')
    .refine((val) => parseFloat(val) <= 50000, 'Maximum transfer is $50,000'),
  description: z.string().max(200).optional(),
})

type TransferFormValues = z.infer<typeof transferSchema>

interface RequestSummary {
  id: string
  amount: number
  toAccountNumber: string
  reference: string
  status: string
  rejectReason?: string | null
  createdAt: string
}

interface TransferFormProps {
  fromAccountNumber: string
  fromBalance: number
  transfersEnabled: boolean
  recentRequests: RequestSummary[]
}

function statusBadge(status: string) {
  switch (status) {
    case 'APPROVED':
      return <span className="badge-success">Approved</span>
    case 'REJECTED':
      return <span className="badge-danger">Failed</span>
    default:
      return <span className="badge-warning">Pending</span>
  }
}

export function TransferForm({ fromAccountNumber, fromBalance, transfersEnabled, recentRequests }: TransferFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showPending, setShowPending] = useState(false)
  const [pendingValues, setPendingValues] = useState<TransferFormValues | null>(null)
  const [pendingResult, setPendingResult] = useState<{ reference: string; newBalance: number } | null>(null)

  const methods = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: { toAccount: '', amount: '', description: '' },
  })

  const { register, handleSubmit, watch, formState: { errors }, reset } = methods

  const watchedAmount = watch('amount')
  const watchedToAccount = watch('toAccount')

  const onSubmit = (data: TransferFormValues) => {
    if (parseFloat(data.amount) > fromBalance) {
      toast.error('Insufficient balance for this transfer.')
      return
    }
    setPendingValues(data)
    setShowConfirmation(true)
  }

  const confirmTransfer = async () => {
    if (!pendingValues) return
    setIsSubmitting(true)

    const result = await requestTransfer({
      toAccountNumber: pendingValues.toAccount,
      amount: parseFloat(pendingValues.amount),
      description: pendingValues.description,
    })

    setIsSubmitting(false)

    if (!result.success) {
      toast.error(result.error)
      setShowConfirmation(false)
      return
    }

    setPendingResult({ reference: result.reference, newBalance: result.newBalance })
    setShowConfirmation(false)
    setShowPending(true)
    router.refresh()
  }

  const handleNewTransfer = () => {
    setShowPending(false)
    setPendingResult(null)
    setPendingValues(null)
    reset()
    router.refresh()
  }

  if (showPending && pendingResult && pendingValues) {
    return (
      <div className="max-w-lg mx-auto py-8">
        <Card>
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Transfer Pending Approval</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
                {formatCurrency(parseFloat(pendingValues.amount))} has been deducted from your
                account and is on hold. It will reach ****{pendingValues.toAccount.slice(-4)}{' '}
                once this is approved — if it's declined instead, the funds are returned to you.
              </p>
            </div>
            <p className="text-xs text-gray-400 font-mono">{pendingResult.reference}</p>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => (window.location.href = '/dashboard')}>
                Go to Dashboard
              </Button>
              <Button className="flex-1" onClick={handleNewTransfer}>
                New Transfer
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transfer Funds</h1>
            <p className="text-sm text-gray-500">Send funds to another account</p>
          </div>
        </div>
      </motion.div>

      {!transfersEnabled && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-red-800">Hold on — transfers are disabled</p>
            <p className="text-sm text-red-700 mt-0.5">
              Your account currently can't send transfers. Please contact support to find out why
              or to have this re-enabled.
            </p>
          </div>
        </div>
      )}

      <div className={!transfersEnabled ? 'opacity-40 pointer-events-none select-none' : undefined}>
      <AnimatePresence mode="wait">
        {!showConfirmation ? (
          <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <Card>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">From Account</p>
                    <p className="text-sm font-medium text-gray-900">{maskAccountNumber(fromAccountNumber)}</p>
                    <p className="text-xs text-gray-500 mt-1">Available balance: {formatCurrency(fromBalance)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      To Account Number
                    </label>
                    <input
                      {...register('toAccount')}
                      type="text"
                      maxLength={10}
                      placeholder="Enter 10-digit account number"
                      className="input-field font-mono"
                    />
                    {errors.toAccount && (
                      <p className="text-xs text-red-600 mt-1">{errors.toAccount.message}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Every transfer is reviewed before it's delivered.
                    </p>
                  </div>

                  <div>
                    <AmountInput
                      label="Transfer Amount"
                      placeholder="0.00"
                      error={errors.amount?.message}
                      {...register('amount')}
                    />
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {[50, 100, 250, 500, 1000].map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => methods.setValue('amount', amount.toString(), { shouldValidate: true })}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            watchedAmount === amount.toString()
                              ? 'bg-blue-100 text-blue-800 border-2 border-blue-500'
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
                      placeholder="What's this transfer for?"
                      rows={2}
                      className="input-field resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-lg py-3"
                    disabled={!watchedAmount || !watchedToAccount || !transfersEnabled}
                  >
                    Review Transfer
                  </Button>
                </form>
              </FormProvider>
            </Card>
          </motion.div>
        ) : (
          pendingValues && (
            <motion.div key="confirmation" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Confirm Transfer</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Funds are deducted right away and held until this is approved.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">From</span>
                      <span className="text-sm font-medium">{maskAccountNumber(fromAccountNumber)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">To</span>
                      <span className="text-sm font-medium">****{pendingValues.toAccount.slice(-4)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Amount</span>
                      <span className="text-lg font-bold text-gray-900">
                        {formatCurrency(parseFloat(pendingValues.amount))}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setShowConfirmation(false)}>
                      Edit
                    </Button>
                    <Button className="flex-1" onClick={confirmTransfer} isLoading={isSubmitting}>
                      Confirm Transfer
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        )}
      </AnimatePresence>
      </div>

      {recentRequests.length > 0 && !showConfirmation && (
        <Card>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Transfers</h3>
          <div className="space-y-2">
            {recentRequests.map((r) => (
              <div key={r.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm text-gray-900 font-medium">
                    {formatCurrency(r.amount)} → ****{r.toAccountNumber.slice(-4)}
                  </p>
                  <p className="text-xs text-gray-500 font-mono">{r.reference}</p>
                  {r.status === 'REJECTED' && r.rejectReason && (
                    <p className="text-xs text-red-500 mt-0.5">{r.rejectReason}</p>
                  )}
                </div>
                {statusBadge(r.status)}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}