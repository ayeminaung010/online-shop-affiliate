/**
 * Next.js Middleware for rate limiting and security headers
 */

import { NextResponse } from 'next/server';
import { applyRateLimit } from '@/lib/rate-limit';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Skip rate limiting for static assets and public files
  if (
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname.startsWith('/favicons') ||
    pathname.match(/\.(png|jpg|jpeg|svg|ico|css|js|webmanifest|json)$/)
  ) {
    return NextResponse.next();
  }
  
  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    // Login endpoint: stricter limits
    if (pathname.includes('/admin/login') || pathname === '/api/auth') {
      const rateLimitResponse = applyRateLimit(request, 'login');
      if (rateLimitResponse) {
        return rateLimitResponse;
      }
    } 
    // Click/redirect endpoints
    else if (pathname.startsWith('/api/clicks') || pathname.startsWith('/go/')) {
      const rateLimitResponse = applyRateLimit(request, 'redirect');
      if (rateLimitResponse) {
        return rateLimitResponse;
      }
    }
    // Other API endpoints
    else {
      const rateLimitResponse = applyRateLimit(request, 'api');
      if (rateLimitResponse) {
        return rateLimitResponse;
      }
    }
  }
  
  // Continue to next middleware/route
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all API routes and admin routes
     * Skip static files
     */
    '/((?!_next/static|_next/image|favicons|.*\\.(?:png|jpg|svg|ico|css|js|webmanifest|json)$).*)',
  ],
};
