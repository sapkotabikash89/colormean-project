"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ColorSidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Palette, Droplet, Monitor, ImageIcon, Contrast, Eye, CircleDot, Shuffle, Pipette } from "lucide-react"
import Link from "next/link"
import { hexToRgb, rgbToHsl, rgbToCmyk, hslToRgb, rgbToHex } from "@/lib/color-utils"
import {
  WebsiteSchema,
  OrganizationSchema,
  SoftwareApplicationSchema,
} from "@/components/structured-data"

export default function HomePage() {
  const router = useRouter()
  const [color, setColor] = useState("#5B6FD8")
  const [hue, setHue] = useState(230)
  const [saturation, setSaturation] = useState(70)
  const [lightness, setLightness] = useState(60)
  const [colorFormat, setColorFormat] = useState<"hex" | "rgb" | "hsl" | "cmyk">("hex")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const event = new CustomEvent("colorUpdate", { detail: { color } })
    window.dispatchEvent(event)
  }, [color])

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

    // Draw saturation (x-axis) and lightness (y-axis) gradient
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

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = ("clientX" in e ? e.clientX : e.touches[0].clientX) - rect.left
    const y = ("clientY" in e ? e.clientY : e.touches[0].clientY) - rect.top

    const newSaturation = (x / rect.width) * 100
    const newLightness = 100 - (y / rect.height) * 100

    setSaturation(Math.round(newSaturation))
    setLightness(Math.round(newLightness))

    const rgb = hslToRgb(hue, newSaturation, newLightness)
    setColor(rgbToHex(rgb.r, rgb.g, rgb.b))
  }

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHue = Number.parseInt(e.target.value)
    setHue(newHue)
    const rgb = hslToRgb(newHue, saturation, lightness)
    setColor(rgbToHex(rgb.r, rgb.g, rgb.b))
  }

  const handleApply = () => {
    const cleanHex = color.replace("#", "")
    router.push(`/colors/${cleanHex.toLowerCase()}`)
  }

  const handleRandomColor = () => {
    const randomColor =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    setColor(randomColor)
    const rgb = hexToRgb(randomColor)
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
      setHue(hsl.h)
    }
  }

  const handleScreenPicker = async () => {
    if ("EyeDropper" in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper()
        const result = await eyeDropper.open()
        setColor(result.sRGBHex)
        const rgb = hexToRgb(result.sRGBHex)
        if (rgb) {
          const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
          setHue(hsl.h)
        }
      } catch (e) {
        console.log("[v0] Eye dropper cancelled or not available")
      }
    } else {
      alert("Screen color picker is not supported in your browser. Please try Chrome or Edge.")
    }
  }

  const getColorValue = () => {
    const rgb = hexToRgb(color)
    if (!rgb) return color.toUpperCase()
    switch (colorFormat) {
      case "rgb": {
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
      }
      case "hsl": {
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
        return hsl ? `hsl(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)` : color.toUpperCase()
      }
      case "cmyk": {
        const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b)
        return cmyk ? `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` : color.toUpperCase()
      }
      default:
        return color.toUpperCase()
    }
  }

  const pickerX = `${Math.max(0, Math.min(100, saturation))}%`
  const pickerY = `${Math.max(0, Math.min(100, 100 - lightness))}%`

  return (
    <div className="flex flex-col min-h-screen">
      <WebsiteSchema />
      <OrganizationSchema />
      <SoftwareApplicationSchema />
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12 sm:py-16 px-1 sm:px-4">
        <div className="container mx-auto text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-balance">ColorMean: Know Your Color</h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty px-2">
            Turn ideas into visuals with confidence. Access rich color details, meanings, psychology, symbolism, uses, precise conversions, and powerful tools made for creative minds.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-1 sm:px-4 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
          {/* Content Area - 2/3 */}
          <div className="flex-1 space-y-8 sm:space-y-12">
            {/* Color Picker Section */}
            <Card className="p-2 sm:p-6 space-y-4 sm:space-y-6">
              <div className="space-y-2 px-2 sm:px-0">
                <h2 className="text-xl sm:text-2xl font-bold">Interactive Color Picker</h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Choose your perfect color and explore its properties instantly
                </p>
              </div>

              {/* Main Color Picker */}
              <div className="flex flex-col md:flex-row gap-4 sm:gap-6 px-1 sm:px-0">
                <div className="flex-shrink-0 space-y-4 w-full md:w-auto">
                  <div className="relative">
                    <canvas
                      ref={canvasRef}
                      width={350}
                      height={250}
                      className="w-full max-w-[350px] rounded-lg border-2 border-border cursor-crosshair touch-none"
                      onClick={handleCanvasClick}
                      onMouseMove={(e) => isDragging && handleCanvasClick(e)}
                      onMouseDown={() => setIsDragging(true)}
                      onMouseUp={() => setIsDragging(false)}
                      onMouseLeave={() => setIsDragging(false)}
                      onTouchStart={(e) => {
                        setIsDragging(true)
                        handleCanvasClick(e as any)
                      }}
                      onTouchMove={(e) => {
                        e.preventDefault()
                        isDragging && handleCanvasClick(e as any)
                      }}
                      onTouchEnd={() => setIsDragging(false)}
                    />
                    <div
                      className="absolute w-5 h-5 border-2 border-white rounded-full shadow-lg pointer-events-none"
                      style={{
                        left: pickerX,
                        top: pickerY,
                        transform: "translate(-50%, -50%)",
                        boxShadow: "0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)",
                      }}
                    />
                  </div>

                  {/* Hue Slider */}
                  <div className="space-y-2 max-w-[350px]">
                    <label className="text-sm font-medium">Hue</label>
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
                    />
                  </div>
                </div>

                {/* Right Side: Color Display and Controls */}
                <div className="flex-1 space-y-3 sm:space-y-4">
                  {/* Color Preview Box */}
                  <div
                    className="w-full h-32 rounded-lg border-2 border-border flex items-center justify-center font-mono text-base sm:text-lg font-semibold"
                    style={{
                      backgroundColor: color,
                      color: getContrastColor(color),
                    }}
                  >
                    {color.toUpperCase()}
                  </div>

                  {/* Format Selector and Value Display */}
                  <div className="space-y-2">
                    <Select value={colorFormat} onValueChange={(val) => setColorFormat(val as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hex">HEX</SelectItem>
                        <SelectItem value="rgb">RGB</SelectItem>
                        <SelectItem value="hsl">HSL</SelectItem>
                        <SelectItem value="cmyk">CMYK</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="p-2 sm:p-3 bg-muted rounded-md font-mono text-xs sm:text-sm">{getColorValue()}</div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <Button onClick={handleApply} size="lg" className="w-full gap-2 text-sm sm:text-base">
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
                      <Button
                        onClick={handleScreenPicker}
                        variant="outline"
                        size="lg"
                        className="gap-1 sm:gap-2 bg-transparent text-xs sm:text-sm px-2 sm:px-4"
                      >
                        <Pipette className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="truncate">Screen</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Color Tools Preview */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Professional Color Tools</h2>
                <p className="text-muted-foreground">Powerful tools to help you work with colors like a professional</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ToolCard
                  icon={<CircleDot className="w-6 h-6" />}
                  title="Color Wheel"
                  description="Explore color relationships and harmonies"
                  href="/color-wheel"
                />
                <ToolCard
                  icon={<Droplet className="w-6 h-6" />}
                  title="Color Picker"
                  description="Advanced color selection tool"
                  href="/color-picker"
                />
                <ToolCard
                  icon={<Pipette className="w-6 h-6" />}
                  title="Screen Color Picker"
                  description="Pick colors from your screen"
                  href="/screen-color-picker"
                />
                <ToolCard
                  icon={<ImageIcon className="w-6 h-6" />}
                  title="Image Color Picker"
                  description="Extract colors from images"
                  href="/image-color-picker"
                />
                <ToolCard
                  icon={<Palette className="w-6 h-6" />}
                  title="Palette from Image"
                  description="Generate color palettes from photos"
                  href="/palette-from-image"
                />
                <ToolCard
                  icon={<Contrast className="w-6 h-6" />}
                  title="Contrast Checker"
                  description="Check WCAG accessibility standards"
                  href="/contrast-checker"
                />
                <ToolCard
                  icon={<Eye className="w-6 h-6" />}
                  title="Color Blindness Simulator"
                  description="See colors through different vision types"
                  href="/color-blindness-simulator"
                />
                <ToolCard
                  icon={<Monitor className="w-6 h-6" />}
                  title="Color Library"
                  description="Browse thousands of colors"
                  href="/colors"
                />
              </div>
            </div>

            {/* About Section */}
            <Card className="p-8 space-y-4">
              <h2 className="text-2xl font-bold">About ColorMean</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">ColorMean</strong> is your comprehensive color companion, designed
                  for designers, developers, artists, and anyone passionate about colors. We provide detailed color
                  information, meanings, and professional-grade tools to help you make the perfect color choices for
                  your projects.
                </p>
                <p>
                  Whether you're looking for the perfect shade, need to check color accessibility, or want to understand
                  color harmonies, ColorMean has you covered. Our platform combines intuitive tools with in-depth color
                  knowledge to empower your creative work.
                </p>
                <h3 className="text-lg font-semibold text-foreground pt-4">What You Can Do:</h3>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>
                    <strong className="text-foreground">Explore Color Information:</strong> Get detailed color codes in
                    HEX, RGB, HSL, CMYK, HSV, and LAB formats
                  </li>
                  <li>
                    <strong className="text-foreground">Discover Color Meanings:</strong> Learn about the psychology and
                    symbolism behind different colors
                  </li>
                  <li>
                    <strong className="text-foreground">Find Color Harmonies:</strong> Generate complementary,
                    analogous, triadic, and more color schemes
                  </li>
                  <li>
                    <strong className="text-foreground">Check Accessibility:</strong> Ensure your color combinations
                    meet WCAG standards
                  </li>
                  <li>
                    <strong className="text-foreground">Extract Colors from Images:</strong> Build palettes from your
                    favorite photos
                  </li>
                  <li>
                    <strong className="text-foreground">Test Color Blindness:</strong> See how your colors appear to
                    people with different vision types
                  </li>
                </ul>
                <p className="pt-4">
                  Start exploring colors today and discover how ColorMean can enhance your creative workflow!
                </p>
              </div>
            </Card>
          </div>

          {/* Sidebar - 1/3 */}
          <ColorSidebar color={color} />
        </div>
      </main>

      <Footer />
    </div>
  )
}

function ToolCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <Link href={href}>
      <Card className="p-6 h-full hover:shadow-lg transition-all hover:border-primary cursor-pointer group">
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            {icon}
          </div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </Card>
    </Link>
  )
}

function getContrastColor(hex: string): string {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? "#000000" : "#FFFFFF"
}
