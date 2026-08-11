// src/lib/rate-limit.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

interface RateLimitRecord {
  count: number
  resetTime: number
}

interface RateLimitStore {
  [key: string]: RateLimitRecord
}

// In production use Redis/Upstash instead
const store: RateLimitStore = {}

// Cleanup expired entries every 5 minutes
if (typeof globalThis !== 'undefined') {
  setInterval(() => {
    const now = Date.now()

    for (const key in store) {
      if (store[key].resetTime < now) {
        delete store[key]
      }
    }
  }, 5 * 60 * 1000)
}

interface RateLimitOptions {
  limit?: number
  windowMs?: number
  identifier?: (req: NextRequest) => string
}

export function rateLimit(options: RateLimitOptions = {}) {
  const {
    limit = 10,
    windowMs = 60 * 1000,
    identifier = (req) =>
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      'unknown',
  } = options

  return async function rateLimitMiddleware(
    req: NextRequest
  ): Promise<NextResponse | null> {
    const key = identifier(req)
    const now = Date.now()

    if (!store[key] || now > store[key].resetTime) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      }

      return null
    }

    store[key].count++

    if (store[key].count > limit) {
      const retryAfter = Math.ceil(
        (store[key].resetTime - now) / 1000
      )

      return NextResponse.json(
        {
          error: 'Too many requests',
          retryAfter,
          message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': String(limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(
              Math.ceil(store[key].resetTime / 1000)
            ),
          },
        }
      )
    }

    return null
  }
}

// Authentication routes
export const authRateLimit = rateLimit({
  limit: 5,
  windowMs: 60 * 1000,
})

// General API routes
export const apiRateLimit = rateLimit({
  limit: 100,
  windowMs: 60 * 1000,
})