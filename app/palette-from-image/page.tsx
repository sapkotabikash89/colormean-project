import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PaletteFromImageTool } from "@/components/tools/palette-from-image-tool"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { BreadcrumbSchema } from "@/components/structured-data"
import { ShareButtons } from "@/components/share-buttons"

export const metadata: Metadata = {
  title: "Palette from Image - ColorMean",
  description:
    "Generate beautiful color palettes from any image. Extract dominant colors and create harmonious color schemes.",
  alternates: {
    canonical: "https://www.colormean.com/palette-from-image",
  },
  openGraph: {
    title: "Palette from Image - ColorMean",
    description:
      "Generate beautiful color palettes from any image. Extract dominant colors and create harmonious color schemes.",
    url: "https://www.colormean.com/palette-from-image",
    siteName: "ColorMean",
    type: "website",
    images: [
      {
        url: "https://www.colormean.com/placeholder.jpg",
        width: 1200,
        height: 630,
        alt: "Palette from Image tool by ColorMean",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Palette from Image - ColorMean",
    description:
      "Generate beautiful color palettes from any image. Extract dominant colors and create harmonious color schemes.",
    images: ["https://www.colormean.com/placeholder.jpg"],
  },
}

export default function PaletteFromImagePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <BreadcrumbSchema items={[
        { name: "Home", item: "https://www.colormean.com" },
        { name: "Palette from Image", item: "https://www.colormean.com/palette-from-image" }
      ]} />
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <BreadcrumbNav items={[{ label: "Palette from Image", href: "/palette-from-image" }]} />

        <div className="mt-6 space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Color Palette from Image</h1>
            </div>
            <p className="text-muted-foreground mt-2">
              Upload an image and extract a beautiful color palette with dominant colors
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <PaletteFromImageTool />
            </div>
            <ColorSidebar color="#5B6FD8" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
