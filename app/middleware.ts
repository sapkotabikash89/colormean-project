import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware for domain redirects only
 * 
 * This middleware handles redirects from Cloudflare Pages domain to custom domain.
 * All color page 410 handling has been moved to Cloudflare Worker.
 */

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const host = request.headers.get('host')
  
  // Handle domain redirects
  if (host === 'colormean-project.pages.dev') {
    // Redirect from Cloudflare Pages domain to custom domain with 301
    const newUrl = new URL(url.pathname + url.search, 'https://colormean.com')
    return NextResponse.redirect(newUrl, 301)
  }
  
  // For all other requests, continue normally
  return NextResponse.next()
}

// Configure middleware to run on all paths for domain redirects
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}