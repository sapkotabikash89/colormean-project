import { NextResponse } from "next/server"

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://colormean-project.vercel.app"
  const now = new Date().toISOString()
  const paths = [
    "/about-us",
    "/contact",
    "/privacy-policy",
    "/terms-and-conditions",
    "/disclaimer",
    "/editorial-policy",
    "/cokie-policy",
  ]
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    paths
      .map(
        (p) =>
          `<url><loc>${baseUrl}${p}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`,
      )
      .join("") +
    `</urlset>`
  return new NextResponse(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } })
}
