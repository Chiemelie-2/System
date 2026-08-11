// components/providers/SessionProviderWrapper.tsx
'use client'

import { SessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'
import type { ReactNode } from 'react'

/**
 * Wraps next-auth's SessionProvider so Client Components anywhere in the
 * app (e.g. the marketing landing page) can call useSession() to know
 * whether someone is logged in. `session` is pre-fetched server-side in
 * the root layout and passed in so there's no loading flash on first paint.
 */
export function SessionProviderWrapper({
  children,
  session,
}: {
  children: ReactNode
  session: Session | null
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>
}