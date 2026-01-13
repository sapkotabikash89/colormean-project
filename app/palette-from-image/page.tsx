import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbSchema, FAQSchema, ToolApplicationSchema } from "@/components/structured-data"
import { PaletteFromImageClient } from "@/components/tool-wrappers"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ShareButtons } from "@/components/share-buttons"
import { ExploreColorTools } from "@/components/tools/explore-color-tools"

export const metadata: Metadata = {
  title: "Palette from Image - ColorMean",
  description:
    "Generate beautiful color palettes from any image. Extract dominant colors and create harmonious color schemes.",
  alternates: {
    canonical: "https://colormean.com/palette-from-image",
  },
  openGraph: {
    title: "Palette from Image - ColorMean",
    description:
      "Generate beautiful color palettes from any image. Extract dominant colors and create harmonious color schemes.",
    url: "https://colormean.com/palette-from-image",
    siteName: "ColorMean",
    type: "website",
    images: [
      {
        url: "https://colormean.com/color%20palette%20from%20image%20online%20free.webp",
        width: 1200,
        height: 630,
        alt: "Palette Generator from Image Tool to create color palettes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Palette from Image - ColorMean",
    description:
      "Generate beautiful color palettes from any image. Extract dominant colors and create harmonious color schemes.",
    images: ["https://colormean.com/color%20palette%20from%20image%20online%20free.webp"],
  },
}

export default function PaletteFromImagePage() {
  const faqs = [
    {
      question: "How many colors are extracted?",
      answer:
        "We extract up to 8 dominant colors from your image to form a cohesive palette.",
    },
    {
      question: "Are my images stored or shared?",
      answer:
        "No. Processing happens locally in your browser. Images aren’t uploaded or shared.",
    },
    {
      question: "What image formats are supported?",
      answer:
        "Common formats such as JPG, PNG, GIF, and WebP work well. Use high-quality images for best results.",
    },
  ]
  return (
    <div className="flex flex-col min-h-screen">
      <BreadcrumbSchema items={[
        { name: "Home", item: "https://colormean.com" },
        { name: "Palette from Image", item: "https://colormean.com/palette-from-image" }
      ]} />
      <FAQSchema faqs={faqs} />
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

          <div className="flex flex-col lg:flex-row gap-8" aria-label="Palette Generator from Image Tool to create color palettes">
            <div className="flex-1">
              <ToolApplicationSchema
                name="Palette from Image"
                slug="palette-from-image"
                description="Palette Generator from Image Tool to create color palettes"
              />
              <PaletteFromImageClient />
            </div>
            <ColorSidebar color="#5B6FD8" />
          </div>
          
          
        </div>
      </main>
      <ExploreColorTools current="palette-from-image" />
      <Footer />
    </div>
  )
}
