/**
 * Utility functions for SEO canonical URL generation
 */

/**
 * Generate canonical URL for the current page
 * @param pathname - Current pathname
 * @param search - Current search parameters
 * @returns Canonical URL
 */
export function generateCanonicalUrl(pathname: string, search = ''): string {
  // Remove trailing slash for consistency (except for root)
  const cleanPath = pathname === '/' ? pathname : pathname.replace(/\/$/, '')
  return `https://colormean.com${cleanPath}${search}`
}

/**
 * Generate canonical URL from Next.js request
 * @param request - Next.js request object
 * @returns Canonical URL
 */
export function generateCanonicalFromRequest(request: Request): string {
  const url = new URL(request.url)
  return generateCanonicalUrl(url.pathname, url.search)
}

/**
 * Generate canonical URL for dynamic routes
 * @param basePath - Base path for the route
 * @param dynamicParam - Dynamic parameter value
 * @param search - Search parameters
 * @returns Canonical URL
 */
export function generateDynamicCanonical(basePath: string, dynamicParam: string, search = ''): string {
  const path = `${basePath}/${dynamicParam}`.replace(/\/+/g, '/')
  return generateCanonicalUrl(path, search)
}