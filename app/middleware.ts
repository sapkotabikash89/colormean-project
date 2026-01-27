import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Import complete list of known color hex codes (1534 entries)
// Generated from color-meaning.json for Edge runtime compatibility
import { KNOWN_HEXES } from '@/lib/known-hexes-array'

/**
 * Unified Middleware handling both:
 * 1. Domain redirects (Cloudflare Pages to custom domain)
 * 2. HTTP 410 Gone responses for unknown color pages
 */

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const host = request.headers.get('host')
  const { pathname } = request.nextUrl
  
  // 1. Handle domain redirects first
  if (host === 'colormean-project.pages.dev') {
    // Redirect from Cloudflare Pages domain to custom domain with 301
    const newUrl = new URL(url.pathname + url.search, 'https://colormean.com')
    return NextResponse.redirect(newUrl, 301)
  }
  
  // 2. Handle color page 410 responses
  // Only handle /colors/* URLs
  if (!pathname.startsWith('/colors/')) {
    return NextResponse.next()
  }
  
  // TEMPORARY TEST: Return 410 for all /colors/* URLs to see if middleware is triggered
  // Remove this after testing
  // return new NextResponse(null, {
  //   status: 410,
  //   statusText: 'Gone',
  //   headers: {
  //     'Content-Type': 'text/html',
  //   },
  // });
  
  // Extract hex parameter from URL
  // Expected format: /colors/{hex}
  const hexParam = pathname.split('/')[2]
  
  if (!hexParam) {
    // No hex parameter - let page component handle this case
    return NextResponse.next()
  }
  
  // HEX NORMALIZATION
  // Convert to lowercase and strip leading # if present
  let normalizedHex = hexParam.toLowerCase()
  if (normalizedHex.startsWith('#')) {
    normalizedHex = normalizedHex.substring(1)
  }
  
  // Validate hex format (must be 3 or 6 hexadecimal digits)
  const hexRegex = /^[0-9a-f]{3}$|^[0-9a-f]{6}$/
  if (!hexRegex.test(normalizedHex)) {
    // Invalid hex format - let page component handle 404/notFound()
    return NextResponse.next()
  }
  
  // CHECK AGAINST KNOWN COLORS DATABASE
  // Use static array of known hex codes for Edge runtime compatibility
  

  
  // If hex is NOT in our known colors database, return HTTP 410 Gone
  if (!KNOWN_HEXES.includes(normalizedHex)) {
    // UNKNOWN COLOR - RETURN HTTP 410 GONE
    // - Empty response body (null)
    // - No HTML, JSX, or layout rendering
    // - Immediate server-side response
    // - Signals to search engines that this resource is permanently gone
    return new NextResponse(null, {
      status: 410,
      statusText: 'Gone',
      headers: {
        'Content-Type': 'text/html',
      },
    })
  }
  
  // KNOWN COLOR - PASS THROUGH FOR NORMAL RENDERING
  // Let the page component render the full 200 OK response
  // with all JSX, metadata, canonical tags, and layout intact
  return NextResponse.next()
}

// Configure middleware to run on all paths (needed for domain redirects)
// Color page handling is done conditionally within the middleware function
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