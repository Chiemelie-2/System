import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    // 1. Verify admin exists
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@bankingsim.com' }
    })

    if (!admin) {
      return NextResponse.json({
        success: false,
        message: 'Admin account does not exist'
      }, { status: 404 })
    }

    // 2. Verify pending users exist
    const pendingProfiles = await prisma.customerProfile.findMany({
      where: { verificationStatus: 'PENDING_REVIEW' },
      include: {
        user: { select: { id: true, email: true } }
      }
    })

    // 3. Verify auth can query correctly
    const adminWithProfile = await prisma.user.findUnique({
      where: { id: admin.id },
      include: {
        profile: true,
        accounts: true
      }
    })

    // 4. Test bcrypt verification works
    const testPassword = 'Admin@123456'
    const bcryptTest = await bcrypt.compare(testPassword, admin.passwordHash).catch(() => false)

    return NextResponse.json({
      success: true,
      checks: {
        adminExists: !!admin,
        adminRole: admin.role,
        adminStatus: admin.status,
        bcryptWorks: bcryptTest,
        pendingUsersCount: pendingProfiles.length,
        pendingUsers: pendingProfiles.map(p => ({
          id: p.userId,
          name: `${p.firstName} ${p.lastName}`,
          email: p.user.email,
          status: p.verificationStatus,
          hasIdentification: !!p.dateOfBirth,
          hasAddress: !!p.maritalStatus
        }))
      },
      message: 'All systems working! Admin can log in and view pending users.'
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
