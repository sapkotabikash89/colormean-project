/**
 * Gumlet CDN utility functions for WordPress image conversion
 * Converts WordPress CMS URLs to Gumlet CDN URLs automatically
 */

const WORDPRESS_CMS_BASE = 'https://cms.colormean.com/wp-content/uploads/'
const GUMLET_CDN_BASE = 'https://colormean.gumlet.io/wp-content/uploads/'

/**
 * Check if a URL is a WordPress CMS image URL
 */
export function isWordPressImageUrl(url: string): boolean {
  if (!url) return false
  return url.includes('cms.colormean.com/wp-content/uploads/')
}

/**
 * Convert WordPress CMS URL to Gumlet CDN URL
 * @param url - WordPress image URL
 * @returns Gumlet CDN URL or original URL if not WordPress
 */
export function convertToGumletUrl(url: string): string {
  if (!url) return url
  
  // Check if it's a WordPress image URL
  if (isWordPressImageUrl(url)) {
    return url.replace(WORDPRESS_CMS_BASE, GUMLET_CDN_BASE)
  }
  
  // Also handle protocol-relative and other WordPress variations
  const variations = [
    'http://cms.colormean.com/wp-content/uploads/',
    '//cms.colormean.com/wp-content/uploads/',
  ]
  
  for (const variant of variations) {
    if (url.includes(variant)) {
      return url.replace(variant, GUMLET_CDN_BASE)
    }
  }
  
  return url
}

/**
 * Convert all WordPress image URLs in HTML content to Gumlet URLs
 * @param html - HTML content with WordPress image URLs
 * @returns HTML with Gumlet CDN URLs
 */
export function convertHtmlImagesToGumlet(html: string): string {
  if (!html) return html
  
  // Replace all WordPress image URLs in src attributes
  let converted = html.replace(
    /src=["'](https?:)?\/\/cms\.colormean\.com\/wp-content\/uploads\/([^"']+)["']/gi,
    `src="${GUMLET_CDN_BASE}$2"`
  )
  
  // Replace all WordPress image URLs in srcset attributes
  converted = converted.replace(
    /srcset=["']([^"']*cms\.colormean\.com\/wp-content\/uploads\/[^"']*)["']/gi,
    (match, srcset) => {
      const convertedSrcset = srcset.replace(
        /(https?:)?\/\/cms\.colormean\.com\/wp-content\/uploads\//gi,
        GUMLET_CDN_BASE
      )
      return `srcset="${convertedSrcset}"`
    }
  )
  
  // Replace background image URLs in style attributes
  converted = converted.replace(
    /url\((["']?)(https?:)?\/\/cms\.colormean\.com\/wp-content\/uploads\/([^)"']+)\1\)/gi,
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
