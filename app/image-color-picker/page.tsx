import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { ImageColorPickerTool } from "@/components/tools/image-color-picker-tool"
import { BreadcrumbSchema } from "@/components/structured-data"
import { ExploreColorTools } from "@/components/tools/explore-color-tools"

export const metadata: Metadata = {
  title: "Image Color Picker - Extract Colors from Images | ColorMean",
  description:
    "Upload an image and extract color values by clicking anywhere on it. Get hex, RGB, and other color codes from your images instantly.",
  keywords: ["image color picker", "extract colors", "eyedropper tool", "color from image"],
  alternates: {
    canonical: "https://www.colormean.com/image-color-picker",
  },
  openGraph: {
    title: "Image Color Picker - Extract Colors from Images | ColorMean",
    description:
      "Upload an image and extract color values by clicking anywhere on it. Get hex, RGB, and other color codes from your images instantly.",
    url: "https://www.colormean.com/image-color-picker",
    siteName: "ColorMean",
    type: "website",
    images: [
      {
        url: "https://www.colormean.com/placeholder.jpg",
        width: 1200,
        height: 630,
        alt: "Image Color Picker tool by ColorMean",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Color Picker - Extract Colors from Images | ColorMean",
    description:
      "Upload an image and extract color values by clicking anywhere on it.",
    images: ["https://www.colormean.com/placeholder.jpg"],
  },
}

export default function ImageColorPickerPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <BreadcrumbSchema items={[
        { name: "Home", item: "https://www.colormean.com" },
        { name: "Image Color Picker", item: "https://www.colormean.com/image-color-picker" }
      ]} />
      <Header />

      <section className="bg-muted/30 py-12 px-4">
        <div className="container mx-auto">
          <BreadcrumbNav items={[{ label: "Image Color Picker", href: "/image-color-picker" }]} />
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Image Color Picker</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Upload an image and extract exact color values from any pixel by clicking on it
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <ImageColorPickerTool />
          </div>
          <ColorSidebar color="#5B6FD8" />
        </div>

        
      </main>

      <ExploreColorTools current="image-color-picker" />

      <Footer />
    </div>
  )
}
