import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { ColorLibrary } from "@/components/color-library"
import { BreadcrumbSchema, SoftwareApplicationSchema } from "@/components/structured-data"

import { ShareButtons } from "@/components/share-buttons"

export const metadata: Metadata = {
  title: "Color Library - Browse Thousands of Colors | ColorMean",
  description:
    "Explore our comprehensive color library with thousands of colors organized by category. Find the perfect color with hex codes, RGB values, and color names.",
  keywords: ["color library", "color names", "hex colors", "color palette", "color collection"],
}

export default function ColorsPage({ searchParams }: { searchParams: { q?: string } }) {
  return (
    <div className="flex flex-col min-h-screen">
      <SoftwareApplicationSchema />
      <BreadcrumbSchema items={[
        { name: "Home", item: "https://www.colormean.com" },
        { name: "Color Library", item: "https://www.colormean.com/colors" }
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
            <ColorLibrary initialQuery={searchParams?.q || ""} />
          </div>
          <ColorSidebar color="#5B6FD8" />
        </div>
        <div className="mt-8 flex justify-center">
          <ShareButtons title="Check out the ColorMean Color Library" />
        </div>
      </main>

      <Footer />
    </div>
  )
}
