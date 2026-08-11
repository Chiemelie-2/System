// lib/security.ts
import { prisma } from './prisma'

export async function logSecurityEvent(
  userId: string | null,
  action: string,
  details?: any,
  ipAddress?: string
) {
  try {
    await prisma.auditLog.create({
      data: {
        adminId: userId || 'system',
        action: `SECURITY_${action}`,
        targetUserId: userId,
        details,
        ipAddress,
      }
    })
  } catch (error) {
    console.error('Failed to log security event:', error)
  }
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .trim()
}

export function isValidAccountNumber(accountNumber: string): boolean {
  return /^\d{10}$/.test(accountNumber)
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}