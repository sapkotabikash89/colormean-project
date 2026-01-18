/**
 * Static, deterministic search logic for the sticky header search bar
 * Works entirely with bundled JSON data, no API calls required
 */

import colorMeaningJson from './color-meaning.json'
import { KNOWN_COLOR_HEXES } from './known-colors-complete';
import blogPostsData from './blog-posts-data.json';

// Type definitions
interface BlogPost {
  title: string
  uri: string
  content?: string
}

interface ColorEntry {
  name: string
  hex: string
  meaning: string
}

// Input normalization (Rule #1)
export function normalizeInput(input: string): string {
  // Trim leading/trailing spaces
  let normalized = input.trim()
  
  // Convert to lowercase
  normalized = normalized.toLowerCase()
  
  // Remove leading # only for hex comparisons
  if (normalized.startsWith('#')) {
    normalized = normalized.substring(1)
  }
  
  return normalized
}

// Detect input type (Rule #2)
export function detectInputType(input: string): 'hex' | 'color-name' {
  const normalized = normalizeInput(input)
  
  // Check if it's a valid hex code (3 or 6 digits)
  if (/^[0-9a-f]{3}$/.test(normalized) || /^[0-9a-f]{6}$/.test(normalized)) {
    return 'hex'
  }
  
  // Otherwise treat as color name
  return 'color-name'
}

// Search blog posts for color matches (using static data)
// Since we don't have static blog post data in this file, we'll need to pass it in
export function searchBlogPosts(
  input: string, 
  inputType: 'hex' | 'color-name', 
  blogPosts: BlogPost[]
): BlogPost | null {
  const normalizedInput = normalizeInput(input)
  
  // For hex input, look for blog posts with titles containing the hex pattern
  if (inputType === 'hex') {
    // Look for patterns like "color-XXXXXX-meaning" or hex codes in titles
    const hexPattern = normalizedInput.toUpperCase()
    
    for (const post of blogPosts) {
      const titleLower = post.title.toLowerCase()
      
      // Check for hex in title (e.g., "FFA500 Color Orange Meaning")
      if (titleLower.includes(normalizedInput) || titleLower.includes(hexPattern)) {
        return post
      }
      
      // Check if the URI contains the hex pattern (e.g., /color-ffa500-meaning/)
      if (post.uri.toLowerCase().includes(normalizedInput) || post.uri.toLowerCase().includes(hexPattern)) {
        return post
      }
    }
  }
  
  // For color name input, look for exact or partial matches in blog post titles
  if (inputType === 'color-name') {
    // First try exact match - look for color name in the title
    for (const post of blogPosts) {
      const titleLower = post.title.toLowerCase()
      // Match whole word or part of title
      if (titleLower.includes(normalizedInput)) {
        return post
      }
    }
    
    // If no exact match, try partial match with common color patterns
    for (const post of blogPosts) {
      const titleLower = post.title.toLowerCase()
      // Check for patterns like "blue color", "blue meaning", etc.
      if (titleLower.includes(`${normalizedInput} color`) || 
          titleLower.includes(`color ${normalizedInput}`) ||
          titleLower.includes(`${normalizedInput} meaning`)) {
        return post
      }
    }
    
    // Finally check if the URI contains the color name pattern (e.g., /color-blue-meaning/)
    for (const post of blogPosts) {
      if (post.uri.toLowerCase().includes(`color-${normalizedInput}-meaning`)) {
        return post
      }
    }
  }
  
  return null
}

// Search color-meaning.json (Rule #3)
export function searchColorJson(input: string, inputType: 'hex' | 'color-name'): ColorEntry | null {
  const normalizedInput = normalizeInput(input)
  const colorData = colorMeaningJson as Record<string, ColorEntry>
  
  if (inputType === 'hex') {
    // Direct hex lookup (uppercase)
    const hexKey = normalizedInput.toUpperCase()
    if (colorData[hexKey]) {
      return colorData[hexKey]
    }
    
    // Also check if normalized input matches any hex key
    for (const [hex, colorInfo] of Object.entries(colorData)) {
      if (hex.toLowerCase() === normalizedInput.toLowerCase()) {
        return colorInfo
      }
    }
  }
  
  if (inputType === 'color-name') {
    // Search by color name
    for (const [, colorInfo] of Object.entries(colorData)) {
      if (colorInfo.name.toLowerCase() === normalizedInput) {
        return colorInfo
      }
    }
    
    // Partial match fallback
    for (const [, colorInfo] of Object.entries(colorData)) {
      if (colorInfo.name.toLowerCase().includes(normalizedInput)) {
        return colorInfo
      }
    }
  }
  
  return null
}

// Generate color page slug from hex (Rule #4)
export function generateColorSlug(hex: string): string {
  return `/colors/${hex.toLowerCase()}/`
}

// Check if a color is known (exists in static color pages)
export function isKnownColor(hex: string): boolean {
  const cleanHex = hex.replace('#', '').toUpperCase();
  return KNOWN_COLOR_HEXES.has(cleanHex);
}

// Main search function implementing all rules with static data
export function performStaticSearch(input: string, blogPosts: BlogPost[] = []): string | null {
  // Rule #1: Input normalization (always first)
  const normalizedInput = normalizeInput(input)
  
  // Handle empty/invalid input
  if (!normalizedInput) {
    return null
  }
  
  // Rule #2: Detect input type
  const inputType = detectInputType(input)
  
  // Rule #3: Priority rules - Blog post match first
  const blogMatch = searchBlogPosts(input, inputType, blogPosts)
  if (blogMatch) {
    // Return the blog post URL directly
    // Ensure the URI starts with / for proper URL construction
    const uri = blogMatch.uri.startsWith('/') ? blogMatch.uri : `/${blogMatch.uri}`
    const baseUrl = "https://colormean.com"
    return new URL(uri, baseUrl).toString()
  }
  
  // Rule #3: Known color JSON match second
  const jsonMatch = searchColorJson(input, inputType)
  if (jsonMatch) {
    // Check if this is a known static color
    const cleanHex = jsonMatch.hex.replace('#', '').toUpperCase();
    if (isKnownColor(cleanHex)) {
      // Return static color page URL
      return `https://colormean.com${generateColorSlug(cleanHex)}`;
    } else {
      // For colors not in static pages, return HTML color picker
      return `https://colormean.com/html-color-picker?hex=${cleanHex.toLowerCase()}`;
    }
  }
  
  // Rule #3: Unknown color fallback (last) - only for hex input
  if (inputType === 'hex') {
    // Validate hex format
    if (/^[0-9a-f]{3}$/.test(normalizedInput) || /^[0-9a-f]{6}$/.test(normalizedInput)) {
      // Check if this hex corresponds to a known static color
      const cleanHex = normalizedInput.toUpperCase();
      if (isKnownColor(cleanHex)) {
        // Return static color page URL
        return `https://colormean.com${generateColorSlug(cleanHex)}`;
      } else {
        // For unknown hex, return HTML color picker
        return `https://colormean.com/html-color-picker/?hex=${normalizedInput}`;
      }
    }
  }
  
  // No matches found
  return null
}

// Utility function to check if input is valid hex
export function isValidHex(input: string): boolean {
  const normalized = normalizeInput(input)
  return /^[0-9a-f]{3}$/.test(normalized) || /^[0-9a-f]{6}$/.test(normalized)
}

// Function to get all color names for autocomplete suggestions
export function getAllColorNames(): string[] {
  const colorData = colorMeaningJson as Record<string, ColorEntry>;
  return Object.values(colorData).map(color => color.name.toLowerCase());
}

// Simplified search function for when blog posts aren't available
export function performSimpleSearch(input: string): string | null {
  // Rule #1: Input normalization (always first)
  const normalizedInput = normalizeInput(input)
  
  // Handle empty/invalid input
  if (!normalizedInput) {
    return null
  }
  
  // Rule #2: Detect input type
  const inputType = detectInputType(input)
  
  // Rule #3: Known color JSON match first
  const jsonMatch = searchColorJson(input, inputType)
  if (jsonMatch) {
    // Check if this is a known static color
    const cleanHex = jsonMatch.hex.replace('#', '').toUpperCase();
    if (isKnownColor(cleanHex)) {
      // Return static color page URL
      return `https://colormean.com${generateColorSlug(cleanHex)}`;
    } else {
      // For colors not in static pages, return HTML color picker
      return `https://colormean.com/html-color-picker?hex=${cleanHex.toLowerCase()}`;
    }
  }
  
  // Rule #3: Unknown color fallback (last) - only for hex input
  if (inputType === 'hex') {
    // Validate hex format
    if (/^[0-9a-f]{3}$/.test(normalizedInput) || /^[0-9a-f]{6}$/.test(normalizedInput)) {
      // Check if this hex corresponds to a known static color
      const cleanHex = normalizedInput.toUpperCase();
      if (isKnownColor(cleanHex)) {
        // Return static color page URL
        return `https://colormean.com${generateColorSlug(cleanHex)}`;
      } else {
        // For unknown hex, return HTML color picker
        return `https://colormean.com/html-color-picker/?hex=${normalizedInput}`;
      }
    }
  }
  
  // No matches found
  return null
}