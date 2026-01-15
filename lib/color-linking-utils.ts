/**
 * Centralized hex validation and linking logic for color pages
 * This utility determines whether to link to static color pages or the universal picker
 */

import { KNOWN_COLOR_HEXES } from './known-colors-complete';

// Use the existing known color set

/**
 * Check if a hex color exists in our static color database
 * @param hex - Hex color code (with or without #)
 * @returns true if color exists in static pages, false otherwise
 */
export function isStaticColor(hex: string): boolean {
  const cleanHex = hex.replace('#', '').toUpperCase();
  return KNOWN_COLOR_HEXES.has(cleanHex);
}

/**
 * Generate the appropriate link for a hex color
 * @param hex - Hex color code (with or without #)
 * @returns URL for the color page
 */
export function getColorPageLink(hex: string): string {
  const cleanHex = hex.replace('#', '').toLowerCase();
  
  if (isStaticColor(hex)) {
    // Link to static color page
    return `/colors/${cleanHex}`;
  } else {
    // Link to universal color picker with query parameter
    return `/html-color-picker?hex=${cleanHex}`;
  }
}

/**
 * Generate the appropriate link for color swatches that should update in-place
 * @param hex - Hex color code (with or without #)
 * @returns URL for in-place updates (always points to current page with query param)
 */
export function getInPlaceColorLink(hex: string): string {
  const cleanHex = hex.replace('#', '').toLowerCase();
  // For in-place updates, always use the current page with query parameter
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('hex', cleanHex);
    return newUrl.toString();
  }
  return `/html-color-picker?hex=${cleanHex}`;
}

/**
 * Get the display name for a color
 * @param hex - Hex color code
 * @param staticName - Name from static data if available
 * @returns Display name for the color
 */
export function getColorDisplayName(hex: string, staticName?: string): string {
  if (staticName) {
    return `${staticName} (${hex})`;
  }
  return hex;
}

/**
 * Determine if a color page should be indexed by search engines
 * @param hex - Hex color code
 * @returns true for static colors, false for dynamic/universal picker
 */
export function shouldIndexColorPage(hex: string): boolean {
  return isStaticColor(hex);
}

// Export the known hex set for other utilities that might need it
export { KNOWN_COLOR_HEXES as KNOWN_HEX_SET };

// Export count of known static colors
export const STATIC_COLOR_COUNT = KNOWN_COLOR_HEXES.size;