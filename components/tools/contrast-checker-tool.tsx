"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { RefreshCw } from "lucide-react"
import { hexToRgb } from "@/lib/color-utils"
import { CustomColorPicker } from "@/components/custom-color-picker"
import { ShareButtons } from "@/components/share-buttons"

export function ContrastCheckerTool() {
  const [foreground, setForeground] = useState("#1E3A8A")
  const [background, setBackground] = useState("#DBEAFE")
  const [tempForeground, setTempForeground] = useState("#1E3A8A")
  const [tempBackground, setTempBackground] = useState("#DBEAFE")
  const [showForegroundPicker, setShowForegroundPicker] = useState(false)
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false)

  const contrastRatio = calculateContrastRatio(foreground, background)

  const swapColors = () => {
    const temp = foreground
    setForeground(background)
    setBackground(temp)
    setTempForeground(background)
    setTempBackground(temp)
  }

  const handleApplyForeground = (color?: string) => {
    const finalColor = color || tempForeground
    setForeground(finalColor)
    setTempForeground(finalColor)
    setShowForegroundPicker(false)
  }

  const handleApplyBackground = (color?: string) => {
    const finalColor = color || tempBackground
    setBackground(finalColor)
    setTempBackground(finalColor)
    setShowBackgroundPicker(false)
  }

  return (
    <div className="space-y-8">
      <Card className="p-4 sm:p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Check Contrast Ratio</h2>
              <p className="text-muted-foreground">Test your color combinations against WCAG accessibility standards</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="space-y-2">
              <label className="text-sm font-medium">Foreground (Text)</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowForegroundPicker(true)
                  }}
                  className="w-16 h-12 rounded-md border-2 border-border cursor-pointer flex-shrink-0"
                  style={{ backgroundColor: foreground }}
                />
                <input
                  type="text"
                  value={foreground}
                  onChange={(e) => {
                    setForeground(e.target.value)
                    setTempForeground(e.target.value)
                  }}
                  className="flex-1 px-3 py-2 border rounded-md font-mono text-sm"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" size="icon" onClick={swapColors}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Background</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowBackgroundPicker(true)
                  }}
                  className="w-16 h-12 rounded-md border-2 border-border cursor-pointer flex-shrink-0"
                  style={{ backgroundColor: background }}
                />
                <input
                  type="text"
                  value={background}
                  onChange={(e) => {
                    setBackground(e.target.value)
                    setTempBackground(e.target.value)
                  }}
                  className="flex-1 px-3 py-2 border rounded-md font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="p-12 rounded-lg space-y-6" style={{ backgroundColor: background, color: foreground }}>
            <h3 className="text-4xl font-bold">Large Text Sample</h3>
            <p className="text-xl">Medium text at 20 pixels for testing readability</p>
            <p className="text-base">
              Normal text at 16 pixels. This is how your regular body text will appear with these color combinations.
              Make sure it's readable and comfortable to read.
            </p>
            <p className="text-sm">Small text at 14 pixels for detailed content</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ContrastResult
              label="Large Text"
              sublabel="18pt+ or 14pt+ Bold"
              ratio={contrastRatio}
              aaThreshold={3}
              aaaThreshold={4.5}
            />
            <ContrastResult
              label="Normal Text"
              sublabel="Under 18pt"
              ratio={contrastRatio}
              aaThreshold={4.5}
              aaaThreshold={7}
            />
            <ContrastResult
              label="UI Components"
              sublabel="Icons, Borders"
              ratio={contrastRatio}
              aaThreshold={3}
              aaaThreshold={4.5}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-center py-4">
        <ShareButtons title="Contrast Checker Tool - ColorMean" />
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-bold">How to Use the Contrast Checker</h2>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          <li>Select your foreground (text) color using the color picker or enter a hex code</li>
          <li>Select your background color</li>
          <li>View the contrast ratio and WCAG compliance levels instantly</li>
          <li>Use the swap button to quickly test the inverse combination</li>
          <li>Ensure your combination meets at least AA standards for accessibility</li>
        </ol>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-bold">Understanding WCAG Standards</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            The Web Content Accessibility Guidelines (WCAG) provide standards for making web content more accessible to
            people with disabilities, including those with visual impairments.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">WCAG AA (Minimum)</h3>
              <ul className="space-y-1 text-sm">
                <li>• Normal text: 4.5:1 contrast ratio</li>
                <li>• Large text: 3:1 contrast ratio</li>
                <li>• Required for most websites</li>
              </ul>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">WCAG AAA (Enhanced)</h3>
              <ul className="space-y-1 text-sm">
                <li>• Normal text: 7:1 contrast ratio</li>
                <li>• Large text: 4.5:1 contrast ratio</li>
                <li>• Highest accessibility standard</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-bold">Why Contrast Matters</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Ensures readability for users with visual impairments</li>
          <li>Improves usability in different lighting conditions</li>
          <li>Required for ADA and Section 508 compliance</li>
          <li>Enhances overall user experience for everyone</li>
          <li>Prevents legal issues related to accessibility</li>
          <li>Shows consideration for all users regardless of ability</li>
        </ul>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>What is a good contrast ratio?</AccordionTrigger>
            <AccordionContent>
              For normal text, aim for at least 4.5:1 (WCAG AA) or 7:1 (WCAG AAA). For large text (18pt+ or 14pt+ bold),
              3:1 (AA) or 4.5:1 (AAA) is acceptable. Higher ratios provide better accessibility.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Do I need to meet AAA standards?</AccordionTrigger>
            <AccordionContent>
              AA is the legal requirement for most websites. AAA is recommended but not required, as it can be difficult
              to achieve with brand colors. However, critical content and government sites should aim for AAA when
              possible.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>What if my brand colors don't meet standards?</AccordionTrigger>
            <AccordionContent>
              You can use your brand colors for decorative elements and adjust shades for text. Consider using darker or
              lighter versions of your brand colors, or ensure sufficient contrast by pairing them with appropriate
              backgrounds.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {showForegroundPicker && (
        <CustomColorPicker
          value={tempForeground}
          onChange={setTempForeground}
          onApply={handleApplyForeground}
          onClose={() => {
            setShowForegroundPicker(false)
            setTempForeground(foreground)
          }}
        />
      )}
      {showBackgroundPicker && (
        <CustomColorPicker
          value={tempBackground}
          onChange={setTempBackground}
          onApply={handleApplyBackground}
          onClose={() => {
            setShowBackgroundPicker(false)
            setTempBackground(background)
          }}
        />
      )}
    </div>
  )
}

function ContrastResult({
  label,
  sublabel,
  ratio,
  aaThreshold,
  aaaThreshold,
}: {
  label: string
  sublabel: string
  ratio: number
  aaThreshold: number
  aaaThreshold: number
}) {
  const passAA = ratio >= aaThreshold
  const passAAA = ratio >= aaaThreshold

  return (
    <div className="p-6 bg-muted rounded-lg space-y-3 text-center">
      <div>
        <h4 className="font-semibold text-lg">{label}</h4>
        <p className="text-sm text-muted-foreground">{sublabel}</p>
      </div>
      <div className="text-3xl font-bold">{ratio.toFixed(2)}:1</div>
      <div className="space-y-2">
        <div className="flex items-center justify-between p-2 bg-background rounded">
          <span className="text-sm font-medium">WCAG AA</span>
          <span className={`text-lg ${passAA ? "text-green-500" : "text-red-500"}`}>
            {passAA ? "✓ Pass" : "✗ Fail"}
          </span>
        </div>
        <div className="flex items-center justify-between p-2 bg-background rounded">
          <span className="text-sm font-medium">WCAG AAA</span>
          <span className={`text-lg ${passAAA ? "text-green-500" : "text-red-500"}`}>
            {passAAA ? "✓ Pass" : "✗ Fail"}
          </span>
        </div>
      </div>
    </div>
  )
}

function calculateContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hex: string) => {
    const rgb = hexToRgb(hex)
    if (!rgb) return 0

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
      const sRGB = val / 255
      return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
    })

    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}
