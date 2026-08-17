// app/loading.tsx
// ── Drop-in replacement. Path in project: app/loading.tsx ──
export default function RootLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-950">
      <div className="text-center">
        {/* Spinner with gold ring */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-white/[0.07]"/>
          <div className="absolute inset-0 rounded-full border-4 border-t-gold-400 animate-spin"/>
          {/* Centre logo mark */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600
                            flex items-center justify-center shadow-lg">
              <span className="font-display font-bold text-white text-base">F</span>
            </div>
          </div>
        </div>

        <p className="mt-5 font-display font-semibold text-white text-base tracking-tight">
          Fiduciary
        </p>
        <p className="mt-1 text-xs text-white/30 animate-pulse tracking-wide">
          Loading your account…
        </p>
      </div>
    </div>
  )
}