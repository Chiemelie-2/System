import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const pendingUsers = await prisma.customerProfile.findMany({
      where: {
        verificationStatus: {
          in: ['PENDING_REVIEW', 'IN_REVIEW']
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            createdAt: true,
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Fetch related data for each user
    const usersWithDetails = await Promise.all(
      pendingUsers.map(async (profile) => {
        const identification = await prisma.identificationRecord.findUnique({
          where: { userId: profile.userId }
        })
        
        const address = await prisma.address.findUnique({
          where: { userId: profile.userId }
        })

        return {
          ...profile,
          identification,
          address
        }
      })
    )

    return NextResponse.json({
      count: usersWithDetails.length,
      users: usersWithDetails.map(u => ({
        userId: u.userId,
        name: `${u.firstName} ${u.lastName}`,
        email: u.user.email,
        status: u.verificationStatus,
        dateOfBirth: u.dateOfBirth,
        gender: u.gender,
        nationality: u.nationality,
        phoneNumber: u.phoneNumber,
        idType: u.identification?.idType,
        idNumber: u.identification?.idNumber,
        governmentIdFile: u.identification?.governmentIdFile,
        address: `${u.address?.residentialAddress || ''}${u.address?.apartmentSuite ? ', ' + u.address.apartmentSuite : ''}`,
        city: u.address?.city,
        state: u.address?.state,
        country: u.address?.country,
        postalCode: u.address?.postalCode,
        createdAt: u.user.createdAt
      }))
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
