import { NextResponse } from "next/server"
import colorMeaning from "@/lib/color-meaning.json"
import { getGumletImageUrl } from "@/lib/gumlet-utils"

export const dynamic = 'force-static'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://colormean.com"
  const now = new Date().toISOString()
  
  // Generate image sitemap entries for all colors with Gumlet images
  const entries = Object.entries(colorMeaning)
    .map(([hex]: any) => {
      const cleanHex = String(hex).toUpperCase()
      const gumletUrl = getGumletImageUrl(`#${cleanHex}`)
      
      // Only include colors that have Gumlet images
      if (!gumletUrl) return null
      
      const pageUrl = `${baseUrl}/colors/${cleanHex}`
      const title = colorMeaning[hex as keyof typeof colorMeaning]?.name || `#${cleanHex} Color`
      
      return `<url>
  <loc>${pageUrl}</loc>
  <lastmod>${now}</lastmod>
  <image:image>
    <image:loc>${gumletUrl}</image:loc>
    <image:caption>${title} color swatch</image:caption>
    <image:title>${title} Color</image:title>
    <image:geo_location>Global</image:geo_location>
  </image:image>
</url>`
    })
    .filter(Boolean) // Remove null entries
    .join("")

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">` +
    entries +
    `</urlset>`

  return new NextResponse(body, { 
    headers: { "Content-Type": "application/xml; charset=utf-8" } 
  })
}