"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Upload, Share } from "lucide-react"
import { CopyButton } from "@/components/copy-button"
import { ColorExportDialog } from "@/components/color-export-dialog"
import { ShareButtons } from "@/components/share-buttons"

export function PaletteFromImageTool() {
  const router = useRouter()
  const [image, setImage] = useState<string | null>(null)
  const [palette, setPalette] = useState<{ hex: string; percent: number }[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCustomImage, setIsCustomImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [exportOpen, setExportOpen] = useState(false)
  const pieCanvasRef = useRef<HTMLCanvasElement>(null)
  const [colorCount, setColorCount] = useState(8)

  useEffect(() => {
    const defaultImg =
      "https://images.unsplash.com/photo-1744994338689-77e9f043abd9?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    setImage(defaultImg)
    setIsCustomImage(false)
    extractPalette(defaultImg)
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = event.target?.result as string
        setImage(img)
        setIsCustomImage(true)
        extractPalette(img)
      }
      reader.readAsDataURL(file)
    }
  }

  const extractPalette = (imageSrc: string, countOverride?: number) => {
    setIsProcessing(true)
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Scale down image for faster processing
      const scaleFactor = Math.min(1, 200 / Math.max(img.width, img.height))
      canvas.width = img.width * scaleFactor
      canvas.height = img.height * scaleFactor

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const colors = kMeansPalette(imageData, Math.max(2, Math.min(12, countOverride ?? colorCount)))
      const total = colors.reduce((sum, c) => sum + c.count, 0)
      let withPercents = colors.map((c) => ({ hex: c.hex.toUpperCase(), percent: Math.round((c.count / total) * 100) }))
      const sumPerc = withPercents.reduce((s, x) => s + x.percent, 0)
      if (sumPerc !== 100 && withPercents.length > 0) {
        const diff = 100 - sumPerc
        withPercents[withPercents.length - 1].percent += diff
      }
      setPalette(withPercents)
      setIsProcessing(false)
      drawPie(withPercents)
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

  const handleExplore = (color: string) => {
    const cleanHex = color.replace("#", "")
    router.push(`/colors/${cleanHex.toLowerCase()}`)
  }

  const openExport = () => setExportOpen(true)

  const drawPie = (items: { hex: string; percent: number }[]) => {
    const canvas = pieCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const w = 280
    const h = 280
    canvas.width = w
    canvas.height = h
    const centerX = w / 2
    const centerY = h / 2
    const radius = Math.min(centerX, centerY) - 8
    let start = -Math.PI / 2
    items.forEach((item) => {
      const sweep = (item.percent / 100) * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, start, start + sweep)
      ctx.closePath()
      ctx.fillStyle = item.hex
      ctx.fill()
      start += sweep
    })
  }

  return (
    <div className="space-y-8">
      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Generate Color Palette</h2>
          </div>
          <p className="text-muted-foreground">
            Upload an image to extract its dominant colors and create a beautiful color palette
          </p>

          <div className="space-y-4">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <Button onClick={() => fileInputRef.current?.click()} className="w-full gap-2" size="lg">
              <Upload className="w-5 h-5" />
              Upload Image
            </Button>

            {image && (
              <div className="space-y-4">
                <div className="relative border-2 border-dashed border-lime-400 bg-lime-50 rounded-lg overflow-hidden">
                  <img
                    src={image || "/placeholder.svg"}
                    alt="Uploaded"
                    className="w-full h-auto max-h-96 object-contain"
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
                </div>
                <canvas ref={canvasRef} className="hidden" />

                {isProcessing ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Extracting colors...</p>
                  </div>
                ) : palette.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">Extracted Palette</h3>
                      <Button onClick={openExport} variant="ghost" size="sm" className="gap-2">
                        <Share className="w-4 h-4" />
                        Export
                      </Button>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium">Number of colors:</label>
                      <select
                        className="border rounded-md px-2 py-1 text-sm bg-background"
                        value={colorCount}
                        onChange={(e) => {
                          const v = Number(e.target.value)
                          setColorCount(v)
                          if (image) extractPalette(image, v)
                        }}
                      >
                        {Array.from({ length: 11 }, (_, i) => i + 2).map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {palette.map((item, index) => (
                        <div key={index} className="group cursor-pointer" onClick={() => handleExplore(item.hex)}>
                          <div
                            className="w-full aspect-square rounded-lg hover:scale-105 transition-transform"
                            style={{ backgroundColor: item.hex }}
                          />
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-sm font-mono">{item.hex} ({item.percent}%)</p>
                            <CopyButton value={item.hex} size="icon" />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex rounded-lg overflow-hidden border-2 border-border h-20">
                      {palette.map((item, index) => (
                        <div
                          key={index}
                          className="flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                          style={{ backgroundColor: item.hex }}
                          onClick={() => handleExplore(item.hex)}
                          title={item.hex}
                        />
                      ))}
                    </div>

                    <div className="space-y-1 pb-0 mb-0">
                      <h4 className="font-medium">Palette Distribution</h4>
                      <canvas ref={pieCanvasRef} className="w-72 h-72 block" />
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </Card>
      <ColorExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        title="Export Palette"
        colors={palette.map((p) => p.hex)}
        filenameLabel="palette-from-image"
      />

      <div className="flex justify-center py-4">
        <ShareButtons title="Palette From Image Tool - ColorMean" />
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-bold">How to Use Palette Generator</h2>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          <li>Click "Upload Image" and select a photo or image from your device</li>
          <li>Wait a moment while we analyze the image and extract dominant colors</li>
          <li>View the extracted color palette with HEX codes</li>
          <li>Click on any color to explore it in detail</li>
          <li>Download the palette as a text file for future reference</li>
        </ol>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-bold">Use Cases</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Extract brand colors from logos and marketing materials</li>
          <li>Create color schemes inspired by nature photography</li>
          <li>Build website color palettes from mood boards</li>
          <li>Match colors from artwork and illustrations</li>
          <li>Generate cohesive palettes from product photos</li>
          <li>Find complementary colors in existing designs</li>
        </ul>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>How many colors are extracted?</AccordionTrigger>
            <AccordionContent>
              We extract the top 8 most dominant colors from your image. These are the colors that appear most
              frequently and define the overall color scheme of your image.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Are my images stored or shared?</AccordionTrigger>
            <AccordionContent>
              No, all image processing happens entirely in your browser. Your images are never uploaded to our servers
              and are not stored or shared in any way.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>What image formats are supported?</AccordionTrigger>
            <AccordionContent>
              We support all common image formats including JPG, PNG, GIF, WebP, and more. For best results, use
              high-quality images with distinct colors.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  )
}
