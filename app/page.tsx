// app/page.tsx
import Link from 'next/link'
import Image from 'next/image'

/* ─────────────────────────────────────────────────────────────────
   Fiduciary — Landing Page
   Sections:
     1. Navbar
     2. Hero       — full-bleed image + overlay + headline (signature)
     3. Trust bar  — 4 key stats
     4. Services   — 3 service cards
     5. How it works — 3-step process
     6. Articles   — 2 editorial pieces
     7. Feature split — image + copy (HappyLady.jpg)
     8. Testimonial quote
     9. CTA banner
    10. Footer
─────────────────────────────────────────────────────────────────── */

const services = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2z"/>
      </svg>
    ),
    title: 'Digital Current Account',
    body:  'Open an account in minutes. Manage your money, make payments, and track every transaction in real time — from any device.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
      </svg>
    ),
    title: 'Instant Transfers',
    body:  'Send funds to any account instantly. Fiduciary processes transfers with bank-grade security and confirms within seconds.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
      </svg>
    ),
    title: 'Verified & Secure',
    body:  'Full KYC verification, encrypted data at rest and in transit, and continuous fraud monitoring so your assets stay protected.',
  },
]

const steps = [
  {
    num:   '01',
    title: 'Create your account',
    body:  'Register with your email in under two minutes. No paperwork, no branch visit.',
  },
  {
    num:   '02',
    title: 'Verify your identity',
    body:  'Complete our streamlined KYC process. Upload your documents once and we handle the rest.',
  },
  {
    num:   '03',
    title: 'Start banking',
    body:  'Deposit funds, transfer money, and manage your portfolio — all from your dashboard.',
  },
]

const articles = [
  {
    tag:     'Wealth Planning',
    title:   'Five principles every private banking client should know',
    excerpt: 'From liquidity management to generational wealth transfer, the most effective financial strategies share common pillars that transcend market cycles.',
    readTime:'5 min read',
    img:     '/images/coupleImage.png',
  },
  {
    tag:     'Security',
    title:   'How Fiduciary keeps your assets safe in the digital age',
    excerpt: 'We use military-grade AES-256 encryption, multi-factor authentication, and real-time anomaly detection to give you institutional-level protection.',
    readTime:'4 min read',
    img:     '/images/familyImage.jpg',
  },
]

const trustStats = [
  { value: '$ 2B+',    label: 'Assets under management' },
  { value: '99.97%',   label: 'Platform uptime SLA'     },
  { value: '< 3 sec',  label: 'Average transfer speed'  },
  { value: '256-bit',  label: 'AES encryption standard' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* ══════════════════════════════════════════
          1. NAVBAR
      ══════════════════════════════════════════ */}
      <header className="fixed top-0 inset-x-0 z-50">
        {/* Translucent glass bar */}
        <div className="bg-primary-950/80 backdrop-blur-md border-b border-white/[0.06]">
          <div className="mx-auto max-w-7xl px-6 lg:px-10 h-16 flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600
                              flex items-center justify-center shadow-lg
                              group-hover:shadow-gold-500/30 transition-shadow duration-300">
                <span className="font-display font-bold text-white text-base tracking-tight">F</span>
              </div>
              <span className="font-display font-bold text-white text-xl tracking-tight">
                Fiduciary
              </span>
            </Link>

            {/* Nav links — desktop */}
            <nav className="hidden md:flex items-center gap-8">
              {['Services', 'Security', 'About'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Auth links */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:inline-flex text-sm font-semibold text-white/80
                           hover:text-white transition-colors duration-200"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg
                           bg-gold-500 hover:bg-gold-600
                           px-4 h-9 text-sm font-bold text-white
                           shadow-md shadow-gold-900/30
                           transition-all duration-200 hover:-translate-y-px"
              >
                Open Account
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          2. HERO — full-bleed image + overlay + text
          Signature element: the diagonal gold rule
          that bisects headline and subhead.
      ══════════════════════════════════════════ */}
      {/*
        Hero: min-h-[100svh] gives a concrete height so next/image fill resolves correctly.
        The section itself is the positioned ancestor (position:relative via Tailwind).
      */}
      <section className="relative min-h-[100svh] h-[100svh] flex items-center overflow-hidden">

        {/* Background image — parent has explicit height via h-[100svh] */}
        <Image
          src="/images/HappyLady.jpg"
          alt="Fiduciary client"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 hero-overlay" />

        {/* Subtle grid texture on top of overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 pt-24 pb-20
                        flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12">

          {/* Left: Main headline */}
          <div className="max-w-2xl animate-slide-up">

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="h-px w-8 bg-gold-400"/>
              <span className="text-xs font-semibold tracking-[0.2em] text-gold-400 uppercase">
                Private Banking Reimagined
              </span>
            </div>

            <h1 className="font-display font-bold text-white leading-[1.06]
                           text-[clamp(2.4rem,5.5vw,4.5rem)]
                           [text-shadow:0_2px_32px_rgba(0,0,0,0.4)]">
              Your wealth,<br/>
              <span className="text-gold-400">managed with</span><br/>
              precision.
            </h1>

            {/* Gold rule — the signature element */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 max-w-[80px] bg-gold-400"/>
              <div className="h-1.5 w-1.5 rounded-full bg-gold-400"/>
            </div>

            <p className="text-[clamp(1rem,1.8vw,1.2rem)] text-white/75 leading-relaxed max-w-lg">
              Fiduciary gives individuals and families access to institutional-grade
              banking — secure, transparent, and built for the long term.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2
                           rounded-xl bg-gold-500 hover:bg-gold-600
                           px-8 h-13 text-[15px] font-bold text-white
                           shadow-xl shadow-gold-900/40
                           transition-all duration-200 hover:-translate-y-0.5"
              >
                Open Your Account
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2
                           rounded-xl border border-white/30 bg-white/10
                           backdrop-blur-sm px-8 h-13 text-[15px] font-semibold text-white
                           hover:bg-white/20 transition-all duration-200"
              >
                Sign In
              </Link>
            </div>

            <p className="mt-5 text-xs text-white/40 font-medium">
              No monthly fees on standard accounts · NDIC insured
            </p>
          </div>

          {/* Right: Floating stat card */}
          <div className="hidden lg:block flex-shrink-0 w-72">
            <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl
                            p-6 space-y-4 shadow-2xl">
              <p className="text-xs font-semibold tracking-widest text-gold-400 uppercase">
                Why Fiduciary?
              </p>
              {[
                { icon: '🛡', text: 'Bank-grade AES-256 encryption' },
                { icon: '⚡', text: 'Transfers settle in under 3 seconds' },
                { icon: '📊', text: 'Real-time portfolio dashboard' },
                { icon: '✅', text: 'Full KYC & regulatory compliance' },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  <span className="text-base mt-px">{item.icon}</span>
                  <span className="text-sm text-white/80 leading-snug">{item.text}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-white/10">
                <Link
                  href="/register"
                  className="block w-full text-center rounded-xl bg-gold-500 hover:bg-gold-600
                             py-2.5 text-sm font-bold text-white transition-colors duration-200"
                >
                  Get started →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="flex flex-col items-center gap-1">
            <div className="h-8 w-5 rounded-full border border-white/30 flex items-start justify-center pt-1.5">
              <div className="h-2 w-0.5 rounded-full bg-white/50 animate-pulse"/>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3. TRUST STATISTICS BAR
      ══════════════════════════════════════════ */}
      <section className="bg-primary-900 py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-white/10">
            {trustStats.map((stat) => (
              <div key={stat.label} className="text-center lg:px-8">
                <p className="font-display font-bold text-gold-400 text-3xl lg:text-4xl tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-xs font-medium text-white/50 tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. SERVICES
      ══════════════════════════════════════════ */}
      <section id="services" className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">

          {/* Section header */}
          <div className="max-w-xl mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-6 bg-gold-500"/>
              <span className="text-xs font-semibold tracking-[0.18em] text-gold-600 uppercase">
                What we offer
              </span>
            </div>
            <h2 className="font-display font-bold text-primary-900
                           text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight">
              Everything you need,<br/>
              <span className="text-gold-600">nothing you don't.</span>
            </h2>
            <p className="mt-4 text-base text-gray-500 leading-relaxed">
              Fiduciary strips banking back to its essentials — security, speed,
              and clarity — so you can focus on what matters.
            </p>
          </div>

          {/* Service cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <div
                key={service.title}
                className="group relative rounded-2xl border border-gray-200 bg-white p-8
                           shadow-sm hover:shadow-[0_8px_40px_rgba(26,31,110,0.12)]
                           hover:border-primary-100 hover:-translate-y-1
                           transition-all duration-300"
              >
                {/* Icon */}
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center
                                rounded-xl bg-primary-50 text-primary-700
                                group-hover:bg-primary-800 group-hover:text-white
                                transition-colors duration-300">
                  {service.icon}
                </div>

                {/* Gold accent line */}
                <div className="mb-4 h-0.5 w-8 bg-gold-400
                                group-hover:w-16 transition-all duration-300"/>

                <h3 className="font-display font-bold text-primary-900 text-xl mb-3">
                  {service.title}
                </h3>
                <p className="text-[15px] text-gray-500 leading-relaxed">
                  {service.body}
                </p>

                {/* Subtle number watermark */}
                <span className="absolute bottom-5 right-6 font-display font-bold
                                 text-5xl text-gray-50 select-none pointer-events-none
                                 group-hover:text-primary-50 transition-colors duration-300">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          5. HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">

          <div className="text-center max-w-xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-6 bg-gold-500"/>
              <span className="text-xs font-semibold tracking-[0.18em] text-gold-600 uppercase">
                Getting started
              </span>
              <div className="h-px w-6 bg-gold-500"/>
            </div>
            <h2 className="font-display font-bold text-primary-900
                           text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight">
              Up and running in minutes
            </h2>
            <p className="mt-4 text-base text-gray-500 leading-relaxed">
              We've removed the friction. Opening a Fiduciary account is faster
              than ordering lunch.
            </p>
          </div>

          <div className="relative grid md:grid-cols-3 gap-8">
            {/* Connector line — desktop only */}
            <div className="hidden md:block absolute top-8 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)]
                            h-px bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 z-0"/>

            {steps.map((step) => (
              <div key={step.num} className="relative z-10 text-center">
                {/* Step circle */}
                <div className="mx-auto mb-6 h-16 w-16 rounded-full
                                bg-primary-900 border-4 border-white shadow-lg
                                flex items-center justify-center">
                  <span className="font-display font-bold text-gold-400 text-lg">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-display font-bold text-primary-900 text-xl mb-3">
                  {step.title}
                </h3>
                <p className="text-[15px] text-gray-500 leading-relaxed max-w-xs mx-auto">
                  {step.body}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-800
                         hover:bg-primary-900 px-8 py-3.5 text-[15px] font-bold text-white
                         shadow-lg shadow-primary-900/20
                         transition-all duration-200 hover:-translate-y-0.5"
            >
              Open your account
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          6. ARTICLES / EDITORIAL SECTION
      ══════════════════════════════════════════ */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-px w-6 bg-gold-500"/>
                <span className="text-xs font-semibold tracking-[0.18em] text-gold-600 uppercase">
                  Insights
                </span>
              </div>
              <h2 className="font-display font-bold text-primary-900
                             text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight">
                Financial clarity,<br/>whenever you need it.
              </h2>
            </div>
            <Link
              href="#"
              className="text-sm font-semibold text-primary-700 hover:text-primary-900
                         flex items-center gap-1.5 flex-shrink-0 transition-colors duration-200"
            >
              View all articles
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {articles.map((article) => (
              <article
                key={article.title}
                className="group relative rounded-2xl overflow-hidden
                           border border-gray-200 bg-white
                           hover:shadow-[0_8px_40px_rgba(26,31,110,0.10)]
                           hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {/* Article image — h-52 gives fill its concrete height */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={article.img}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center
                               group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Dark overlay on image */}
                  <div className="absolute inset-0 bg-gradient-to-t
                                  from-primary-950/70 via-primary-900/20 to-transparent"/>
                  {/* Tag over image */}
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold
                                     tracking-wide uppercase bg-gold-500 text-white shadow">
                      {article.tag}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  <h3 className="font-display font-bold text-primary-900 text-lg leading-snug mb-3
                                 group-hover:text-primary-700 transition-colors duration-200">
                    {article.title}
                  </h3>
                  <p className="text-[14px] text-gray-500 leading-relaxed mb-5 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="font-medium">{article.readTime}</span>
                    <span className="flex items-center gap-1 text-primary-600 font-semibold
                                     group-hover:gap-2 transition-all duration-200">
                      Read more
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          7. FEATURE SPLIT — image left, copy right
      ══════════════════════════════════════════ */}
      <section id="security" className="py-0 bg-white overflow-hidden border-t border-gray-100">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 lg:min-h-[520px]">

            {/*
              Image side:
              - On mobile: explicit h-72 gives fill its concrete height (avoids height:0 error)
              - On desktop: lg:min-h-[520px] on the grid row + lg:h-auto lets it stretch naturally
              The "relative" class makes this the fill image's positioned ancestor.
            */}
            <div className="relative h-72 lg:h-auto overflow-hidden">
              <Image
                src="/images/coupleImage.png"
                alt="Fiduciary clients"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r
                              from-primary-950/30 via-transparent to-transparent"/>
              {/* Decorative frame */}
              <div className="absolute inset-6 border border-white/20 rounded-xl
                              pointer-events-none"/>
              {/* Caption on image */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20
                                p-4 max-w-xs">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"/>
                    <span className="text-xs font-semibold text-white/70">Live account security</span>
                  </div>
                  <p className="text-white font-semibold text-sm">
                    All transactions monitored 24/7 for anomalies.
                  </p>
                </div>
              </div>
            </div>

            {/* Copy side */}
            <div className="flex items-center px-10 py-16 lg:px-16 bg-white">
              <div className="max-w-md">
                <div className="inline-flex items-center gap-2 mb-5">
                  <div className="h-px w-6 bg-gold-500"/>
                  <span className="text-xs font-semibold tracking-[0.18em] text-gold-600 uppercase">
                    Security
                  </span>
                </div>
                <h2 className="font-display font-bold text-primary-900 leading-tight
                               text-[clamp(1.75rem,3vw,2.5rem)] mb-5">
                  Trusted by thousands.<br/>
                  <span className="text-gold-600">Secured for everyone.</span>
                </h2>
                <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
                  Every Fiduciary account is protected by multi-layered security —
                  from device-level verification to network-level intrusion detection.
                  Your money never moves without your explicit approval.
                </p>

                <ul className="space-y-3 mb-8">
                  {[
                    'End-to-end AES-256 data encryption',
                    'Two-factor authentication on every login',
                    'Real-time fraud detection & account freeze',
                    'Fully compliant with CBN digital banking guidelines',
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-3 text-[14px] text-gray-600">
                      <svg className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0"
                           fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                              d="M5 13l4 4L19 7"/>
                      </svg>
                      {point}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-800
                             hover:bg-primary-900 px-6 py-3 text-[14px] font-bold text-white
                             shadow-md shadow-primary-900/20
                             transition-all duration-200 hover:-translate-y-0.5"
                >
                  Start banking securely
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          8. TESTIMONIAL QUOTE
      ══════════════════════════════════════════ */}
      <section className="py-24 bg-primary-950 overflow-hidden relative">
        {/* Decorative blob */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full
                        bg-gold-500/10 blur-3xl pointer-events-none"/>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full
                        bg-primary-700/20 blur-3xl pointer-events-none"/>

        <div className="relative mx-auto max-w-3xl px-6 lg:px-10 text-center">
          {/* Quote mark */}
          <div className="font-display font-bold text-gold-400/20 text-[120px] leading-none
                          absolute -top-6 left-1/2 -translate-x-1/2 select-none pointer-events-none">
            "
          </div>

          <blockquote className="relative z-10">
            <p className="font-display font-semibold text-white
                          text-[clamp(1.2rem,2.5vw,1.75rem)] leading-snug mb-8">
              "Fiduciary is the only digital bank that made me feel like a priority,
              not a number. The dashboard is intuitive, transfers are instant, and
              support actually responds."
            </p>
            <footer className="flex flex-col items-center gap-2">
              <div className="h-px w-12 bg-gold-400/40"/>
              <cite className="not-italic text-sm font-semibold text-gold-400 tracking-wide">
                John Doe
              </cite>
              <span className="text-xs text-white/40">Private Account Holder, New York</span>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          9. CTA BANNER — image background with overlay
      ══════════════════════════════════════════ */}
      {/*
        CTA Banner: py-28 alone doesn't give next/image fill a concrete height.
        min-h-[480px] ensures the section always has a measurable height for the fill image.
      */}
      <section className="relative min-h-[480px] py-28 overflow-hidden">
        <Image
          src="/images/petImage.png"
          alt=""
          fill
          aria-hidden
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Strong overlay */}
        <div className="absolute inset-0 bg-gradient-to-br
                        from-primary-950/92 via-primary-900/85 to-primary-800/80"/>

        <div className="relative z-10 mx-auto max-w-3xl px-6 lg:px-10 text-center">
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="h-px w-8 bg-gold-400"/>
            <span className="text-xs font-semibold tracking-[0.2em] text-gold-400 uppercase">
              Join Fiduciary today
            </span>
            <div className="h-px w-8 bg-gold-400"/>
          </div>
          <h2 className="font-display font-bold text-white
                         text-[clamp(2rem,4.5vw,3.5rem)] leading-tight mb-5">
            The bank you deserve<br/>has been waiting for you.
          </h2>
          <p className="text-[16px] text-white/65 leading-relaxed max-w-xl mx-auto mb-10">
            Open a Fiduciary account in minutes. No paperwork, no queues,
            no hidden charges — just modern banking done right.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl
                         bg-gold-500 hover:bg-gold-600
                         px-8 py-4 text-[15px] font-bold text-white
                         shadow-xl shadow-gold-900/40
                         transition-all duration-200 hover:-translate-y-0.5"
            >
              Open an Account — It's Free
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl
                         border border-white/30 bg-white/10 backdrop-blur-sm
                         px-8 py-4 text-[15px] font-semibold text-white
                         hover:bg-white/20 transition-all duration-200"
            >
              Sign in to your account
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          10. FOOTER
      ══════════════════════════════════════════ */}
      <footer className="bg-primary-950 border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16">

          {/* Top row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12
                          border-b border-white/[0.08]">

            {/* Brand */}
            <div className="md:col-span-2">
              <Link href="/" className="inline-flex items-center gap-3 mb-5">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600
                                flex items-center justify-center shadow-lg">
                  <span className="font-display font-bold text-white text-base">F</span>
                </div>
                <span className="font-display font-bold text-white text-xl">Fiduciary</span>
              </Link>
              <p className="text-[14px] text-white/45 leading-relaxed max-w-xs">
                Private banking precision, delivered digitally.
                Fiduciary is a E-banking platform.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-4 mt-6">
                {[
                  { label: 'Twitter', path: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
                  { label: 'LinkedIn', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
                ].map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    aria-label={s.label}
                    className="h-8 w-8 rounded-lg border border-white/10 flex items-center
                               justify-center text-white/40 hover:text-white hover:border-white/30
                               transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={s.path}/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            {[
              {
                heading: 'Product',
                links: ['Open Account', 'Sign In', 'Dashboard', 'Transfers', 'Deposit'],
              },
              {
                heading: 'Company',
                links: ['About', 'Security', 'Privacy Policy', 'Terms of Service', 'Help'],
              },
            ].map((col) => (
              <div key={col.heading}>
                <h4 className="text-xs font-bold tracking-[0.14em] uppercase text-gold-500 mb-5">
                  {col.heading}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-[13px] text-white/45 hover:text-white/80
                                   transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} Fiduciary. All rights reserved.
            </p>
            <p className="text-xs text-white/20 text-center sm:text-right max-w-md">
              Fiduciary is an E-banking financial services.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}