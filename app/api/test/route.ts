// app/api/test/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const userCount = await prisma.user.count()
    return NextResponse.json({ 
      status: 'ok', 
      userCount,
      database: 'connected'
    })
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'Database connection failed' 
    }, { status: 500 })
  }
}