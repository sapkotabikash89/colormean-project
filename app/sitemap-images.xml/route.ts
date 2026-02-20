import { NextResponse } from "next/server"
import colorMeaning from "@/lib/color-meaning.json"
import { getGumletImageUrl } from "@/lib/gumlet-utils"
import hexToBlog from "@/lib/hex-to-blog.json"

export const dynamic = 'force-static'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://colormean.com"
  const now = new Date().toISOString()

  const excludedHexes = new Set(Object.keys(hexToBlog).map(h => h.toUpperCase()))

  const entries = ""

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">` +
    entries +
    `</urlset>`

  return new NextResponse(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" }
  })
}
