// features/accounts/actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { generateCustomerId, generateAccountNumber, ROUTING_NUMBER } from './generator'
import { revalidatePath } from 'next/cache'
import { createAuditLog } from '@/features/admin/audit'

export async function approveCustomer(userId: string) {
  return await prisma.$transaction(async (tx) => {
    // Update verification status
    await tx.customerProfile.update({
      where: { userId },
      data: { verificationStatus: 'APPROVED' }
    })
    
    // Generate unique customer ID
    let customerId: string
    let exists
    do {
      customerId = generateCustomerId()

      exists = await tx.bankAccount.findUnique({
        where: { customerId }
      })
    } while (exists)
    
    // Generate unique account number
    let accountNumber: string
    do {
      accountNumber = generateAccountNumber()
      exists = await tx.bankAccount.findUnique({ where: { accountNumber } })
    } while (exists)
    
    // Create bank account
    const account = await tx.bankAccount.create({
      data: {
        userId,
        customerId,
        accountNumber,
        routingNumber: ROUTING_NUMBER,
        balance: 0.00,
        accountType: 'CHECKING',
        status: 'ACTIVE'
      }
    })
    
    // Audit log
    await tx.auditLog.create({
      data: {
        adminId: 'CURRENT_ADMIN_ID', // From session
        action: 'APPROVE_CUSTOMER',
        targetUserId: userId,
        details: { customerId, accountNumber }
      }
    })
    
    return account
  })
}