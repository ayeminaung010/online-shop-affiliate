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

  // Intercept TikTok in-app browser globally
  const userAgent = request.headers.get('user-agent') || '';
  const isTikTok = userAgent.toLowerCase().includes('tiktok') || userAgent.toLowerCase().includes('bytedance') || userAgent.toLowerCase().includes('trill');

  if (isTikTok && !pathname.startsWith('/open-in-browser') && !pathname.startsWith('/api/')) {
    const url = request.nextUrl.clone();

    // If it's a /go/ link, preserve the ID for the platform wording (optional but good for context)
    if (pathname.startsWith('/go/')) {
      const id = pathname.substring(4);
      url.searchParams.set('id', id);
    }

    url.pathname = '/open-in-browser';
    return NextResponse.rewrite(url);
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
