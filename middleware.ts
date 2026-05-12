import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect dashboard and internal APIs
  const isDashboard = pathname.startsWith('/dashboard') && pathname !== '/dashboard/login'
  const isInternalApi = pathname.startsWith('/api/reviews')

  if (isDashboard || isInternalApi) {
    const authCookie = request.cookies.get('dash_auth')

    if (!authCookie || authCookie.value !== '1') {
      if (isInternalApi) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      return NextResponse.redirect(new URL('/dashboard/login', request.url))
    }
  }

  const response = NextResponse.next()

  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/reviews/:path*'],
}