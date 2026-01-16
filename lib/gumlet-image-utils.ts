/**
 * Gumlet CDN utility functions
 */

const GUMLET_CDN_BASE = 'https://colormean.gumlet.io/wp-content/uploads/'

/**
 * Convert image URLs to Gumlet CDN URLs
 * @param url - Image URL
 * @returns Gumlet CDN URL or original URL
 */
export function convertToGumletUrl(url: string): string {
  if (!url) return url
  
  // Handle various image URL formats
  const variations = [
    'http://colormean.com/wp-content/uploads/',
    'https://colormean.com/wp-content/uploads/',
    '//colormean.com/wp-content/uploads/',
  ]
  
  for (const variant of variations) {
    if (url.includes(variant)) {
      return url.replace(variant, GUMLET_CDN_BASE)
    }
  }
  
  return url
}

/**
 * Convert all image URLs in HTML content to Gumlet URLs
 * @param html - HTML content with image URLs
 * @returns HTML with Gumlet CDN URLs
 */
export function convertHtmlImagesToGumlet(html: string): string {
  if (!html) return html
  
  // Replace all image URLs in src attributes
  let converted = html.replace(
    /src=["']([^"']+)["']/gi,
    (match, src) => {
      if (src.includes('colormean.com/wp-content/uploads/')) {
        return `src="${convertToGumletUrl(src)}"`
      }
      return match
    }
  )
  
  // Replace all image URLs in srcset attributes
  converted = converted.replace(
    /srcset=["']([^"']*)["']/gi,
    (match, srcset) => {
      if (srcset.includes('colormean.com/wp-content/uploads/')) {
        const convertedSrcset = srcset.replace(
          /(https?:)?\/\/colormean\.com\/wp-content\/uploads\//gi,
          GUMLET_CDN_BASE
        )
        return `srcset="${convertedSrcset}"`
      }
      return match
    }
  )
  
  // Replace background image URLs in style attributes
  converted = converted.replace(
    /url\((["']?)(https?:)?\/\/colormean\.com\/wp-content\/uploads\/([^)"']+)\1\)/gi,
    `url($1${GUMLET_CDN_BASE}$3$1)`
  )
  
  return converted
}

/**
 * Extract image URLs from HTML content
 * @param html - HTML content
 * @returns Array of image URLs
 */
export function extractImageUrls(html: string): string[] {
  if (!html) return []
  
  const urls: string[] = []
  const srcMatches = html.matchAll(/src=["']([^"']+)["']/gi)
  
  for (const match of srcMatches) {
    if (match[1] && (match[1].includes('.jpg') || match[1].includes('.jpeg') || 
        match[1].includes('.png') || match[1].includes('.webp') || match[1].includes('.gif'))) {
      urls.push(match[1])
    }
  }
  
  return urls
}
