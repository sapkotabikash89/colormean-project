"use client"

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
} from "@/lib/color-utils"
import { CustomColorPicker } from "@/components/custom-color-picker"
import { ColorCombination } from "@/components/color-combination"
import { ColorSwatch as Swatch } from "@/components/color-swatch"
import { Share, Heart, Check, Copy } from "lucide-react"
import { ColorExportDialog } from "@/components/color-export-dialog"
import { CopyButton } from "@/components/copy-button"
import { ShareButtons } from "@/components/share-buttons"

interface ColorPageContentProps {
  hex: string
  mode?: "full" | "sectionsOnly"
  faqs?: { question: string; answer: string }[]
}

export function ColorPageContent({ hex, mode = "full", faqs }: ColorPageContentProps) {
  const router = useRouter()
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

  useEffect(() => {
    // Sync global components (Header, Sidebar) with current page color
    window.dispatchEvent(new CustomEvent("colorUpdate", { detail: { color: hex } }))
    const key = `love:${hex.toUpperCase()}`
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        setLoveCount(parsed.count || 9)
        setLiked(!!parsed.liked)
      } catch {}
    } else {
      setLoveCount(9)
      setLiked(false)
    }
  }, [hex])

  const rgb = hexToRgb(hex)
  if (!rgb) return null

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b)
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
  const xyz = rgbToXyz(rgb.r, rgb.g, rgb.b)
  const yxy = rgbToYxy(rgb.r, rgb.g, rgb.b)
  const lab = rgbToLab(rgb.r, rgb.g, rgb.b)
  const hunter = rgbToHunterLab(rgb.r, rgb.g, rgb.b)
  const colorMeaning = getColorMeaning(hex)
  const hueFamily = (h: number) => {
    const ranges = [
      [0, 15, "Red", "passion, energy, urgency"],
      [15, 45, "Red-Orange", "warmth, creativity, enthusiasm, approachability"],
      [45, 75, "Orange", "vitality, friendliness, optimism"],
      [75, 105, "Yellow", "happiness, clarity, intellect"],
      [105, 150, "Green", "growth, balance, renewal"],
      [150, 195, "Cyan", "calm, clarity, technology"],
      [195, 240, "Blue", "trust, stability, professionalism"],
      [240, 270, "Blue-Violet", "imagination, sophistication, depth"],
      [270, 300, "Violet", "mystery, creativity, luxury"],
      [300, 330, "Magenta", "innovation, vibrancy, expression"],
      [330, 360, "Red", "passion, energy, urgency"],
    ] as Array<[number, number, string, string]>
    const x = ((h % 360) + 360) % 360
    const f = ranges.find(([a, b]) => x >= a && x < b)
    return f ? { name: f[2], traits: f[3] } : { name: "Color", traits: "balance and expression" }
  }
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

  const toggleLove = () => {
    const key = `love:${hex.toUpperCase()}`
    const nextLiked = !liked
    setLiked(nextLiked)
    setLoveCount((prev) => {
      const v = nextLiked ? prev + 1 : Math.max(0, prev - 1)
      const payload = { count: v, liked: nextLiked }
      if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(payload))
      return v
    })
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
  const relatedColors = getRelatedColors(hex, 12)
  // const palettes = generateColorPalette(hex)

  const contrastRatio = getContrastRatio(foreground, background)

  const navigateToColor = (color: string) => {
    const cleanHex = color.replace("#", "")
    router.push(`/colors/${cleanHex.toLowerCase()}`)
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
        <div className="flex flex-wrap justify-center items-center gap-1 text-black font-medium text-[11px] sm:text-sm">
          <a href="#information" className="px-0.5 text-purple-600">Information</a>
          <span>|</span>
          <a href="#meaning" className="px-0.5 text-purple-600">Meaning</a>
          <span>|</span>
          <a href="#conversion" className="px-0.5 text-purple-600">Conversion</a>
          <span>|</span>
          <a href="#variations" className="px-0.5 text-purple-600">Variations</a>
          <span>|</span>
          <a href="#harmonies" className="px-0.5 text-purple-600">Harmonies</a>
          <span>|</span>
          <a href="#contrast-checker" className="px-0.5 text-purple-600">Contrast Checker</a>
          <span>|</span>
          <a href="#blindness-simulator" className="px-0.5 text-purple-600">Blindness Simulator</a>
          <span>|</span>
          <a href="#css-examples" className="px-0.5 text-purple-600">CSS Examples</a>
          <span>|</span>
          <a href="#related-colors" className="px-0.5 text-purple-600">Related Colors</a>
          <span>|</span>
          <a href="#faqs" className="px-0.5 text-purple-600">FAQs</a>
        </div>
      ) : null}
      {mode !== "sectionsOnly" ? (
        <Card id="information" className="p-6 space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-bold">Color Information</h2>
          <p className="text-base leading-relaxed">
            {hex} color RGB value is ({rgb.r}, {rgb.g}, {rgb.b}). The hex color red value is {rgb.r}, green is {rgb.g},
            and blue is {rgb.b}. Its HSL format shows a hue of {hsl.h}°, saturation of {hsl.s} percent, and lightness of{" "}
            {hsl.l} percent. The CMYK process values are {cmyk.c} percent, {cmyk.m} percent, {cmyk.y} percent, {cmyk.k}{" "}
            percent.
          </p>
        </Card>
      ) : null}

      {mode !== "sectionsOnly" ? (
        <Card className="p-6 space-y-4">
          <div className="w-full flex justify-center">
            <div
              className="relative w-full max-w-xl h-80 rounded-lg border-2 border-border"
              style={{ backgroundColor: hex, color: getContrastColor(hex) }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="font-mono text-xl font-bold">{hex.toUpperCase()}</div>
                <div className="font-mono text-sm">{`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}</div>
              </div>
              <button
                onClick={toggleLove}
                className="absolute left-2 bottom-2 inline-flex items-center gap-1 px-2 py-1 rounded bg-black/40 text-white"
                style={{ color: liked ? "#ef4444" : undefined }}
              >
                <Heart className="w-4 h-4" />
                <span className="text-xs font-semibold">{loveCount}</span>
              </button>
              <div className="absolute bottom-2 right-3 font-semibold text-xs opacity-80">ColorMean</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="outline" className="bg-transparent" onClick={downloadMainSwatch}>
              Download image (1920x1080)
            </Button>
            <ShareButtons title={`Color ${hex}`} />
          </div>
        </Card>
      ) : null}

      {/* Color Meaning */}
      {mode !== "sectionsOnly" ? (
        <Card id="meaning" className="p-6 space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-bold">{hex} Color Meaning</h2>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="whitespace-pre-line leading-relaxed">{colorMeaning}</p>
          </div>
        </Card>
      ) : null}

      {/* Color Conversion Table */}
      <Card id="conversion" className="p-6 space-y-4 scroll-mt-24">
        <button onClick={() => setOpenConversion((v) => !v)} className={`text-left text-2xl font-bold ${openConversion ? "" : "underline"}`}>Color Conversion</button>
        {openConversion ? (
          <>
            <p className="text-muted-foreground">
              Convert {hex} across different color models and formats. These conversions help designers work seamlessly
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
          </>
        ) : null}
      </Card>

      {/* RGB & CMYK Percentage Bars */}
      <Card className="p-6 space-y-6">
        <button onClick={() => setOpenBars((v) => !v)} className={`text-left text-2xl font-bold ${openBars ? "" : "underline"}`}>RGB Values & CMYK Values</button>
        {openBars ? (
          <>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">RGB Values</h3>
              <ColorBar label="Red" value={rgb.r} max={255} color="#FF0000" />
              <ColorBar label="Green" value={rgb.g} max={255} color="#00FF00" />
              <ColorBar label="Blue" value={rgb.b} max={255} color="#0000FF" />
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">CMYK Values</h3>
              <ColorBar label="Cyan" value={cmyk.c} max={100} color="#00FFFF" />
              <ColorBar label="Magenta" value={cmyk.m} max={100} color="#FF00FF" />
              <ColorBar label="Yellow" value={cmyk.y} max={100} color="#FFFF00" />
              <ColorBar label="Key (Black)" value={cmyk.k} max={100} color="#000000" />
            </div>
          </>
        ) : null}
      </Card>

      <Card id="variations" className="p-6 space-y-4 scroll-mt-24">
        <div className="flex items-center justify-between">
          <button onClick={() => setOpenVariations((v) => !v)} className={`text-left text-2xl font-bold ${openVariations ? "" : "underline"}`}>Color Variations</button>
        </div>
        {openVariations ? (
          <>
            <p className="text-muted-foreground">
              {hex} harmonies come to life through carefully balanced shades, tints, and tones, giving this color depth and
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
                      <Swatch key={`${c}-${idx}`} color={c} showHex />
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="shades" className="mt-4">
                <div className="flex justify-center">
                  <div className="grid w-fit grid-cols-5 xl:grid-cols-10 gap-1">
                    {shades.slice(0, 10).map((c, idx) => (
                      <Swatch key={`${c}-${idx}`} color={c} showHex />
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="tones" className="mt-4">
                <div className="flex justify-center">
                  <div className="grid w-fit grid-cols-5 xl:grid-cols-10 gap-1">
                    {tones.slice(0, 10).map((c, idx) => (
                      <Swatch key={`${c}-${idx}`} color={c} showHex />
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : null}
      </Card>

      {/* Color Harmonies */}
      <Card id="harmonies" className="p-4 sm:p-6 space-y-6 scroll-mt-24">
        <button onClick={() => setOpenHarmonies((v) => !v)} className={`text-left text-2xl font-bold ${openHarmonies ? "" : "underline"}`}>Color Harmonies</button>
        {openHarmonies ? (
          <>
            <p className="text-muted-foreground">
              {hex} harmonies create beautiful relationships with other colors based on their position on the color wheel.
              Each harmony type offers unique design possibilities, enabling cohesive and visually appealing color schemes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(harmonies).map(([type, harmony]) => (
                <div key={type} className="space-y-3 p-5 border-2 border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{harmony.name}</h3>
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
                  <ColorCombination colors={harmony.colors} baseHex={hex} />
                </div>
              ))}
            </div>
          </>
        ) : null}
      </Card>

      {/* Contrast Checker */}
      <Card id="contrast-checker" className="p-6 space-y-4 scroll-mt-24">
        <button onClick={() => setOpenContrast((v) => !v)} className={`text-left text-2xl font-bold ${openContrast ? "" : "underline"}`}>Contrast Checker</button>
        {openContrast ? (
          <>
            <p className="text-muted-foreground">
              (WCAG 2.1) Test {hex} for accessibility compliance against white and black backgrounds. Proper contrast
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
          </>
        ) : null}
      </Card>

      {/* Color Blindness Simulator */}
      <Card id="blindness-simulator" className="p-6 space-y-4 scroll-mt-24">
        <button onClick={() => setOpenBlindness((v) => !v)} className={`text-left text-2xl font-bold ${openBlindness ? "" : "underline"}`}>Color Blindness Simulator</button>
        {openBlindness ? (
          <>
            <p className="text-muted-foreground">
              See how {hex} appears to people with different types of color vision deficiencies. These simulations help
              create more inclusive designs that consider how this color is perceived across various visual abilities.
            </p>
            <Select value={colorBlindnessType} onValueChange={setColorBlindnessType}>
              <SelectTrigger className="w-full md:w-64">
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
                  {hex}
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
          </>
        ) : null}
      </Card>

      {/* CSS Examples */}
      <Card id="css-examples" className="p-6 space-y-4 scroll-mt-24">
        <button onClick={() => setOpenCss((v) => !v)} className={`text-left text-2xl font-bold ${openCss ? "" : "underline"}`}>CSS Examples</button>
        {openCss ? (
          <div className="space-y-4">
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
      <Card id="related-colors" className="p-6 space-y-4 scroll-mt-24">
        <button onClick={() => setOpenRelated((v) => !v)} className={`text-left text-2xl font-bold ${openRelated ? "" : "underline"}`}>Related Colors</button>
        {openRelated ? (
          <>
            <p className="text-muted-foreground">
              Find out the colors closely related to {hex} in hue, saturation, and lightness. These color relatives offer
              harmonious alternatives and complementary options that work well alongside this color in comprehensive color
              schemes.
            </p>
            <div className="flex justify-center">
              <div className="grid w-fit grid-cols-5 xl:grid-cols-10 gap-1">
                {relatedColors.slice(0, 10).map((c, idx) => (
                  <Swatch key={`${c}-${idx}`} color={c} showHex />
                ))}
              </div>
            </div>
          </>
        ) : null}
      </Card>

      {mode !== "sectionsOnly" && faqs && faqs.length > 0 ? (
        <Card id="faqs" className="p-6 space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-bold">{hex} Color FAQs</h2>
          <p className="text-muted-foreground">Frequently asked questions about {hex} color meaning, symbolism, and applications. Click on any question to expand detailed answers.</p>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx + 1}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      ) : null}
      
      {mode !== "sectionsOnly" ? (
        <div className="flex justify-center mt-6">
          <ShareButtons title={`Color ${hex} - ColorMean`} />
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
        <h4 className="font-medium text-sm">{title}</h4>
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
