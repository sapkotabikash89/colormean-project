import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ColorSidebar } from "@/components/sidebar"
import { Hero } from "@/components/home/hero"
import { ColorLibraryPreview } from "@/components/home/color-library-preview"
import { AboutSection } from "@/components/home/about-section"
import { LatestPosts } from "@/components/home/latest-posts"
import { CompactAdvancedColorPicker } from "@/components/home/compact-advanced-color-picker"
import { CompactImageColorPicker } from "@/components/home/compact-image-color-picker"
import { CompactColorWheel } from "@/components/home/compact-color-wheel"
import Link from "next/link"
import {
  WebsiteSchema,
  OrganizationSchema,
} from "@/components/structured-data"

// Static metadata for SEO
export const metadata: Metadata = {
  title: "ColorMean: Know Your Color - Professional Color Tools & Information",
  description: "Turn ideas into visuals with confidence. Access rich color details, meanings, psychology, symbolism, uses, precise conversions, and powerful tools made for creative minds.",
  keywords: ["color picker", "color converter", "color meanings", "color harmonies", "design tools", "color psychology"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ColorMean: Know Your Color",
    description: "Professional color tools and information for designers and developers",
    url: "https://colormean.com",
    siteName: "ColorMean",
    type: "website",
    images: [
      {
        url: "https://colormean.com/opengraph-image.webp",
        width: 1200,
        height: 630,
        alt: "ColorMean - Professional Color Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ColorMean: Know Your Color",
    description: "Professional color tools and information for designers and developers",
    images: ["https://colormean.com/opengraph-image.webp"],
  },
}

// Static props for server-side generation
export async function generateStaticParams() {
  return [{}]
}

// Interactive homepage
export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <WebsiteSchema />
      <OrganizationSchema />
      <Header />

      {/* Hero Section with Animation */}
      <Hero />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Content Area */}
          <article id="content" className="main-content grow-content flex-1 space-y-12">
            {/* Live Color Picker Tool */}
            <ToolSection
              title="Interactive Color Picker"
              description="Choose your perfect color and explore its properties instantly"
            >
              <CompactAdvancedColorPicker />
            </ToolSection>

            {/* Live Image Color Picker Tool */}
            <ToolSection
              title="Image Color Picker"
              description="Upload an image and extract exact color values from any pixel"
            >
              <CompactImageColorPicker />
            </ToolSection>

            {/* Live Color Wheel Tool */}
            <ToolSection
              title="Color Wheel"
              description="Explore color relationships and create harmonious color combinations"
            >
              <CompactColorWheel />
            </ToolSection>

            {/* Color Library Preview */}
            <ToolSection
              title="Color Library Preview"
              description="Explore popular shades and their detailed properties"
            >
              <ColorLibraryPreview />
            </ToolSection>

            {/* About ColorMean */}
            <ToolSection
              title="About ColorMean"
              description="Your comprehensive color companion for all your creative needs"
            >
              <AboutSection />
            </ToolSection>
          </article>

          {/* Sidebar */}
          <ColorSidebar color="#5B6FD8" />
        </div>
      </main>

      {/* Latest Posts - Full Width */}
      <LatestPosts />

      <Footer />
    </div>
  )
}

// Tool Section Wrapper Component
function ToolSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
        <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
      </div>

      {children}
    </div>
  )
}