import { NextResponse } from "next/server"

export const dynamic = 'force-static'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://colormean.com"
  const now = new Date().toISOString()
  const sitemaps = [
    `${baseUrl}/sitemap-legal.xml`,
    `${baseUrl}/sitemap-tools.xml`,
    `${baseUrl}/sitemap-colors.xml`,
    `${baseUrl}/sitemap-posts.xml`,
    `${baseUrl}/sitemap-images.xml`,
  ]
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    sitemaps
      .map((loc) => `<sitemap><loc>${loc}</loc><lastmod>${now}</lastmod></sitemap>`)
      .join("") +
    `</sitemapindex>`
  return new NextResponse(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  })
}
