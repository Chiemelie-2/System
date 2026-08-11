// features/kyc/actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { uploadToCloudinary } from '@/lib/cloudinary'

export type KycGate = {
  accountVerified: boolean
  kycVerified: boolean
  allowed: boolean
  reason?: string
}

/**
 * Withdrawals and transfers are only allowed when the account is
 * admin-verified AND the KYC document is verified.
 */
export async function getKycGate(userId: string): Promise<KycGate> {
  const [profile, kyc] = await Promise.all([
    prisma.customerProfile.findUnique({
      where: { userId },
      select: { verificationStatus: true },
    }),
    prisma.kycDocument.findUnique({
      where: { userId },
      select: { status: true },
    }),
  ])

  const accountVerified = profile?.verificationStatus === 'APPROVED'
  const kycVerified = kyc?.status === 'VERIFIED'

  let reason: string | undefined
  if (!accountVerified) {
    reason = 'Your account is not verified yet. An admin must approve it first.'
  } else if (!kyc) {
    reason = 'Upload your KYC document to enable withdrawals and transfers.'
  } else if (kyc.status === 'PENDING') {
    reason = 'Your KYC document is pending review.'
  } else if (kyc.status === 'REJECTED') {
    reason = 'Your KYC document was rejected. Please upload a new one.'
  }

  return { accountVerified, kycVerified, allowed: accountVerified && kycVerified, reason }
}

export async function getMyKyc() {
  const session = await auth()
  if (!session?.user?.id) return null

  return prisma.kycDocument.findUnique({ where: { userId: session.user.id } })
}

// Customer uploads ONE document: Driver's License OR ID Card.
export async function submitKycDocument(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'You must be signed in.' }
  }

  const documentType = formData.get('documentType') as 'DRIVERS_LICENSE' | 'ID_CARD' | null
  const file = formData.get('document') as File | null

  if (!documentType || (documentType !== 'DRIVERS_LICENSE' && documentType !== 'ID_CARD')) {
    return { success: false, error: 'Select a document type.' }
  }
  if (!file || file.size === 0) {
    return { success: false, error: 'Select a document image to upload.' }
  }

  try {
    const fileUrl = await uploadToCloudinary(file, `banking-sim/users/${session.user.id}/kyc`)

    await prisma.kycDocument.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        documentType,
        fileUrl,
        status: 'PENDING',
      },
      update: {
        documentType,
        fileUrl,
        status: 'PENDING',
        rejectReason: null,
        reviewedBy: null,
        reviewedAt: null,
      },
    })

    revalidatePath('/kyc')
    revalidatePath('/dashboard')
    revalidatePath('/admin/kyc')

    return { success: true, message: 'Document uploaded. It is pending review.' }
  } catch (error) {
    console.error('KYC upload failed:', error)
    return { success: false, error: 'Failed to upload document. Please try again.' }
  }
}

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    throw new Error('Unauthorized')
  }
  return session
}

export async function verifyKycDocument(userId: string) {
  const session = await requireAdmin()

  await prisma.$transaction(async (tx) => {
    await tx.kycDocument.update({
      where: { userId },
      data: {
        status: 'VERIFIED',
        rejectReason: null,
        reviewedBy: session.user.id!,
        reviewedAt: new Date(),
      },
    })

    await tx.auditLog.create({
      data: {
        adminId: session.user.id!,
        action: 'VERIFY_KYC',
        targetUserId: userId,
      },
    })
  })

  revalidatePath('/admin/kyc')
  revalidatePath('/kyc')
  return { success: true }
}

export async function rejectKycDocument(userId: string, reason: string) {
  const session = await requireAdmin()

  await prisma.$transaction(async (tx) => {
    await tx.kycDocument.update({
      where: { userId },
      data: {
        status: 'REJECTED',
        rejectReason: reason,
        reviewedBy: session.user.id!,
        reviewedAt: new Date(),
      },
    })

    await tx.auditLog.create({
      data: {
        adminId: session.user.id!,
        action: 'REJECT_KYC',
        targetUserId: userId,
        details: { reason },
      },
    })
  })

  revalidatePath('/admin/kyc')
  revalidatePath('/kyc')
  return { success: true }
}
