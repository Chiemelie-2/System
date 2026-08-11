// app/page.tsx
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <header className="w-full px-6 py-5 flex items-center">
        <Image
          src="/images/All BeBell.png"
          alt="BeBell Bank"
          width={140}
          height={40}
          priority
          className="h-9 w-auto object-contain"
        />
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold text-primary-800 max-w-2xl leading-tight">
          Banking made simple.
        </h1>

        <Link
          href="/register"
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-primary-700 px-8 h-12 text-white text-base font-semibold hover:bg-primary-800 transition-colors"
        >
          Sign Up
        </Link>

        <p className="mt-6 text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-700 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </section>

      <footer className="px-6 py-6 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} BeBell Bank
      </footer>
    </main>
  )
}
