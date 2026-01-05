"use client"

import { useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/copy-button"
import { hexToRgb, rgbToHsl, rgbToLab } from "@/lib/color-utils"
import { ColorCombination } from "@/components/color-combination"

interface ColorExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  colors: string[]
  baseHex?: string
  filenameLabel?: string
}

export function ColorExportDialog({ open, onOpenChange, title = "Export Colors", colors, baseHex, filenameLabel }: ColorExportDialogProps) {
  const formatted = useMemo(() => {
    return colors.map((hex) => {
      const rgb = hexToRgb(hex)
      const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null
      const lab = rgb ? rgbToLab(rgb.r, rgb.g, rgb.b) : null
      const rgbStr = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : ""
      const hslStr = hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : ""
      const labStr = lab ? `lab(${lab.l}, ${lab.a}, ${lab.b})` : ""
      const twStr = `bg-[${hex.toUpperCase()}]`
      return { hex: hex.toUpperCase(), rgbStr, hslStr, labStr, twStr }
    })
  }, [colors])

  const copyCombined = (type: "hex" | "rgb" | "hsl" | "lab" | "tw") => {
    const value = formatted
      .map((c) => {
        switch (type) {
          case "hex":
            return c.hex
          case "rgb":
            return c.rgbStr
          case "hsl":
            return c.hslStr
          case "lab":
            return c.labStr
          case "tw":
            return c.twStr
        }
      })
      .filter(Boolean)
      .join("\n")
    navigator.clipboard.writeText(value)
  }

  const downloadCombinedImage = () => {
    const canvas = document.createElement("canvas")
    canvas.width = 1920
    canvas.height = 1080
    const ctx = canvas.getContext("2d")
    if (!ctx || colors.length === 0) return
    const stripeW = Math.floor(canvas.width / colors.length)
    colors.forEach((hex, i) => {
      ctx.fillStyle = hex
      ctx.fillRect(i * stripeW, 0, stripeW, canvas.height)
      const x = i * stripeW + stripeW / 2
      const textColor = getContrast(hex)
      ctx.fillStyle = textColor
      ctx.font = "bold 48px system-ui, -apple-system, Segoe UI, Roboto"
      ctx.textAlign = "center"
      ctx.fillText(hex.toUpperCase(), x, canvas.height / 2 - 20)
    })
    ctx.fillStyle = "rgba(0,0,0,0.2)"
    ctx.font = "600 36px system-ui, -apple-system, Segoe UI, Roboto"
    ctx.textAlign = "right"
    const watermarkColor = getContrast(colors[colors.length - 1] || "#000000")
    ctx.fillStyle = watermarkColor
    ctx.fillText("ColorMean", canvas.width - 24, canvas.height - 24)
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        const cleanBase = (baseHex || "").replace("#", "").toLowerCase()
        const label = (filenameLabel || "combination").toLowerCase().replace(/\s+/g, "-")
        a.download = cleanBase ? `${cleanBase}-${label}-combination.png` : `${label}-combination.png`
        a.click()
        URL.revokeObjectURL(url)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <ColorCombination colors={colors} baseHex={baseHex} height={72} />

          <div className="grid grid-cols-2 gap-2">
            <Button onClick={downloadCombinedImage} className="gap-2">
              Download Swatches
            </Button>
            <Button variant="outline" className="bg-transparent" onClick={() => copyCombined("hex")}>Copy all HEX</Button>
            <Button variant="outline" className="bg-transparent" onClick={() => copyCombined("rgb")}>Copy all RGB</Button>
            <Button variant="outline" className="bg-transparent" onClick={() => copyCombined("hsl")}>Copy all HSL</Button>
            <Button variant="outline" className="bg-transparent" onClick={() => copyCombined("lab")}>Copy all LAB</Button>
            <Button variant="outline" className="bg-transparent" onClick={() => copyCombined("tw")}>Copy all Tailwind</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function getContrast(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return "#000000"
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
  return brightness > 128 ? "#000000" : "#FFFFFF"
}
