import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorPageContent } from "@/components/color-page-content"
import { AnchorHashNav } from "@/components/anchor-hash-nav"
import { normalizeHex, isValidHex, getContrastColor, hexToRgb, rgbToHsl, rgbToCmyk, getColorHarmony } from "@/lib/color-utils"
import { getGumletImageUrl } from "@/lib/gumlet-utils"
import { BreadcrumbSchema, FAQSchema, ImageObjectSchema, WebPageSchema } from "@/components/structured-data"
import { CopyButton } from "@/components/copy-button"
import { generateFAQs } from "@/lib/category-utils"

// This page handles unknown color paths that aren't pre-generated
// It uses the same component structure as the static color pages
// but loads data client-side for unknown colors

interface DynamicColorPageProps {
  params: Promise<{ 
    hex: string
  }>
}

export async function generateMetadata({ params }: DynamicColorPageProps): Promise<Metadata> {
  const { hex } = await params
  const normalizedHex = normalizeHex(hex)

  if (!isValidHex(normalizedHex)) {
    return {
      title: "Invalid Color - ColorMean",
    }
  }

  const displayLabel = normalizedHex
  const imageUrl = `https://colormean.com/opengraph-image.webp`

  return {
    title: `${displayLabel} Color Information - ColorMean`,
    description: `Explore ${normalizedHex} color information, conversions, harmonies, variations, and accessibility.`,
    keywords: [
      `${normalizedHex} color`,
      "color information",
      "hex to rgb",
      "color converter",
    ],
    alternates: {
      canonical: `https://colormean.com/colors/${normalizedHex.replace("#", "").toLowerCase()}`,
    },
    openGraph: {
      title: `${displayLabel} Color - ColorMean`,
      description: `Color information for ${displayLabel}`,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `${displayLabel} color swatch` }],
    },
    twitter: {
      card: "summary_large_image",
      images: [imageUrl],
    },
  }
}

export default async function DynamicColorPage({ params }: DynamicColorPageProps) {
  const { hex } = await params
  const normalizedHex = normalizeHex(hex)

  if (!isValidHex(normalizedHex)) {
    notFound()
  }

  // Check if this color exists in our database
  const data = (await import('@/lib/color-meaning.json')).default
  const upper = normalizedHex.replace("#", "").toUpperCase()
  const meta: any = (data as any)[upper]
  
  // For unknown colors, we'll render the page with minimal data
  const colorName: string | undefined = meta?.name || undefined
  const displayLabel = colorName ? `${colorName} (${normalizedHex})` : normalizedHex

  const contrastColor = getContrastColor(normalizedHex)
  const rgb = hexToRgb(normalizedHex)
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null
  const cmyk = rgb ? rgbToCmyk(rgb.r, rgb.g, rgb.b) : null

  const breadcrumbItems = [
    { name: "ColorMean", item: "https://colormean.com" },
    { name: "Color Names", item: "https://colormean.com/colors" },
    { name: normalizedHex, item: `https://colormean.com/colors/${hex}` },
  ]

  const faqItems = rgb && hsl ? generateFAQs(normalizedHex, rgb, hsl) : []
  const pageUrl = `https://colormean.com/colors/${normalizedHex.replace("#", "").toLowerCase()}`
  const pageDescription = `Explore ${normalizedHex} color information, conversions, harmonies, variations, and accessibility.`

  // For unknown colors, no Gumlet image will be available
  const gumletImageUrl = getGumletImageUrl(normalizedHex)
  const colorExistsInDb = !!meta
  
  return (
    <div className="flex flex-col min-h-screen">
      <WebPageSchema name={`${displayLabel} Color`} url={pageUrl} description={pageDescription} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <FAQSchema faqs={faqItems} />

      <Header />

      {/* Dynamic Color Hero */}
      <section
        className="py-12 px-4 transition-colors"
        style={{
          backgroundColor: normalizedHex,
          color: contrastColor,
        }}
      >
        <div className="container mx-auto">
          <BreadcrumbNav
            items={[
              { label: "Color Names", href: "/colors" },
              { label: normalizedHex, href: `/colors/${hex}` },
            ]}
          />
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">{displayLabel} Color Information</h1>
            <p className="max-w-3xl mx-auto text-sm md:text-base opacity-90">
              Color information for {displayLabel} including values, conversions, and technical details.
            </p>
            <div className="max-w-4xl mx-auto">
              <div className="font-mono text-xs md:text-sm flex flex-wrap justify-center gap-4">
                <CopyButton showIcon={false} variant="ghost" size="sm" className="p-0 h-auto" label={`HEX: ${normalizedHex}`} value={normalizedHex} />
                {rgb && (
                  <CopyButton
                    showIcon={false}
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto"
                    label={`RGB: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                    value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                  />
                )}
                {hsl && (
                  <CopyButton
                    showIcon={false}
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto"
                    label={`HSL: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                    value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <AnchorHashNav
        items={[
          { href: "#information", label: "Information" },
          { href: "#conversion", label: "Conversion" },
          { href: "#variations", label: "Variations" },
          { href: "#harmonies", label: "Harmonies" },
          { href: "#contrast-checker", label: "Contrast Checker" },
          { href: "#css-examples", label: "CSS Examples" },
        ]}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Content Area - 2/3 */}
          <div className="flex-1">
            <ColorPageContent hex={normalizedHex} faqs={faqItems} name={colorName} colorExistsInDb={colorExistsInDb} />
          </div>

          {/* Sidebar - 1/3 */}
          <ColorSidebar color={normalizedHex} />
        </div>
      </main>

      <Footer />
    </div>
  )
}