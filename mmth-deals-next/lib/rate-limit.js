/**
 * Rate Limiting Middleware
 *
 * Implements in-memory rate limiting for API routes.
 * For high-traffic production, consider using Upstash Redis.
 */

// In-memory store for rate limits (use Redis in production)
const rateLimitStore = new Map();

/**
 * Rate limit configuration
 */
const RATE_LIMITS = {
  // Auth endpoints: stricter limits
  login: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
  },
  // API endpoints: moderate limits
  api: {
    windowMs: 60 * 1000, // 1 minute
    max: 30, // 30 requests per minute
  },
  // Redirect endpoints: higher limits (user clicks)
  redirect: {
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 redirects per minute
  },
  // Public read endpoints: generous limits
  public: {
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
  },
};

/**
 * Get client identifier from request
 * Tries multiple IP headers to work behind proxies (Vercel, Cloudflare, etc.)
 */
function getClientId(request) {
  // List of headers that might contain the real IP (checked in order of priority)
  const ipHeaders = [
    'x-real-ip',           // Nginx/proxy
    'x-vercel-ip',         // Vercel
    'x-client-ip',         // Standard
    'x-forwarded-for',     // Cloudflare, load balancers
  ];
  
  for (const header of ipHeaders) {
    const value = request.headers.get(header);
    if (value) {
      // x-forwarded-for can contain multiple IPs: "client, proxy1, proxy2"
      const ip = value.split(',')[0].trim();
      if (ip && ip !== 'unknown') {
        return ip;
      }
    }
  }
  
  // Fallback: use a hash of user agent + path (not perfect, but better than 'unknown')
  const ua = request.headers.get('user-agent') || 'unknown';
  return `fallback:${Buffer.from(ua).toString('base64').slice(0, 16)}`;
}

/**
 * Check rate limit and return status
 * @param {string} key - Rate limit key (client ID + endpoint)
 * @param {number} max - Max requests allowed
 * @param {number} windowMs - Window duration in ms
 * @returns {{ allowed: boolean, remaining: number, resetAt: number }}
 */
function checkRateLimit(key, max, windowMs) {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetAt) {
    // New window
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { allowed: true, remaining: max - 1, resetAt: now + windowMs };
  }
  
  // Existing window
  if (record.count >= max) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }
  
  record.count++;
  return { allowed: true, remaining: max - record.count, resetAt: record.resetAt };
}

/**
 * Clean up expired entries periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000); // Clean every minute

/**
 * Create rate limit response with headers
 */
function rateLimitResponse(message, resetAt) {
  const resetSeconds = Math.ceil((resetAt - Date.now()) / 1000);
  return new Response(
    JSON.stringify({ 
      error: message,
      retryAfter: resetSeconds,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(resetSeconds),
        'X-RateLimit-Limit': '0',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(resetAt),
      },
    }
  );
}

/**
 * Apply rate limiting to a request
 * @param {Request} request - The incoming request
 * @param {'login' | 'api' | 'redirect' | 'public'} type - Rate limit type
 * @returns {Response|null} - Returns 429 response if rate limited, null otherwise
 */
export function applyRateLimit(request, type = 'api') {
  const config = RATE_LIMITS[type] || RATE_LIMITS.api;
  const clientId = getClientId(request);
  const key = `${type}:${clientId}`;
  
  const result = checkRateLimit(key, config.max, config.windowMs);
  
  if (!result.allowed) {
    return rateLimitResponse('Too many requests', result.resetAt);
  }
  
  return null;
}

/**
 * Get rate limit headers for successful responses
 */
export function getRateLimitHeaders(remaining, resetAt) {
  return {
    'X-RateLimit-Limit': String(remaining),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(resetAt),
  };
}
