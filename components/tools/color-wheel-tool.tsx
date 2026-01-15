"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getColorHarmony, hslToRgb, rgbToHex, hexToRgb, rgbToHsl } from "@/lib/color-utils"
import { CustomColorPicker } from "@/components/custom-color-picker"
import { ShareButtons } from "@/components/share-buttons"
import { Share } from "lucide-react"
import { ColorExportDialog } from "@/components/color-export-dialog"
import { ColorCombination } from "@/components/color-combination"
import { ColorPageContent } from "@/components/color-page-content"
import { getColorPageLink } from "@/lib/color-linking-utils"
// OPTIMIZATION: Removed direct import of large JSON file to reduce bundle size
// Data is fetched via API when needed to avoid loading 1.5MB JSON in client bundle

export function ColorWheelTool() {
  const router = useRouter()
  const [baseColor, setBaseColor] = useState("#5B6FD8")
  const [tempColor, setTempColor] = useState("#5B6FD8")
  const [harmonyType, setHarmonyType] = useState("complementary")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showCustomPicker, setShowCustomPicker] = useState(false)
  const [canvasSize, setCanvasSize] = useState(450)
  const [exportOpen, setExportOpen] = useState(false)
  const staticCanvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const event = new CustomEvent("colorUpdate", { detail: { color: baseColor } })
    window.dispatchEvent(event)
  }, [baseColor])

  useEffect(() => {
    const updateCanvasSize = () => {
      if (window.innerWidth < 640) {
        // Reduced margin from 80 to 40 for wider wheel on mobile
        const size = Math.min(window.innerWidth - 40, 360)
        setCanvasSize(size)
      } else if (window.innerWidth < 1024) {
        setCanvasSize(380)
      } else {
        setCanvasSize(450)
      }
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)
    return () => window.removeEventListener("resize", updateCanvasSize)
  }, [])

  useEffect(() => {
    drawStaticWheel()
    drawOverlay()
  }, [canvasSize])

  useEffect(() => {
    drawOverlay()
  }, [baseColor, harmonyType])

  const drawStaticWheel = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const outerRadius = Math.min(centerX, centerY) - 40

    const offscreen = document.createElement("canvas")
    offscreen.width = canvas.width
    offscreen.height = canvas.height
    const offCtx = offscreen.getContext("2d")
    if (!offCtx) return

    offCtx.clearRect(0, 0, offscreen.width, offscreen.height)

    for (let angle = 0; angle < 360; angle++) {
      const startAngle = (angle - 90) * (Math.PI / 180)
      const endAngle = (angle + 1 - 90) * (Math.PI / 180)

      for (let r = 0; r <= outerRadius; r += 1) {
        const saturation = (r / outerRadius) * 100
        const lightness = 100 - (r / outerRadius) * 50
        const rgb = hslToRgb(angle, saturation, lightness)
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b)

        offCtx.beginPath()
        offCtx.arc(centerX, centerY, r, startAngle, endAngle)
        offCtx.strokeStyle = hex
        offCtx.lineWidth = 1.5
        offCtx.stroke()
      }
    }

    staticCanvasRef.current = offscreen
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(offscreen, 0, 0)
  }

  const drawOverlay = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const outerRadius = Math.min(centerX, centerY) - 40

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (staticCanvasRef.current) {
      ctx.drawImage(staticCanvasRef.current, 0, 0)
    }

    const ringInner = outerRadius + 10
    const ringOuter = outerRadius + 30

    const baseRgb = hexToRgb(baseColor)
    if (baseRgb) {
      const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b)

      for (let angle = 0; angle < 360; angle++) {
        const startAngle = (angle - 90) * (Math.PI / 180)
        const endAngle = (angle + 1 - 90) * (Math.PI / 180)

        const lightness = (angle / 360) * 100
        const rgb = hslToRgb(baseHsl.h, baseHsl.s, lightness)
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b)

        for (let r = ringInner; r <= ringOuter; r += 1) {
          ctx.beginPath()
          ctx.arc(centerX, centerY, r, startAngle, endAngle)
          ctx.strokeStyle = hex
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }
    }

    const baseRgb2 = hexToRgb(baseColor)
    if (baseRgb2) {
      const baseHsl = rgbToHsl(baseRgb2.r, baseRgb2.g, baseRgb2.b)
      const angle = (baseHsl.h - 90) * (Math.PI / 180)
      const distance = (baseHsl.s / 100) * outerRadius

      const x = centerX + Math.cos(angle) * distance
      const y = centerY + Math.sin(angle) * distance

      ctx.beginPath()
      ctx.arc(x, y, 12, 0, 2 * Math.PI)
      ctx.fillStyle = "#FFFFFF"
      ctx.fill()
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 4
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(x, y, 7, 0, 2 * Math.PI)
      ctx.fillStyle = baseColor
      ctx.fill()
    }

    const harmonies = getColorHarmony(baseColor, harmonyType)
    harmonies.forEach((color) => {
      if (color !== baseColor) {
        drawColorMarker(ctx, centerX, centerY, outerRadius, color, false)
      }
    })
  }

  const drawColorMarker = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    color: string,
    isBase = false,
  ) => {
    const rgb = hexToRgb(color)
    if (!rgb) return

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    const angle = (hsl.h - 90) * (Math.PI / 180)
    const distance = (hsl.s / 100) * radius

    const x = centerX + Math.cos(angle) * distance
    const y = centerY + Math.sin(angle) * distance

    ctx.beginPath()
    ctx.arc(x, y, 10, 0, 2 * Math.PI)
    ctx.fillStyle = "#FFFFFF"
    ctx.fill()
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(x, y, 6, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.fill()
  }

  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    
    let clientX: number
    let clientY: number

    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = (e as React.MouseEvent).clientX
      clientY = (e as React.MouseEvent).clientY
    }

    const x = clientX - rect.left
    const y = clientY - rect.top

    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const canvasX = x * scaleX
    const canvasY = y * scaleY

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const outerRadius = Math.min(centerX, centerY) - 40

    const dx = canvasX - centerX
    const dy = canvasY - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > outerRadius) return

    const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90
    const normalizedAngle = angle < 0 ? angle + 360 : angle

    const saturation = (distance / outerRadius) * 100
    const lightness = 100 - (distance / outerRadius) * 50

    const rgb = hslToRgb(normalizedAngle, saturation, lightness)
    const newColor = rgbToHex(rgb.r, rgb.g, rgb.b)
    setBaseColor(newColor)
  }

  const harmonies = getColorHarmony(baseColor, harmonyType)

  const navigateToColor = (hex: string) => {
    // Use centralized linking logic for safe color navigation
    router.push(getColorPageLink(hex))
  }

  const copyHex = (hex: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(hex)
    const toast = document.createElement("div")
    toast.textContent = "Copied!"
    toast.className = "fixed top-4 right-4 bg-black text-white px-4 py-2 rounded-lg shadow-lg z-50"
    document.body.appendChild(toast)
    setTimeout(() => document.body.removeChild(toast), 2000)
  }

  return (
    <div className="space-y-4 sm:space-y-8">
      <Card className="p-1 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Interactive Color Wheel</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Click and drag on the color wheel to select a base color, then choose a harmony type to discover perfect color
              combinations
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Color Wheel - Centered */}
          <div className="flex justify-center items-center">
            <canvas
              ref={canvasRef}
              width={canvasSize}
              height={canvasSize}
              className="border-2 border-border rounded-lg cursor-crosshair"
              style={{
                width: `${canvasSize}px`,
                height: `${canvasSize}px`,
                aspectRatio: "1/1",
                touchAction: "none",
              }}
              role="img"
              aria-label="Interactive color wheel canvas. Click and drag to select a base color."
              onClick={handleCanvasInteraction}
              onMouseMove={(e) => isDragging && handleCanvasInteraction(e)}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onTouchStart={(e) => {
                setIsDragging(true)
                handleCanvasInteraction(e)
              }}
              onTouchMove={(e) => {
                e.preventDefault()
                if (isDragging) handleCanvasInteraction(e)
              }}
              onTouchEnd={() => setIsDragging(false)}
            />
          </div>

          {/* Controls - Below Wheel on Mobile, Side by Side on Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Left Column: Base Color and Harmony Type */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <label className="font-medium text-sm sm:text-base">Base Color:</label>
                <button
                  onClick={() => setShowCustomPicker(true)}
                  className="w-12 h-8 sm:w-16 sm:h-10 rounded-md border-2 border-border cursor-pointer"
                  style={{ backgroundColor: baseColor }}
                  aria-label={`Open color picker for base color ${baseColor.toUpperCase()}`}
                />
                <span className="font-mono font-semibold text-sm sm:text-base">{baseColor.toUpperCase()}</span>
              </div>

              <div className="space-y-2">
                <label className="font-medium text-sm sm:text-base">Harmony Type:</label>
                <Select value={harmonyType} onValueChange={setHarmonyType}>
                  <SelectTrigger className="w-full" aria-label="Select harmony type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complementary">Complementary</SelectItem>
                    <SelectItem value="analogous">Analogous</SelectItem>
                    <SelectItem value="triadic">Triadic</SelectItem>
                    <SelectItem value="tetradic">Tetradic</SelectItem>
                    <SelectItem value="split-complementary">Split Complementary</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="double-split-complementary">Double Split Complementary</SelectItem>
                    <SelectItem value="monochromatic">Monochromatic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right Column: Color Harmony */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm sm:text-base">Color Harmony</h3>
                <Button size="sm" variant="ghost" className="gap-2" onClick={() => setExportOpen(true)}>
                  <Share className="w-4 h-4" />
                  Export
                </Button>
              </div>
              <div className="space-y-2">
                <div className="w-full">
                  <ColorCombination colors={harmonies} baseHex={baseColor} height={56} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <ColorExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        title={`Export ${harmonyType}`}
        colors={harmonies}
        baseHex={baseColor}
        filenameLabel={harmonyType}
      />

      {showCustomPicker && (
        <CustomColorPicker
          value={baseColor}
          onChange={setTempColor}
          onClose={() => setShowCustomPicker(false)}
          onApply={(color) => {
            setBaseColor(color)
            setShowCustomPicker(false)
          }}
        />
      )}

      <div className="flex justify-center py-4">
        <ShareButtons title="Color Wheel Tool - ColorMean" />
      </div>
      {(() => {
        // OPTIMIZATION: Pass the color hex directly without looking up name
        // The ColorPageContent component will handle unknown colors appropriately
        return <ColorPageContent hex={baseColor} name={undefined} mode="sectionsOnly" />
      })()}

      <Card className="p-2 sm:p-6 space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-xl font-bold">How to Use the Color Wheel</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
          <li>Select your base color using the color picker, or pick color from the color wheel</li>
          <li>Choose a harmony type from the dropdown menu</li>
          <li>View the generated color combinations on the wheel with white markers</li>
          <li>Click on any color to explore it in detail. Click "Explore" button, or scroll down to see everything about the picked color in detail.</li>
          <li>Use these harmonious colors in your design projects</li>
        </ol>
      </Card>

      <Card className="p-2 sm:p-6 space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-xl font-bold">Understanding Color Harmonies</h2>
        <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-muted-foreground">
          <p>
            Color harmonies are combinations of colors that are aesthetically pleasing and create visual balance. Based
            on color theory, these relationships help designers create cohesive and professional color schemes.
          </p>
          <div className="space-y-2">
            <p>
              <strong className="text-foreground">Complementary:</strong> Colors opposite each other on the color wheel,
              creating high contrast and vibrant combinations.
            </p>
            <p>
              <strong className="text-foreground">Analogous:</strong> Colors adjacent to each other, creating serene and
              comfortable designs.
            </p>
            <p>
              <strong className="text-foreground">Triadic:</strong> Three colors evenly spaced on the wheel, offering
              vibrant yet balanced schemes.
            </p>
            <p>
              <strong className="text-foreground">Tetradic:</strong> Two sets of complementary colors 60 degrees apart,
              offering rich color schemes.
            </p>
            <p>
              <strong className="text-foreground">Square:</strong> Four colors evenly spaced (90 degrees) on the wheel,
              creating bold and dynamic combinations.
            </p>
            <p>
              <strong className="text-foreground">Double Split Complementary:</strong> Two sets of split complementary
              colors, offering a balanced and dynamic scheme.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-2 sm:p-6 space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-xl font-bold">Why Use a Color Wheel?</h2>
        <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
          <li>Create professional and harmonious color schemes</li>
          <li>Understand color relationships based on scientific color theory</li>
          <li>Save time by quickly generating color combinations</li>
          <li>Ensure visual balance in your designs</li>
          <li>Learn which colors work well together naturally</li>
        </ul>
      </Card>

      <Card className="p-2 sm:p-6 space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-xl font-bold">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-base sm:text-lg">What is a color wheel?</AccordionTrigger>
            <AccordionContent className="text-sm">
              A color wheel is a circular diagram of colors arranged by their chromatic relationship. It's a visual
              representation of colors arranged according to their hue, showing relationships between primary,
              secondary, and tertiary colors.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-base sm:text-lg">
              How do I choose the right color harmony?
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              The choice depends on your design goals. Use complementary for high contrast and energy, analogous for
              harmony and calm, triadic for vibrant balance, and monochromatic for elegant sophistication. Consider your
              brand, audience, and the mood you want to convey.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-base sm:text-lg">Can I use these colors commercially?</AccordionTrigger>
            <AccordionContent className="text-sm">
              Yes! Colors themselves cannot be copyrighted. The color combinations generated by our tool are free to use
              in any personal or commercial project. However, be mindful of trademarked color combinations in specific
              industries.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  )
}
