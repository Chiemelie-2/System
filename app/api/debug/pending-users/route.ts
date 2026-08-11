import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Get all pending users
    const pendingProfiles = await prisma.customerProfile.findMany({
      where: {
        verificationStatus: 'PENDING_REVIEW'
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            createdAt: true
          }
        }
      }
    })

    // Get stats
    const totalUsers = await prisma.user.count()
    const totalProfiles = await prisma.customerProfile.count()
    const totalIdentifications = await prisma.identificationRecord.count()
    const totalAddresses = await prisma.address.count()

    return NextResponse.json({
      pendingCount: pendingProfiles.length,
      pendingUsers: pendingProfiles.map(p => ({
        userId: p.userId,
        name: `${p.firstName} ${p.lastName}`,
        email: p.user.email,
        status: p.verificationStatus,
        createdAt: p.user.createdAt
      })),
      stats: {
        totalUsers,
        totalProfiles,
        totalIdentifications,
        totalAddresses
      }
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
