import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbSchema, FAQSchema, ToolApplicationSchema, WebPageSchema } from "@/components/structured-data"
import { ColorWheelClient } from "@/components/tool-wrappers"
import { ExploreColorTools } from "@/components/tools/explore-color-tools"

export const metadata: Metadata = {
  title: "Color Wheel - Interactive Color Harmony Tool | ColorMean",
  description:
    "Explore the interactive color wheel to discover color harmonies, complementary colors, analogous colors, and triadic combinations. Professional color theory tool for designers.",
  keywords: ["color wheel", "color harmony", "complementary colors", "analogous colors", "color theory"],
  alternates: {
    canonical: "https://colormean.com/color-wheel",
  },
  openGraph: {
    title: "Color Wheel - Interactive Color Harmony Tool | ColorMean",
    description:
      "Explore the interactive color wheel to discover color harmonies, complementary colors, analogous colors, and triadic combinations. Professional color theory tool for designers.",
    url: "https://colormean.com/color-wheel",
    siteName: "ColorMean",
    type: "website",
    images: [
      {
        url: "https://colormean.com/color%20wheel%20online%20free.webp",
        width: 1200,
        height: 630,
        alt: "Interactive Color Wheel Tool to select colors and generate palettes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Wheel - Interactive Color Harmony Tool | ColorMean",
    description:
      "Explore the interactive color wheel to discover color harmonies, complementary colors, analogous colors, and triadic combinations.",
    images: ["https://colormean.com/color%20wheel%20online%20free.webp"],
  },
}

export default function ColorWheelPage() {
  const faqs = [
    {
      question: "What is a color wheel?",
      answer:
        "A color wheel is a circular diagram of colors arranged by their chromatic relationship. It shows relationships between primary, secondary, and tertiary colors.",
    },
    {
      question: "How do I choose the right color harmony?",
      answer:
        "Choose complementary for high contrast and energy, analogous for harmony and calm, triadic for vibrant balance, and monochromatic for elegant simplicity.",
    },
    {
      question: "Can I use these colors commercially?",
      answer:
        "Yes. Colors themselves cannot be copyrighted. You can use generated combinations in personal or commercial projects.",
    },
  ]
  return (
    <div className="flex flex-col min-h-screen">
      <WebPageSchema
        name="Color Wheel"
        url="https://colormean.com/color-wheel"
        description="Interactive color wheel to explore harmonies, complementary, analogous, and triadic combinations."
      />
      <BreadcrumbSchema items={[
        { name: "Home", item: "https://colormean.com" },
        { name: "Color Wheel", item: "https://colormean.com/color-wheel" }
      ]} />
      <FAQSchema faqs={faqs} />
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
            <ToolApplicationSchema
              name="Color Wheel"
              slug="color-wheel"
              description="Interactive Color Wheel Tool to select colors and generate palettes"
            />
            <ColorWheelClient />
          </div>
          <ColorSidebar color="#5B6FD8" />
        </div>

        
      </main>

      <ExploreColorTools current="color-wheel" />

      <Footer />
    </div>
  )
}
