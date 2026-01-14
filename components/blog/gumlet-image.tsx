"use client"

import { useEffect, useRef, useState } from 'react'
import { convertToGumletUrl } from '@/lib/gumlet-image-utils'

interface GumletImageProps {
  src: string
  alt?: string
  width?: number
  height?: number
  className?: string
}

/**
 * GumletImage component for inline/post content images
 * - Keeps original dimensions
 * - Fully responsive (max-width: 100%, height: auto)
 * - Lazy-loaded
 * - Client-side only (no SSR)
 * - Automatically converts WordPress URLs to Gumlet CDN
 */
export function GumletImage({ 
  src, 
  alt = '', 
  width, 
  height, 
  className = '' 
}: GumletImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  
  // Convert WordPress URL to Gumlet CDN URL
  const gumletUrl = convertToGumletUrl(src)
  
  useEffect(() => {
    const img = imgRef.current
    if (!img) return
    
    // Set up intersection observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoaded(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '50px',
      }
    )
    
    observer.observe(img)
    
    return () => {
      observer.disconnect()
    }
  }, [])
  
  return (
    <img
      ref={imgRef}
      src={isLoaded ? gumletUrl : ''}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className={`max-w-full h-auto ${className}`}
      style={{
        aspectRatio: width && height ? `${width} / ${height}` : undefined,
      }}
    />
  )
}
