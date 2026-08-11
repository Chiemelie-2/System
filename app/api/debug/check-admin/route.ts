import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if admin exists
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@bankingsim.com' }
    })

    if (!adminUser) {
      return NextResponse.json({
        exists: false,
        message: 'Admin account does not exist'
      })
    }

    return NextResponse.json({
      exists: true,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        status: adminUser.status
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
