// app/error.tsx
// ── Drop-in replacement ──
//
// FIX: The original file wrapped its JSX in <html><body> tags.
// That is ONLY valid for app/global-error.tsx (which must provide its own
// shell because the root layout may have failed).
// A regular error.tsx is rendered INSIDE the existing layout — adding <html>
// inside <body> causes React's "You are mounting a new html component"
// hydration error and the double-html/double-body warnings.
// Removed the <html><body> wrapper — the layout already provides the shell.

'use client'

import { useEffect } from 'react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <h1 className="font-display font-bold text-2xl text-gray-900 mb-2">
          Something went wrong
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-2">
          We encountered an unexpected error. Please try again.
        </p>

        {error.digest && (
          <p className="text-xs text-gray-400 mb-6 font-mono bg-gray-50 rounded-lg px-3 py-2 inline-block">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex gap-3 justify-center mt-6">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-xl
                       bg-primary-800 hover:bg-primary-900
                       px-6 py-2.5 text-sm font-semibold text-white
                       transition-colors duration-200"
          >
            Try Again
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="inline-flex items-center justify-center rounded-xl
                       border border-gray-200 bg-white hover:bg-gray-50
                       px-6 py-2.5 text-sm font-semibold text-gray-700
                       transition-colors duration-200"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}