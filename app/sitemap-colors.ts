import type { MetadataRoute } from "next"
import colorMeaning from "@/lib/color-meaning.json"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://colormean-project.vercel.app"
  const now = new Date()
  return Object.entries(colorMeaning)
    .filter(([, v]: any) => v?.hex && v?.meaning)
    .map(([hex]: any) => ({
      url: `${baseUrl}/colors/${String(hex).toLowerCase()}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    }))
}
