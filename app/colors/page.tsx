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
    canonical: "/colors",
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

import colorLibraryData from "@/lib/color-library-data.json"

export default function ColorsPage() {
  const baseUrl = "https://colormean.com"
  const perPage = 100
  const currentPage = 1

  const initialPageItems = colorLibraryData.slice(0, perPage).map((c) => ({
    name: c.name,
    url: `${baseUrl}/colors/${c.hex.replace("#", "").toLowerCase()}`,
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
          <article id="content" className="main-content grow-content flex-1" itemProp="articleBody">
            <ColorLibrary
              initialQuery=""
              initialPage={currentPage}
              initialCategory="all"
              perPage={perPage}
              baseUrl="/colors"
            />
            <div className="mt-8 flex justify-center">
              <ShareButtons title="Check out the ColorMean Color Library" />
            </div>
          </article>
          <ColorSidebar color="#5B6FD8" />
        </div>
      </main>

      <Footer />
    </div>
  )
}
