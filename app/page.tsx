import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ColorSidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Palette, Droplet, Monitor, ImageIcon, Contrast, Eye, CircleDot, Shuffle, Pipette } from "lucide-react"
import Link from "next/link"
import { HomeColorPicker } from "@/components/home-color-picker"
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
    canonical: "https://colormean.com",
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
  // For the home page, we just return an empty array as there are no dynamic params
  return [{}]
}

// Static content for the homepage
export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <WebsiteSchema />
      <OrganizationSchema />
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12 sm:py-16 px-1 sm:px-4">
        <div className="container mx-auto text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-balance">ColorMean: Know Your Color</h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty px-2">
            Turn ideas into visuals with confidence. Access rich color details, meanings, psychology, symbolism, uses, precise conversions, and powerful tools made for creative minds.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-1 sm:px-4 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
          {/* Content Area - 2/3 */}
          <div className="flex-1 space-y-8 sm:space-y-12">
            {/* Interactive Color Picker Component */}
            <HomeColorPicker />

            {/* Color Tools Preview - Static */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Professional Color Tools</h2>
                <p className="text-muted-foreground">Powerful tools to help you work with colors like a professional</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ToolCard
                  icon={<CircleDot className="w-6 h-6" />}
                  title="Color Wheel"
                  description="Explore color relationships and harmonies"
                  href="/color-wheel"
                />
                <ToolCard
                  icon={<Droplet className="w-6 h-6" />}
                  title="Color Picker"
                  description="Advanced color selection tool"
                  href="/color-picker"
                />
                <ToolCard
                  icon={<Pipette className="w-6 h-6" />}
                  title="Screen Color Picker"
                  description="Pick colors from your screen"
                  href="/screen-color-picker"
                />
                <ToolCard
                  icon={<ImageIcon className="w-6 h-6" />}
                  title="Image Color Picker"
                  description="Extract colors from images"
                  href="/image-color-picker"
                />
                <ToolCard
                  icon={<Palette className="w-6 h-6" />}
                  title="Palette from Image"
                  description="Generate color palettes from photos"
                  href="/palette-from-image"
                />
                <ToolCard
                  icon={<Contrast className="w-6 h-6" />}
                  title="Contrast Checker"
                  description="Check WCAG accessibility standards"
                  href="/contrast-checker"
                />
                <ToolCard
                  icon={<Eye className="w-6 h-6" />}
                  title="Color Blindness Simulator"
                  description="See colors through different vision types"
                  href="/color-blindness-simulator"
                />
                <ToolCard
                  icon={<Monitor className="w-6 h-6" />}
                  title="Color Library"
                  description="Browse thousands of colors"
                  href="/colors"
                />
              </div>
            </div>

            {/* About Section - Static */}
            <Card className="p-8 space-y-4">
              <h2 className="text-2xl font-bold">About ColorMean</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">ColorMean</strong> is your comprehensive color companion, designed
                  for designers, developers, artists, and anyone passionate about colors. We provide detailed color
                  information, meanings, and professional-grade tools to help you make the perfect color choices for
                  your projects.
                </p>
                <p>
                  Whether you're looking for the perfect shade, need to check color accessibility, or want to understand
                  color harmonies, ColorMean has you covered. Our platform combines intuitive tools with in-depth color
                  knowledge to empower your creative work.
                </p>
                <h3 className="text-lg font-semibold text-foreground pt-4">What You Can Do:</h3>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>
                    <strong className="text-foreground">Explore Color Information:</strong> Get detailed color codes in
                    HEX, RGB, HSL, CMYK, HSV, and LAB formats
                  </li>
                  <li>
                    <strong className="text-foreground">Discover Color Meanings:</strong> Learn about the psychology and
                    symbolism behind different colors
                  </li>
                  <li>
                    <strong className="text-foreground">Find Color Harmonies:</strong> Generate complementary,
                    analogous, triadic, and more color schemes
                  </li>
                  <li>
                    <strong className="text-foreground">Check Accessibility:</strong> Ensure your color combinations
                    meet WCAG standards
                  </li>
                  <li>
                    <strong className="text-foreground">Extract Colors from Images:</strong> Build palettes from your
                    favorite photos
                  </li>
                  <li>
                    <strong className="text-foreground">Test Color Blindness:</strong> See how your colors appear to
                    people with different vision types
                  </li>
                </ul>
                <p className="pt-4">
                  Start exploring colors today and discover how ColorMean can enhance your creative workflow!
                </p>
              </div>
            </Card>
          </div>

          {/* Sidebar - 1/3 */}
          <ColorSidebar color="#5B6FD8" />
        </div>
      </main>

      <Footer />
    </div>
  )
}

function ToolCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <Link href={href}>
      <Card className="p-6 h-full hover:shadow-lg transition-all hover:border-primary cursor-pointer group">
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            {icon}
          </div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </Card>
    </Link>
  )
}