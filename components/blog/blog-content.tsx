"use client"

import { useEffect, useMemo, useRef } from 'react'

interface BlogContentProps {
  html: string
  className?: string
  style?: React.CSSProperties
}

/**
 * BlogContent component - Client-side blog content renderer
 * - Adds lazy loading to all images
 * - Fully responsive images
 * - Client-side only to minimize Cloudflare Worker computation
 * - Uses WordPress CMS URLs for inline images (not Gumlet) to prevent broken image loading
 */
export function BlogContent({ html, className = '', style }: BlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  
  // Process HTML to add proper attributes to all images during render
  const processedHtml = useMemo(() => {
    if (!html) return html
    
    // Process HTML to add proper attributes while keeping WordPress URLs
    let processed = html
    
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
