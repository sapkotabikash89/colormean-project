import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbSchema, FAQSchema, ToolApplicationSchema, WebPageSchema } from "@/components/structured-data"
import { ImageColorPickerClient } from "@/components/tool-wrappers"
import { ExploreColorTools } from "@/components/tools/explore-color-tools"

export const metadata: Metadata = {
  title: "Image Color Picker - Extract Colors from Images | ColorMean",
  description:
    "Upload an image and extract color values by clicking anywhere on it. Get hex, RGB, and other color codes from your images instantly.",
  keywords: ["image color picker", "extract colors", "eyedropper tool", "color from image"],
  alternates: {
    canonical: "https://colormean.com/image-color-picker",
  },
  openGraph: {
    title: "Image Color Picker - Extract Colors from Images | ColorMean",
    description:
      "Upload an image and extract color values by clicking anywhere on it. Get hex, RGB, and other color codes from your images instantly.",
    url: "https://colormean.com/image-color-picker",
    siteName: "ColorMean",
    type: "website",
    images: [
      {
        url: "https://colormean.com/image%20color%20picker%20online%20free.webp",
        width: 1200,
        height: 630,
        alt: "Image Color Picker Tool to extract colors from images",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Color Picker - Extract Colors from Images | ColorMean",
    description:
      "Upload an image and extract color values by clicking anywhere on it.",
    images: ["https://colormean.com/image%20color%20picker%20online%20free.webp"],
  },
}

export default function ImageColorPickerPage() {
  const faqs = [
    {
      question: "What image formats are supported?",
      answer:
        "Common formats like JPG, PNG, GIF, WebP, and SVG are supported. High-quality images yield better color accuracy.",
    },
    {
      question: "Are my uploaded images stored?",
      answer:
        "No. Processing happens in your browser. Images are never uploaded to our servers, and are removed on refresh.",
    },
    {
      question: "How accurate are the color values?",
      answer:
        "Values come directly from image pixels, so they’re exact. Slight differences can appear due to display calibration.",
    },
  ]
  return (
    <div className="flex flex-col min-h-screen">
      <WebPageSchema
        name="Image Color Picker"
        url="https://colormean.com/image-color-picker"
        description="Upload an image and extract exact color values from any pixel."
      />
      <BreadcrumbSchema items={[
        { name: "Home", item: "https://colormean.com" },
        { name: "Image Color Picker", item: "https://colormean.com/image-color-picker" }
      ]} />
      <FAQSchema faqs={faqs} />
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

      <main className="container mx-auto px-4 py-12" aria-label="Image Color Picker Tool to extract colors from images">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <ToolApplicationSchema
              name="Image Color Picker"
              slug="image-color-picker"
              description="Image Color Picker Tool to extract colors from images"
            />
            <ImageColorPickerClient />
          </div>
          <ColorSidebar color="#5B6FD8" />
        </div>

        
      </main>

      <ExploreColorTools current="image-color-picker" />

      <Footer />
    </div>
  )
}
