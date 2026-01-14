"use client"

import { useEffect, useRef } from 'react'
import { convertToGumletUrl } from '@/lib/gumlet-image-utils'

interface BlogContentProps {
  html: string
  className?: string
  style?: React.CSSProperties
}

/**
 * BlogContent component - Client-side blog content renderer
 * - Converts all WordPress image URLs to Gumlet CDN URLs
 * - Adds lazy loading to all images
 * - Fully responsive images
 * - Client-side only to minimize Cloudflare Worker computation
 */
export function BlogContent({ html, className = '', style }: BlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!contentRef.current) return
    
    // Find all images in the content
    const images = contentRef.current.querySelectorAll('img')
    
    images.forEach((img) => {
      const originalSrc = img.getAttribute('src') || img.getAttribute('data-src')
      
      if (originalSrc) {
        // Convert WordPress URL to Gumlet CDN URL
        const gumletUrl = convertToGumletUrl(originalSrc)
        
        // Update the image source
        img.src = gumletUrl
        
        // Ensure lazy loading
        if (!img.getAttribute('loading')) {
          img.setAttribute('loading', 'lazy')
        }
        
        // Ensure decoding async
        if (!img.getAttribute('decoding')) {
          img.setAttribute('decoding', 'async')
        }
        
        // Make image responsive
        if (!img.style.maxWidth) {
          img.style.maxWidth = '100%'
        }
        if (!img.style.height) {
          img.style.height = 'auto'
        }
        
        // Add responsive class if not present
        const classes = img.className || ''
        if (!classes.includes('max-w-full')) {
          img.className = `${classes} max-w-full h-auto`.trim()
        }
      }
    })
    
    // Also handle srcset attributes
    const imagesWithSrcset = contentRef.current.querySelectorAll('img[srcset]')
    imagesWithSrcset.forEach((img) => {
      const srcset = img.getAttribute('srcset')
      if (srcset) {
        // Convert all URLs in srcset to Gumlet
        const convertedSrcset = srcset.replace(
          /(https?:)?\/\/cms\.colormean\.com\/wp-content\/uploads\/([^\s,]+)/gi,
          (match, protocol, path) => {
            return `https://colormean.gumlet.io/wp-content/uploads/${path}`
          }
        )
        img.setAttribute('srcset', convertedSrcset)
      }
    })
  }, [html])
  
  return (
    <div
      ref={contentRef}
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
