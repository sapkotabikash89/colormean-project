import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { ColorWheelTool } from "@/components/tools/color-wheel-tool"
import { BreadcrumbSchema } from "@/components/structured-data"
import { ExploreColorTools } from "@/components/tools/explore-color-tools"

export const metadata: Metadata = {
  title: "Color Wheel - Interactive Color Harmony Tool | ColorMean",
  description:
    "Explore the interactive color wheel to discover color harmonies, complementary colors, analogous colors, and triadic combinations. Professional color theory tool for designers.",
  keywords: ["color wheel", "color harmony", "complementary colors", "analogous colors", "color theory"],
  alternates: {
    canonical: "https://www.colormean.com/color-wheel",
  },
  openGraph: {
    title: "Color Wheel - Interactive Color Harmony Tool | ColorMean",
    description:
      "Explore the interactive color wheel to discover color harmonies, complementary colors, analogous colors, and triadic combinations. Professional color theory tool for designers.",
    url: "https://www.colormean.com/color-wheel",
    siteName: "ColorMean",
    type: "website",
    images: [
      {
        url: "https://www.colormean.com/placeholder.jpg",
        width: 1200,
        height: 630,
        alt: "Color Wheel - Interactive Color Harmony Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Wheel - Interactive Color Harmony Tool | ColorMean",
    description:
      "Explore the interactive color wheel to discover color harmonies, complementary colors, analogous colors, and triadic combinations.",
    images: ["https://www.colormean.com/placeholder.jpg"],
  },
}

export default function ColorWheelPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <BreadcrumbSchema items={[
        { name: "Home", item: "https://www.colormean.com" },
        { name: "Color Wheel", item: "https://www.colormean.com/color-wheel" }
      ]} />
      <Header />

      <section className="bg-muted/30 py-12 px-4">
        <div className="container mx-auto">
          <BreadcrumbNav items={[{ label: "Color Wheel", href: "/color-wheel" }]} />
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Color Wheel</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore color relationships and create harmonious color combinations using our interactive color wheel
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <ColorWheelTool />
          </div>
          <ColorSidebar color="#5B6FD8" />
        </div>

        
      </main>

      <ExploreColorTools current="color-wheel" />

      <Footer />
    </div>
  )
}
