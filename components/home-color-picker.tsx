"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Palette, Shuffle, Pipette } from "lucide-react"
import { hexToRgb, rgbToHsl, hslToRgb, rgbToHex } from "@/lib/color-utils"
import { CopyButton } from "@/components/copy-button"
import Link from "next/link"
import { getColorPageLink } from "@/lib/color-linking-utils"

export function HomeColorPicker() {
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
    const newColor = rgbToHex(rgb.r, rgb.g, rgb.b)
    setSelectedColor(newColor)
    
    // Dispatch color update event for sidebar
    const event = new CustomEvent("colorUpdate", { detail: { color: newColor } })
    window.dispatchEvent(event)
  }

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHue = Number.parseInt(e.target.value)
    setHue(newHue)
    const rgb = hslToRgb(newHue, saturation, lightness)
    const newColor = rgbToHex(rgb.r, rgb.g, rgb.b)
    setSelectedColor(newColor)
    
    // Dispatch color update event for sidebar
    const event = new CustomEvent("colorUpdate", { detail: { color: newColor } })
    window.dispatchEvent(event)
  }

  const handleRandomColor = () => {
    // Generate a random hex color
    const randomHex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    const rgb = hexToRgb(randomHex)
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
      setHue(hsl.h)
      setSaturation(hsl.s)
      setLightness(hsl.l)
      setSelectedColor(randomHex)
    }
  }

  const handleExplore = () => {
    // Use centralized linking logic for safe color navigation
    router.push(getColorPageLink(selectedColor))
  }

  const rgb = hexToRgb(selectedColor)
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null

  const pickerX = `${Math.max(0, Math.min(100, saturation))}%`
  const pickerY = `${Math.max(0, Math.min(100, 100 - lightness))}%`

  return (
    <Card className="p-2 sm:p-6 space-y-4 sm:space-y-6">
      <div className="space-y-2 px-2 sm:px-0">
        <h2 className="text-xl sm:text-2xl font-bold">Interactive Color Picker</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Choose your perfect color and explore its properties instantly
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:gap-6 px-1 sm:px-0 w-full">
        {/* Full-width color picker area for mobile */}
        <div className="space-y-4 w-full">
          <div className="relative w-full">
            <canvas
              ref={canvasRef}
              width={320}
              height={240}
              className="w-full h-auto rounded-lg border-2 border-border cursor-crosshair touch-none"
              style={{ height: 'auto', maxHeight: '240px' }}
              onClick={handleCanvasInteraction}
              onMouseMove={(e) => {
                if (isDragging) {
                  handleCanvasInteraction(e);
                  e.preventDefault();
                }
              }}
              onMouseDown={(e) => {
                setIsDragging(true);
                handleCanvasInteraction(e);
                e.preventDefault();
              }}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onTouchStart={(e) => {
                setIsDragging(true);
                handleCanvasInteraction(e);
                e.preventDefault();
              }}
              onTouchMove={(e) => {
                if (isDragging) {
                  handleCanvasInteraction(e);
                  e.preventDefault();
                }
              }}
              onTouchEnd={() => setIsDragging(false)}
            />
            <div
              className="absolute w-4 h-4 sm:w-5 sm:h-5 border-2 border-white rounded-full pointer-events-none"
              style={{
                left: pickerX,
                top: pickerY,
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)",
              }}
            />
          </div>

          {/* Hue Slider */}
          <div className="space-y-2 w-full">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Hue: {hue}°</label>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={hue}
              onChange={handleHueChange}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer"
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
              onMouseDown={() => {
                setIsDragging(true);
              }}
              onMouseUp={() => {
                setIsDragging(false);
              }}
              onMouseLeave={() => {
                setIsDragging(false);
              }}
            />
          </div>
        </div>

        {/* Color Display and Controls - now below the picker on all screens */}
        <div className="space-y-3 sm:space-y-4 w-full">
          {/* Color Preview Box */}
          <div
            className="w-full h-32 rounded-lg border-2 border-border flex items-center justify-center font-mono text-base sm:text-lg font-semibold"
            style={{
              backgroundColor: selectedColor,
              color: getContrastColor(selectedColor),
            }}
          >
            {selectedColor.toUpperCase()}
          </div>

          {/* Format Display */}
          <div className="space-y-2">
            <div className="p-2 sm:p-3 bg-muted rounded-md font-mono text-xs sm:text-sm">
              HEX: {selectedColor.toUpperCase()}
            </div>
            {rgb && (
              <div className="p-2 sm:p-3 bg-muted rounded-md font-mono text-xs sm:text-sm">
                RGB: ({rgb.r}, {rgb.g}, {rgb.b})
              </div>
            )}
            {hsl && (
              <div className="p-2 sm:p-3 bg-muted rounded-md font-mono text-xs sm:text-sm">
                HSL: ({hsl.h}°, {hsl.s}%, {hsl.l}%)
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <Button onClick={handleExplore} size="lg" className="w-full gap-2 text-sm sm:text-base">
              <Palette className="w-4 h-4" />
              Apply & Explore
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleRandomColor}
                variant="outline"
                size="lg"
                className="gap-1 sm:gap-2 bg-transparent text-xs sm:text-sm px-2 sm:px-4"
              >
                <Shuffle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="truncate">Random</span>
              </Button>
              <Link href="/screen-color-picker">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full gap-1 sm:gap-2 bg-transparent text-xs sm:text-sm px-2 sm:px-4"
                >
                  <Pipette className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="truncate">Screen</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

// Helper function to get contrasting text color
function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return "#000000"
  
  // Calculate luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  return luminance > 0.5 ? "#000000" : "#FFFFFF"
}