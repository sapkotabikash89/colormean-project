"use client"

import Image from 'next/image'
import { convertToGumletUrl } from '@/lib/gumlet-image-utils'

interface FeaturedImageProps {
  src: string
  alt: string
  priority?: boolean
  className?: string
}

/**
 * FeaturedImage component for blog post featured images
 * - Fixed 1200x800 aspect ratio
 * - Fully responsive on all devices
 * - Lazy-loaded by default
 * - Client-side only (no SSR)
 * - Automatically converts WordPress URLs to Gumlet CDN
 */
export function FeaturedImage({ 
  src, 
  alt, 
  priority = false, 
  className = '' 
}: FeaturedImageProps) {
  // Convert WordPress URL to Gumlet CDN URL
  const gumletUrl = convertToGumletUrl(src)
  
  return (
    <div className={`relative w-full aspect-[1200/800] overflow-hidden rounded-lg ${className}`}>
      <Image
        src={gumletUrl}
        alt={alt}
        fill
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1200px"
        className="object-cover w-full h-full"
        unoptimized
        style={{
          objectFit: 'cover',
        }}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAADAAQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
    </div>
  )
}
