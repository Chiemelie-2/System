// features/deposits/actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { adjustBalance } from '@/features/transactions/integrity'
import { randomBytes } from 'crypto'
import { revalidatePath } from 'next/cache'

const DEPOSIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour — how long a virtual account stays valid

function generateDepositReference(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const randomPart = randomBytes(4).toString('hex').toUpperCase()
  return `DEP-${datePart}-${randomPart}`
}

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    throw new Error('Unauthorized')
  }
  return session
}

/**
 * Picks an active destination account for a new deposit request. Uses a
 * simple round robin (based on how many requests have ever been assigned a
 * destination account) so load spreads across the pool if admins configure
 * more than one.
 */
async function pickDestinationAccount() {
  const activeAccounts = await prisma.depositDestinationAccount.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
  })
  if (activeAccounts.length === 0) return null

  const totalAssigned = await prisma.depositRequest.count({
    where: { destinationAccountId: { not: null } },
  })
  const index = totalAssigned % activeAccounts.length
  return activeAccounts[index]
}

export type RequestDepositResult =
  | {
      success: true
      requestId: string
      reference: string
      expiresAt: string
      destination: { bankName: string; accountNumber: string; accountName: string }
    }
  | { success: false; error: string }

/**
 * Customer-initiated deposit request. Does NOT touch the balance. It assigns
 * a destination account for the customer to pay into and starts a 1-hour
 * window. The balance is only credited later, when an admin approves the
 * request after the customer confirms they've paid.
 */
export async function requestDeposit(input: {
  amount: number
  note?: string
}): Promise<RequestDepositResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'You must be signed in to request a deposit.' }
  }

  const amount = Number(input.amount)
  if (!Number.isFinite(amount) || amount <= 0) {
    return { success: false, error: 'Enter a valid amount.' }
  }
  if (amount > 1_000_000) {
    return { success: false, error: 'Maximum deposit request is $1,000,000.' }
  }

  const account = await prisma.bankAccount.findFirst({
    where: { userId: session.user.id, status: 'ACTIVE' },
  })
  if (!account) {
    return { success: false, error: 'No active account found for your profile.' }
  }

  const existingActive = await prisma.depositRequest.findFirst({
    where: {
      userId: session.user.id,
      status: { in: ['AWAITING_PAYMENT', 'PROCESSING'] },
    },
  })
  if (existingActive) {
    return {
      success: false,
      error: 'You already have a deposit request in progress. Finish or cancel it before starting a new one.',
    }
  }

  const destination = await pickDestinationAccount()
  if (!destination) {
    return {
      success: false,
      error: 'No deposit account is currently available. Please contact support.',
    }
  }

  const reference = generateDepositReference()
  const expiresAt = new Date(Date.now() + DEPOSIT_WINDOW_MS)

  const depositRequest = await prisma.depositRequest.create({
    data: {
      userId: session.user.id,
      accountId: account.id,
      destinationAccountId: destination.id,
      amount,
      note: input.note?.trim() || undefined,
      reference,
      status: 'AWAITING_PAYMENT',
      expiresAt,
    },
  })

  revalidatePath('/deposit')
  revalidatePath('/admin/deposit-requests')

  return {
    success: true,
    requestId: depositRequest.id,
    reference,
    expiresAt: expiresAt.toISOString(),
    destination: {
      bankName: destination.bankName,
      accountNumber: destination.accountNumber,
      accountName: destination.accountName,
    },
  }
}

/**
 * Customer confirms they've sent the money. This does NOT credit the
 * balance — it just moves the request into PROCESSING so the admin queue
 * picks it up for manual confirmation.
 */
export async function confirmDepositPayment(requestId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('You must be signed in.')

  const depositRequest = await prisma.depositRequest.findUnique({ where: { id: requestId } })
  if (!depositRequest) throw new Error('Deposit request not found')
  if (depositRequest.userId !== session.user.id) throw new Error('Unauthorized')
  if (depositRequest.status !== 'AWAITING_PAYMENT') {
    throw new Error('This request is no longer awaiting payment.')
  }
  if (depositRequest.expiresAt < new Date()) {
    await prisma.depositRequest.update({ where: { id: requestId }, data: { status: 'EXPIRED' } })
    throw new Error('This deposit window has expired. Please start a new request.')
  }

  await prisma.depositRequest.update({
    where: { id: requestId },
    data: { status: 'PROCESSING', customerConfirmedAt: new Date() },
  })

  revalidatePath('/deposit')
  revalidatePath('/admin/deposit-requests')

  return { success: true }
}

/** Customer cancels a request before paying. */
export async function cancelDepositRequest(requestId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('You must be signed in.')

  const depositRequest = await prisma.depositRequest.findUnique({ where: { id: requestId } })
  if (!depositRequest) throw new Error('Deposit request not found')
  if (depositRequest.userId !== session.user.id) throw new Error('Unauthorized')
  if (depositRequest.status !== 'AWAITING_PAYMENT') {
    throw new Error('This request can no longer be cancelled.')
  }

  await prisma.depositRequest.update({
    where: { id: requestId },
    data: { status: 'CANCELLED' },
  })

  revalidatePath('/deposit')
  revalidatePath('/admin/deposit-requests')

  return { success: true }
}

/** Admin confirms the money arrived — this is the only place a deposit ever credits a balance. */
export async function approveDepositRequest(requestId: string) {
  const session = await requireAdmin()

  const depositRequest = await prisma.depositRequest.findUnique({ where: { id: requestId } })
  if (!depositRequest) throw new Error('Deposit request not found')
  if (depositRequest.status !== 'PROCESSING') {
    throw new Error('This request is not awaiting confirmation. The customer must confirm payment first.')
  }

  await adjustBalance(
    depositRequest.accountId,
    Number(depositRequest.amount),
    'CREDIT',
    `Approved deposit request ${depositRequest.reference}`,
    session.user.id!
  )

  await prisma.depositRequest.update({
    where: { id: requestId },
    data: {
      status: 'APPROVED',
      processedBy: session.user.id,
      processedAt: new Date(),
    },
  })

  revalidatePath('/admin/deposit-requests')
  revalidatePath('/admin/balances')
  revalidatePath('/dashboard')
  revalidatePath('/deposit')

  return { success: true }
}

export async function rejectDepositRequest(requestId: string, reason: string) {
  const session = await requireAdmin()

  const depositRequest = await prisma.depositRequest.findUnique({ where: { id: requestId } })
  if (!depositRequest) throw new Error('Deposit request not found')
  if (!['AWAITING_PAYMENT', 'PROCESSING'].includes(depositRequest.status)) {
    throw new Error('This request has already been processed')
  }

  await prisma.depositRequest.update({
    where: { id: requestId },
    data: {
      status: 'REJECTED',
      processedBy: session.user.id,
      processedAt: new Date(),
      rejectReason: reason,
    },
  })

  revalidatePath('/admin/deposit-requests')
  revalidatePath('/deposit')

  return { success: true }
}

/**
 * Flips any AWAITING_PAYMENT request whose window has passed into EXPIRED.
 * Call this at the top of any page that reads deposit requests — cheap,
 * idempotent, and avoids needing a background cron job for this project's
 * scale.
 */
export async function expireStaleDepositRequests() {
  await prisma.depositRequest.updateMany({
    where: { status: 'AWAITING_PAYMENT', expiresAt: { lt: new Date() } },
    data: { status: 'EXPIRED' },
  })
}