import { NextResponse } from "next/server"

export const dynamic = 'force-static'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://colormean.com"
  const now = new Date().toISOString()
  const paths = [
    "/",
    "/colors",
    "/color-meanings",
    "/color-wheel",
    "/color-picker",
    "/contrast-checker",
    "/color-blindness-simulator",
    "/image-color-picker",
    "/palette-from-image",
    "/screen-color-picker",
  ]
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    paths
      .map((p) => {
        const changefreq = p === "/" ? "weekly" : "monthly"
        const priority = p === "/" ? "1.0" : "0.9"
        return `<url><loc>${baseUrl}${p}</loc><lastmod>${now}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`
      })
      .join("") +
    `</urlset>`
  return new NextResponse(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } })
}
