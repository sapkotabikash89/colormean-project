import { NextResponse } from "next/server"
import colorMeaning from "@/lib/color-meaning.json"

export const dynamic = 'force-static'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://colormean.com"
  const now = new Date().toISOString()
  const entries = Object.entries(colorMeaning)
    .filter(([, v]: any) => v?.hex && v?.meaning)
    .map(([hex]: any) => {
      const loc = `${baseUrl}/colors/${String(hex).toLowerCase()}`
      return `<url><loc>${loc}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`
    })
    .join("")
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    entries +
    `</urlset>`
  return new NextResponse(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } })
}
