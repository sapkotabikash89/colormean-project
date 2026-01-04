
import categoryData from './color-categories.json'
import { getColorHarmony } from './color-utils'

export interface ColorCategory {
  id: number
  name: string
  hueRange: string
  saturation: string
  lightness: string
  spiritualMeaning: string
  psychologicalEffect: string
  culturalSignificance: string
  designBrandingUse: string
  artUse: string
}

const categories = categoryData.colorCategories as ColorCategory[]

function parseHueRange(rangeStr: string): { start: number; end: number; isFull: boolean } {
  if (rangeStr.includes("0–360") || rangeStr.includes("achromatic")) {
    return { start: 0, end: 360, isFull: true }
  }
  const parts = rangeStr.split('–') // En dash
  if (parts.length !== 2) {
      const partsHyphen = rangeStr.split('-') // Hyphen
      if (partsHyphen.length === 2) {
          return { start: parseInt(partsHyphen[0]), end: parseInt(partsHyphen[1]), isFull: false }
      }
      return { start: 0, end: 360, isFull: true } // Fallback
  }
  return { start: parseInt(parts[0]), end: parseInt(parts[1]), isFull: false }
}

function getValueFromDescriptor(desc: string, type: 'sat' | 'light'): number {
  const d = desc.toLowerCase()
  if (d.includes('none')) return 0
  if (d.includes('lowest')) return 2
  if (d.includes('very low')) return 12
  if (d.includes('low-medium')) return 35
  if (d.includes('medium-low')) return 40
  if (d.includes('very high')) return 90
  if (d.includes('medium-high')) return 65
  if (d.includes('high')) return 75
  if (d.includes('low')) return 30
  if (d.includes('medium')) return 50
  return 50
}

function isHueMatch(h: number, start: number, end: number, isFull: boolean): boolean {
  if (isFull) return true
  if (start <= end) {
    return h >= start && h <= end
  } else {
    // Wrap around (e.g. 350-10)
    return h >= start || h <= end
  }
}

export function getCategory(h: number, s: number, l: number): ColorCategory {
  let bestCat = categories[0]
  let bestScore = -Infinity

  for (const cat of categories) {
    const hueParsed = parseHueRange(cat.hueRange)
    const targetS = getValueFromDescriptor(cat.saturation, 'sat')
    const targetL = getValueFromDescriptor(cat.lightness, 'light')

    let score = 0
    
    // Hue check
    if (isHueMatch(h, hueParsed.start, hueParsed.end, hueParsed.isFull)) {
      score += 1000
    } else {
        // Penalty for hue mismatch (shortest distance)
        let dist = Math.min(Math.abs(h - hueParsed.start), Math.abs(h - hueParsed.end))
        if (hueParsed.start > hueParsed.end) {
             // range crosses 0/360
             // distance to [start, 360] U [0, end]
             // normalize h to be comparable
             // simplistic approach: if not match, just subtract distance
             // but handle wrap around distance
             const dist1 = Math.abs(h - hueParsed.start)
             const dist2 = Math.abs(h - hueParsed.end)
             const dist3 = Math.abs(h - (hueParsed.start - 360))
             const dist4 = Math.abs(h - (hueParsed.end + 360))
             dist = Math.min(dist1, dist2, dist3, dist4)
        }
        score -= dist * 2
    }

    // Saturation/Lightness distance
    // Special case for achromatic/black/white
    if (cat.name.includes("Void") || cat.name.includes("Black")) {
         if (l < 10) score += 500
    }
    if (cat.name.includes("White")) {
        if (l > 90) score += 500
    }

    const distS = Math.abs(s - targetS)
    const distL = Math.abs(l - targetL)
    
    score -= (distS + distL)

    if (score > bestScore) {
      bestScore = score
      bestCat = cat
    }
  }
  return bestCat
}

export interface FAQItem {
  question: string
  answer: string
}

export function generateFAQs(hex: string, rgb: { r: number, g: number, b: number }, hsl: { h: number, s: number, l: number }): FAQItem[] {
  const category = getCategory(hsl.h, hsl.s, hsl.l)
  const complementary = getColorHarmony(hex, "complementary")[1]
  
  const tone = hsl.l < 30 ? "Dark" : hsl.l > 70 ? "Light" : "Medium"
  const isWarm = (hsl.h >= 0 && hsl.h < 90) || (hsl.h >= 270 && hsl.h <= 360)
  const temp = isWarm ? "warm" : "cool"
  
  // Clean hex for text
  const hexText = hex.toUpperCase()

  const q1 = `What is the meaning and symbolism of ${hexText} color?`
  const a1 = `${hexText} belongs to the ${category.name} category, shaped by an HSL profile of (${hsl.h}°, ${hsl.s}%, ${hsl.l}%) and an RGB composition of (${rgb.r}, ${rgb.g}, ${rgb.b}). The ${temp} hue character of ${hexText} establishes temperature, while saturation defines chromatic intensity and lightness regulates perceived depth. In this configuration of ${hexText}, saturation provides clarity without exaggeration, and ${tone.toLowerCase()} lightness moderates contrast to avoid harshness. Within the ${category.name} family, ${hexText} inherits associations such as ${category.spiritualMeaning.toLowerCase()}, refined by its specific values rather than generic symbolism. The interaction of hue, saturation, and lightness in ${hexText} produces a steady visual cadence that reads as intentional rather than loud, making ${hexText} feel balanced, articulate, and adaptable across contexts.`

  const q2 = `What psychological effects does ${hexText} color have?`
  const a2 = `Psychologically, ${hexText} sets a focused perceptual frame that stabilizes attention through its ${tone.toLowerCase()} luminance and ${temp} identity, often evoking ${category.psychologicalEffect.toLowerCase()}. The lower lightness components of ${hexText} introduce seriousness and visual weight, while saturation maintains a defined edge that prevents the color from collapsing into neutrality. This combination in ${hexText} supports cues of clarity, self‑control, and purpose. Subtly, the RGB configuration (${rgb.r}, ${rgb.g}, ${rgb.b}) influences how ${hexText} interacts with light on digital displays, reinforcing its firmness without glare. The effect of ${hexText} is effective for interface accents, informational markers, and brand elements where confidence and precision are preferred over exuberance, producing an emotional tone that is alert, composed, and intentionally directive. In contrast systems, pairing ${hexText} with ${complementary} can heighten focus while preserving readability.`

  const q3 = `What is the spiritual meaning of ${hexText} color?`
  const a3 = `Spiritually, ${hexText} aligns with grounded attention and structured awareness, resonating with systems that prioritize clarity and steadiness over volatility, symbolizing ${category.spiritualMeaning.toLowerCase()}. The ${temp} temperature of ${hexText} reads as physically centering, while ${tone.toLowerCase()} lightness deepens contemplative intensity without becoming opaque. The hue degree at ${hsl.h}° positions ${hexText} along a spectrum that balances outward cognition with inward focus, encouraging disciplined presence and measured reflection. In practice, ${hexText} suits meditative interfaces, study environments, and quiet branding where intention and continuity are emphasized, serving as a visual anchor that supports routine, accountability, and calm recalibration.`

  const q4 = `What is the cultural significance of ${hexText} color?`
  const a4 = `Colors within the ${category.name.toLowerCase()} spectrum have appeared in signals of trust, structure, and institutional continuity, and ${hexText} maintains this lineage through moderated saturation and ${tone.toLowerCase()} depth. ${hexText} is significant because ${category.culturalSignificance.toLowerCase()}. In contemporary visual communication, ${hexText} reads as reliable and methodical, conveying information with clarity rather than spectacle. While interpretations of ${hexText} vary across regions and traditions, the RGB identity (${rgb.r}, ${rgb.g}, ${rgb.b}) and ${category.name} categorization establish a broadly intelligible signal of professionalism and restraint. This adaptability allows ${hexText} to move between editorial, corporate, and educational contexts without losing coherence, sustaining recognition while avoiding cultural overstatement.`

  const q5 = `How is ${hexText} used in design, branding, and art?`
  const a5 = `In design and branding, ${hexText} communicates intention, craft, and consistency, and is often used for ${category.designBrandingUse.toLowerCase()}. ${hexText} performs in functional roles that benefit from legibility and continuity—navigation states, typographic accents, diagrams, and data visualization frames—where ${tone.toLowerCase()} luminance and controlled saturation produce clean separations without visual strain. In artistic contexts, ${category.artUse.toLowerCase()} using ${hexText}. Pairing ${hexText} with its complementary color ${complementary} creates structured contrast useful for callouts, dual‑tone systems, and hierarchical emphasis. In art, ${hexText} builds atmosphere through layered value transitions, supporting spatial clarity and measured tension. Its technical profile translates predictably across digital RGB (${rgb.r}, ${rgb.g}, ${rgb.b}), print workflows, and environmental graphics, making ${hexText} versatile from small‑scale identity systems to large‑format installations.`

  return [
    { question: q1, answer: a1 },
    { question: q2, answer: a2 },
    { question: q3, answer: a3 },
    { question: q4, answer: a4 },
    { question: q5, answer: a5 },
  ]
}
