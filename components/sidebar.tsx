"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getColorHarmony } from "@/lib/color-utils"
import { Download, Share } from "lucide-react"
import { toast } from "sonner"
import { ColorExportDialog } from "@/components/color-export-dialog"
import { ColorCombination } from "@/components/color-combination"

interface ColorSidebarProps {
  color: string
}

export function ColorSidebar({ color: initialColor }: ColorSidebarProps) {
  const [color, setColor] = useState(initialColor)
  const [harmonyType, setHarmonyType] = useState("analogous")
  const [exportOpen, setExportOpen] = useState(false)
  const [latestPosts, setLatestPosts] = useState<Array<{ title: string; uri: string }>>([])

  useEffect(() => {
    const handleColorUpdate = (e: CustomEvent) => {
      if (e.detail?.color) {
        setColor(e.detail.color)
      }
    }

    window.addEventListener("colorUpdate", handleColorUpdate as EventListener)
    return () => window.removeEventListener("colorUpdate", handleColorUpdate as EventListener)
  }, [])

  const harmonies = getColorHarmony(color, harmonyType)

  const downloadSwatch = (hex: string) => {
    const canvas = document.createElement("canvas")
    canvas.width = 200
    canvas.height = 200
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.fillStyle = hex
      ctx.fillRect(0, 0, 200, 200)
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `${hex.replace("#", "")}.png`
          a.click()
          URL.revokeObjectURL(url)
          toast.success("Swatch downloaded!")
        }
      })
    }
  }

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch("https://cms.colormean.com/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query LatestPosts {
                posts(first: 4, where: { orderby: { field: DATE, order: DESC } }) {
                  nodes { title uri }
                }
              }
            `,
          }),
        })
        const json = await res.json()
        const nodes = json?.data?.posts?.nodes || []
        setLatestPosts(nodes.filter((n: any) => !!n?.title && !!n?.uri))
      } catch {
        setLatestPosts([])
      }
    }
    fetchLatest()
  }, [])

  return (
    <aside className="w-full lg:w-96 space-y-6 sticky top-24 self-start">
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Color Schemes</h3>
          <Button
            size="sm"
            variant="ghost"
            className="gap-2"
            onClick={() => setExportOpen(true)}
          >
            <Share className="w-4 h-4" />
            Export
          </Button>
        </div>

        <Select value={harmonyType} onValueChange={setHarmonyType}>
          <SelectTrigger aria-label="Select harmony type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="analogous">Analogous</SelectItem>
            <SelectItem value="complementary">Complementary</SelectItem>
            <SelectItem value="split-complementary">Split Complementary</SelectItem>
            <SelectItem value="triadic">Triadic</SelectItem>
            <SelectItem value="tetradic">Tetradic</SelectItem>
            <SelectItem value="square">Square</SelectItem>
            <SelectItem value="double-split-complementary">Double Split Complementary</SelectItem>
            <SelectItem value="monochromatic">Monochromatic</SelectItem>
          </SelectContent>
        </Select>

        <ColorCombination colors={harmonies} baseHex={color} height={72} />
      </div>

      {latestPosts.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-lg">Latest Posts</h3>
          <ul className="space-y-3">
            {latestPosts.map((p, idx) => {
              const numBg = color
              const numColor = getContrastColor(numBg)
              return (
                <li key={`${p.uri}-${idx}`} className="flex items-start gap-3">
                  <span
                    className="inline-flex items-center justify-center rounded-full shrink-0"
                    style={{
                      width: "28px",
                      height: "28px",
                      backgroundColor: numBg,
                      color: numColor,
                      fontWeight: 700,
                    }}
                  >
                    {idx + 1}
                  </span>
                  <Link href={p.uri} className="hover:underline whitespace-normal break-words">
                    {p.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}
      <ColorExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        title={`Export ${harmonyType}`}
        colors={harmonies}
        baseHex={color}
        filenameLabel={harmonyType}
      />
    </aside>
  )
}

function getContrastColor(hex: string): string {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? "#000000" : "#FFFFFF"
}
