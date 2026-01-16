"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ColorSidebar } from "@/components/sidebar"
import { ColorPageContent } from "@/components/color-page-content"
import { AnchorHashNav } from "@/components/anchor-hash-nav"
import { normalizeHex, isValidHex, getContrastColor, hexToRgb, rgbToHsl, rgbToCmyk } from "@/lib/color-utils"
import { generateFAQs } from "@/lib/category-utils"
import { CopyButton } from "@/components/copy-button"

interface ColorData {
  name?: string
  meaning?: string
  hsl?: { h: number; s: number; l: number }
}

export default function ColorSearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const hexParam = searchParams.get('hex') || ''
  const normalizedHex = normalizeHex(hexParam)
  
  const [colorData, setColorData] = useState<ColorData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      if (!isValidHex(normalizedHex)) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        // Load the color meaning data
        const dataModule = await import("@/lib/color-meaning.json")
        const data = dataModule.default
        
        const upperHex = normalizedHex.replace("#", "").toUpperCase()
        const colorInfo = (data as Record<string, ColorData>)[upperHex]
        
        setColorData(colorInfo || null)
      } catch (err) {
        console.error("Error loading color data:", err)
        setColorData(null)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [normalizedHex])

  if (!isValidHex(normalizedHex)) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Color</h1>
          <p className="text-muted-foreground">
            Please enter a valid hex color code.
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