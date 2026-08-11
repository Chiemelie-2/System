// lib/auth.ts
import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import authConfig from "./auth.config"
import { Role } from ".prisma/client/default.js"

class AccountSuspendedError extends CredentialsSignin {
  code = "AccountSuspended"
}

class AccountDeactivatedError extends CredentialsSignin {
  code = "AccountDeactivated"
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === 'string' ? credentials.email : undefined
        const password = typeof credentials?.password === 'string' ? credentials.password : undefined
        if (!email || !password) return null

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return null

        const valid = await bcrypt.compare(password, user.passwordHash)
        if (!valid) return null

        // Check account status only after the password has been verified —
        // this avoids leaking account status to someone who doesn't
        // actually know the correct password.
        if (user.status === 'SUSPENDED') {
          throw new AccountSuspendedError()
        }
        if (user.status === 'DEACTIVATED') {
          throw new AccountDeactivatedError()
        }

        return { id: user.id, email: user.email, role: user.role }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
      }
      return session
    },
  },
})