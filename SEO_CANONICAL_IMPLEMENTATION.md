# SEO Canonical Tags Implementation Guide

## Overview
This guide explains how canonical tags are implemented in the Next.js App Router project to ensure proper SEO and fix the "indexed but not ranking" issue caused by pages.dev exposure.

## 1. Domain Redirect Middleware

The `app/middleware.js` file handles automatic 301 redirects from the Cloudflare Pages domain to the custom domain:

```javascript
import { NextResponse } from 'next/server'

export function middleware(request) {
  const url = request.nextUrl.clone()
  const host = request.headers.get('host')
  
  // Redirect from Cloudflare Pages domain to custom domain with 301
  if (host === 'colormean-project.pages.dev') {
    const newUrl = new URL(url.pathname + url.search, 'https://colormean.com')
    return NextResponse.redirect(newUrl, 301)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

## 2. Dynamic Canonical Tags

The `components/canonical-tag.tsx` component automatically adds canonical tags to all pages:

```tsx
'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function CanonicalTag() {
  const pathname = usePathname()
  
  useEffect(() => {
    // Remove existing canonical tags
    const existingLinks = document.querySelectorAll('link[rel="canonical"]')
    existingLinks.forEach(link => link.remove())
    
    // Create new canonical tag
    const canonicalUrl = `https://colormean.com${pathname}`
    const link = document.createElement('link')
    link.rel = 'canonical'
    link.href = canonicalUrl
    
    document.head.appendChild(link)
    
    return () => link.remove()
  }, [pathname])
  
  return null
}
```

## 3. Static Metadata Implementation

For pages using `generateMetadata`, canonical URLs are set statically:

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hex } = await params
  const cleanHex = normalizeHex(hex).replace("#", "").toUpperCase()
  
  return {
    // ... other metadata
    alternates: {
      canonical: `https://colormean.com/colors/${cleanHex.toLowerCase()}`,
    },
    openGraph: {
      url: `https://colormean.com/colors/${cleanHex.toLowerCase()}`,
      // ... other OG tags
    },
  }
}
```

## 4. How It Works Together

1. **Middleware Level**: All traffic from `colormean-project.pages.dev` gets 301 redirected to `https://colormean.com`
2. **Component Level**: The `CanonicalTag` component ensures every page has the correct canonical URL pointing to the custom domain
3. **Static Generation**: Pages with `generateMetadata` include canonical URLs at build time
4. **Client Side**: Dynamic routes get canonical tags added client-side via the CanonicalTag component

## 5. Benefits

- ✅ Eliminates duplicate content issues between domains
- ✅ Consolidates SEO authority to the custom domain
- ✅ Fixes "indexed but not ranking" problems
- ✅ Maintains proper link equity transfer
- ✅ Works seamlessly with dynamic routes
- ✅ Preserves all existing functionality

## 6. Verification

After deployment, you can verify the implementation by:

1. Visiting `https://colormean-project.pages.dev/any-page` - should redirect to `https://colormean.com/any-page`
2. Checking page source for `<link rel="canonical" href="https://colormean.com/current-path" />`
3. Using Google Search Console to verify canonical URLs are being recognized

## 7. Best Practices Implemented

- Uses 301 permanent redirects for maximum SEO benefit
- Canonical URLs point to HTTPS version of custom domain
- Handles all paths and query parameters correctly
- Works with both static and dynamic routes
- Prevents canonical tag duplication
- Maintains consistent URL structure