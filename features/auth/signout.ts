// features/auth/signout.ts
// ── Drop-in new file: app-src/features/auth/signout.ts ──
'use server'

import { signOut } from '@/lib/auth'

/**
 * Server Action for signing out.
 * Called from Client Components via a <form action={signOutAction}> or
 * direct invocation. Previously the sidebar pointed to /api/auth/signout
 * which does not exist as a route — that is why sign-out was silently broken.
 */
export async function signOutAction() {
  await signOut({ redirectTo: '/login' })
}