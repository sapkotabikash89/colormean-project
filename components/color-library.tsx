"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Search } from "lucide-react"
import { getContrastColor } from "@/lib/color-utils"
import data from "@/lib/color-meaning.json"
import { hexToRgb, rgbToHsl } from "@/lib/color-utils"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination"

type ColorItem = { name: string; hex: string; category: string }

export function ColorLibrary({ initialQuery = "" }: { initialQuery?: string }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [activeCategory, setActiveCategory] = useState("all")
  const [previewResults, setPreviewResults] = useState<Array<{ name: string; hex: string }>>([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<number | null>(null)
  const [page, setPage] = useState(1)
  const perPage = 100
  const buildMobileList = (pages: number) => {
    if (pages <= 4) return Array.from({ length: pages }, (_, i) => i + 1)
    return [1, 2, "ellipsis", pages - 1, pages]
  }

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

  useEffect(() => {
    setPage(1)
  }, [searchQuery, activeCategory])

  const buildPageList = (pages: number, current: number) => {
    if (pages <= 8) return Array.from({ length: pages }, (_, i) => i + 1)
    if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", pages - 2, pages - 1, pages]
    if (current >= pages - 3) return [1, 2, 3, "ellipsis", pages - 4, pages - 3, pages - 2, pages - 1, pages]
    return [1, 2, "ellipsis", current - 1, current, current + 1, "ellipsis", pages - 2, pages - 1, pages]
  }

  const getCategory = (hex: string) => {
    const rgb = hexToRgb(hex)
    if (!rgb) return "grays"
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    if (hsl.s <= 12 || hsl.l <= 5 || hsl.l >= 95) return "grays"
    if ((hsl.h >= 0 && hsl.h < 12) || (hsl.h >= 348 && hsl.h <= 360)) return "reds"
    if (hsl.h >= 12 && hsl.h < 20 && hsl.s < 70 && hsl.l < 60) return "browns"
    if (hsl.h >= 20 && hsl.h < 45) {
      if (hsl.s < 70 && hsl.l < 60) return "browns"
      return "oranges"
    }
    if (hsl.h >= 45 && hsl.h < 75) return "yellows"
    if (hsl.h >= 75 && hsl.h < 165) return "greens"
    if (hsl.h >= 165 && hsl.h < 255) return "blues"
    if (hsl.h >= 255 && hsl.h < 320) return "purples"
    if (hsl.h >= 320 && hsl.h < 348) return "pinks"
    return "reds"
  }

  const allColors: ColorItem[] = (() => {
    const entries: ColorItem[] = []
    for (const key of Object.keys(data as any)) {
      const item = (data as any)[key]
      const hex = String(item?.hex || `#${key}`).toUpperCase()
      const name = String(item?.name || `#${key}`)
      const category = getCategory(hex)
      entries.push({ name, hex, category })
    }
    return entries
  })()

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
          {(() => {
            const total = filteredColors().length
            const pages = Math.ceil(total / perPage)
            if (pages <= 1) return null
            const desktop = buildPageList(pages, page)
            const mobile = buildMobileList(pages)
            return (
              <div className="mb-4">
                <Pagination>
                  <PaginationContent className="flex-nowrap sm:flex-wrap">
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setPage((p) => Math.max(1, p - 1))
                        }}
                      />
                    </PaginationItem>
                    <div className="hidden sm:flex">
                      {desktop.map((n, idx) =>
                        n === "ellipsis" ? (
                          <PaginationItem key={`e-${idx}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={`n-${n}`}>
                            <PaginationLink
                              href="#"
                              isActive={n === page}
                              className={n === page ? "bg-primary text-primary-foreground rounded-full" : ""}
                              onClick={(e) => {
                                e.preventDefault()
                                setPage(n as number)
                              }}
                            >
                              {n as number}
                            </PaginationLink>
                          </PaginationItem>
                        ),
                      )}
                    </div>
                    <div className="flex sm:hidden">
                      {mobile.map((n, idx) =>
                        n === "ellipsis" ? (
                          <PaginationItem key={`me-${idx}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={`mn-${idx}-${n}`}>
                            <PaginationLink
                              href="#"
                              isActive={(n as number) === page}
                              className={(n as number) === page ? "bg-primary text-primary-foreground rounded-full" : ""}
                              onClick={(e) => {
                                e.preventDefault()
                                setPage(n as number)
                              }}
                            >
                              {n as number}
                            </PaginationLink>
                          </PaginationItem>
                        ),
                      )}
                    </div>
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setPage((p) => Math.min(pages, p + 1))
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )
          })()}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredColors()
              .slice((page - 1) * perPage, page * perPage)
              .map((color, index) => (
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
          {(() => {
            const total = filteredColors().length
            const pages = Math.ceil(total / perPage)
            if (pages <= 1) return null
            const nums = buildPageList(pages, page)
            const mobile = buildMobileList(pages)
            return (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent className="flex-nowrap sm:flex-wrap">
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setPage((p) => Math.max(1, p - 1))
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }}
                      />
                    </PaginationItem>
                    <div className="hidden sm:flex">
                      {nums.map((n, idx) =>
                        n === "ellipsis" ? (
                          <PaginationItem key={`b-e-${idx}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={`b-n-${n as number}`}>
                            <PaginationLink
                              href="#"
                              isActive={(n as number) === page}
                              className={(n as number) === page ? "bg-primary text-primary-foreground rounded-full" : ""}
                              onClick={(e) => {
                                e.preventDefault()
                                setPage(n as number)
                                window.scrollTo({ top: 0, behavior: "smooth" })
                              }}
                            >
                              {n as number}
                            </PaginationLink>
                          </PaginationItem>
                        ),
                      )}
                    </div>
                    <div className="flex sm:hidden">
                      {mobile.map((n, idx) =>
                        n === "ellipsis" ? (
                          <PaginationItem key={`b-me-${idx}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={`b-mn-${idx}-${n}`}>
                            <PaginationLink
                              href="#"
                              isActive={(n as number) === page}
                              className={(n as number) === page ? "bg-primary text-primary-foreground rounded-full" : ""}
                              onClick={(e) => {
                                e.preventDefault()
                                setPage(n as number)
                                window.scrollTo({ top: 0, behavior: "smooth" })
                              }}
                            >
                              {n as number}
                            </PaginationLink>
                          </PaginationItem>
                        ),
                      )}
                    </div>
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setPage((p) => Math.min(pages, p + 1))
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )
          })()}
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
