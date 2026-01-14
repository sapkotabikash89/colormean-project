"use client"

import { useEffect, useMemo, useRef } from 'react'
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
  
  // Process HTML to convert all image URLs to Gumlet URLs during render
  const processedHtml = useMemo(() => {
    if (!html) return html
    
    // Convert all WordPress image URLs to Gumlet CDN URLs
    let processed = html
    
    // Replace src attributes
    processed = processed.replace(
      /src=["'](https?:)?\/\/cms\.colormean\.com\/wp-content\/uploads\/([^"']*)["']/gi,
      (_match: string, _protocol: string, path: string) => {
        return `src="https://colormean.gumlet.io/wp-content/uploads/${path}"`
      }
    )
    
    // Replace srcset attributes
    processed = processed.replace(
      /srcset=["']([^"']*cms\.colormean\.com\/wp-content\/uploads\/[^"']*)["']/gi,
      (match: string, srcset: string) => {
        const convertedSrcset = srcset.replace(
          /(https?:)?\/\/cms\.colormean\.com\/wp-content\/uploads\/([^",\s]+)/gi,
          (_subMatch: string, _subProtocol: string, subPath: string) => {
            return `https://colormean.gumlet.io/wp-content/uploads/${subPath}`
          }
        )
        return `srcset="${convertedSrcset}"`
      }
    )
    
    // Replace background image URLs in style attributes
    processed = processed.replace(
      /style=["']([^"']*)url\(([^\)]*cms\.colormean\.com\/wp-content\/uploads\/[^\)]*)\)([^"']*)["']/gi,
      (match: string, before: string, url: string, after: string) => {
        const convertedUrl = url.replace(
          /(https?:)?\/\/cms\.colormean\.com\/wp-content\/uploads\/([^",\s\)\(]+)/gi,
          (_subMatch: string, _subProtocol: string, subPath: string) => {
            return `https://colormean.gumlet.io/wp-content/uploads/${subPath}`
          }
        )
        return `style="${before}url(${convertedUrl})${after}"`
      }
    )
    
    // Add loading=lazy and decoding=async to all images if not present
    processed = processed.replace(
      /<img([^>]*)>/gi,
      (match: string, attrs: string) => {
        let newAttrs = attrs
        
        // Add loading=lazy if not present
        if (!/\sloading\s*=/.test(newAttrs)) {
          newAttrs = `${newAttrs} loading="lazy"`
        }
        
        // Add decoding=async if not present
        if (!/\sdecoding\s*=/.test(newAttrs)) {
          newAttrs = `${newAttrs} decoding="async"`
        }
        
        // Add sizes if not present
        if (!/\ssizes\s*=/.test(newAttrs)) {
          newAttrs = `${newAttrs} sizes="(max-width: 640px) 100vw, (max-width: 768px) 75vw, (max-width: 1024px) 60vw, 50vw"`
        }
        
        // Add responsive classes if not present
        if (!/\sclass\s*=/.test(newAttrs)) {
          newAttrs = `${newAttrs} class="max-w-full h-auto"`
        } else {
          // If class exists, add responsive classes
          newAttrs = newAttrs.replace(
            /(\sclass\s*=\s*["'])([^"']*)(["'])/gi,
            (classMatch: string, _prefix: string, classes: string, _suffix: string) => {
              if (!classes.includes('max-w-full')) {
                return `${_prefix}${classes} max-w-full h-auto${_suffix}`
              }
              return classMatch
            }
          )
        }
        
        return `<img${newAttrs}>`
      }
    )
    
    return processed
  }, [html])
  
  useEffect(() => {
    if (!contentRef.current) return
    
    // Ensure all images have proper attributes after render
    const images = contentRef.current.querySelectorAll('img')
    
    images.forEach((img) => {
      // Ensure responsive styles are applied
      if (!img.style.maxWidth) {
        img.style.maxWidth = '100%'
      }
      if (!img.style.height) {
        img.style.height = 'auto'
      }
    })
  }, [])
  
  return (
    <div
      ref={contentRef}
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  )
}
