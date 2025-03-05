import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  // Exclude authentication routes and public routes
  if (
    request.nextUrl.pathname.startsWith('/api/auth') ||
    request.nextUrl.pathname === '/login'
  ) {
    return NextResponse.next();
  }

  const token = request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
}; 