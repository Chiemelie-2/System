// app/(customer)/withdraw/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getKycGate } from '@/features/kyc/actions'
import { VerificationRequired } from '@/components/dashboard/VerificationRequired'
import { WithdrawForm } from './WithdrawForm'

export const dynamic = 'force-dynamic'

export default async function WithdrawPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const gate = await getKycGate(session.user.id)
  if (!gate.allowed) {
    return <VerificationRequired action="withdraw funds" reason={gate.reason} />
  }

  return <WithdrawForm />
}
