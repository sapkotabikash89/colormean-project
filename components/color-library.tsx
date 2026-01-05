"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Search } from "lucide-react"
import { getContrastColor } from "@/lib/color-utils"

const colorCategories = {
  reds: [
    { name: "Indian Red", hex: "#CD5C5C" },
    { name: "Light Coral", hex: "#F08080" },
    { name: "Salmon", hex: "#FA8072" },
    { name: "Dark Salmon", hex: "#E9967A" },
    { name: "Light Salmon", hex: "#FFA07A" },
    { name: "Crimson", hex: "#DC143C" },
    { name: "Red", hex: "#FF0000" },
    { name: "Fire Brick", hex: "#B22222" },
    { name: "Dark Red", hex: "#8B0000" },
  ],
  pinks: [
    { name: "Pink", hex: "#FFC0CB" },
    { name: "Light Pink", hex: "#FFB6C1" },
    { name: "Hot Pink", hex: "#FF69B4" },
    { name: "Deep Pink", hex: "#FF1493" },
    { name: "Medium Violet Red", hex: "#C71585" },
    { name: "Pale Violet Red", hex: "#DB7093" },
  ],
  oranges: [
    { name: "Coral", hex: "#FF7F50" },
    { name: "Tomato", hex: "#FF6347" },
    { name: "Orange Red", hex: "#FF4500" },
    { name: "Dark Orange", hex: "#FF8C00" },
    { name: "Orange", hex: "#FFA500" },
  ],
  yellows: [
    { name: "Gold", hex: "#FFD700" },
    { name: "Yellow", hex: "#FFFF00" },
    { name: "Light Yellow", hex: "#FFFFE0" },
    { name: "Lemon Chiffon", hex: "#FFFACD" },
    { name: "Light Goldenrod Yellow", hex: "#FAFAD2" },
    { name: "Papaya Whip", hex: "#FFEFD5" },
    { name: "Moccasin", hex: "#FFE4B5" },
    { name: "Peach Puff", hex: "#FFDAB9" },
    { name: "Pale Goldenrod", hex: "#EEE8AA" },
    { name: "Khaki", hex: "#F0E68C" },
    { name: "Dark Khaki", hex: "#BDB76B" },
  ],
  purples: [
    { name: "Lavender", hex: "#E6E6FA" },
    { name: "Thistle", hex: "#D8BFD8" },
    { name: "Plum", hex: "#DDA0DD" },
    { name: "Violet", hex: "#EE82EE" },
    { name: "Orchid", hex: "#DA70D6" },
    { name: "Fuchsia", hex: "#FF00FF" },
    { name: "Magenta", hex: "#FF00FF" },
    { name: "Medium Orchid", hex: "#BA55D3" },
    { name: "Medium Purple", hex: "#9370DB" },
    { name: "Rebeccapurple", hex: "#663399" },
    { name: "Blue Violet", hex: "#8A2BE2" },
    { name: "Dark Violet", hex: "#9400D3" },
    { name: "Dark Orchid", hex: "#9932CC" },
    { name: "Dark Magenta", hex: "#8B008B" },
    { name: "Purple", hex: "#800080" },
    { name: "Indigo", hex: "#4B0082" },
  ],
  greens: [
    { name: "Green Yellow", hex: "#ADFF2F" },
    { name: "Chartreuse", hex: "#7FFF00" },
    { name: "Lawn Green", hex: "#7CFC00" },
    { name: "Lime", hex: "#00FF00" },
    { name: "Lime Green", hex: "#32CD32" },
    { name: "Pale Green", hex: "#98FB98" },
    { name: "Light Green", hex: "#90EE90" },
    { name: "Medium Spring Green", hex: "#00FA9A" },
    { name: "Spring Green", hex: "#00FF7F" },
    { name: "Medium Sea Green", hex: "#3CB371" },
    { name: "Sea Green", hex: "#2E8B57" },
    { name: "Forest Green", hex: "#228B22" },
    { name: "Green", hex: "#008000" },
    { name: "Dark Green", hex: "#006400" },
    { name: "Yellow Green", hex: "#9ACD32" },
    { name: "Olive Drab", hex: "#6B8E23" },
    { name: "Olive", hex: "#808000" },
    { name: "Dark Olive Green", hex: "#556B2F" },
  ],
  blues: [
    { name: "Aqua", hex: "#00FFFF" },
    { name: "Cyan", hex: "#00FFFF" },
    { name: "Light Cyan", hex: "#E0FFFF" },
    { name: "Pale Turquoise", hex: "#AFEEEE" },
    { name: "Aquamarine", hex: "#7FFFD4" },
    { name: "Turquoise", hex: "#40E0D0" },
    { name: "Medium Turquoise", hex: "#48D1CC" },
    { name: "Dark Turquoise", hex: "#00CED1" },
    { name: "Cadet Blue", hex: "#5F9EA0" },
    { name: "Steel Blue", hex: "#4682B4" },
    { name: "Light Steel Blue", hex: "#B0C4DE" },
    { name: "Powder Blue", hex: "#B0E0E6" },
    { name: "Light Blue", hex: "#ADD8E6" },
    { name: "Sky Blue", hex: "#87CEEB" },
    { name: "Light Sky Blue", hex: "#87CEFA" },
    { name: "Deep Sky Blue", hex: "#00BFFF" },
    { name: "Dodger Blue", hex: "#1E90FF" },
    { name: "Cornflower Blue", hex: "#6495ED" },
    { name: "Royal Blue", hex: "#4169E1" },
    { name: "Blue", hex: "#0000FF" },
    { name: "Medium Blue", hex: "#0000CD" },
    { name: "Dark Blue", hex: "#00008B" },
    { name: "Navy", hex: "#000080" },
    { name: "Midnight Blue", hex: "#191970" },
  ],
  browns: [
    { name: "Cornsilk", hex: "#FFF8DC" },
    { name: "Blanched Almond", hex: "#FFEBCD" },
    { name: "Bisque", hex: "#FFE4C4" },
    { name: "Navajo White", hex: "#FFDEAD" },
    { name: "Wheat", hex: "#F5DEB3" },
    { name: "Burly Wood", hex: "#DEB887" },
    { name: "Tan", hex: "#D2B48C" },
    { name: "Rosy Brown", hex: "#BC8F8F" },
    { name: "Sandy Brown", hex: "#F4A460" },
    { name: "Goldenrod", hex: "#DAA520" },
    { name: "Dark Goldenrod", hex: "#B8860B" },
    { name: "Peru", hex: "#CD853F" },
    { name: "Chocolate", hex: "#D2691E" },
    { name: "Saddle Brown", hex: "#8B4513" },
    { name: "Sienna", hex: "#A0522D" },
    { name: "Brown", hex: "#A52A2A" },
    { name: "Maroon", hex: "#800000" },
  ],
  grays: [
    { name: "White", hex: "#FFFFFF" },
    { name: "Snow", hex: "#FFFAFA" },
    { name: "Honeydew", hex: "#F0FFF0" },
    { name: "Mint Cream", hex: "#F5FFFA" },
    { name: "Azure", hex: "#F0FFFF" },
    { name: "Alice Blue", hex: "#F0F8FF" },
    { name: "Ghost White", hex: "#F8F8FF" },
    { name: "White Smoke", hex: "#F5F5F5" },
    { name: "Seashell", hex: "#FFF5EE" },
    { name: "Beige", hex: "#F5F5DC" },
    { name: "Old Lace", hex: "#FDF5E6" },
    { name: "Floral White", hex: "#FFFAF0" },
    { name: "Ivory", hex: "#FFFFF0" },
    { name: "Antique White", hex: "#FAEBD7" },
    { name: "Linen", hex: "#FAF0E6" },
    { name: "Lavender Blush", hex: "#FFF0F5" },
    { name: "Misty Rose", hex: "#FFE4E1" },
    { name: "Gainsboro", hex: "#DCDCDC" },
    { name: "Light Gray", hex: "#D3D3D3" },
    { name: "Silver", hex: "#C0C0C0" },
    { name: "Dark Gray", hex: "#A9A9A9" },
    { name: "Gray", hex: "#808080" },
    { name: "Dim Gray", hex: "#696969" },
    { name: "Light Slate Gray", hex: "#778899" },
    { name: "Slate Gray", hex: "#708090" },
    { name: "Dark Slate Gray", hex: "#2F4F4F" },
    { name: "Black", hex: "#000000" },
  ],
}

export function ColorLibrary({ initialQuery = "" }: { initialQuery?: string }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [activeCategory, setActiveCategory] = useState("all")
  const [previewResults, setPreviewResults] = useState<Array<{ name: string; hex: string }>>([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<number | null>(null)

  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current)
    }
    if (searchQuery.trim().length <= 2) {
      setPreviewResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    debounceRef.current = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/color-search?q=${encodeURIComponent(searchQuery.trim())}`)
        const data = await res.json()
        setPreviewResults(data.results || [])
      } catch {
        setPreviewResults([])
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
    }
  }, [searchQuery])

  const highlight = (name: string, q: string) => {
    const idx = name.toLowerCase().indexOf(q.toLowerCase())
    if (idx === -1) return name
    const before = name.slice(0, idx)
    const match = name.slice(idx, idx + q.length)
    const after = name.slice(idx + q.length)
    return (
      <>
        {before}
        <span className="bg-muted px-0.5 rounded-sm font-semibold">{match}</span>
        {after}
      </>
    )
  }

  const filteredColors = () => {
    const allColors = Object.entries(colorCategories).flatMap(([category, colors]) =>
      colors.map((color) => ({ ...color, category })),
    )

    if (!searchQuery) {
      if (activeCategory === "all") return allColors
      return allColors.filter((c) => c.category === activeCategory)
    }

    return allColors.filter(
      (color) =>
        color.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        color.hex.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  return (
    <div className="space-y-8">
      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Search Colors</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by color name or hex code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery.trim().length > 2 && (
              <div className="absolute left-0 right-0 mt-2 border-2 border-border rounded-md bg-background shadow-lg max-h-64 overflow-y-auto z-30">
                {loading ? (
                  <div className="p-4 text-sm text-muted-foreground">Searching…</div>
                ) : previewResults.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground">No matches</div>
                ) : (
                  <div className="divide-y">
                    {previewResults.map((c, i) => (
                      <Link key={`${c.hex}-${i}`} href={`/colors/${c.hex.replace("#", "").toLowerCase()}`} className="flex items-center gap-3 p-3 hover:bg-muted">
                        <div className="w-6 h-6 rounded border" style={{ backgroundColor: c.hex }} />
                        <div className="flex-1 text-sm">
                          {highlight(c.name, searchQuery.trim())}
                        </div>
                        <div className="font-mono text-xs">{c.hex}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="w-full flex-wrap h-auto gap-2 justify-start">
          <TabsTrigger value="all">All Colors</TabsTrigger>
          <TabsTrigger value="reds">Reds</TabsTrigger>
          <TabsTrigger value="pinks">Pinks</TabsTrigger>
          <TabsTrigger value="oranges">Oranges</TabsTrigger>
          <TabsTrigger value="yellows">Yellows</TabsTrigger>
          <TabsTrigger value="greens">Greens</TabsTrigger>
          <TabsTrigger value="blues">Blues</TabsTrigger>
          <TabsTrigger value="purples">Purples</TabsTrigger>
          <TabsTrigger value="browns">Browns</TabsTrigger>
          <TabsTrigger value="grays">Grays</TabsTrigger>
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredColors().map((color, index) => (
              <Link key={index} href={`/colors/${color.hex.replace("#", "").toLowerCase()}`}>
                <Card className="group hover:shadow-lg transition-all hover:scale-105 cursor-pointer overflow-hidden">
                  <div
                    className="aspect-square flex items-center justify-center p-4 text-center font-mono text-sm font-semibold"
                    style={{
                      backgroundColor: color.hex,
                      color: getContrastColor(color.hex),
                    }}
                  >
                    {color.hex}
                  </div>
                  <div className="p-3 bg-card">
                    <p className="text-sm font-medium text-center truncate">{color.name}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredColors().length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No colors found matching your search.</p>
          <Button variant="outline" className="mt-4 bg-transparent" onClick={() => setSearchQuery("")}>
            Clear Search
          </Button>
        </Card>
      )}
    </div>
  )
}
