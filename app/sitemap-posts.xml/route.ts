import { NextResponse } from "next/server"

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://colormean-project.vercel.app"
  const now = new Date().toISOString()
  try {
    const res = await fetch("https://cms.colormean.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query SitemapEntries {
            posts(where: { status: PUBLISH }, first: 500) {
              nodes { uri date }
            }
            pages(where: { status: PUBLISH }, first: 500) {
              nodes { uri date }
            }
          }
        `,
      }),
      next: { revalidate: 600 },
    })
    const json = await res.json()
    const posts: Array<{ uri: string; date?: string }> = json?.data?.posts?.nodes || []
    const pages: Array<{ uri: string; date?: string }> = json?.data?.pages?.nodes || []
    const normalize = (u: string) => (u?.startsWith("/") ? u : `/${u || ""}`)
    const entries = [...posts, ...pages]
      .map((p) => {
        const loc = `${baseUrl}${normalize(p.uri)}`
        const lastmod = p.date ? new Date(p.date).toISOString() : now
        return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`
      })
      .join("")
    const body =
      `<?xml version="1.0" encoding="UTF-8"?>` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
      entries +
      `</urlset>`
    return new NextResponse(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } })
  } catch {
    const body =
      `<?xml version="1.0" encoding="UTF-8"?>` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`
    return new NextResponse(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } })
  }
}

