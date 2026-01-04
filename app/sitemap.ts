import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.colormean.com"

  // Generate sitemap entries for popular colors
  const popularColors = [
    "ff0000",
    "00ff00",
    "0000ff",
    "ffffff",
    "000000",
    "ff00ff",
    "00ffff",
    "ffff00",
    "808080",
    "c0c0c0",
    "800000",
    "808000",
    "008000",
    "800080",
    "008080",
    "000080",
  ]

  const colorPages = popularColors.map((hex) => ({
    url: `${baseUrl}/colors/${hex}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/colors`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/color-wheel`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/color-picker`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contrast-checker`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/color-blindness-simulator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/image-color-picker`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...colorPages,
  ]
}
