// app/(customer)/kyc/page.tsx
// ── Drop-in replacement ──
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { KycForm } from './KycForm'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'KYC Verification' }

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending Review',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    dot: 'bg-amber-400',
    icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    desc: "Your document has been submitted and is awaiting our team's review.",
  },
  VERIFIED: {
    label: 'Verified',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    dot: 'bg-emerald-400',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    desc: 'Your identity has been verified. All features are unlocked.',
  },
  REJECTED: {
    label: 'Rejected',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    dot: 'bg-red-400',
    icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    desc: 'Your document was rejected. Please upload a new one.',
  },
}

export default async function KycPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const kyc = await prisma.kycDocument.findUnique({
    where: { userId: session.user.id },
  })

  const cfg = kyc ? STATUS_CONFIG[kyc.status as keyof typeof STATUS_CONFIG] : null

  return (
    <div className="max-w-lg mx-auto space-y-6">

      {/* Page header */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Account</p>
        <h1 className="font-display font-bold text-2xl text-primary-900 mt-0.5">
          KYC Verification
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Upload your ID or Driver's License to unlock full account features
        </p>
      </div>

      {/* Why KYC info strip */}
      <div className="rounded-2xl bg-gradient-to-br from-primary-900 to-primary-800 p-5 text-white relative overflow-hidden">
        <svg className="absolute -right-6 -top-6 w-36 h-36 opacity-[0.06]" viewBox="0 0 150 150" fill="none">
          {[0,1,2].map(n => <ellipse key={n} cx="150" cy="150" rx={50+n*30} ry={50+n*30} stroke="white" strokeWidth="1"/>)}
        </svg>
        <div className="relative flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <div>
            <p className="font-display font-bold text-sm text-white">Why we need this</p>
            <p className="text-xs text-white/60 mt-1 leading-relaxed">
              KYC (Know Your Customer) verification is required by financial regulations to
              protect against fraud and ensure your account security.
            </p>
          </div>
        </div>
      </div>

      {/* Current document status */}
      {kyc && cfg && (
        <div
          className={`rounded-2xl border ${cfg.bg} ${cfg.border} p-5`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <svg
                className={`w-5 h-5 ${cfg.text} flex-shrink-0 mt-0.5`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={cfg.icon}/>
              </svg>
              <div>
                <p className={`text-[13px] font-bold ${cfg.text}`}>{cfg.label}</p>
                <p className={`text-[12px] mt-0.5 ${cfg.text} opacity-80`}>{cfg.desc}</p>
                {kyc.status === 'REJECTED' && kyc.rejectReason && (
                  <p className="text-[12px] mt-2 font-semibold text-red-700">
                    Reason: {kyc.rejectReason}
                  </p>
                )}
              </div>
            </div>
            <span
              className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1
                           rounded-full text-[10px] font-bold uppercase tracking-wide
                           ${cfg.bg} ${cfg.text} border ${cfg.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}/>
              {cfg.label}
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-current/10 flex items-center gap-3">
            <svg className={`w-4 h-4 ${cfg.text} opacity-60`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 6H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-4M9 12h6m-6 4h3m5-12l4 4-6 6h-4v-4l6-6z"/>
            </svg>
            <p className={`text-[12px] ${cfg.text} opacity-70`}>
              Document: {kyc.documentType === 'DRIVERS_LICENSE' ? "Driver's License" : 'ID Card'}
            </p>
          </div>
        </div>
      )}

      {/* Upload form (only when not verified) */}
      {kyc?.status !== 'VERIFIED' && (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="font-display font-bold text-[15px] text-primary-900">
              {kyc ? 'Replace Document' : 'Upload Document'}
            </h3>
            <p className="text-[12px] text-gray-400 mt-0.5">
              Accepted formats: JPG, PNG, PDF · Max 5 MB
            </p>
          </div>
          <div className="p-5">
            <KycForm />
          </div>
        </div>
      )}

      {/* Verified — all done panel */}
      {kyc?.status === 'VERIFIED' && (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <p className="font-display font-bold text-lg text-gray-900">Identity Verified</p>
          <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">
            Your account is fully verified. You have access to all Fiduciary features including transfers.
          </p>
        </div>
      )}
    </div>
  )
}