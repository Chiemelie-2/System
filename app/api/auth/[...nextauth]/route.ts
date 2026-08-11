// app/api/auth/[...nextauth]/route.ts
import { authRateLimit } from '@/lib/rate-limit'
import { handlers } from '@/lib/auth'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  return handlers.GET(req)
}

export async function POST(req: NextRequest) {
  const rateLimitResponse = await authRateLimit(req as any)
  if (rateLimitResponse) return rateLimitResponse

  return handlers.POST(req)
}
