// app/api/auth/force-signout/route.ts
// ── New file ──
//
// This Route Handler is the ONLY correct place to call signOut() for
// server-side forced logouts (e.g. suspended/deactivated accounts).
//
// Why: signOut() modifies the session cookie. Cookie writes are only
// permitted in Server Actions and Route Handlers — not in Server Components
// like layouts. The customer layout now redirects here for suspended users
// instead of calling signOut() directly.

import { signOut } from '@/lib/auth'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code') ?? 'AccountDeactivated'

  await signOut({
    redirectTo: `/login?error=CredentialsSignin&code=${code}`,
  })
}