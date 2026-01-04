import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://colormean-project.vercel.app"
  const now = new Date()
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
  return paths.map((p) => ({
    url: `${baseUrl}${p}`,
    lastModified: now,
    changeFrequency: p === "/" ? "weekly" : "monthly",
    priority: p === "/" ? 1 : 0.9,
  }))
}
