'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Component to dynamically add canonical tags to the head
 * This should be used in layout files or pages where dynamic canonical URLs are needed
 */
export function CanonicalTag() {
  const pathname = usePathname()
  
  useEffect(() => {
    // Remove any existing canonical tags
    const existingLinks = document.querySelectorAll('link[rel="canonical"]')
    existingLinks.forEach(link => link.remove())
    
    // Create new canonical tag
    const canonicalUrl = `https://colormean.com${pathname}`
    const link = document.createElement('link')
    link.rel = 'canonical'
    link.href = canonicalUrl
    
    // Add to head
    document.head.appendChild(link)
    
    // Cleanup function
    return () => {
      link.remove()
    }
  }, [pathname])
  
  return null
}