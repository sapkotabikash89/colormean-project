"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/copy-button"
import { hexToRgb, rgbToHsl, hslToRgb, rgbToHex } from "@/lib/color-utils"
import { ShareButtons } from "@/components/share-buttons"
import { ColorPageContent } from "@/components/color-page-content"
// OPTIMIZATION: Removed direct import of large JSON file to reduce bundle size
// Data is fetched via API when needed to avoid loading 1.5MB JSON in client bundle

export function AdvancedColorPicker() {
  const router = useRouter()
  const [selectedColor, setSelectedColor] = useState("#5B6FD8")
  const [hue, setHue] = useState(230)
  const [saturation, setSaturation] = useState(70)
  const [lightness, setLightness] = useState(60)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const event = new CustomEvent("colorUpdate", { detail: { color: selectedColor } })
    window.dispatchEvent(event)
  }, [selectedColor])

  useEffect(() => {
    drawColorSpace()
  }, [hue])

  const drawColorSpace = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Draw saturation and lightness gradient
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const s = (x / width) * 100
        const l = 100 - (y / height) * 100
        const rgb = hslToRgb(hue, s, l)
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
        ctx.fillStyle = hex
        ctx.fillRect(x, y, 1, 1)
      }
    }
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
      clientX = e.clientX
      clientY = e.clientY
    }

    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    const y = Math.max(0, Math.min(clientY - rect.top, rect.height))

    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const canvasX = x * scaleX
    const canvasY = y * scaleY

    const newSaturation = (canvasX / canvas.width) * 100
    const newLightness = 100 - (canvasY / canvas.height) * 100

    setSaturation(Math.max(0, Math.min(100, Math.round(newSaturation))))
    setLightness(Math.max(0, Math.min(100, Math.round(newLightness))))

    const rgb = hslToRgb(hue, newSaturation, newLightness)
    setSelectedColor(rgbToHex(rgb.r, rgb.g, rgb.b))
  }

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHue = Number.parseInt(e.target.value)
    setHue(newHue)
    const rgb = hslToRgb(newHue, saturation, lightness)
    setSelectedColor(rgbToHex(rgb.r, rgb.g, rgb.b))
  }

  const handleExplore = () => {
    const cleanHex = selectedColor.replace("#", "")
    router.push(`/colors/${cleanHex.toLowerCase()}`)
  }

  const rgb = hexToRgb(selectedColor)
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null

  const pickerX = `${Math.max(0, Math.min(100, saturation))}%`
  const pickerY = `${Math.max(0, Math.min(100, 100 - lightness))}%`

  return (
    <div className="space-y-6">
      <Card className="p-1 sm:p-6 space-y-6">
        <div className="flex items-center justify-between px-3 pt-3 sm:px-0 sm:pt-0">
          <h2 className="text-2xl font-bold">Advanced Color Picker</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-6 px-1 sm:px-0">
          {/* Left Side: Color Space Canvas */}
          <div className="flex-shrink-0 space-y-4 w-full md:w-auto">
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={400}
                height={280}
                className="w-full max-w-[400px] rounded-lg border-2 border-border cursor-crosshair touch-none"
                onClick={handleCanvasInteraction}
                onMouseMove={(e) => isDragging && handleCanvasInteraction(e)}
                onMouseDown={(e) => {
                  setIsDragging(true)
                  handleCanvasInteraction(e)
                }}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onTouchStart={(e) => {
                  setIsDragging(true)
                  handleCanvasInteraction(e)
                }}
                onTouchMove={(e) => {
                  e.preventDefault()
                  handleCanvasInteraction(e)
                }}
                onTouchEnd={() => setIsDragging(false)}
              />
              <div
                className="absolute w-5 h-5 border-2 border-white rounded-full pointer-events-none"
                style={{
                  left: pickerX,
                  top: pickerY,
                  transform: "translate(-50%, -50%)",
                  boxShadow: "0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)",
                }}
              />
            </div>

            {/* Hue Slider */}
            <div className="space-y-2 max-w-[400px]">
              <label className="text-sm font-medium">Hue: {hue}°</label>
              <input
                type="range"
                min="0"
                max="360"
                value={hue}
                onChange={handleHueChange}
                className="w-full h-4 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(0, 100%, 50%), 
                    hsl(60, 100%, 50%), 
                    hsl(120, 100%, 50%), 
                    hsl(180, 100%, 50%), 
                    hsl(240, 100%, 50%), 
                    hsl(300, 100%, 50%), 
                    hsl(360, 100%, 50%))`,
                }}
              />
            </div>
          </div>

          {/* Right Side: Color Display and Values */}
          <div className="flex-1 space-y-3">
            {/* Color Preview */}
            <div
              className="w-full h-32 rounded-lg border-2 border-border flex items-center justify-center font-mono font-semibold"
              style={{ backgroundColor: selectedColor, color: getContrastColor(selectedColor) }}
            >
              {selectedColor.toUpperCase()}
            </div>

            {/* Color Values */}
            <div className="flex items-center justify-between p-3 bg-muted rounded-md">
              <div>
                <span className="text-sm text-muted-foreground">HEX</span>
                <p className="font-mono font-semibold">{selectedColor}</p>
              </div>
              <CopyButton value={selectedColor} />
            </div>
            {rgb && (
              <>
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div>
                    <span className="text-sm text-muted-foreground">RGB</span>
                    <p className="font-mono">
                      ({rgb.r}, {rgb.g}, {rgb.b})
                    </p>
                  </div>
                  <CopyButton value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
                </div>
                {hsl && (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div>
                      <span className="text-sm text-muted-foreground">HSL</span>
                      <p className="font-mono">
                        ({hsl.h}°, {hsl.s}%, {hsl.l}%)
                      </p>
                    </div>
                    <CopyButton value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
                  </div>
                )}
              </>
            )}

            <Button onClick={handleExplore} className="w-full" size="lg">
              Explore This Color
            </Button>
          </div>
        </div>
      </Card>
      
      <div className="flex justify-center py-4">
        <ShareButtons title="Advanced Color Picker Tool - ColorMean" />
      </div>
      {(() => {
        // OPTIMIZATION: Pass the color hex directly without looking up name
        // The ColorPageContent component will handle unknown colors appropriately
        return <ColorPageContent hex={selectedColor} name={undefined} mode="sectionsOnly" />
      })()}
    </div>
  )
}

function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return "#000000"
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
  return brightness > 128 ? "#000000" : "#FFFFFF"
}
