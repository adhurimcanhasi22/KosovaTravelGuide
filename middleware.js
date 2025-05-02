import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Allow access
  return NextResponse.next();
}

// Apply middleware only to protected routes
export const config = {
  matcher: ['/dashboard'],
};
