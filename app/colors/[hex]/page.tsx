import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorPageContent } from "@/components/color-page-content"
import { AnchorHashNav } from "@/components/anchor-hash-nav"
import { normalizeHex, isValidHex, getContrastColor, hexToRgb, rgbToHsl, rgbToCmyk, getColorHarmony } from "@/lib/color-utils"
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
  return hexCodes.map((hex) => ({
    hex: hex.toLowerCase(),
  }))
}

export async function generateMetadata({ params }: ColorPageProps): Promise<Metadata> {
  const { hex } = await params
  const normalizedHex = normalizeHex(hex)

  if (!isValidHex(normalizedHex)) {
    return {
      title: "Invalid Color - ColorMean",
    }
  }

  // Load data to check if color exists in our database
  const data = (await import('@/lib/color-meaning.json')).default
  const clean = normalizedHex.replace("#", "").toLowerCase()
  const upper = clean.toUpperCase()
  const meta: any = (data as any)[upper]
  const colorName: string | undefined = meta?.name || undefined
  const displayLabel = colorName ? `${colorName} (${normalizedHex})` : normalizedHex
  const imageUrl = `https://colormean.com/colors/${clean}-image.webp`

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
  const { hex } = await params
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

  const redirected = await maybeRedirectToBlog(normalizedHex)
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
    { name: normalizedHex, item: `https://colormean.com/colors/${hex}` },
  ]

  const faqItems = rgb && hsl ? generateFAQs(normalizedHex, rgb, hsl) : []
  const pageUrl = `https://colormean.com/colors/${normalizedHex.replace("#", "").toLowerCase()}`
  const pageDescription = `Explore ${normalizedHex} color information, conversions, harmonies, variations, and accessibility.`

  return (
    <div className="flex flex-col min-h-screen">
      <WebPageSchema name={`${displayLabel} Color`} url={pageUrl} description={pageDescription} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <FAQSchema faqs={faqItems} />

      <Header />

      <ImageObjectSchema
        url={`https://colormean.com/colors/${normalizedHex.replace("#", "").toLowerCase()}-image.webp`}
        width={1200}
        height={630}
        alt={`Color swatch image showing ${displayLabel} with RGB(${rgb?.r ?? 0},${rgb?.g ?? 0},${rgb?.b ?? 0}) values`}
      />

      <img
        src={`https://colormean.com/colors/${normalizedHex.replace("#", "").toLowerCase()}-image.webp`}
        alt={`Color swatch image showing ${displayLabel} with RGB(${rgb?.r ?? 0},${rgb?.g ?? 0},${rgb?.b ?? 0}) values`}
        width={1200}
        height={630}
        className="sr-only"
      />

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
            <ColorPageContent hex={normalizedHex} faqs={faqItems} name={colorName} />
          </div>

          {/* Sidebar - 1/3 */}
          <ColorSidebar color={normalizedHex} />
        </div>
      </main>

      <Footer />
    </div>
  )
}

async function maybeRedirectToBlog(hex: string): Promise<string | null> {
  const site = "https://colormean.com"
  const searchTerm = hex.toUpperCase()
  const clean = searchTerm.replace("#", "")
  try {
    const res = await fetch("https://cms.colormean.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query SearchByHex($q: String!) {
            posts(where: { search: $q }, first: 3) {
              nodes { uri content }
            }
            pages(where: { search: $q }, first: 3) {
              nodes { uri content }
            }
          }
        `,
        variables: { q: clean },
      }),

    })
    const json = await res.json()
    const nodes: Array<{ uri: string; content: string }> = [
      ...((json?.data?.posts?.nodes as any[]) || []),
      ...((json?.data?.pages?.nodes as any[]) || []),
    ]
    for (const n of nodes) {
      const html = String(n?.content || "")
      const found = findHexInContent(html, searchTerm)
      if (found) {
        if (n?.uri) return new URL(n.uri, site).toString()
      }
    }
  } catch {}
  return null
}

function findHexInContent(html: string, target: string): boolean {
  const t = target.toUpperCase()
  const noHash = t.replace("#", "")
  const patterns = [
    new RegExp(`\\b${t}\\b`, "i"),
    new RegExp(`#${noHash}\\b`, "i"),
    new RegExp(`\\b${noHash}\\b`, "i"),
  ]
  for (const re of patterns) {
    if (re.test(html)) return true
  }
  return !!parseShortcodeHex(html) && parseShortcodeHex(html)!.toUpperCase() === t
}

function parseShortcodeHex(html: string): string | null {
  const pre = (html || "")
    .replace(/&(amp;)?#91;?/gi, "[")
    .replace(/&(amp;)?#93;?/gi, "]")
    .replace(/&(amp;)?#x0*5[bB];?/gi, "[")
    .replace(/&(amp;)?#x0*5[dD];?/gi, "]")
    .replace(/&(amp;)?lsqb;?/gi, "[")
    .replace(/&(amp;)?rsqb;?/gi, "]")
    .replace(/&(amp;)?lbrack;?/gi, "[")
    .replace(/&(amp;)?rbrack;?/gi, "]")
    .replace(/\u005B/g, "[")
    .replace(/\u005D/g, "]")
  const tag = pre.match(/\[\s*colormean\b([\s\S]*?)\]/i)
  if (!tag) return null
  const attrs = tag[1] || ""
  const decoded = attrs
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&ldquo;/gi, '"')
    .replace(/&rdquo;/gi, '"')
    .replace(/&lsquo;/gi, "'")
    .replace(/&rsquo;/gi, "'")
    .replace(/&#34;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#8220;/gi, '"')
    .replace(/&#8221;/gi, '"')
    .replace(/&#8216;/gi, "'")
    .replace(/&#8217;/gi, "'")
    .replace(/\u201C|\u201D/g, '"')
    .replace(/\u2018|\u2019/g, "'")
  let val: string | undefined
  const re = /([a-zA-Z0-9_-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"']+))/g
  for (const m of decoded.matchAll(re) as any) {
    const key = String(m[1] || "").trim().toLowerCase()
    if (key === "hex") {
      val = (m[2] ?? m[3] ?? m[4] ?? "").trim()
      break
    }
  }
  if (!val) return null
  const raw = val.replace(/^#/, "").toLowerCase()
  if (/^[0-9a-f]{6}$/.test(raw)) return `#${raw.toUpperCase()}`
  if (/^[0-9a-f]{3}$/.test(raw)) {
    const exp = `${raw[0]}${raw[0]}${raw[1]}${raw[1]}${raw[2]}${raw[2]}`
    return `#${exp.toUpperCase()}`
  }
  return null
}