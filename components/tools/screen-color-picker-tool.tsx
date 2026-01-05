"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Pipette } from "lucide-react"
import { hexToRgb, rgbToHsl, rgbToCmyk } from "@/lib/color-utils"
import { CopyButton } from "@/components/copy-button"
import { ShareButtons } from "@/components/share-buttons"

export function ScreenColorPickerTool() {
  const router = useRouter()
  const [selectedColor, setSelectedColor] = useState("#5B6FD8")
  const [pickedColors, setPickedColors] = useState<string[]>([])
  const [isSupported, setIsSupported] = useState(true)

  const handlePickColor = async () => {
    if ("EyeDropper" in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper()
        const result = await eyeDropper.open()
        setSelectedColor(result.sRGBHex.toUpperCase())

        if (!pickedColors.includes(result.sRGBHex.toUpperCase())) {
          setPickedColors([result.sRGBHex.toUpperCase(), ...pickedColors])
        }
      } catch (e) {
        console.log("User cancelled color picker")
      }
    } else {
      setIsSupported(false)
    }
  }

  const handleExplore = (color: string) => {
    const cleanHex = color.replace("#", "")
    router.push(`/colors/${cleanHex.toLowerCase()}`)
  }

  const rgb = hexToRgb(selectedColor)
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null
  const cmyk = rgb ? rgbToCmyk(rgb.r, rgb.g, rgb.b) : null

  return (
    <div className="space-y-8">
      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Pick Color from Screen</h2>
          </div>
          <p className="text-muted-foreground">
            Click the button below to activate the screen color picker and select any color from your screen
          </p>

          {isSupported ? (
            <>
              <Button onClick={handlePickColor} size="lg" className="w-full gap-2">
                <Pipette className="w-5 h-5" />
                Pick Color from Screen
              </Button>

              <div className="p-6 bg-muted rounded-lg space-y-4">
                <div className="flex items-center gap-6">
                  <div
                    className="w-32 h-32 rounded-lg border-2 border-border"
                    style={{ backgroundColor: selectedColor }}
                  />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-muted-foreground">HEX</span>
                        <p className="font-mono font-semibold text-lg">{selectedColor}</p>
                      </div>
                      <CopyButton value={selectedColor} />
                    </div>
                    {rgb && (
                      <>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm text-muted-foreground">RGB</span>
                            <p className="font-mono">
                              ({rgb.r}, {rgb.g}, {rgb.b})
                            </p>
                          </div>
                          <CopyButton value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
                        </div>
                        {hsl && (
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm text-muted-foreground">HSL</span>
                              <p className="font-mono">
                                ({hsl.h}°, {hsl.s}%, {hsl.l}%)
                              </p>
                            </div>
                            <CopyButton value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
                          </div>
                        )}
                        {cmyk && (
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm text-muted-foreground">CMYK</span>
                              <p className="font-mono">
                                ({cmyk.c}%, {cmyk.m}%, {cmyk.y}%, {cmyk.k}%)
                              </p>
                            </div>
                            <CopyButton value={`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`} />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <Button onClick={() => handleExplore(selectedColor)} variant="outline" className="w-full">
                  Explore This Color
                </Button>
              </div>

              {pickedColors.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Recently Picked Colors</h3>
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
                  <Button variant="outline" size="sm" onClick={() => setPickedColors([])} className="w-full">
                    Clear All
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="p-6 bg-destructive/10 border-2 border-destructive/20 rounded-lg">
              <p className="text-destructive font-semibold">EyeDropper API Not Supported</p>
              <p className="text-sm text-muted-foreground mt-2">
                Your browser doesn't support the EyeDropper API. Please use Chrome, Edge, or Opera browser for this
                feature.
              </p>
            </div>
          )}
        </div>
      </Card>

      <div className="flex justify-center py-4">
        <ShareButtons title="Screen Color Picker Tool - ColorMean" />
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-bold">How to Use Screen Color Picker</h2>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          <li>Click the "Pick Color from Screen" button to activate the color picker</li>
          <li>Your cursor will change to a crosshair or color picker icon</li>
          <li>Move your cursor over any element on your screen</li>
          <li>Click to select the color at that exact pixel</li>
          <li>The selected color will be displayed with all format codes</li>
          <li>Click on any recently picked color to explore it further</li>
        </ol>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-bold">Use Cases</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Match colors from websites and applications</li>
          <li>Extract brand colors from competitor sites</li>
          <li>Pick colors from design references and inspiration</li>
          <li>Identify colors in screenshots and images</li>
          <li>Create color palettes from existing designs</li>
        </ul>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Which browsers support the screen color picker?</AccordionTrigger>
            <AccordionContent>
              The EyeDropper API is supported in Chrome 95+, Edge 95+, and Opera 81+. Safari and Firefox do not
              currently support this feature.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Can I pick colors from other applications?</AccordionTrigger>
            <AccordionContent>
              Yes! The screen color picker works across your entire screen, including other browser windows, desktop
              applications, and even your desktop wallpaper.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is this tool free to use?</AccordionTrigger>
            <AccordionContent>
              Yes, the screen color picker is completely free to use with no limitations. Pick as many colors as you
              need for your projects.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  )
}
