// components/dashboard/VerificationBanner.tsx
// ── New file. Path: app-src/components/dashboard/VerificationBanner.tsx ──
import Link from 'next/link'

const config: Record<
  string,
  { bg: string; border: string; icon: string; iconColor: string; text: string; cta?: string; ctaHref?: string }
> = {
  REJECTED: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    iconColor: 'text-red-500',
    text: 'Your account verification was rejected. Please re-submit your documents.',
    cta: 'Re-submit now',
    ctaHref: '/profile',
  },
  NEEDS_RESUBMISSION: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    iconColor: 'text-orange-500',
    text: 'Some of your documents need to be re-submitted.',
    cta: 'Upload again',
    ctaHref: '/kyc',
  },
  APPROVED: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    iconColor: 'text-emerald-500',
    text: 'Your account is fully verified. All features are unlocked.',
  },
}

export function VerificationBanner({ status }: { status: string }) {
  const c = config[status]
  if (!c) return null
  // Don't show the APPROVED banner — it's too noisy on every visit
  if (status === 'APPROVED') return null

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${c.bg} ${c.border}`}
    >
      <svg
        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${c.iconColor}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={c.icon} />
      </svg>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-gray-800">{c.text}</p>
      </div>
      {c.cta && c.ctaHref && (
        <Link
          href={c.ctaHref}
          className="flex-shrink-0 text-[12px] font-bold text-primary-700
                     hover:text-primary-900 transition-colors underline underline-offset-2"
        >
          {c.cta}
        </Link>
      )}
    </div>
  )
}