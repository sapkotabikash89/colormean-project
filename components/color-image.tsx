"use client"

import Image from 'next/image';
import { getGumletImageUrl } from '@/lib/gumlet-utils';

interface ColorImageProps {
  hex: string;
  alt?: string;
  priority?: boolean;
  className?: string;
}

/**
 * Reusable ColorImage component for displaying pre-generated color images from Gumlet CDN
 * Features:
 * - Width: 1200, Height: 630
 * - Lazy loading enabled by default
 * - Responsive via style maxWidth: "100%", height: "auto"
 * - Returns nothing if URL is null (no image available)
 */
export function ColorImage({ hex, alt, priority = false, className = '' }: ColorImageProps) {
  // Get Gumlet CDN URL for this color
  const imageUrl = getGumletImageUrl(hex);
  
  // If no pre-generated image exists, return null (fall back to CSS swatch)
  if (!imageUrl) {
    return null;
  }
  
  // Normalize hex for alt text
  const normalizedHex = hex.replace('#', '').toUpperCase();
  const altText = alt || `${normalizedHex} color swatch`;
  
  return (
    <Image
      src={imageUrl}
      alt={altText}
      width={1200}
      height={630}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1200px"
      className={className}
      style={{
        maxWidth: '100%',
        height: 'auto',
      }}
      unoptimized // Since images are already optimized on Gumlet CDN
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAADAAQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
    />
  );
}
