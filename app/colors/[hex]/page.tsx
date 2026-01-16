import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorPageContent } from "@/components/color-page-content"
import { AnchorHashNav } from "@/components/anchor-hash-nav"
import { normalizeHex, isValidHex, getContrastColor, hexToRgb, rgbToHsl, rgbToCmyk, getColorHarmony } from "@/lib/color-utils"
import { getGumletImageUrl } from "@/lib/gumlet-utils"
import { notFound, redirect } from "next/navigation"
import { BreadcrumbSchema, FAQSchema, ImageObjectSchema, WebPageSchema } from "@/components/structured-data"
import { CopyButton } from "@/components/copy-button"
import { generateFAQs } from "@/lib/category-utils"

export const runtime = 'nodejs'

interface ColorPageProps {
  params: Promise<{ 
    hex: string
  }>
}

export async function generateStaticParams() {
  const data = (await import('@/lib/color-meaning.json')).default
  const hexCodes = Object.keys(data)
  
  // Generate additional common color variations to improve coverage
  const commonColors = [
    // Grayscale
    '000000', 'ffffff', '808080', 'c0c0c0', 
    // Primary colors
    'ff0000', '00ff00', '0000ff',
    // Secondary colors  
    'ffff00', 'ff00ff', '00ffff',
    // Common web colors
    'ff6b6b', '4ecdc4', '45b7d1', '96ceb4', 'ffeaa7', 'dda0dd', '98d8c8',
    // Additional common colors to reduce 404s
    'ff4757', '2ed573', '3742fa', 'ffa502', '70a1ff', '7bed9f', 'ff6b81',
    '2f3542', 'a4b0be', 'ff3838', '3ae374', '67e6dc', '18dcff', '7d5fff',
    'cd84f1', 'ffb8b8', 'ff9f43', '7efff5', '1bfff0', '7158e2', '3d3d3d',
    'f7f1e3', '40407a', '706fd3', 'f5cd79', 'eccc68', 'ff793f', 'ffda79',
    '33d9b2', '218c74', 'aaa69d', '2c2c54', '474787', 'ff5252', 'ff79ac',
    'd1ccc0', 'ffb142', 'ffda79', 'b33939', 'cd6133', '84817a', 'cc8e35'
  ]
  
  // Combine database colors with common colors, removing duplicates
  const allHexCodes = [...new Set([...hexCodes, ...commonColors])]
  
  return allHexCodes.map((hex) => ({
    hex: hex.toUpperCase(),
  }))
}


export async function generateMetadata({ params }: ColorPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  if (!resolvedParams || !resolvedParams.hex) {
    return {
      title: "Color - ColorMean",
    }
  }
  const { hex } = resolvedParams;
  const normalizedHex = normalizeHex(hex)

  if (!isValidHex(normalizedHex)) {
    return {
      title: "Invalid Color - ColorMean",
    }
  }

  // Load data to check if color exists in our database
  const data = (await import('@/lib/color-meaning.json')).default
  const clean = normalizedHex.replace("#", "").toUpperCase()
  const upper = clean.toUpperCase()
  const meta: any = (data as any)[upper]
  const colorName: string | undefined = meta?.name || undefined
  const displayLabel = colorName ? `${colorName} (${normalizedHex})` : normalizedHex
  
  // Determine if image should be from Gumlet CDN
  const gumletImageUrl = getGumletImageUrl(normalizedHex);
  const imageUrl = gumletImageUrl || `https://colormean.com/opengraph-image.webp`; // Fallback for unknown colors

  return {
    title: `${displayLabel} Color Meaning and Information - ColorMean`,
    description: `Explore ${normalizedHex} color information, meanings, conversions (RGB, HSL, CMYK, HSV, LAB), harmonies, variations, and accessibility. Professional color tools for designers and developers.`,
    keywords: [
      `${normalizedHex} color`,
      "color information",
      "color meaning",
      "hex to rgb",
      "color converter",
      "color harmonies",
    ],
    alternates: {
      canonical: `https://colormean.com/colors/${clean}`,
    },
    openGraph: {
      title: `${displayLabel} Color - ColorMean`,
      description: `Detailed information about ${displayLabel} including conversions, harmonies, and meanings.`,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `${displayLabel} color swatch` }],
    },
    twitter: {
      card: "summary_large_image",
      images: [imageUrl],
    },
  }
}

export default async function ColorPage({ params }: ColorPageProps) {
  const resolvedParams = await params;
  if (!resolvedParams || !resolvedParams.hex) {
    notFound();
  }
  const { hex } = resolvedParams;
  const normalizedHex = normalizeHex(hex)

  if (!isValidHex(normalizedHex)) {
    notFound()
  }
  
  // Load data dynamically for both static and dynamic rendering
  const data = (await import('@/lib/color-meaning.json')).default
  const upper = normalizedHex.replace("#", "").toUpperCase()
  const meta: any = (data as any)[upper]
  
  // If the color doesn't exist in our JSON, we'll still render the page but with minimal data
  const colorName: string | undefined = meta?.name || undefined
  const displayLabel = colorName ? `${colorName} (${normalizedHex})` : normalizedHex

  // Removed WordPress blog redirection - colors will stay on color pages
  const redirected = null
  if (redirected) {
    redirect(redirected)
  }

  const contrastColor = getContrastColor(normalizedHex)
  const rgb = hexToRgb(normalizedHex)
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null
  const cmyk = rgb ? rgbToCmyk(rgb.r, rgb.g, rgb.b) : null

  const breadcrumbItems = [
    { name: "ColorMean", item: "https://colormean.com" },
    { name: "Color Names", item: "https://colormean.com/colors" },
    { name: normalizedHex, item: `https://colormean.com/colors/${normalizedHex.replace("#", "").toUpperCase()}` },
  ]

  const faqItems = rgb && hsl ? generateFAQs(normalizedHex, rgb, hsl) : []
  const pageUrl = `https://colormean.com/colors/${normalizedHex.replace("#", "").toUpperCase()}`
  const pageDescription = `Explore ${normalizedHex} color information, conversions, harmonies, variations, and accessibility.`

  // Determine if image is available from Gumlet CDN
  const gumletImageUrl = getGumletImageUrl(normalizedHex);
  const colorExistsInDb = !!meta;
  
  // Only render the page if color exists in database
  // Unknown colors will be handled by server-side redirects
  if (!colorExistsInDb) {
    // This should never be reached due to server-side redirects
    // but we return notFound() as a safety fallback
    notFound();
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <WebPageSchema name={`${displayLabel} Color`} url={pageUrl} description={pageDescription} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <FAQSchema faqs={faqItems} />
      
      <Header />
      
      {gumletImageUrl ? (
        <ImageObjectSchema
          url={gumletImageUrl}
          width={1200}
          height={630}
          alt={`Color swatch image showing ${displayLabel} with RGB(${rgb?.r ?? 0},${rgb?.g ?? 0},${rgb?.b ?? 0}) values`}
        />
      ) : (
        // For unknown colors without Gumlet images, we don't include an image in the schema
        <div className="sr-only">No image schema for dynamic color</div>
      )}
      
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
              { label: normalizedHex, href: `/colors/${normalizedHex.replace("#", "").toUpperCase()}` },
            ]}
          />
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">{displayLabel} Color Meaning and Information</h1>
            <p className="max-w-3xl mx-auto text-sm md:text-base opacity-90">
              Everything you need to know about {displayLabel} including values, color harmonies, shades,
              meanings, and applications in design, branding, and everyday visuals.
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
          { href: "#meaning", label: "Meaning" },
          { href: "#conversion", label: "Conversion" },
          { href: "#variations", label: "Variations" },
          { href: "#harmonies", label: "Harmonies" },
          { href: "#contrast-checker", label: "Contrast Checker" },
          { href: "#blindness-simulator", label: "Blindness Simulator" },
          { href: "#css-examples", label: "CSS Examples" },
          { href: "#related-colors", label: "Related Colors" },
          { href: "#faqs", label: "FAQs" },
        ]}
      />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Content Area - 2/3 */}
          <div className="flex-1">
            <ColorPageContent hex={normalizedHex} faqs={faqItems} name={colorName} colorExistsInDb={colorExistsInDb} pageUrl={pageUrl} />
          </div>
          
          {/* Sidebar - 1/3 */}
          <ColorSidebar color={normalizedHex} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}


