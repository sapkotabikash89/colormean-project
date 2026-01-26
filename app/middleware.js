import { NextResponse } from 'next/server'

// Middleware to handle domain redirects and canonical URLs
export function middleware(request) {
  const url = request.nextUrl.clone()
  const host = request.headers.get('host')
  
  // Redirect from Cloudflare Pages domain to custom domain with 301
  if (host === 'colormean-project.pages.dev') {
    // Construct the new URL with the custom domain
    const newUrl = new URL(url.pathname + url.search, 'https://colormean.com')
    return NextResponse.redirect(newUrl, 301)
  }
  
  // For all other hosts, continue normally
  return NextResponse.next()
}

// Configure which paths the middleware should run on
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