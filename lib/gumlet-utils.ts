/**
 * Gumlet CDN utilities for pre-generated color images
 * Images are hosted at: https://colormean.gumlet.io/wp-content/uploads/colors/{hex}/image.webp
 */

import colorMeaningData from './color-meaning.json';

// Extract all pre-generated hex codes from color-meaning.json and store in a Set for O(1) lookup
const pregeneratedHexSet = new Set<string>(
  Object.keys(colorMeaningData).map(hex => hex.toUpperCase())
);

/**
 * Get the Gumlet CDN URL for a color image if it exists in the pre-generated set
 * @param hex - Hex color code (with or without #)
 * @returns Gumlet CDN URL if image exists, null otherwise
 */
export function getGumletImageUrl(hex: string): string | null {
  // Normalize hex: remove # and convert to uppercase for comparison
  const normalizedHex = hex.replace('#', '').toUpperCase();
  
  // Check if this hex has a pre-generated image
  if (!pregeneratedHexSet.has(normalizedHex)) {
    return null;
  }
  
  // For URL, use lowercase as images are stored in lowercase
  const urlHex = hex.replace('#', '').toLowerCase();
  // Return Gumlet CDN URL
  return `https://colormean.gumlet.io/wp-content/uploads/colors/${urlHex}/image.webp`;
}

/**
 * Check if a hex color has a pre-generated image
 * @param hex - Hex color code (with or without #)
 * @returns true if image exists, false otherwise
 */
export function hasPregeneratedImage(hex: string): boolean {
  const normalizedHex = hex.replace('#', '').toUpperCase();
  return pregeneratedHexSet.has(normalizedHex);
}

/**
 * Get the total count of pre-generated colors
 * @returns Number of pre-generated colors
 */
export function getPregeneratedCount(): number {
  return pregeneratedHexSet.size;
}
