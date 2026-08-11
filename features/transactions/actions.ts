// features/transactions/actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { adjustBalance } from '@/features/transactions/integrity'
import { Prisma } from '@prisma/client'
import { randomBytes } from 'crypto'
import { revalidatePath } from 'next/cache'
import { getKycGate } from '@/features/kyc/actions'

function generateTransferReference(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const randomPart = randomBytes(6).toString('hex').toUpperCase()
  return `TRF-${datePart}-${randomPart}`
}

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    throw new Error('Unauthorized')
  }
  return session
}

export type RequestTransferResult =
  | { success: true; reference: string; newBalance: number }
  | { success: false; error: string }

/**
 * Customer-initiated transfer. Funds are deducted from the sender
 * immediately and the request is created with status PENDING — the money
 * does not reach anyone yet. An admin must approve it (features/transactions
 * actions below) before the recipient is credited. The recipient account
 * number does not need to belong to an existing account in this system at
 * request time; if it doesn't resolve to one, admin approval simply
 * completes the hold without crediting anyone in-app (treated as handled
 * externally by the admin).
 */
export async function requestTransfer(input: {
  toAccountNumber: string
  amount: number
  description?: string
}): Promise<RequestTransferResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'You must be signed in to transfer funds.' }
  }

  // Sends are only allowed when the account is admin-verified AND KYC is verified.
  const gate = await getKycGate(session.user.id)
  if (!gate.allowed) {
    return { success: false, error: gate.reason || 'Verification required before sending money.' }
  }

  const amount = Number(input.amount)
  if (!Number.isFinite(amount) || amount <= 0) {
    return { success: false, error: 'Enter a valid amount.' }
  }
  if (amount > 50000) {
    return { success: false, error: 'Maximum transfer is $50,000.' }
  }

  const toAccountNumber = input.toAccountNumber.trim()

  try {
    const result = await prisma.$transaction(async (tx) => {
      const senderAccount = await tx.bankAccount.findFirst({
        where: { userId: session.user.id, status: 'ACTIVE' },
      })
      if (!senderAccount) {
        throw new Error('No active account found for your profile.')
      }
      if (!senderAccount.transfersEnabled) {
        throw new Error('Transfers are currently disabled on your account. Please contact support.')
      }

      // The recipient does NOT need to exist in this system yet — we just
      // record whatever was entered. If it does resolve to a real account,
      // we link it now so approval can credit it directly.
      const recipientAccount = await tx.bankAccount.findUnique({
        where: { accountNumber: toAccountNumber },
      })
      if (recipientAccount && recipientAccount.id === senderAccount.id) {
        throw new Error('You cannot transfer to your own account.')
      }

      // Row-level lock on the sender's account before touching its balance.
      const rows = await tx.$queryRaw<Array<{ balance: Prisma.Decimal }>>`
        SELECT balance FROM bank_accounts WHERE id = ${senderAccount.id} FOR UPDATE
      `
      const currentBalance = new Prisma.Decimal(rows[0].balance)
      const transferAmount = new Prisma.Decimal(amount)

      if (currentBalance.lessThan(transferAmount)) {
        throw new Error('Insufficient balance for this transfer.')
      }

      const newBalance = currentBalance.minus(transferAmount)
      const reference = generateTransferReference()
      const holdReference = `${reference}-HOLD`
      const description = input.description?.trim() || 'Funds Transfer'

      // Deduct immediately — the funds are held, not yet delivered.
      await tx.bankAccount.update({
        where: { id: senderAccount.id },
        data: { balance: newBalance },
      })

      await tx.transaction.create({
        data: {
          accountId: senderAccount.id,
          transactionType: 'TRANSFER',
          amount: transferAmount,
          description: `${description} — to ${toAccountNumber.slice(-4)} (pending admin approval)`,
          status: 'PENDING',
          reference: holdReference,
        },
      })

      await tx.transferRequest.create({
        data: {
          userId: session.user.id,
          fromAccountId: senderAccount.id,
          toAccountNumber,
          toAccountId: recipientAccount?.id,
          amount: transferAmount,
          description,
          status: 'PENDING',
          reference,
          holdTransactionReference: holdReference,
        },
      })

      return { reference, newBalance: newBalance.toNumber() }
    })

    revalidatePath('/dashboard')
    revalidatePath('/transactions')
    revalidatePath('/transfer')
    revalidatePath('/admin/transfer-requests')

    return { success: true, ...result }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Transfer failed. Please try again.'
    return { success: false, error: message }
  }
}

/**
 * Admin approves a pending transfer. Completes the hold transaction and, if
 * the recipient account exists in this system, credits it. Re-checks for a
 * matching account in case it was created after the request was submitted.
 */
export async function approveTransferRequest(requestId: string) {
  const session = await requireAdmin()

  const transferRequest = await prisma.transferRequest.findUnique({ where: { id: requestId } })
  if (!transferRequest) throw new Error('Transfer request not found')
  if (transferRequest.status !== 'PENDING') {
    throw new Error('This request has already been processed')
  }

  await prisma.transaction.updateMany({
    where: { reference: transferRequest.holdTransactionReference },
    data: { status: 'COMPLETED' },
  })

  let toAccountId = transferRequest.toAccountId
  if (!toAccountId) {
    const recipient = await prisma.bankAccount.findUnique({
      where: { accountNumber: transferRequest.toAccountNumber },
    })
    toAccountId = recipient?.id ?? null
  }

  if (toAccountId) {
    await adjustBalance(
      toAccountId,
      Number(transferRequest.amount),
      'CREDIT',
      `Incoming transfer ${transferRequest.reference}${transferRequest.description ? ' — ' + transferRequest.description : ''}`,
      session.user.id!
    )
  }

  await prisma.transferRequest.update({
    where: { id: requestId },
    data: {
      status: 'APPROVED',
      toAccountId: toAccountId ?? undefined,
      processedBy: session.user.id,
      processedAt: new Date(),
    },
  })

  revalidatePath('/admin/transfer-requests')
  revalidatePath('/dashboard')
  revalidatePath('/transactions')
  revalidatePath('/transfer')

  return { success: true }
}

/**
 * Admin denies a pending transfer. Reverses the hold — the deducted amount
 * is returned to the sender — and marks the request REJECTED with a reason
 * the customer will see.
 */
export async function rejectTransferRequest(requestId: string, reason: string) {
  const session = await requireAdmin()

  const transferRequest = await prisma.transferRequest.findUnique({ where: { id: requestId } })
  if (!transferRequest) throw new Error('Transfer request not found')
  if (transferRequest.status !== 'PENDING') {
    throw new Error('This request has already been processed')
  }
  if (!reason.trim()) {
    throw new Error('A reason is required when declining a transfer.')
  }

  await prisma.transaction.updateMany({
    where: { reference: transferRequest.holdTransactionReference },
    data: { status: 'FAILED' },
  })

  await adjustBalance(
    transferRequest.fromAccountId,
    Number(transferRequest.amount),
    'CREDIT',
    `Transfer reversed — request ${transferRequest.reference} was declined: ${reason.trim()}`,
    session.user.id!
  )

  await prisma.transferRequest.update({
    where: { id: requestId },
    data: {
      status: 'REJECTED',
      processedBy: session.user.id,
      processedAt: new Date(),
      rejectReason: reason.trim(),
    },
  })

  revalidatePath('/admin/transfer-requests')
  revalidatePath('/dashboard')
  revalidatePath('/transactions')
  revalidatePath('/transfer')

  return { success: true }
}