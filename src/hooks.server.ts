import type { Handle } from '@sveltejs/kit';

// Basic in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Configuration
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 150; // max 150 requests per window per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return false;
  }

  if (now > record.resetTime) {
    // Reset window
    record.count = 1;
    record.resetTime = now + WINDOW_MS;
    return false;
  }

  record.count += 1;
  return record.count > MAX_REQUESTS;
}

// Optional cleanup to prevent memory leak for inactive IPs
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, WINDOW_MS);

export const handle: Handle = async ({ event, resolve }) => {
  // Get IP address
  const clientAddress = event.getClientAddress();

  if (isRateLimited(clientAddress)) {
    return new Response('Too Many Requests', { status: 429 });
  }

  const response = await resolve(event);

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
};
