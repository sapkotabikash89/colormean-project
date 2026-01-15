import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { ColorLibrary } from "@/components/color-library"
import { BreadcrumbSchema, CollectionPageSchema, ItemListSchema } from "@/components/structured-data"
import data from "@/lib/color-meaning.json"

import { ShareButtons } from "@/components/share-buttons"

export const metadata: Metadata = {
  title: "Color Library - Browse Thousands of Colors | ColorMean",
  description:
    "Explore our comprehensive color library with thousands of colors organized by category. Find the perfect color with hex codes, RGB values, and color names.",
  keywords: ["color library", "color names", "hex colors", "color palette", "color collection"],
  alternates: {
    canonical: "https://colormean.com/colors",
  },
  openGraph: {
    title: "Color Library - Browse Thousands of Colors | ColorMean",
    description:
      "Explore our comprehensive color library with thousands of colors organized by category. Find the perfect color with hex codes, RGB values, and color names.",
    url: "https://colormean.com/colors",
    siteName: "ColorMean",
    type: "website",
    images: [
      {
        url: "https://colormean.com/color%20library-list%20of%20all%20colors.webp",
        width: 1200,
        height: 630,
        alt: "Color Library preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Library - Browse Thousands of Colors | ColorMean",
    description:
      "Explore our comprehensive color library with thousands of colors organized by category. Find the perfect color with hex codes, RGB values, and color names.",
    images: ["https://colormean.com/color%20library-list%20of%20all%20colors.webp"],
  },
}

export default function ColorsPage() {
  const baseUrl = "https://colormean.com"
  const allColors = (() => {
    const entries: Array<{ name: string; hex: string }> = []
    for (const key of Object.keys(data as any)) {
      const item = (data as any)[key]
      const hex = String(item?.hex || `#${key}`).toUpperCase()
      const name = String(item?.name || `#${key}`)
      entries.push({ name, hex })
    }
    return entries
  })()
  const q = "" // For static export, search is not supported
  const filtered = q
    ? allColors.filter((c) => c.name.toLowerCase().includes(q) || c.hex.toLowerCase().includes(q))
    : allColors
  const initialPageItems = filtered.slice(0, 100).map((c) => ({
    name: c.name,
    url: `${baseUrl}/colors/${c.hex.replace("#", "").toUpperCase()}`,
  }))
  return (
    <div className="flex flex-col min-h-screen">
      <CollectionPageSchema name="Color Library" url={`${baseUrl}/colors`} />
      <ItemListSchema items={initialPageItems} />
      <BreadcrumbSchema items={[
        { name: "Home", item: "https://colormean.com" },
        { name: "Color Library", item: "https://colormean.com/colors" }
      ]} />
      <Header />

      <section className="bg-muted/30 py-12 px-4">
        <div className="container mx-auto">
          <BreadcrumbNav items={[{ label: "Color Library", href: "/colors" }]} />
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Color Library</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Browse our extensive collection of colors organized by category with hex codes and names
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <ColorLibrary initialQuery="" />
            <div className="mt-8 flex justify-center">
              <ShareButtons title="Check out the ColorMean Color Library" />
            </div>
          </div>
          <ColorSidebar color="#5B6FD8" />
        </div>
      </main>

      <Footer />
    </div>
  )
}
