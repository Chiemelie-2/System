// features/transactions/integrity.ts
// features/transactions/integrity.ts
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { randomBytes } from 'crypto'

function generateTransactionReference(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const randomPart = randomBytes(6).toString('hex').toUpperCase()
  return `TXN-${datePart}-${randomPart}`
}

export async function adjustBalance(
  accountId: string,
  amount: number,
  type: 'CREDIT' | 'DEBIT',
  description: string,
  adminId: string,
  ipAddress?: string
) {
  return await prisma.$transaction(async (tx) => {
    // Row-level lock — blocks concurrent writers to this account until commit
    const rows = await tx.$queryRaw<Array<{ balance: Prisma.Decimal; userId: string }>>`
      SELECT balance, "userId" FROM bank_accounts WHERE id = ${accountId} FOR UPDATE
    `
    const account = rows[0]
    if (!account) throw new Error('Account not found')

    const currentBalance = new Prisma.Decimal(account.balance)
    const changeAmount = new Prisma.Decimal(amount)
    const newBalance = type === 'CREDIT'
      ? currentBalance.plus(changeAmount)
      : currentBalance.minus(changeAmount)

    if (newBalance.isNegative()) {
      throw new Error('Insufficient virtual balance')
    }

    const transaction = await tx.transaction.create({
      data: {
        accountId,
        transactionType: type,
        amount,
        description,
        status: 'COMPLETED',
        createdByAdmin: adminId,
        reference: generateTransactionReference(),
      }
    })

    await tx.bankAccount.update({
      where: { id: accountId },
      data: { balance: newBalance }
    })

    await tx.auditLog.create({
      data: {
        adminId,
        action: type === 'CREDIT' ? 'ADD_FUNDS' : 'DEDUCT_FUNDS',
        targetUserId: account.userId,
        details: { accountId, amount, newBalance: newBalance.toString(), transactionId: transaction.id },
        ipAddress
      }
    })

    return { transaction, newBalance: newBalance.toNumber() }
  })
}