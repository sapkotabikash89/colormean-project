import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://colormean-project.vercel.app"
  const now = new Date()
  const pages = [
    "/about-us",
    "/contact",
    "/privacy-policy",
    "/terms-and-conditions",
    "/disclaimer",
    "/editorial-policy",
    "/cokie-policy",
  ]
  return pages.map((p) => ({
    url: `${baseUrl}${p}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }))
}
