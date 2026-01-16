import { NextRequest } from "next/server"
import sharp from "sharp"

// For static export compatibility with revalidation
export const dynamic = "force-static"
export const revalidate = 0 // No caching, always fresh

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = (searchParams.get("slug") || "tool").toLowerCase()
  const map: Record<string, string> = {
    "color-wheel": "Color Wheel",
    "color-picker": "Color Picker",
    "contrast-checker": "Contrast Checker",
    "color-blindness-simulator": "Color Blindness Simulator",
    "image-color-picker": "Image Color Picker",
    "palette-from-image": "Palette from Image",
  }
  const title = map[slug] || slug
  const width = 1200
  const height = 630
  const bgColor = "#111827"
  const accent = "#5B6FD8"
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  <g transform="translate(0,0)">
    <rect x="60" y="60" width="${width - 120}" height="${height - 180}" rx="16" fill="#1F2937"/>
    <rect x="80" y="80" width="${width - 160}" height="24" rx="6" fill="#374151"/>
    <rect x="80" y="120" width="160" height="160" rx="12" fill="${accent}" opacity="0.9"/>
    <rect x="260" y="120" width="${width - 360}" height="160" rx="12" fill="#374151"/>
    <rect x="80" y="300" width="${width - 160}" height="60" rx="10" fill="#374151"/>
  </g>
  <text x="${width / 2}" y="${height - 70}" text-anchor="middle" fill="#ffffff" font-size="36" font-weight="700" font-family="Inter, ui-sans-serif">ColorMean — ${title}</text>
</svg>
`
  const buffer = await sharp(Buffer.from(svg)).webp({ quality: 92 }).toBuffer()
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
