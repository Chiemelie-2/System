// features/registration/schemas.ts
import { z } from 'zod'

// Single-step registration: Full Name, Email, Password, Confirm Password.
export const registerSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name is required')
    .max(100, 'Full name too long')
    .regex(/^[a-zA-Z\s\-']+$/, 'Full name contains invalid characters'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export type RegisterInput = z.infer<typeof registerSchema>
