// features/deposit-accounts/actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    throw new Error('Unauthorized')
  }
  return session
}

export async function createDepositAccount(input: {
  bankName: string
  accountNumber: string
  accountName: string
}) {
  await requireAdmin()

  const bankName = input.bankName.trim()
  const accountNumber = input.accountNumber.trim()
  const accountName = input.accountName.trim()

  if (!bankName || !accountNumber || !accountName) {
    throw new Error('Bank name, account number, and account name are all required.')
  }

  await prisma.depositDestinationAccount.create({
    data: { bankName, accountNumber, accountName },
  })

  revalidatePath('/admin/deposit-accounts')

  return { success: true }
}

export async function toggleDepositAccountActive(id: string, isActive: boolean) {
  await requireAdmin()

  await prisma.depositDestinationAccount.update({
    where: { id },
    data: { isActive },
  })

  revalidatePath('/admin/deposit-accounts')

  return { success: true }
}