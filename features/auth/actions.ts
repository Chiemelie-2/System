// features/auth/actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { sendPasswordResetEmail } from '@/lib/resend'
import { z } from 'zod'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[0-9]/, 'Must contain number'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export async function requestPasswordReset(data: { email: string }) {
  try {
    const validated = forgotPasswordSchema.parse(data)
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validated.email }
    })

    // Always return success to prevent email enumeration
    if (!user) {
      return { success: true, message: 'If the email exists, a reset link has been sent.' }
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Delete any existing tokens
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id }
    })

    // Create new token
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expires,
      }
    })

    // Send email
    await sendPasswordResetEmail(user.email, token)

    return { success: true, message: 'If the email exists, a reset link has been sent.' }
  } catch (error) {
    console.error('Password reset request error:', error)
    return { success: false, error: 'Failed to process request' }
  }
}

export async function resetPassword(data: { token: string; password: string; confirmPassword: string }) {
  try {
    const validated = resetPasswordSchema.parse(data)
    
    // Find valid token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token: validated.token }
    })

    if (!resetToken || resetToken.expires < new Date()) {
      return { success: false, error: 'Invalid or expired reset link' }
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(validated.password, 12)

    // Update password
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash }
    })

    // Delete used token
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id }
    })

    return { success: true, message: 'Password reset successfully' }
  } catch (error) {
    console.error('Password reset error:', error)
    return { success: false, error: 'Failed to reset password' }
  }
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!isValid) {
      return { success: false, error: 'Current password is incorrect' }
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12)

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash }
    })

    return { success: true, message: 'Password changed successfully' }
  } catch (error) {
    return { success: false, error: 'Failed to change password' }
  }
}