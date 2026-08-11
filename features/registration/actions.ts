// features/registration/actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import { createEmailVerificationToken } from './helpers'
import { registerSchema } from './schemas'

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/)
  const firstName = parts[0]
  const lastName = parts.length > 1 ? parts.slice(1).join(' ') : ''
  return { firstName, lastName }
}

/**
 * Registration — Full Name, Email, Password, Confirm Password only.
 * The account is created UNVERIFIED (PENDING_REVIEW) and stays that way
 * until an admin approves it.
 */
export async function registerUser(data: unknown) {
  try {
    const validated = registerSchema.parse(data)

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    })

    if (existingUser) {
      return { success: false, error: 'An account with this email already exists' }
    }

    const passwordHash = await bcrypt.hash(validated.password, 12)
    const { firstName, lastName } = splitName(validated.fullName)

    const user = await prisma.user.create({
      data: {
        email: validated.email,
        passwordHash,
        role: 'USER',
        profile: {
          create: {
            firstName,
            lastName,
            // UNVERIFIED until an admin approves the account
            verificationStatus: 'PENDING_REVIEW',
          },
        },
      },
    })

    await createEmailVerificationToken(user.id)

    revalidatePath('/admin/verifications')
    revalidatePath('/admin/users')
    revalidatePath('/admin/dashboard')

    return {
      success: true,
      userId: user.id,
      message: 'Account created. It is unverified until an admin approves it.',
    }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to create account' }
  }
}
