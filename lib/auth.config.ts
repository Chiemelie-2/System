// auth.config.ts
import type { NextAuthConfig } from "next-auth"

export default {
  providers: [], // populated in lib/auth.ts, not here — keep this Edge-safe
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // These must live here (not only in lib/auth.ts) because middleware
    // uses a separate, Edge-runtime auth instance built from this file
    // alone. Without them, `auth.user.role` is undefined inside
    // middleware even when the real session correctly has a role,
    // causing the `authorized` check below to always fail for admins.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        ;(session.user as { role?: string }).role = token.role as string
      }
      return session
    },
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = request.nextUrl.pathname.startsWith('/admin')
      if (isOnAdmin) return isLoggedIn && auth?.user?.role === 'ADMIN'
      return true
    },
  },
} satisfies NextAuthConfig