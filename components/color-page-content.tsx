"use client"

import Image from "next/image"
import { Select } from "@/components/ui/select"

import { SelectItem, SelectContent, SelectValue, SelectTrigger } from "@/components/ui/select"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  hexToRgb,
  rgbToHsl,
  rgbToCmyk,
  rgbToHsv,
  rgbToLab,
  rgbToXyz,
  rgbToYxy,
  rgbToHunterLab,
  getColorHarmony,
  generateTints,
  generateShades,
  generateTones,
  simulateColorBlindness,
  getContrastRatio,
  getRelatedColors,
  getContrastColor, // Declare the variable here
  getColorMeaning,
  getAdjacentColors,
  getHueFamily,
} from "@/lib/color-utils"
import { CustomColorPicker } from "@/components/custom-color-picker"
import { ColorCombination } from "@/components/color-combination"
import { ColorSwatch as Swatch } from "@/components/color-swatch"
import { Share, Heart, Check, Copy } from "lucide-react"
import { ColorExportDialog } from "@/components/color-export-dialog"
import { CopyButton } from "@/components/copy-button"
import { ShareButtons } from "@/components/share-buttons"
import { ColorImage } from "@/components/color-image"
import { getGumletImageUrl } from "@/lib/gumlet-utils"
import { getColorPageLink } from "@/lib/color-linking-utils"

interface ColorPageContentProps {
  hex: string
  mode?: "full" | "sectionsOnly"
  faqs?: { question: string; answer: string }[]
  name?: string
  colorExistsInDb?: boolean
  onColorChange?: (color: string) => void
}

export function ColorPageContent({ hex, mode = "full", faqs, name, colorExistsInDb, onColorChange }: ColorPageContentProps) {
  const router = useRouter()
  const label = name ? `${name} (${hex})` : hex
  const [selectedHarmony, setSelectedHarmony] = useState("analogous")
  const [colorBlindnessType, setColorBlindnessType] = useState("protanopia")
  const [foreground, setForeground] = useState("#FFFFFF")
  const [background, setBackground] = useState(hex)
  const [showForegroundPicker, setShowForegroundPicker] = useState(false)
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false)
  const [tempForeground, setTempForeground] = useState(foreground)
  const [tempBackground, setTempBackground] = useState(background)
  const [contrastForeground, setContrastForeground] = useState(foreground)
  const [contrastBackground, setContrastBackground] = useState(background)
  const [exportOpen, setExportOpen] = useState(false)
  const [exportColors, setExportColors] = useState<string[]>([])
  const [exportTitle, setExportTitle] = useState("")
  const [exportLabel, setExportLabel] = useState("")
  const [loveCount, setLoveCount] = useState(9)
  const [liked, setLiked] = useState(false)
  const [variationsTab, setVariationsTab] = useState("tints")
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setImageError(false)
  }, [hex])

  useEffect(() => {
    // Sync global components (Header, Sidebar) with current page color
    window.dispatchEvent(new CustomEvent("colorUpdate", { detail: { color: hex } }))
    
    // Fetch global love count
    const fetchLoveCount = async () => {
      try {
        const res = await fetch(`/api/love?hex=${hex.replace("#", "")}`)
        if (res.ok) {
          const data = await res.json()
          setLoveCount(data.count)
        }
      } catch (error) {
        console.error("Failed to fetch love count", error)
      }
    }
    
    fetchLoveCount()

    const key = `love:${hex.toUpperCase()}`
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        // setLoveCount(parsed.count || 9) // We prefer server count if available
        setLiked(!!parsed.liked)
      } catch {}
    } else {
      // setLoveCount(9) // Default set by server fetch or initial state
      setLiked(false)
    }
  }, [hex])
  
  // Sync background color with current hex when it changes
  useEffect(() => {
    if (onColorChange) {
      // When onColorChange is provided, this is the HTML Color Picker page
      // Update background to match current hex
      setBackground(hex)
      setContrastBackground(hex)
    }
  }, [hex, onColorChange])

  const rgb = hexToRgb(hex)
  const { prev, next } = getAdjacentColors(hex)
  if (!rgb) return null

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b)
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
  const xyz = rgbToXyz(rgb.r, rgb.g, rgb.b)
  const yxy = rgbToYxy(rgb.r, rgb.g, rgb.b)
  const lab = rgbToLab(rgb.r, rgb.g, rgb.b)
  const hunter = rgbToHunterLab(rgb.r, rgb.g, rgb.b)
  const colorMeaning = getColorMeaning(hex)
  const hueFamily = getHueFamily
  const tone = hsl.l < 30 ? "Dark" : hsl.l > 70 ? "Light" : "Medium"
  const family = hueFamily(hsl.h)
  const categoryName = `${tone} ${family.name}`
  const complementary = getColorHarmony(hex, "complementary")[1]
  
  const downloadMainSwatch = () => {
    const canvas = document.createElement("canvas")
    canvas.width = 1920
    canvas.height = 1080
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.fillStyle = hex
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    const textColor = getContrastColor(hex)
    ctx.fillStyle = textColor
    ctx.font = "bold 120px system-ui, -apple-system, Segoe UI, Roboto"
    ctx.textAlign = "center"
    ctx.fillText(hex.toUpperCase(), canvas.width / 2, canvas.height / 2 - 40)
    ctx.font = "600 72px system-ui, -apple-system, Segoe UI, Roboto"
    ctx.fillText(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, canvas.width / 2, canvas.height / 2 + 80)
    ctx.font = "600 64px system-ui, -apple-system, Segoe UI, Roboto"
    ctx.textAlign = "right"
    ctx.fillText("ColorMean", canvas.width - 40, canvas.height - 40)
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        const cleanHex = hex.replace("#", "").toLowerCase()
        a.download = `${cleanHex}-color-information-meaning.png`
        a.click()
        URL.revokeObjectURL(url)
      }
    })
  }

  const toggleLove = async () => {
    const key = `love:${hex.toUpperCase()}`
    const nextLiked = !liked
    setLiked(nextLiked)
    
    // Optimistic update
    setLoveCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)))

    try {
      // Update server
      await fetch("/api/love", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hex: hex.replace("#", ""), increment: nextLiked }),
      })
      
      // Update local storage for persistence of "liked" state
      const payload = { liked: nextLiked }
      if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(payload))
    } catch (error) {
      console.error("Failed to update love count", error)
    }
  }

  const swapColors = () => {
    const temp = foreground
    setForeground(background)
    setBackground(temp)
    setContrastForeground(background)
    setContrastBackground(temp)
  }

  const harmonies = {
    analogous: { name: "Analogous", colors: getColorHarmony(hex, "analogous") },
    complementary: { name: "Complementary", colors: getColorHarmony(hex, "complementary") },
    "split-complementary": { name: "Split Complementary", colors: getColorHarmony(hex, "split-complementary") },
    triadic: { name: "Triadic", colors: getColorHarmony(hex, "triadic") },
    tetradic: { name: "Tetradic", colors: getColorHarmony(hex, "tetradic") },
    square: { name: "Square", colors: getColorHarmony(hex, "square") },
    "double-split-complementary": { name: "Double Split", colors: getColorHarmony(hex, "double-split-complementary") },
    monochromatic: { name: "Monochromatic", colors: getColorHarmony(hex, "monochromatic") },
  }

  const harmonyDescriptions: Record<string, string> = {
    analogous: "Colors adjacent on the color wheel (30° apart)",
    complementary: "Colors opposite on the color wheel (180° apart)",
    triadic: "Three colors evenly spaced (120° apart)",
    tetradic: "Four colors forming a rectangle on the wheel",
    square: "Four colors evenly spaced (90° apart)",
    monochromatic: "Variations of a single hue",
    "split-complementary": "Three colors using one base hue and the two hues beside its opposite",
    "double-split-complementary": "Four colors formed from two base hues and the colors next to their opposites",
  }

  const tints = generateTints(hex, 10)
  const shades = generateShades(hex, 10)
  const tones = generateTones(hex, 10)
  const relatedColors = getRelatedColors(hex, 9)
  // const palettes = generateColorPalette(hex)

  const contrastRatio = getContrastRatio(foreground, background)

  const navigateToColor = (color: string) => {
    // Use centralized linking logic for safe color navigation
    router.push(getColorPageLink(color))
  }

  const defaultOpen = mode !== "sectionsOnly"
  const [openConversion, setOpenConversion] = useState(defaultOpen)
  const [openBars, setOpenBars] = useState(defaultOpen)
  const [openVariations, setOpenVariations] = useState(defaultOpen)
  const [openHarmonies, setOpenHarmonies] = useState(defaultOpen)
  const [openContrast, setOpenContrast] = useState(defaultOpen)
  const [openBlindness, setOpenBlindness] = useState(defaultOpen)
  const [openCss, setOpenCss] = useState(defaultOpen)
  const [openRelated, setOpenRelated] = useState(defaultOpen)

  return (
    <div className="space-y-8">
      {mode !== "sectionsOnly" ? (
        <Card id="information" className="p-0 overflow-hidden space-y-0 scroll-mt-24">
          <div className="bg-muted-foreground/10 border-l-[10px] py-5 px-4" style={{ borderLeftColor: hex }}>
            <h2 className="text-3xl font-bold m-0 leading-tight">{label} Color Information</h2>
          </div>
          <div className="px-4 sm:px-6 py-2">
            <p className="text-base leading-relaxed">
              {label} RGB value is ({rgb.r}, {rgb.g}, {rgb.b}). The hex color red value is {rgb.r}, green is {rgb.g}, and
              blue is {rgb.b}. Its HSL format shows a hue of {hsl.h}°, saturation of {hsl.s} percent, and lightness of{}
              {hsl.l} percent. The CMYK process values are {cmyk.c} percent, {cmyk.m} percent, {cmyk.y} percent, {cmyk.k}{}
              percent.
            </p>
          </div>
        </Card>
      ) : null}
  
      {mode !== "sectionsOnly" ? (
        <Card className="p-4 sm:p-6 space-y-4">
          <div className="w-full flex justify-center">
            <div className="relative w-full max-w-xl aspect-[1200/630] rounded-lg border-2 border-border overflow-hidden">
              {/* Try to render Gumlet CDN image first, fall back to CSS swatch */}
              {(() => {
                const gumletUrl = getGumletImageUrl(hex);
                
                if (gumletUrl && !imageError) {
                  // Has pre-generated image from Gumlet CDN
                  return (
                    <a
                      href={gumletUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-full"
                    >
                      <ColorImage
                        hex={hex}
                        alt={`${label} color swatch`}
                        priority={true}
                        className="object-cover w-full h-full"
                      />
                    </a>
                  );
                }
                
                // Fall back to CSS-generated swatch
                return (
                  <div
                    className="w-full h-full relative"
                    style={{ backgroundColor: hex, color: getContrastColor(hex) }}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      {name ? (
                        <div className="font-mono text-base sm:text-lg font-semibold mb-1">{name}</div>
                      ) : null}
                      <div className="font-mono text-xl font-bold">{hex.toUpperCase()}</div>
                      <div className="font-mono text-sm">{`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}</div>
                    </div>
                    <div className="absolute bottom-2 right-3 font-semibold text-xs opacity-80">ColorMean</div>
                  </div>
                );
              })()}
              <button
                onClick={toggleLove}
                className="absolute left-2 bottom-2 inline-flex items-center gap-1 px-2 py-1 rounded bg-black/40 text-white z-10"
                style={{ color: liked ? "#ef4444" : undefined }}
              >
                <Heart className="w-4 h-4" />
                <span className="text-xs font-semibold">{loveCount}</span>
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="outline" className="bg-transparent" onClick={downloadMainSwatch}>
              Download image (1920x1080)
            </Button>
            <ShareButtons title={`Color ${label}`} />
          </div>
        </Card>
      ) : null}

      {/* Color Meaning */}
      {mode !== "sectionsOnly" ? (
        <Card id="meaning" className="p-0 overflow-hidden space-y-0 scroll-mt-24">
          <div className="bg-muted-foreground/10 border-l-[10px] py-5 px-4" style={{ borderLeftColor: hex }}>
            <h2 className="text-3xl font-bold m-0 leading-tight">{label} Color Meaning</h2>
          </div>
          <div className="px-4 sm:px-6 py-2">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="whitespace-pre-line leading-relaxed">{colorMeaning}</p>
            </div>
          </div>
        </Card>
      ) : null}

      {/* Color Conversion Table */}
      <Card id="conversion" className="p-0 overflow-hidden space-y-0 scroll-mt-24">
        <div 
          onClick={() => setOpenConversion((v) => !v)} 
          className="bg-muted-foreground/10 border-l-[10px] py-5 px-4 cursor-pointer hover:bg-muted/50 transition-colors" 
          style={{ borderLeftColor: hex }}
        >
          <h2 className={`text-3xl font-bold m-0 leading-tight ${openConversion ? "" : "underline"}`}>Color Conversion</h2>
        </div>
        {openConversion ? (
          <div className="px-4 sm:px-6 py-2 space-y-4">
            <p className="text-muted-foreground">
              Convert {label} across different color models and formats. These conversions help designers work seamlessly
              between digital and print media, ensuring this color maintains its intended appearance across RGB screens,
              CMYK printers, and HSL color manipulations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorCodeItem label="HEX" value={hex} />
              <ColorCodeItem label="RGB" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
              <ColorCodeItem label="HSL" value={`hsl(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)`} />
              <ColorCodeItem label="CMYK" value={`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`} />
              <ColorCodeItem label="HSV" value={`hsv(${hsv.h}°, ${hsv.s}%, ${hsv.v}%)`} />
              <ColorCodeItem label="XYZ" value={`${xyz.x.toFixed(4)} ${xyz.y.toFixed(4)} ${xyz.z.toFixed(4)}`} />
              <ColorCodeItem label="Yxy" value={`${yxy.Y.toFixed(4)} ${yxy.x.toFixed(4)} ${yxy.y.toFixed(4)}`} />
              <ColorCodeItem label="Hunter Lab" value={`${hunter.L.toFixed(4)} ${hunter.a.toFixed(4)} ${hunter.b.toFixed(4)}`} />
              <ColorCodeItem label="CIE-Lab" value={`${lab.l.toFixed(4)} ${lab.a.toFixed(4)} ${lab.b.toFixed(4)}`} />
            </div>
          </div>
        ) : null}
      </Card>

      {/* RGB & CMYK Percentage Bars */}
      <Card className="p-0 overflow-hidden space-y-0">
        <div 
          onClick={() => setOpenBars((v) => !v)} 
          className="bg-muted-foreground/10 border-l-[10px] py-5 px-4 cursor-pointer hover:bg-muted/50 transition-colors" 
          style={{ borderLeftColor: hex }}
        >
          <h2 className={`text-3xl font-bold m-0 leading-tight ${openBars ? "" : "underline"}`}>RGB Values & CMYK Values</h2>
        </div>
        {openBars ? (
          <div className="px-4 sm:px-6 py-2 space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-2xl">RGB Values</h3>
              <ColorBar label="Red" value={rgb.r} max={255} color="#FF0000" />
              <ColorBar label="Green" value={rgb.g} max={255} color="#00FF00" />
              <ColorBar label="Blue" value={rgb.b} max={255} color="#0000FF" />
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-2xl">CMYK Values</h3>
              <ColorBar label="Cyan" value={cmyk.c} max={100} color="#00FFFF" />
              <ColorBar label="Magenta" value={cmyk.m} max={100} color="#FF00FF" />
              <ColorBar label="Yellow" value={cmyk.y} max={100} color="#FFFF00" />
              <ColorBar label="Key (Black)" value={cmyk.k} max={100} color="#000000" />
            </div>
          </div>
        ) : null}
      </Card>

      <Card id="variations" className="p-0 overflow-hidden space-y-0 scroll-mt-24">
        <div 
          onClick={() => setOpenVariations((v) => !v)} 
          className="bg-muted-foreground/10 border-l-[10px] py-5 px-4 cursor-pointer hover:bg-muted/50 transition-colors" 
          style={{ borderLeftColor: hex }}
        >
          <h2 className={`text-3xl font-bold m-0 leading-tight ${openVariations ? "" : "underline"}`}>Color Variations</h2>
        </div>
        {openVariations ? (
          <div className="px-4 sm:px-6 py-2 space-y-4">
            <p className="text-muted-foreground">
              {label} harmonies come to life through carefully balanced shades, tints, and tones, giving this color depth and
              flexibility across light and dark variations. Shades add richness, tints bring an airy softness, and tones
              soften intensity, making it easy to pair in clean, modern palettes.
            </p>
            <div className="w-full flex justify-end">
              <Button
                size="sm"
                variant="ghost"
                className="gap-2"
                onClick={() => {
                  const current = variationsTab
                  const colors = current === "tints" ? tints : current === "shades" ? shades : tones
                  const title = current === "tints" ? "Export Tints" : current === "shades" ? "Export Shades" : "Export Tones"
                  setExportColors(colors)
                  setExportTitle(title)
                  setExportLabel(current)
                  setExportOpen(true)
                }}
              >
                <Share className="w-4 h-4" />
                Export
              </Button>
            </div>
            <Tabs value={variationsTab} onValueChange={setVariationsTab} className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="tints">Tints</TabsTrigger>
                <TabsTrigger value="shades">Shades</TabsTrigger>
                <TabsTrigger value="tones">Tones</TabsTrigger>
              </TabsList>
              <TabsContent value="tints" className="mt-4">
                <div className="flex justify-center">
                  <div className="grid w-fit grid-cols-5 xl:grid-cols-10 gap-1">
                    {tints.slice(0, 10).map((c, idx) => (
                      <Swatch key={`${c}-${idx}`} color={c} showHex onClick={onColorChange ? () => onColorChange(c) : undefined} />
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="shades" className="mt-4">
                <div className="flex justify-center">
                  <div className="grid w-fit grid-cols-5 xl:grid-cols-10 gap-1">
                    {shades.slice(0, 10).map((c, idx) => (
                      <Swatch key={`${c}-${idx}`} color={c} showHex onClick={onColorChange ? () => onColorChange(c) : undefined} />
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="tones" className="mt-4">
                <div className="flex justify-center">
                  <div className="grid w-fit grid-cols-5 xl:grid-cols-10 gap-1">
                    {tones.slice(0, 10).map((c, idx) => (
                      <Swatch key={`${c}-${idx}`} color={c} showHex onClick={onColorChange ? () => onColorChange(c) : undefined} />
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : null}
      </Card>

      {/* Color Harmonies */}
      <Card id="harmonies" className="p-0 overflow-hidden space-y-0 scroll-mt-24">
        <div 
          onClick={() => setOpenHarmonies((v) => !v)} 
          className="bg-muted-foreground/10 border-l-[10px] py-5 px-4 cursor-pointer hover:bg-muted/50 transition-colors" 
          style={{ borderLeftColor: hex }}
        >
          <h2 className={`text-3xl font-bold m-0 leading-tight ${openHarmonies ? "" : "underline"}`}>Color Harmonies</h2>
        </div>
        {openHarmonies ? (
          <div className="px-4 sm:px-6 py-2 space-y-6">
            <p className="text-muted-foreground">
              {label} harmonies create beautiful relationships with other colors based on their position on the color wheel.
              Each harmony type offers unique design possibilities, enabling cohesive and visually appealing color schemes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(harmonies).map(([type, harmony]) => (
                <div key={type} className="space-y-3 p-5 border-2 border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-2xl">{harmony.name}</h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-2"
                      onClick={() => {
                        setExportColors(harmony.colors)
                        setExportTitle(`Export ${harmony.name}`)
                        setExportLabel(type)
                        setExportOpen(true)
                      }}
                    >
                      <Share className="w-4 h-4" />
                      Export
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{harmonyDescriptions[type]}</p>
                  <ColorCombination colors={harmony.colors} baseHex={hex} onColorChange={onColorChange} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </Card>

      {/* Contrast Checker */}
      {mode !== "sectionsOnly" ? (
        <Card id="contrast-checker" className="p-0 overflow-hidden space-y-0 scroll-mt-24">
          <div 
            className="bg-muted-foreground/10 border-l-[10px] py-5 px-4 cursor-pointer"
            style={{ borderLeftColor: hex }}
            onClick={() => setOpenContrast((v) => !v)}
          >
            <h2 className="text-3xl font-bold m-0 leading-tight">Contrast Checker</h2>
          </div>
          {openContrast ? (
            <div className="px-6 py-2 space-y-4">
              <p className="text-muted-foreground">
                (WCAG 2.1) Test {label} for accessibility compliance against white and black backgrounds. Proper contrast
                ensures this color remains readable and usable for all audiences, meeting WCAG 2.1 standards for both normal
                and large text applications.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Foreground:</label>
                  <button
                    onClick={() => {
                      setTempForeground(foreground)
                      setShowForegroundPicker(true)
                    }}
                    className="w-16 h-10 rounded-md border-2 border-border cursor-pointer"
                    style={{ backgroundColor: foreground }}
                  />
                  <span className="font-mono text-sm">{foreground}</span>
                </div>
                <Button variant="outline" size="sm" onClick={swapColors} className="gap-2 bg-transparent">
                  Swap
                </Button>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Background:</label>
                  <button
                    onClick={() => {
                      setTempBackground(background)
                      setShowBackgroundPicker(true)
                    }}
                    className="w-16 h-10 rounded-md border-2 border-border cursor-pointer"
                    style={{ backgroundColor: background }}
                  />
                  <span className="font-mono text-sm">{background}</span>
                </div>
              </div>
              <div className="p-8 rounded-lg" style={{ backgroundColor: background, color: foreground }}>
                <p className="text-3xl font-bold mb-2">Sample Text</p>
                <p className="text-lg">This is how your text will look with these colors.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ContrastResult label="Large Text (18pt+)" ratio={contrastRatio} aaThreshold={3} aaaThreshold={4.5} />
                <ContrastResult label="Normal Text" ratio={contrastRatio} aaThreshold={4.5} aaaThreshold={7} />
                <ContrastResult label="UI Components" ratio={contrastRatio} aaThreshold={3} aaaThreshold={4.5} />
              </div>
            </div>
          ) : null}
        </Card>
      ) : null}

      {/* Color Blindness Simulator */}
      {mode !== "sectionsOnly" ? (
        <Card id="blindness-simulator" className="p-0 overflow-hidden space-y-0 scroll-mt-24">
          <div 
            className="bg-muted-foreground/10 border-l-[10px] py-5 px-4 cursor-pointer"
            style={{ borderLeftColor: hex }}
            onClick={() => setOpenBlindness((v) => !v)}
          >
            <h2 className="text-3xl font-bold m-0 leading-tight">Color Blindness Simulator</h2>
          </div>
          {openBlindness ? (
            <div className="px-6 py-2 space-y-4">
              <p className="text-muted-foreground">
                See how {hex} appears to people with different types of color vision deficiencies. These simulations help
                create more inclusive designs that consider how this color is perceived across various visual abilities.
              </p>
              <Select value={colorBlindnessType} onValueChange={setColorBlindnessType}>
                <SelectTrigger className="w-full md:w-64" aria-label="Select color blindness type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="protanopia">Protanopia (Red-Blind)</SelectItem>
                  <SelectItem value="protanomaly">Protanomaly (Red-Weak)</SelectItem>
                  <SelectItem value="deuteranopia">Deuteranopia (Green-Blind)</SelectItem>
                  <SelectItem value="deuteranomaly">Deuteranomaly (Green-Weak)</SelectItem>
                  <SelectItem value="tritanopia">Tritanopia (Blue-Blind)</SelectItem>
                  <SelectItem value="tritanomaly">Tritanomaly (Blue-Weak)</SelectItem>
                  <SelectItem value="achromatopsia">Achromatopsia (Total Color Blind)</SelectItem>
                  <SelectItem value="achromatomaly">Achromatomaly (Partial Color Blind)</SelectItem>
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-center">Normal Vision</h4>
                  <div
                    className="w-full h-32 rounded-lg border-2 border-border flex items-center justify-center font-mono"
                    style={{ backgroundColor: hex, color: getContrastColor(hex) }}
                  >
                    {label}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-center capitalize">
                    {colorBlindnessType.replace(/([A-Z])/g, " $1").trim()}
                  </h4>
                  <div
                    className="w-full h-32 rounded-lg border-2 border-border flex items-center justify-center font-mono"
                    style={{
                      backgroundColor: simulateColorBlindness(hex, colorBlindnessType),
                      color: getContrastColor(simulateColorBlindness(hex, colorBlindnessType)),
                    }}
                  >
                    {simulateColorBlindness(hex, colorBlindnessType)}
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Note: These simulations are approximations. Actual color vision deficiency varies by individual.
              </p>
            </div>
          ) : null}
        </Card>
      ) : null}

      {/* CSS Examples */}
      <Card id="css-examples" className="p-0 overflow-hidden space-y-0 scroll-mt-24">
        <div 
          className="bg-muted-foreground/10 border-l-[10px] py-5 px-4 cursor-pointer"
          style={{ borderLeftColor: hex }}
          onClick={() => setOpenCss((v) => !v)}
        >
          <h2 className="text-3xl font-bold m-0 leading-tight">CSS Examples</h2>
        </div>
        {openCss ? (
          <div className="px-6 py-2 space-y-4">
            <CSSExample
              title="Background Color"
              code={`background-color: ${hex};`}
              preview={<div className="w-full h-16 rounded-md" style={{ backgroundColor: hex }} />}
            />
            <CSSExample
              title="Text Color"
              code={`color: ${hex};`}
              preview={
                <p className="text-2xl font-bold" style={{ color: hex }}>
                  Sample Text
                </p>
              }
            />
            <CSSExample
              title="Border Color"
              code={`border: 2px solid ${hex};`}
              preview={<div className="w-full h-16 rounded-md border-2" style={{ borderColor: hex }} />}
            />
            <CSSExample
              title="Box Shadow"
              code={`box-shadow: 0 4px 6px ${hex}40;`}
              preview={<div className="w-full h-16 rounded-md bg-muted" style={{ boxShadow: `0 4px 6px ${hex}40` }} />}
            />
            <CSSExample
              title="Text Shadow"
              code={`text-shadow: 2px 2px 4px ${hex};`}
              preview={
                <p className="text-2xl font-bold" style={{ textShadow: `2px 2px 4px ${hex}` }}>
                  Sample Text
                </p>
              }
            />
            <CSSExample
              title="Gradient"
              code={`background: linear-gradient(135deg, ${hex} 0%, ${shades[4]} 100%);`}
              preview={
                <div
                  className="w-full h-16 rounded-md"
                  style={{ background: `linear-gradient(135deg, ${hex} 0%, ${shades[4]} 100%)` }}
                />
              }
            />
          </div>
        ) : null}
      </Card>

      {/* Related Colors */}
      {mode !== "sectionsOnly" ? (
        <Card id="related-colors" className="p-0 overflow-hidden space-y-0 scroll-mt-24">
          <div 
            className="bg-muted-foreground/10 border-l-[10px] py-5 px-4 cursor-pointer"
            style={{ borderLeftColor: hex }}
            onClick={() => setOpenRelated((v) => !v)}
          >
            <h2 className="text-3xl font-bold m-0 leading-tight">Related Colors</h2>
          </div>
          {openRelated ? (
            <div className="px-6 py-2 space-y-4">
              <p className="text-muted-foreground">
                Find out the colors closely related to {label} in hue, saturation, and lightness. These color relatives offer
                harmonious alternatives and complementary options that work well alongside this color in comprehensive color
                schemes.
              </p>
              <div className="flex justify-center">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 w-full">
                  {relatedColors.slice(0, 10).map((color, idx) => (
                    <a
                      key={`${color.hex}-${idx}`}
                      href={getColorPageLink(color.hex)}
                      className="group flex flex-col gap-2"
                    >
                      <div
                        className="w-full aspect-square rounded-lg border border-border shadow-sm transition-transform group-hover:scale-105 flex items-center justify-center"
                        style={{ backgroundColor: color.hex }}
                      >
                        <span 
                          className="font-mono text-xs font-bold"
                          style={{ color: getContrastColor(color.hex) }}
                        >
                          {color.hex.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="font-medium text-xs sm:text-sm block leading-tight truncate px-1" title={color.name}>
                          {color.name}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </Card>
      ) : null}

      {mode !== "sectionsOnly" && faqs && faqs.length > 0 ? (
        <Card id="faqs" className="p-0 overflow-hidden space-y-0 scroll-mt-24">
          <div className="bg-muted-foreground/10 border-l-[10px] py-5 px-4" style={{ borderLeftColor: hex }}>
            <h2 className="text-3xl font-bold m-0 leading-tight">{label} Color FAQs</h2>
          </div>
          <div className="px-6 py-2 space-y-4">
            <p className="text-muted-foreground">Frequently asked questions about {label} color meaning, symbolism, and applications. Click on any question to expand detailed answers.</p>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx + 1}`}>
                  <AccordionTrigger className="text-base sm:text-lg">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Card>
      ) : null}
      
      {mode !== "sectionsOnly" ? (
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex justify-between items-center py-6 border-t border-b border-border">
            <a href={getColorPageLink(prev)} className="flex flex-col items-start max-w-[45%] group">
              <span className="text-sm text-muted-foreground group-hover:text-foreground mb-1">← Previous Color</span>
              <span className="font-medium group-hover:underline">{prev}</span>
            </a>
            <a href={getColorPageLink(next)} className="flex flex-col items-end max-w-[45%] text-right group">
              <span className="text-sm text-muted-foreground group-hover:text-foreground mb-1">Next Color →</span>
              <span className="font-medium group-hover:underline">{next}</span>
            </a>
          </div>
          <div className="flex justify-center">
            <ShareButtons title={`Color ${hex} - ColorMean`} />
          </div>
        </div>
      ) : null}

      {/* Custom Color Picker Dialogs for contrast checker */}
      {showForegroundPicker && (
        <CustomColorPicker
          value={tempForeground}
          onChange={setTempForeground}
          onApply={(color) => {
            const finalColor = color || tempForeground
            setContrastForeground(finalColor)
            setForeground(finalColor)
            setShowForegroundPicker(false)
          }}
          onClose={() => {
            setShowForegroundPicker(false)
            setForeground(contrastForeground)
          }}
        />
      )}
      {showBackgroundPicker && (
        <CustomColorPicker
          value={tempBackground}
          onChange={setTempBackground}
          onApply={(color) => {
            const finalColor = color || tempBackground
            setContrastBackground(finalColor)
            setBackground(finalColor)
            setShowBackgroundPicker(false)
          }}
          onClose={() => {
            setShowBackgroundPicker(false)
            setBackground(contrastBackground)
          }}
        />
      )}
      <ColorExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        title={exportTitle}
        colors={exportColors}
        baseHex={hex}
        filenameLabel={exportLabel}
      />
    </div>
  )
}

// Helper components
function ColorCodeItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-muted rounded-lg flex items-center justify-between">
      <div className="space-y-1">
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
        <div className="font-mono text-sm">{value}</div>
      </div>
      <CopyButton value={value} />
    </div>
  )
}

function ColorBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const percentage = (value / max) * 100
  const whiteLabels = new Set(["Red", "Blue", "Key (Black)"])
  const blackLabels = new Set(["Green", "Yellow", "Cyan", "Magenta"])
  const textColor = whiteLabels.has(label) ? "#FFFFFF" : blackLabels.has(label) ? "#000000" : getContrastColor(color)
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-mono">
          {value} / {max} ({percentage.toFixed(0)}%)
        </span>
      </div>
      <div className="w-full h-6 bg-muted rounded-md overflow-hidden">
        <div
          className="h-full flex items-center justify-end px-2 text-xs font-bold transition-all"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            color: textColor,
          }}
        >
          {percentage > 10 && `${percentage.toFixed(0)}%`}
        </div>
      </div>
    </div>
  )
}

function ContrastResult({
  label,
  ratio,
  aaThreshold,
  aaaThreshold,
}: {
  label: string
  ratio: number
  aaThreshold: number
  aaaThreshold: number
}) {
  const passAA = ratio >= aaThreshold
  const passAAA = ratio >= aaaThreshold

  return (
    <div className="p-4 bg-muted rounded-lg space-y-2">
      <h4 className="font-medium">{label}</h4>
      <div className="text-2xl font-bold">{ratio.toFixed(2)}:1</div>
      <div className="space-y-1 text-sm">
        <div className="flex items-center gap-2">
          <span className={passAA ? "text-green-500" : "text-red-500"}>{passAA ? "✓" : "✗"}</span>
          <span>WCAG AA</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={passAAA ? "text-green-500" : "text-red-500"}>{passAAA ? "✓" : "✗"}</span>
          <span>WCAG AAA</span>
        </div>
      </div>
    </div>
  )
}

function CSSExample({ title, code, preview }: { title: string; code: string; preview: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-xl">{title}</h4>
      </div>
      <div className="p-3 bg-muted rounded-md font-mono text-sm">{code}</div>
      <div className="p-4 bg-background border-2 border-dashed border-border rounded-md">{preview}</div>
    </div>
  )
}

function ColorPalette({
  name,
  colors,
  onColorClick,
}: {
  name: string
  colors: string[]
  onColorClick: (color: string) => void
}) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">{name}</h3>
      <div className="flex flex-wrap gap-2">
        {colors.map((color, idx) => (
          <div
            key={idx}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 border-dashed border-border cursor-pointer hover:scale-105 transition-transform"
            style={{ backgroundColor: color }}
            onClick={() => onColorClick(color)}
            title={color}
          />
        ))}
      </div>
    </div>
  )
}
