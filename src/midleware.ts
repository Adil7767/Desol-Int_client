import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (request.nextUrl.pathname.startsWith('/submit-car')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (request.nextUrl.pathname === '/login') {
    if (token) {
      return NextResponse.redirect(new URL('/submit-car', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/submit-car', '/login'],
}

