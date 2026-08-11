// app/(customer)/deposit/DepositForm.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AmountInput } from '@/components/forms/AmountInput'
import {
  requestDeposit,
  confirmDepositPayment,
  cancelDepositRequest,
} from '@/features/deposits/actions'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

const depositSchema = z.object({
  amount: z.string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Enter a valid amount')
    .refine((val) => parseFloat(val) <= 1000000, 'Maximum deposit is $1,000,000'),
  note: z.string().max(200).optional(),
})

type DepositFormValues = z.infer<typeof depositSchema>

const QUICK_AMOUNTS = [100, 500, 1000, 5000, 10000]

interface ActiveRequest {
  id: string
  amount: number
  reference: string
  status: 'AWAITING_PAYMENT' | 'PROCESSING'
  expiresAt: string
  destination: { bankName: string; accountNumber: string; accountName: string } | null
}

interface RequestSummary {
  id: string
  amount: number
  reference: string
  status: string
  rejectReason?: string | null
}

interface DepositFormProps {
  accountNumber: string
  routingNumber: string
  accountType: string
  balance: number
  activeRequest: ActiveRequest | null
  recentRequests: RequestSummary[]
}

function useCountdown(expiresAt: string) {
  const [remainingMs, setRemainingMs] = useState(() => new Date(expiresAt).getTime() - Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingMs(new Date(expiresAt).getTime() - Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [expiresAt])

  const expired = remainingMs <= 0
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const label = `${minutes}:${seconds.toString().padStart(2, '0')}`

  return { expired, label }
}

function statusBadge(status: string) {
  switch (status) {
    case 'APPROVED':
      return <span className="badge-success">Approved</span>
    case 'REJECTED':
      return <span className="badge-danger">Rejected</span>
    case 'EXPIRED':
      return <span className="badge-warning">Expired</span>
    case 'CANCELLED':
      return <span className="badge-warning">Cancelled</span>
    default:
      return <span className="badge-warning">{status}</span>
  }
}

export function DepositForm({
  accountNumber,
  routingNumber,
  accountType,
  balance,
  activeRequest,
  recentRequests,
}: DepositFormProps) {
  const router = useRouter()

  if (activeRequest) {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <ActiveRequestPanel request={activeRequest} onChanged={() => router.refresh()} />
        {recentRequests.length > 0 && <RecentRequestsCard requests={recentRequests} />}
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Deposit Funds</h1>
            <p className="text-sm text-gray-500">Your account and deposit requests</p>
          </div>
        </div>
      </motion.div>

      <Card>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Your Account</h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Account Number</span>
            <span className="text-sm font-mono font-medium text-gray-900">{accountNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Routing Number</span>
            <span className="text-sm font-mono font-medium text-gray-900">{routingNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Account Type</span>
            <span className="text-sm font-medium text-gray-900 capitalize">{accountType.toLowerCase()}</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Current Balance</span>
            <span className="text-sm font-bold text-gray-900">{formatCurrency(balance)}</span>
          </div>
        </div>
      </Card>

      <RequestDepositCard />

      {recentRequests.length > 0 && <RecentRequestsCard requests={recentRequests} />}
    </div>
  )
}

function RequestDepositCard() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DepositFormValues>({
    resolver: zodResolver(depositSchema),
    defaultValues: { amount: '', note: '' },
  })

  const watchedAmount = watch('amount')

  const onSubmit = async (data: DepositFormValues) => {
    setIsSubmitting(true)
    const result = await requestDeposit({
      amount: parseFloat(data.amount),
      note: data.note,
    })
    setIsSubmitting(false)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    toast.success('Deposit account assigned — you have 1 hour to pay.')
    router.refresh()
  }

  return (
    <Card>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">Request a Deposit</h3>
      <p className="text-xs text-gray-500 mb-4">
        Enter the amount you want to deposit. We'll show you an account to pay into — it's
        valid for one hour and can't be reused after that.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <AmountInput
            label="Amount to Deposit"
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
                    ? 'bg-primary-100 text-primary-800 border-2 border-primary-500'
                    : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:border-gray-300'
                }`}
              >
                ${amount.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Note (Optional)</label>
          <textarea
            {...register('note')}
            placeholder="What's this deposit for?"
            rows={2}
            className="input-field resize-none"
          />
        </div>

        <Button
          type="submit"
          className="w-full text-lg py-3"
          isLoading={isSubmitting}
          disabled={!watchedAmount}
        >
          {watchedAmount
            ? `Request Deposit of $${parseFloat(watchedAmount).toLocaleString()}`
            : 'Enter an Amount'}
        </Button>
      </form>
    </Card>
  )
}

function ActiveRequestPanel({
  request,
  onChanged,
}: {
  request: ActiveRequest
  onChanged: () => void
}) {
  const { expired, label } = useCountdown(request.expiresAt)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const refreshedOnExpiry = useCallback(() => onChanged(), [onChanged])

  useEffect(() => {
    if (expired && request.status === 'AWAITING_PAYMENT') {
      // Let the server flip the row to EXPIRED and re-render with the real state.
      refreshedOnExpiry()
    }
  }, [expired, request.status, refreshedOnExpiry])

  if (request.status === 'PROCESSING') {
    return (
      <Card>
        <div className="text-center py-6 space-y-4">
          <div className="mx-auto w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Waiting for Confirmation</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
              We've let the bank know you sent {formatCurrency(request.amount)}. Your balance
              will update as soon as it's confirmed received — this is usually quick, but can
              take a little while.
            </p>
          </div>
          <p className="text-xs text-gray-400 font-mono">{request.reference}</p>
        </div>
      </Card>
    )
  }

  // AWAITING_PAYMENT
  const dest = request.destination

  const handleConfirm = async () => {
    setIsConfirming(true)
    try {
      await confirmDepositPayment(request.id)
      toast.success("Thanks — we'll confirm once the bank shows it received.")
      onChanged()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setIsConfirming(false)
    }
  }

  const handleCancel = async () => {
    setIsCancelling(true)
    try {
      await cancelDepositRequest(request.id)
      toast.success('Deposit request cancelled.')
      onChanged()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <Card>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Complete Your Deposit</h3>
          <span className={`text-sm font-mono font-semibold ${expired ? 'text-red-600' : 'text-gray-700'}`}>
            {expired ? 'Expired' : label}
          </span>
        </div>

        <p className="text-sm text-gray-500">
          Pay <span className="font-semibold text-gray-900">{formatCurrency(request.amount)}</span>{' '}
          into the account below. This account is for this deposit only — don't save it for future use.
        </p>

        {dest ? (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Bank</span>
              <span className="text-sm font-medium text-gray-900">{dest.bankName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Account Number</span>
              <span className="text-sm font-mono font-semibold text-gray-900">{dest.accountNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Account Name</span>
              <span className="text-sm font-medium text-gray-900">{dest.accountName}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-red-600">No destination account is attached to this request.</p>
        )}

        <p className="text-xs text-gray-400 font-mono">{request.reference}</p>

        {expired ? (
          <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3">
            This deposit window has expired. Refreshing…
          </div>
        ) : (
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleCancel} isLoading={isCancelling}>
              Cancel Request
            </Button>
            <Button className="flex-1" onClick={handleConfirm} isLoading={isConfirming}>
              I've Made This Deposit
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}

function RecentRequestsCard({ requests }: { requests: RequestSummary[] }) {
  return (
    <Card>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Requests</h3>
      <div className="space-y-2">
        {requests.map((r) => (
          <div key={r.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
            <div>
              <p className="text-sm text-gray-900 font-medium">{formatCurrency(r.amount)}</p>
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
  )
}