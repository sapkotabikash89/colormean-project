import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  
  // Check if the request is for a color page
  if (url.pathname.startsWith('/colors/')) {
    const hex = url.pathname.split('/')[2]
    
    // If it's a valid hex pattern but not in our static paths,
    // redirect to the dynamic color handler
    if (hex && /^[0-9a-fA-F]{3,6}$/i.test(hex)) {
      // We'll let the static generation handle known colors
      // and the dynamic route will handle unknown colors
      return NextResponse.next()
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/colors/:path*',
  ],
}