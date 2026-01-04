import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://colormean-project.vercel.app"
  const now = new Date()

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
    const toEntry = (u: string, d?: string): MetadataRoute.Sitemap[number] => ({
      url: `${baseUrl}${normalize(u)}`,
      lastModified: d ? new Date(d) : now,
      changeFrequency: "weekly",
      priority: 0.7,
    })
    return [...posts.map((p) => toEntry(p.uri, p.date)), ...pages.map((p) => toEntry(p.uri, p.date))]
  } catch {
    return []
  }
}
