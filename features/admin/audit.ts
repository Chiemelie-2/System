// features/admin/audit.ts
import { prisma } from '@/lib/prisma'

export async function createAuditLog(
  adminId: string,
  action: string,
  targetUserId?: string,
  details?: any,
  ipAddress?: string
) {
  return prisma.auditLog.create({
    data: {
      adminId,
      action,
      targetUserId: targetUserId || null,
      details: details || null,
      ipAddress: ipAddress || null,
    }
  })
}

export async function getAuditLogs(page: number = 1, pageSize: number = 50) {
  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        admin: {
          select: {
            email: true,
            role: true,
          }
        }
      }
    }),
    prisma.auditLog.count()
  ])

  return {
    logs,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  }
}