"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorPageContent } from "@/components/color-page-content"
import { AnchorHashNav } from "@/components/anchor-hash-nav"
import { normalizeHex, isValidHex, getContrastColor, hexToRgb, rgbToHsl, rgbToCmyk } from "@/lib/color-utils"
import { generateFAQs } from "@/lib/category-utils"
import { Skeleton } from "@/components/ui/skeleton"

interface ColorData {
  name?: string
  meaning?: string
  hsl?: { h: number; s: number; l: number }
}

export function DynamicColorPage() {
  const pathname = usePathname()
  const [colorData, setColorData] = useState<ColorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Extract hex from pathname (format: /colors/ff5733)
  const hexFromPath = pathname.split("/")[2] || ""
  const normalizedHex = normalizeHex(hexFromPath)

  useEffect(() => {
    async function loadData() {
      if (!isValidHex(normalizedHex)) {
        setError("Invalid color code")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        // Load the color meaning data
        const dataModule = await import("@/lib/color-meaning.json")
        const data = dataModule.default
        
        const upperHex = normalizedHex.replace("#", "").toUpperCase()
        const colorInfo = (data as Record<string, ColorData>)[upperHex]
        
        setColorData(colorInfo || null)
      } catch (err) {
        console.error("Error loading color data:", err)
        setError("Failed to load color information")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [normalizedHex])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-32 w-full mb-8" />
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="w-full lg:w-1/3">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !isValidHex(normalizedHex)) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Color Not Found</h1>
          <p className="text-muted-foreground">
            {error || "Invalid color code"}
          </p>
        </div>
        <Footer />
      </div>
    )
  }

  const colorName = colorData?.name
  const displayLabel = colorName ? `${colorName} (${normalizedHex})` : normalizedHex
  const contrastColor = getContrastColor(normalizedHex)
  const rgb = hexToRgb(normalizedHex)
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null
  const cmyk = rgb ? rgbToCmyk(rgb.r, rgb.g, rgb.b) : null
  const faqItems = rgb && hsl ? generateFAQs(normalizedHex, rgb, hsl) : []

  return (
    <div className="flex flex-col min-h-screen">
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
              { label: normalizedHex, href: `/colors/${hexFromPath}` },
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
                <span>{`HEX: ${normalizedHex}`}</span>
                {rgb && (
                  <span>{`RGB: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}</span>
                )}
                {hsl && (
                  <span>{`HSL: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}</span>
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
            <ColorPageContent 
              hex={normalizedHex} 
              faqs={faqItems} 
              name={colorName} 
              colorExistsInDb={!!colorData}
            />
          </div>

          {/* Sidebar - 1/3 */}
          <ColorSidebar color={normalizedHex} />
        </div>
      </main>

      <Footer />
    </div>
  )
}