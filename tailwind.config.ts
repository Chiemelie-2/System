// tailwind.config.ts
// ── Drop-in replacement ──
//
// FIX: fontFamily now reads from CSS variables injected by next/font/google
// in layout.tsx (--font-inter, --font-playfair) instead of bare font names.
// This is the correct pattern for next/font + Tailwind integration.

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Fiduciary brand palette — deep navy + warm gold
        primary: {
          50:  '#f0f4ff',
          100: '#e0eaff',
          200: '#c7d7fe',
          300: '#a5bcfd',
          400: '#8098fa',
          500: '#6172f3',
          600: '#4a51e8',
          700: '#3d3fcf',
          800: '#1a1f6e',   // deep navy — primary dark
          900: '#13164f',   // darkest navy
          950: '#0c0e36',
        },
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#c9963a',   // warm antique gold
          600: '#b8832e',
          700: '#92651f',
          800: '#6b4a17',
          900: '#4a330f',
        },
        success: {
          50:  '#f0fdf4',
          500: '#22c55e',
          700: '#15803d',
        },
        warning: {
          50:  '#fffbeb',
          500: '#f59e0b',
          700: '#b45309',
        },
        danger: {
          50:  '#fef2f2',
          500: '#ef4444',
          700: '#b91c1c',
        },
      },
      fontFamily: {
        // Reference next/font CSS variables injected on <html> in layout.tsx
        sans:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        safe: 'env(safe-area-inset-bottom)',
      },
      backgroundImage: {
        'hero-overlay':
          'linear-gradient(135deg, rgba(13,14,54,0.82) 0%, rgba(26,31,110,0.68) 50%, rgba(13,14,54,0.55) 100%)',
        'gold-shimmer':
          'linear-gradient(90deg, #c9963a 0%, #fbbf24 50%, #c9963a 100%)',
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-in-out',
        'slide-up':   'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in':   'scaleIn 0.2s ease-out',
        'shimmer':    'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        slideDown: {
          '0%':   { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',      opacity: '1' },
        },
        scaleIn: {
          '0%':   { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    function ({ addUtilities }: { addUtilities: Function }) {
      addUtilities({
        '.scrollbar-none': {
          '-ms-overflow-style': 'none',
          'scrollbar-width':    'none',
          '&::-webkit-scrollbar': { display: 'none' },
        },
        '.text-balance': { 'text-wrap': 'balance' },
      })
    },
  ],
}

export default config