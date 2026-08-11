import { auth } from "@/lib/auth-edge"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes configuration
const ROUTES = {
  public: ['/', '/about', '/contact'],
  auth: ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'],
  customer: ['/dashboard', '/transactions', '/deposit', '/transfer', '/profile', '/settings'],
  admin: ['/admin'],
  api: ['/api'],
}

const middleware = auth((req) => {
  const { nextUrl } = req
  const path = nextUrl.pathname
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role

  // Send logged-in users straight to their dashboard instead of the
  // marketing homepage (which shows Sign On / Register CTAs meant for
  // logged-out visitors).
  if (path === '/' && isLoggedIn) {
    const redirectTo = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN'
      ? '/admin/dashboard'
      : '/dashboard'
    return NextResponse.redirect(new URL(redirectTo, nextUrl))
  }

  // Allow public routes
  if (ROUTES.public.includes(path) || path === '/') {
    return NextResponse.next()
  }

  // Allow API routes (handle auth in API handlers)
  if (ROUTES.api.some(route => path.startsWith(route))) {
    return NextResponse.next()
  }

  // Redirect logged-in users away from auth pages
  if (ROUTES.auth.some(route => path.startsWith(route))) {
    if (isLoggedIn) {
      const redirectTo = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN' 
        ? '/admin/dashboard' 
        : '/dashboard'
      return NextResponse.redirect(new URL(redirectTo, nextUrl))
    }
    return NextResponse.next()
  }

  // Protect customer routes
  if (ROUTES.customer.some(route => path.startsWith(route))) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', nextUrl)
      loginUrl.searchParams.set('callbackUrl', path)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // Protect admin routes
  if (ROUTES.admin.some(route => path.startsWith(route))) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', nextUrl)
      loginUrl.searchParams.set('callbackUrl', path)
      return NextResponse.redirect(loginUrl)
    }
    
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', nextUrl))
    }
    
    return NextResponse.next()
  }

  return NextResponse.next()
})

export default middleware
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}