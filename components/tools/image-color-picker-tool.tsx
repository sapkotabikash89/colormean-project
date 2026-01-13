"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Upload, Share } from "lucide-react"
import { hexToRgb, rgbToHsl } from "@/lib/color-utils"
import { CopyButton } from "@/components/copy-button"
import { ColorExportDialog } from "@/components/color-export-dialog"
import { ShareButtons } from "@/components/share-buttons"
import { ColorPageContent } from "@/components/color-page-content"
import data from "@/lib/color-meaning.json"

export function ImageColorPickerTool() {
  const router = useRouter()
  const [image, setImage] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState("#5B6FD8")
  const [pickedColors, setPickedColors] = useState<string[]>([])
  const [isCustomImage, setIsCustomImage] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const magnifierRef = useRef<HTMLCanvasElement>(null)
  const [showMagnifier, setShowMagnifier] = useState(false)
  const [magnifierPos, setMagnifierPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [markerPos, setMarkerPos] = useState<{ x: number; y: number } | null>(null)
  const [exportOpen, setExportOpen] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [palette, setPalette] = useState<string[]>([])
  const [exportTitle, setExportTitle] = useState("")
  const [exportLabel, setExportLabel] = useState("")
  const [exportColors, setExportColors] = useState<string[]>([])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
        setIsCustomImage(true)
        if (event.target?.result) extractPalette(event.target.result as string, 10)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    if (!image) {
      const defaultImg =
        "https://images.unsplash.com/photo-1599345697595-2d1398084369?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      setImage(defaultImg)
      setIsCustomImage(false)
    }
  }, [])

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      const imgObj = new Image()
      imgObj.crossOrigin = "anonymous"
      imgObj.onload = () => {
        canvas.width = imgObj.naturalWidth
        canvas.height = imgObj.naturalHeight
        ctx.drawImage(imgObj, 0, 0)
        setImageLoaded(true)
        extractPalette(image as string, 10)
      }
      imgObj.src = image
    }
  }, [image])

  const extractPalette = (imageSrc: string, k: number) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const tempCanvas = document.createElement("canvas")
      const scaleFactor = Math.min(1, 200 / Math.max(img.width, img.height))
      tempCanvas.width = Math.max(1, Math.floor(img.width * scaleFactor))
      tempCanvas.height = Math.max(1, Math.floor(img.height * scaleFactor))
      const tctx = tempCanvas.getContext("2d")
      if (!tctx) return
      tctx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height)
      const imageData = tctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
      const colors = kMeansPalette(imageData, k)
      setPalette(colors.map((c) => c.hex.toUpperCase()))
    }
    img.src = imageSrc
  }

  const kMeansPalette = (imageData: ImageData, k: number): { hex: string; count: number }[] => {
    const data = imageData.data
    const samples: { r: number; g: number; b: number }[] = []
    for (let i = 0; i < data.length; i += 40) {
      const a = data[i + 3]
      if (a < 128) continue
      samples.push({ r: data[i], g: data[i + 1], b: data[i + 2] })
    }
    if (samples.length === 0) return []

    const centroids = samples.slice(0, k)
    const assignments = new Array(samples.length).fill(0)
    for (let iter = 0; iter < 6; iter++) {
      for (let i = 0; i < samples.length; i++) {
        let best = 0
        let bestDist = Infinity
        for (let c = 0; c < k; c++) {
          const dr = samples[i].r - centroids[c].r
          const dg = samples[i].g - centroids[c].g
          const db = samples[i].b - centroids[c].b
          const dist = dr * dr + dg * dg + db * db
          if (dist < bestDist) {
            bestDist = dist
            best = c
          }
        }
        assignments[i] = best
      }
      const sums = Array.from({ length: k }, () => ({ r: 0, g: 0, b: 0, n: 0 }))
      for (let i = 0; i < samples.length; i++) {
        const a = assignments[i]
        sums[a].r += samples[i].r
        sums[a].g += samples[i].g
        sums[a].b += samples[i].b
        sums[a].n += 1
      }
      for (let c = 0; c < k; c++) {
        if (sums[c].n === 0) {
          centroids[c] = samples[Math.floor(Math.random() * samples.length)]
        } else {
          centroids[c] = {
            r: Math.round(sums[c].r / sums[c].n),
            g: Math.round(sums[c].g / sums[c].n),
            b: Math.round(sums[c].b / sums[c].n),
          }
        }
      }
    }
    const counts = Array(k).fill(0)
    for (let i = 0; i < samples.length; i++) counts[assignments[i]]++
    return centroids.map((c, idx) => ({
      hex: `#${((1 << 24) + (c.r << 16) + (c.g << 8) + c.b).toString(16).slice(1)}`,
      count: counts[idx],
    }))
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const imageData = ctx.getImageData(x, y, 1, 1)
    const [r, g, b] = imageData.data

    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`
    setSelectedColor(hex)

    setPickedColors((prev) => {
      if (prev.includes(hex)) return prev
      const next = [...prev, hex]
      return next.length > 10 ? next.slice(next.length - 10) : next
    })

    window.dispatchEvent(new CustomEvent("colorUpdate", { detail: { color: hex } }))
  }

  const lastCursorPos = useRef<{ x: number; y: number } | null>(null)

  const drawMagnifier = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    const mag = magnifierRef.current
    if (!canvas || !mag || !imageLoaded) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (clientX - rect.left) * scaleX
    const y = (clientY - rect.top) * scaleY

    const ctx = canvas.getContext("2d")
    const mctx = mag.getContext("2d")
    if (!ctx || !mctx) return

    const zoomLevel = 11 // Odd number for centered pixel
    const magSize = 120
    
    // Ensure accurate pixel sampling
    const half = Math.floor(zoomLevel / 2)
    const sx = Math.max(0, Math.min(canvas.width - zoomLevel, Math.floor(x - half)))
    const sy = Math.max(0, Math.min(canvas.height - zoomLevel, Math.floor(y - half)))

    let src: ImageData | null = null
    try {
      src = ctx.getImageData(sx, sy, zoomLevel, zoomLevel)
    } catch {
      return
    }
    if (!src) return

    mag.width = magSize
    mag.height = magSize
    mctx.imageSmoothingEnabled = false

    const temp = document.createElement("canvas")
    temp.width = zoomLevel
    temp.height = zoomLevel
    const tctx = temp.getContext("2d")
    if (!tctx) return

    const imgData = new ImageData(src.data, zoomLevel, zoomLevel)
    tctx.putImageData(imgData, 0, 0)

    mctx.clearRect(0, 0, mag.width, mag.height)
    mctx.drawImage(temp, 0, 0, zoomLevel, zoomLevel, 0, 0, mag.width, mag.height)

    // Grid
    mctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
    mctx.lineWidth = 1
    const cell = mag.width / zoomLevel

    for (let i = 0; i <= zoomLevel; i++) {
      mctx.beginPath()
      mctx.moveTo(i * cell, 0)
      mctx.lineTo(i * cell, mag.height)
      mctx.stroke()
      mctx.beginPath()
      mctx.moveTo(0, i * cell)
      mctx.lineTo(mag.width, i * cell)
      mctx.stroke()
    }

    // Center highlight (Pixelated Box)
    mctx.strokeStyle = "#ef4444" // Red
    mctx.lineWidth = 2
    mctx.strokeRect(Math.floor(zoomLevel / 2) * cell, Math.floor(zoomLevel / 2) * cell, cell, cell)
    
    // Add a secondary white border for better visibility on dark colors
    mctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
    mctx.lineWidth = 1
    mctx.strokeRect(Math.floor(zoomLevel / 2) * cell - 1, Math.floor(zoomLevel / 2) * cell - 1, cell + 2, cell + 2)
  }

  // Effect to draw magnifier when it appears (handling first render)
  useEffect(() => {
    if (showMagnifier && lastCursorPos.current) {
      // Use requestAnimationFrame to ensure the canvas is ready in the DOM
      requestAnimationFrame(() => {
        if (magnifierRef.current && lastCursorPos.current) {
          drawMagnifier(lastCursorPos.current.x, lastCursorPos.current.y)
        }
      })
    }
  }, [showMagnifier])

  const updateMagnifierState = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas || !imageLoaded) return
    const rect = canvas.getBoundingClientRect()
     
    // Check bounds
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
      setShowMagnifier(false)
      return
    }
 
    lastCursorPos.current = { x: clientX, y: clientY }
 
    const offsetX = clientX - rect.left
    const offsetY = clientY - rect.top
    const magSize = 120 // Balanced size
    const pad = 20
    const sep = 24
    const isCoarse =
      typeof window !== "undefined" &&
      !!window.matchMedia &&
      window.matchMedia("(pointer: coarse)").matches
 
    // Smart Positioning Logic
    const isLeftHalf = offsetX < rect.width / 2
    const isTopHalf = offsetY < rect.height / 2
    let mx: number
    let my: number
 
    if (isCoarse) {
      // Mobile/tablet: keep current corner-based opposite placement
      mx = isLeftHalf ? Math.max(pad, rect.width - magSize - pad) : pad
      my = isTopHalf ? Math.max(pad, rect.height - magSize - pad) : pad
    } else {
      // Desktop: opposite side but closer to center horizontally, and near cursor vertically
      let targetX = rect.width * (isLeftHalf ? 0.6 : 0.4) - magSize / 2
      targetX = Math.max(pad, Math.min(rect.width - magSize - pad, targetX))
      if (isLeftHalf) {
        if (targetX - offsetX < sep) {
          targetX = Math.min(rect.width - magSize - pad, offsetX + sep)
        }
      } else {
        if (offsetX - (targetX + magSize) < sep) {
          targetX = Math.max(pad, offsetX - magSize - sep)
        }
      }
      mx = targetX
      let targetY = offsetY - magSize / 2
      targetY = Math.max(pad, Math.min(rect.height - magSize - pad, targetY))
      my = targetY
    }
 
    setMagnifierPos({ x: mx, y: my })
    setShowMagnifier(true)
 
    // Try to draw immediately if ref exists
    if (magnifierRef.current) {
        drawMagnifier(clientX, clientY)
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    updateMagnifierState(e.clientX, e.clientY)
  }

  const handleCanvasTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault() // Prevent scroll
    const touch = e.touches[0]
    updateMagnifierState(touch.clientX, touch.clientY)
  }

  const handleCanvasTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const touch = e.touches[0]
    updateMagnifierState(touch.clientX, touch.clientY)
  }

  const handleCanvasTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
      // Pick color on touch end if we want, or just hide magnifier
      setShowMagnifier(false)
      // If we want to support "tap to pick", we should handle it here because preventDefault on start/move might kill onClick
      // Let's rely on onClick for now? No, preventDefault kills onClick.
      // So we must pick color here.
      if (e.changedTouches.length > 0) {
          const touch = e.changedTouches[0]
          // Re-use logic from handleCanvasClick but with touch coords
          const canvas = canvasRef.current
          if (!canvas) return
          const rect = canvas.getBoundingClientRect()
          const scaleX = canvas.width / rect.width
          const scaleY = canvas.height / rect.height
          const x = (touch.clientX - rect.left) * scaleX
          const y = (touch.clientY - rect.top) * scaleY
          const ctx = canvas.getContext("2d")
          if (!ctx) return
          const imageData = ctx.getImageData(x, y, 1, 1)
          const [r, g, b] = imageData.data
          const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`
          setSelectedColor(hex)
          setPickedColors((prev) => {
            if (prev.includes(hex)) return prev
            const next = [...prev, hex]
            return next.length > 10 ? next.slice(next.length - 10) : next
          })
          window.dispatchEvent(new CustomEvent("colorUpdate", { detail: { color: hex } }))
      }
  }

  const handleCanvasMouseLeave = () => {
    setShowMagnifier(false)
  }

  const handleExplore = (color: string) => {
    const cleanHex = color.replace("#", "")
    router.push(`/colors/${cleanHex.toLowerCase()}`)
  }

  const rgb = hexToRgb(selectedColor)
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null

  return (
    <div className="space-y-8">
      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Upload and Pick Colors</h2>
              <p className="text-muted-foreground">Upload an image and click anywhere to extract color values</p>
            </div>
          </div>

          <div className="space-y-4">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <Button onClick={() => fileInputRef.current?.click()} className="w-full gap-2" size="lg">
              <Upload className="w-5 h-5" />
              Upload Image
            </Button>

            {image && (
              <div className="space-y-4">
                <div className="relative border-2 border-dashed border-lime-400 bg-lime-50 rounded-lg overflow-hidden">
                  <img ref={imageRef} src={image || "/placeholder.svg"} alt="Uploaded" className="hidden" crossOrigin="anonymous" />
                  <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseLeave={handleCanvasMouseLeave}
                    onTouchStart={handleCanvasTouchStart}
                    onTouchMove={handleCanvasTouchMove}
                    onTouchEnd={handleCanvasTouchEnd}
                    className="w-full cursor-crosshair max-h-[500px] object-contain touch-none"
                  />
                  {!isCustomImage && image && (
                    <a
                      href={image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-2 right-2 text-[11px] px-2 py-1 rounded bg-black/50 text-white"
                    >
                      Photo © Unsplash
                    </a>
                  )}
                  {showMagnifier && (
                    <div
                      className="absolute z-10 border-4 border-white bg-background rounded-full shadow-2xl pointer-events-none overflow-hidden"
                      style={{ left: magnifierPos.x, top: magnifierPos.y, width: 120, height: 120 }}
                    >
                      <canvas ref={magnifierRef} className="w-full h-full" />
                    </div>
                  )}
                </div>

                {palette.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-end">
                      <Button
                        onClick={() => {
                          setExportColors(palette)
                          setExportTitle("Export Palette")
                          setExportLabel("image-palette")
                          setExportOpen(true)
                        }}
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                      >
                        <Share className="w-4 h-4" />
                        Export
                      </Button>
                    </div>
                    <div className="flex rounded-lg overflow-hidden border-2 border-border h-10">
                      {palette.map((color, index) => (
                        <div
                          key={index}
                          className="flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                          style={{ backgroundColor: color }}
                          onClick={() => handleExplore(color)}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-6 bg-muted rounded-lg space-y-3">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-24 h-24 rounded-lg border-2 border-border"
                      style={{ backgroundColor: selectedColor }}
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-muted-foreground">HEX:</span>
                          <span className="ml-2 font-mono font-semibold">{selectedColor}</span>
                        </div>
                        <CopyButton value={selectedColor} />
                      </div>
                      {rgb && (
                        <>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm text-muted-foreground">RGB:</span>
                              <span className="ml-2 font-mono">
                                {rgb.r}, {rgb.g}, {rgb.b}
                              </span>
                            </div>
                            <CopyButton value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
                          </div>
                          {hsl && (
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-sm text-muted-foreground">HSL:</span>
                                <span className="ml-2 font-mono">
                                  {hsl.h}°, {hsl.s}%, {hsl.l}%
                                </span>
                              </div>
                              <CopyButton value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
                            </div>
                          )}
                        </>
                      )}
                      <Button onClick={() => handleExplore(selectedColor)} variant="outline" className="w-full mt-2">
                        Explore This Color
                      </Button>
                    </div>
                  </div>
                </div>

                {pickedColors.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Picked Colors</h3>
                    <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
                      {pickedColors.map((color, index) => (
                        <div key={index} className="group cursor-pointer" onClick={() => handleExplore(color)}>
                          <div
                            className="aspect-square rounded-md hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                          <p className="text-xs font-mono text-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {color}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setPickedColors([])} className="flex-1">
                        Clear All
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setExportColors(pickedColors)
                          setExportTitle("Export picked colors")
                          setExportLabel("picked-colors")
                          setExportOpen(true)
                        }}
                        className="flex-1"
                      >
                        Export
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="flex justify-center py-4">
        <ShareButtons title="Image Color Picker Tool - ColorMean" />
      </div>
      {(() => {
        const upper = selectedColor.replace("#", "").toUpperCase()
        const meta: any = (data as any)[upper]
        const colorName: string | undefined = meta?.name || undefined
        return <ColorPageContent hex={selectedColor} name={colorName} mode="sectionsOnly" />
      })()}

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-bold">How to Use the Image Color Picker</h2>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          <li>Click the "Upload Image" button and select an image from your device</li>
          <li>Click anywhere on the uploaded image to pick a color from that exact pixel</li>
          <li>View the selected color code in HEX, RGB, and HSL formats</li>
          <li>Your picked colors are saved below the image for reference</li>
          <li>Click on any picked color swatch to explore it in detail</li>
        </ol>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-bold">Use Cases for Image Color Picker</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Extract brand colors from logos and marketing materials</li>
          <li>Match colors from photographs for design projects</li>
          <li>Create color palettes inspired by nature photos</li>
          <li>Identify exact colors used in competitor designs</li>
          <li>Reproduce colors from physical products in digital designs</li>
          <li>Build color schemes based on artwork or illustrations</li>
        </ul>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-base sm:text-lg">What image formats are supported?</AccordionTrigger>
            <AccordionContent>
              The image color picker supports all common image formats including JPG, PNG, GIF, WebP, and SVG. For best
              results, use high-quality images with accurate colors.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-base sm:text-lg">Are my uploaded images stored?</AccordionTrigger>
            <AccordionContent>
              No, your images are processed entirely in your browser and are never uploaded to our servers. Once you
              close or refresh the page, the image is completely removed from memory.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-base sm:text-lg">How accurate are the color values?</AccordionTrigger>
            <AccordionContent>
              The color values are extracted directly from the image pixels, providing exact accuracy. However, note
              that colors may appear slightly different on various screens due to monitor calibration and color profile
              differences.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
      <ColorExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        title={exportTitle}
        colors={exportColors}
        filenameLabel={exportLabel}
      />
    </div>
  )
}
