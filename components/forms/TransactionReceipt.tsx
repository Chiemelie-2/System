// components/forms/TransactionReceipt.tsx
'use client'

import { motion } from 'framer-motion'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface TransactionReceiptProps {
  type: 'deposit' | 'withdrawal' | 'transfer'
  amount: number
  fromAccount?: string
  toAccount?: string
  description?: string
  reference: string
  date: Date
  onClose: () => void
  onNewTransaction?: () => void
}

export function TransactionReceipt({
  type,
  amount,
  fromAccount,
  toAccount,
  description,
  reference,
  date,
  onClose,
  onNewTransaction,
}: TransactionReceiptProps) {
  const typeConfig = {
    deposit: {
      title: 'Deposit Successful',
      icon: '↓',
      color: 'text-green-600 bg-green-100',
    },
    withdrawal: {
      title: 'Withdrawal Successful',
      icon: '↑',
      color: 'text-red-600 bg-red-100',
    },
    transfer: {
      title: 'Transfer Successful',
      icon: '↔',
      color: 'text-blue-600 bg-blue-100',
    },
  }

  const config = typeConfig[type]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-800 to-primary-900 p-6 text-center text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className={`mx-auto w-16 h-16 rounded-full ${config.color} flex items-center justify-center mb-3`}
          >
            <span className="text-3xl">{config.icon}</span>
          </motion.div>
          <h2 className="text-xl font-bold">{config.title}</h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold mt-2"
          >
            {formatCurrency(amount)}
          </motion.p>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            {fromAccount && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">From Account</span>
                <span className="text-sm font-mono font-medium text-gray-900">{fromAccount}</span>
              </div>
            )}
            {toAccount && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">To Account</span>
                <span className="text-sm font-mono font-medium text-gray-900">{toAccount}</span>
              </div>
            )}
            {description && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Description</span>
                <span className="text-sm font-medium text-gray-900">{description}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Reference</span>
              <span className="text-sm font-mono text-gray-900">{reference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Date</span>
              <span className="text-sm text-gray-900">{formatDate(date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Status</span>
              <span className="badge-success">Completed</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            {onNewTransaction && (
              <Button onClick={onNewTransaction} variant="outline" className="flex-1">
                New Transaction
              </Button>
            )}
            <Button onClick={onClose} className="flex-1">
              Done
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
