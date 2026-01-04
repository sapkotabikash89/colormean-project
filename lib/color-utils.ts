import colorData from "@/lib/color-meaning.json"

interface ColorMeaning {
  name: string
  hex: string
  meaning: string
  hsl: { h: number; s: number; l: number }
}

export function getColorMeaning(hex: string): string {
  const cleanHex = hex.replace("#", "").toUpperCase()
  const entry = colorData[cleanHex as keyof typeof colorData] as ColorMeaning | undefined
  if (entry) {
    return entry.meaning || ""
  }

  let minDistance = Number.MAX_VALUE
  let closestColor: ColorMeaning | null = null
  const targetRgb = hexToRgb(hex)
  if (!targetRgb) return "Color meaning not available."
  Object.values(colorData).forEach((color: any) => {
    const currentRgb = hexToRgb(color.hex)
    if (currentRgb) {
      const distance = Math.sqrt(
        Math.pow(targetRgb.r - currentRgb.r, 2) +
        Math.pow(targetRgb.g - currentRgb.g, 2) +
        Math.pow(targetRgb.b - currentRgb.b, 2)
      )
      if (distance < minDistance) {
        minDistance = distance
        closestColor = color
      }
    }
  })
  if (closestColor) {
    const name = `${(closestColor as ColorMeaning).name}-like`
    const baseMeaning = ((closestColor as ColorMeaning).meaning || "").replace(/\(#[0-9A-F]{6}\)/gi, `(${hex})`)
    const hue = (closestColor as ColorMeaning).hsl?.h ?? 0
    const parts = baseMeaning.split(/\n\n+/)
    const psychology = buildPsychologyParagraph(name, hue, hex)
    const design = buildDesignParagraph(name, hex)
    const first = parts[0] ? parts[0] + " " + uniqueHexLine(hex) : uniqueHexLine(hex)
    if (parts.length >= 3) return parts.slice(0, 3).join("\n\n")
    if (parts.length === 2) return [first, parts[1], design].join("\n\n")
    return [first, psychology, design].join("\n\n")
  }
  return "Color meaning not available."
}

function buildPsychologyParagraph(name: string, hue: number, hex: string): string {
  const H = hex.toUpperCase()
  if (hue >= 60 && hue < 180) {
    return `${name} (${H}) aligns with growth, renewal, and natural equilibrium. Psychologically ${H} reduces visual stress and restores balance, often perceived as fresh and vital. Spiritually it points to regeneration and stewardship, inviting grounded optimism without excess.`
  }
  if (hue >= 180 && hue < 260) {
    return `${name} (${H}) communicates clarity, trust, and mental spaciousness. Psychologically ${H} lowers arousal and supports focus. Spiritually it suggests elevated perspective and calm discernment, encouraging honest communication and measured innovation.`
  }
  if ((hue >= 0 && hue < 20) || hue >= 340) {
    return `${name} (${H}) conveys drive, passion, and catalytic energy. Psychologically ${H} amplifies urgency and emotion. Spiritually it symbolizes life-force and decisive action, best used with intention to avoid overwhelming the viewer.`
  }
  if (hue >= 260 && hue < 320) {
    return `${name} (${H}) evokes introspection, creativity, and subtle mysticism. Psychologically ${H} supports imagination and reflective processing. Spiritually it hints at transformation and insight, offering depth without heaviness when balanced well.`
  }
  if (hue >= 20 && hue < 60) {
    return `${name} (${H}) radiates warmth, optimism, and social openness. Psychologically ${H} stimulates attention and buoyant mood. Spiritually it touches themes of preservation and joyful vitality, encouraging energetic yet approachable expression.`
  }
  return `${name} (${H}) suggests neutrality, restraint, and quiet sophistication. Psychologically ${H} stabilizes and softens context. Spiritually it leans toward simplicity and presence, providing an unobtrusive canvas for meaning to emerge.`
}

function buildDesignParagraph(name: string, hex: string): string {
  const H = hex.toUpperCase()
  return `In design, ${name} (${H}) works across interfaces, branding, and environments when paired with accessible contrast and purposeful hierarchy. Use ${H} to signal intent consistent with its psychology—balance legibility with mood, reserve saturation for emphasis, and integrate complementary harmonies for coherent palettes.`
}

function uniqueHexLine(hex: string): string {
  const H = hex.toUpperCase()
  return `${H} anchors the identity of this hue; repeating ${H} ensures device-independent consistency.`
}

// Utility functions for color conversions and manipulations


export interface RGB {
  r: number
  g: number
  b: number
}

export interface HSL {
  h: number
  s: number
  l: number
}

export interface HSV {
  h: number
  s: number
  v: number
}

export interface CMYK {
  c: number
  m: number
  y: number
  k: number
}

export interface LAB {
  l: number
  a: number
  b: number
}

export interface XYZ {
  x: number
  y: number
  z: number
}

export interface Yxy {
  Y: number
  x: number
  y: number
}

export interface HunterLab {
  L: number
  a: number
  b: number
}

// Convert hex to RGB
export function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null
}

// Convert RGB to hex
export function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = Math.round(x).toString(16)
        return hex.length === 1 ? "0" + hex : hex
      })
      .join("")
  )
}

// Convert RGB to HSL
export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h = 0,
    s = 0,
    l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

// Convert HSL to RGB
export function hslToRgb(h: number, s: number, l: number): RGB {
  h /= 360
  s /= 100
  l /= 100
  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

// Convert RGB to HSV
export function rgbToHsv(r: number, g: number, b: number): HSV {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h = 0,
    s = 0,
    v = max

  const d = max - min
  s = max === 0 ? 0 : d / max

  if (max !== min) {
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  }
}

// Convert RGB to CMYK
export function rgbToCmyk(r: number, g: number, b: number): CMYK {
  const rNorm = r / 255
  const gNorm = g / 255
  const bNorm = b / 255

  const k = 1 - Math.max(rNorm, gNorm, bNorm)
  const c = k === 1 ? 0 : (1 - rNorm - k) / (1 - k)
  const m = k === 1 ? 0 : (1 - gNorm - k) / (1 - k)
  const y = k === 1 ? 0 : (1 - bNorm - k) / (1 - k)

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  }
}

// Convert RGB to LAB
export function rgbToLab(r: number, g: number, b: number): LAB {
  // First convert to XYZ
  let rNorm = r / 255
  let gNorm = g / 255
  let bNorm = b / 255

  rNorm = rNorm > 0.04045 ? Math.pow((rNorm + 0.055) / 1.055, 2.4) : rNorm / 12.92
  gNorm = gNorm > 0.04045 ? Math.pow((gNorm + 0.055) / 1.055, 2.4) : gNorm / 12.92
  bNorm = bNorm > 0.04045 ? Math.pow((bNorm + 0.055) / 1.055, 2.4) : bNorm / 12.92

  const x = (rNorm * 0.4124 + gNorm * 0.3576 + bNorm * 0.1805) / 0.95047
  const y = (rNorm * 0.2126 + gNorm * 0.7152 + bNorm * 0.0722) / 1.0
  const z = (rNorm * 0.0193 + gNorm * 0.1192 + bNorm * 0.9505) / 1.08883

  // Then XYZ to LAB
  const fx = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116
  const fy = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116
  const fz = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116

  return {
    l: Math.round((116 * fy - 16) * 10000) / 10000,
    a: Math.round(500 * (fx - fy) * 10000) / 10000,
    b: Math.round(200 * (fy - fz) * 10000) / 10000,
  }
}

export function rgbToXyz(r: number, g: number, b: number): XYZ {
  let R = r / 255
  let G = g / 255
  let B = b / 255
  R = R > 0.04045 ? Math.pow((R + 0.055) / 1.055, 2.4) : R / 12.92
  G = G > 0.04045 ? Math.pow((G + 0.055) / 1.055, 2.4) : G / 12.92
  B = B > 0.04045 ? Math.pow((B + 0.055) / 1.055, 2.4) : B / 12.92
  const X = 100 * (R * 0.4124 + G * 0.3576 + B * 0.1805)
  const Y = 100 * (R * 0.2126 + G * 0.7152 + B * 0.0722)
  const Z = 100 * (R * 0.0193 + G * 0.1192 + B * 0.9505)
  return {
    x: Math.round(X * 10000) / 10000,
    y: Math.round(Y * 10000) / 10000,
    z: Math.round(Z * 10000) / 10000,
  }
}

export function rgbToYxy(r: number, g: number, b: number): Yxy {
  const xyz = rgbToXyz(r, g, b)
  const X = xyz.x
  const Y = xyz.y
  const Z = xyz.z
  const sum = X + Y + Z
  const littleX = sum === 0 ? 0 : X / sum
  const littleY = sum === 0 ? 0 : Y / sum
  return {
    Y: Math.round(Y * 10000) / 10000,
    x: Math.round(littleX * 10000) / 10000,
    y: Math.round(littleY * 10000) / 10000,
  }
}

export function rgbToHunterLab(r: number, g: number, b: number): HunterLab {
  const xyz = rgbToXyz(r, g, b)
  const Xn = 95.047
  const Yn = 100.0
  const Zn = 108.883
  const L = 100 * Math.sqrt(xyz.y / Yn)
  const Ka = 175 / 198.04
  const Kb = 70 / 218.11
  const a = Ka * L * ((xyz.x / Xn) - (xyz.y / Yn))
  const bVal = Kb * L * ((xyz.y / Yn) - (xyz.z / Zn))
  return {
    L: Math.round(L * 10000) / 10000,
    a: Math.round(a * 10000) / 10000,
    b: Math.round(bVal * 10000) / 10000,
  }
}

// Get text color based on background
export function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return "#000000"

  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
  return brightness > 128 ? "#000000" : "#FFFFFF"
}

// Get color harmonies
export function getColorHarmony(hex: string, type: string): string[] {
  const rgb = hexToRgb(hex)
  if (!rgb) return []

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const hue = hsl.h

  const createHex = (h: number) => {
    const normalizedH = ((h % 360) + 360) % 360
    const rgb = hslToRgb(normalizedH, hsl.s, hsl.l)
    return rgbToHex(rgb.r, rgb.g, rgb.b)
  }

  switch (type) {
    case "analogous":
      return [createHex(hue - 30), hex, createHex(hue + 30)]
    case "complementary":
      return [hex, createHex(hue + 180)]
    case "split-complementary":
      return [hex, createHex(hue + 150), createHex(hue + 210)]
    case "triadic":
      return [hex, createHex(hue + 120), createHex(hue + 240)]
    case "tetradic":
      return [hex, createHex(hue + 60), createHex(hue + 180), createHex(hue + 240)]
    case "square":
      return [hex, createHex(hue + 90), createHex(hue + 180), createHex(hue + 270)]
    case "double-split-complementary":
      return [createHex(hue - 30), hex, createHex(hue + 30), createHex(hue + 150), createHex(hue + 210)]
    case "monochromatic": {
      const lighter2 = hslToRgb(hue, hsl.s, Math.min(hsl.l + 20, 100))
      const lighter1 = hslToRgb(hue, hsl.s, Math.min(hsl.l + 10, 100))
      const darker1 = hslToRgb(hue, hsl.s, Math.max(hsl.l - 10, 0))
      const darker2 = hslToRgb(hue, hsl.s, Math.max(hsl.l - 20, 0))

      return [
        rgbToHex(lighter2.r, lighter2.g, lighter2.b),
        rgbToHex(lighter1.r, lighter1.g, lighter1.b),
        hex,
        rgbToHex(darker1.r, darker1.g, darker1.b),
        rgbToHex(darker2.r, darker2.g, darker2.b),
      ]
    }
    default:
      return [hex]
  }
}

// Generate color variations (tints and shades)
export function getColorVariations(hex: string): string[] {
  const rgb = hexToRgb(hex)
  if (!rgb) return []

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const variations: string[] = []

  // Generate 5 lighter and 5 darker variations
  for (let i = 5; i >= 1; i--) {
    const lightness = Math.min(hsl.l + i * 10, 95)
    const rgb = hslToRgb(hsl.h, hsl.s, lightness)
    variations.push(rgbToHex(rgb.r, rgb.g, rgb.b))
  }

  variations.push(hex) // Original color

  for (let i = 1; i <= 5; i++) {
    const lightness = Math.max(hsl.l - i * 10, 5)
    const rgb = hslToRgb(hsl.h, hsl.s, lightness)
    variations.push(rgbToHex(rgb.r, rgb.g, rgb.b))
  }

  return variations
}

// Validate hex color
export function isValidHex(hex: string): boolean {
  return /^#?[0-9A-F]{6}$/i.test(hex)
}

// Normalize hex (add # if missing)
export function normalizeHex(hex: string): string {
  hex = hex.replace("#", "")
  return "#" + hex.toUpperCase()
}

export function getColorTints(hex: string, count = 10): string[] {
  const rgb = hexToRgb(hex)
  if (!rgb) return []

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const tints: string[] = []

  // Generate tints (add white)
  for (let i = 1; i <= count; i++) {
    const lightness = hsl.l + ((95 - hsl.l) / (count + 1)) * i
    const rgb = hslToRgb(hsl.h, hsl.s, Math.min(lightness, 95))
    tints.push(rgbToHex(rgb.r, rgb.g, rgb.b))
  }

  return tints
}

export function getColorShades(hex: string, count = 10): string[] {
  const rgb = hexToRgb(hex)
  if (!rgb) return []

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const shades: string[] = []

  // Generate shades (add black)
  for (let i = 1; i <= count; i++) {
    const lightness = hsl.l - ((hsl.l - 5) / (count + 1)) * i
    const rgb = hslToRgb(hsl.h, hsl.s, Math.max(lightness, 5))
    shades.push(rgbToHex(rgb.r, rgb.g, rgb.b))
  }

  return shades
}

export function getColorTones(hex: string, count = 10): string[] {
  const rgb = hexToRgb(hex)
  if (!rgb) return []

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const tones: string[] = []

  // Generate tones (add gray by reducing saturation)
  for (let i = 1; i <= count; i++) {
    const saturation = hsl.s - ((hsl.s - 10) / (count + 1)) * i
    const rgb = hslToRgb(hsl.h, Math.max(saturation, 10), hsl.l)
    tones.push(rgbToHex(rgb.r, rgb.g, rgb.b))
  }

  return tones
}

export function simulateColorBlindness(hex: string, type: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  // Transformation matrices for different types of color blindness
  let matrix: number[][] = []

  switch (type) {
    case "protanopia": // Red-blind
      matrix = [
        [0.567, 0.433, 0.0],
        [0.558, 0.442, 0.0],
        [0.0, 0.242, 0.758],
      ]
      break
    case "protanomaly": // Red-weak
      matrix = [
        [0.817, 0.183, 0.0],
        [0.333, 0.667, 0.0],
        [0.0, 0.125, 0.875],
      ]
      break
    case "deuteranopia": // Green-blind
      matrix = [
        [0.625, 0.375, 0.0],
        [0.7, 0.3, 0.0],
        [0.0, 0.3, 0.7],
      ]
      break
    case "deuteranomaly": // Green-weak
      matrix = [
        [0.8, 0.2, 0.0],
        [0.258, 0.742, 0.0],
        [0.0, 0.142, 0.858],
      ]
      break
    case "tritanopia": // Blue-blind
      matrix = [
        [0.95, 0.05, 0.0],
        [0.0, 0.433, 0.567],
        [0.0, 0.475, 0.525],
      ]
      break
    case "tritanomaly": // Blue-weak
      matrix = [
        [0.967, 0.033, 0.0],
        [0.0, 0.733, 0.267],
        [0.0, 0.183, 0.817],
      ]
      break
    case "achromatopsia": // Total color blindness
      const gray = 0.299 * r + 0.587 * g + 0.114 * b
      return rgbToHex(Math.round(gray * 255), Math.round(gray * 255), Math.round(gray * 255))
    case "achromatomaly": // Partial color blindness
      const grayPartial = 0.299 * r + 0.587 * g + 0.114 * b
      const nr = r * 0.618 + grayPartial * 0.382
      const ng = g * 0.618 + grayPartial * 0.382
      const nb = b * 0.618 + grayPartial * 0.382
      return rgbToHex(Math.round(nr * 255), Math.round(ng * 255), Math.round(nb * 255))
    default:
      return hex
  }

  // Apply transformation matrix
  const newR = r * matrix[0][0] + g * matrix[0][1] + b * matrix[0][2]
  const newG = r * matrix[1][0] + g * matrix[1][1] + b * matrix[1][2]
  const newB = r * matrix[2][0] + g * matrix[2][1] + b * matrix[2][2]

  return rgbToHex(
    Math.round(Math.max(0, Math.min(1, newR)) * 255),
    Math.round(Math.max(0, Math.min(1, newG)) * 255),
    Math.round(Math.max(0, Math.min(1, newB)) * 255),
  )
}

export function getRelatedColors(hex: string, count = 12): string[] {
  const rgb = hexToRgb(hex)
  if (!rgb) return []

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const related: string[] = []

  // Generate related colors with slight variations in hue and lightness
  for (let i = 0; i < count; i++) {
    const hueShift = (i - count / 2) * 15
    const lightnessShift = ((i % 3) - 1) * 10
    const newHue = (((hsl.h + hueShift) % 360) + 360) % 360
    const newLightness = Math.max(20, Math.min(80, hsl.l + lightnessShift))
    const rgb = hslToRgb(newHue, hsl.s, newLightness)
    related.push(rgbToHex(rgb.r, rgb.g, rgb.b))
  }

  return related
}

export function calculateContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hex: string): number => {
    const rgb = hexToRgb(hex)
    if (!rgb) return 0

    const r = rgb.r / 255
    const g = rgb.g / 255
    const b = rgb.b / 255

    const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)
    const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)
    const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)

    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear
  }

  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)

  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}

// Generate color palette based on a given hex color
export function generateColorPalette(hex: string): Array<{ name: string; colors: string[] }> {
  const rgb = hexToRgb(hex)
  if (!rgb) return []

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const palettes: Array<{ name: string; colors: string[] }> = []

  // Monochromatic palette
  const monochromaticColors = [hex, ...getColorTints(hex, 2), ...getColorShades(hex, 2)]
  palettes.push({ name: "Monochromatic", colors: monochromaticColors.slice(0, 5) })

  // Complementary palette
  const complementary = getColorHarmony(hex, "complementary")
  const complementaryColors = [
    complementary[0],
    ...getColorTints(complementary[0], 1),
    complementary[1],
    ...getColorTints(complementary[1], 1),
    ...getColorShades(complementary[1], 1),
  ]
  palettes.push({ name: "Complementary", colors: complementaryColors.slice(0, 5) })

  // Triadic palette
  const triadic = getColorHarmony(hex, "triadic")
  palettes.push({ name: "Triadic", colors: triadic.slice(0, 5).concat(triadic.slice(0, 2)) })

  // Analogous palette
  const analogous = getColorHarmony(hex, "analogous")
  const analogousColors = [
    analogous[0],
    ...getColorTints(analogous[1], 1),
    analogous[1],
    ...getColorShades(analogous[1], 1),
    analogous[2],
  ]
  palettes.push({ name: "Analogous", colors: analogousColors.slice(0, 5) })

  // Split complementary palette
  const splitComp = getColorHarmony(hex, "split-complementary")
  const splitColors = [
    splitComp[0],
    ...getColorTints(splitComp[0], 1),
    splitComp[1],
    splitComp[2],
    ...getColorShades(splitComp[2], 1),
  ]
  palettes.push({ name: "Split Complementary", colors: splitColors.slice(0, 5) })

  return palettes
}

// Aliases for existing functions
export const generateTints = getColorTints
export const generateShades = getColorShades
export const generateTones = getColorTones
export const getContrastRatio = calculateContrastRatio
