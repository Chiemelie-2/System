// app/(customer)/profile/ChangePasswordForm.tsx
'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { changePassword } from '@/features/auth/actions'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/forms/FormField'
import { toast } from 'sonner'

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[0-9]/, 'Must contain number'),
  confirmNewPassword: z.string(),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
})

interface ChangePasswordFormProps {
  userId: string
}

export function ChangePasswordForm({ userId }: ChangePasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const methods = useForm({
    resolver: zodResolver(changePasswordSchema),
  })

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      const result = await changePassword(userId, data.currentPassword, data.newPassword)
      if (result.success) {
        toast.success('Password changed successfully')
        methods.reset()
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('Failed to change password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
      
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
          <FormField
            name="currentPassword"
            label="Current Password"
            type="password"
            placeholder="Enter current password"
          />

          <FormField
            name="newPassword"
            label="New Password"
            type="password"
            placeholder="Enter new password"
          />

          <FormField
            name="confirmNewPassword"
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
          />

          <Button type="submit" isLoading={isLoading}>
            Change Password
          </Button>
        </form>
      </FormProvider>
    </div>
  )
}