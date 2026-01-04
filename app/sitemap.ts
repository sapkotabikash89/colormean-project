import type { MetadataRoute } from "next"
import colorMeaning from "@/lib/color-meaning.json"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://colormean-project.vercel.app"

  const staticRoutes = [
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
    "/about-us",
    "/contact",
    "/privacy-policy",
    "/terms-and-conditions",
    "/disclaimer",
    "/editorial-policy",
    "/cokie-policy",
  ]

  const now = new Date()

  const entries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.9,
  }))

  const colorEntries = Object.entries(colorMeaning)
    .filter(([, v]: any) => v?.hex && v?.meaning)
    .map(([hex, v]: any) => {
      const normalized = String(hex).toLowerCase()
      return {
        url: `${baseUrl}/colors/${normalized}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }
    })

  async function fetchWPUrls() {
    try {
      const res = await fetch("https://cms.colormean.com/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query SitemapEntries {
              posts(where: { status: PUBLISH }, first: 200) {
                nodes { uri date }
              }
              pages(where: { status: PUBLISH }, first: 200) {
                nodes { uri date }
              }
            }
          `,
        }),
        // small cache to avoid hammering CMS during builds
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

  const wpEntries = await fetchWPUrls()

  return [...entries, ...colorEntries, ...wpEntries]
}
