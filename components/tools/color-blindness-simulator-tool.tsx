"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { simulateColorBlindness, getContrastColor } from "@/lib/color-utils"
import { CustomColorPicker } from "@/components/custom-color-picker"
import { ShareButtons } from "@/components/share-buttons"

export function ColorBlindnessSimulatorTool() {
  const [color, setColor] = useState("#5B6FD8")
  const [tempColor, setTempColor] = useState("#5B6FD8")
  const [selectedType, setSelectedType] = useState("protanopia")
  const [showCustomPicker, setShowCustomPicker] = useState(false)

  const visionTypes = [
    { value: "protanopia", label: "Protanopia (Red-Blind)", description: "Missing red cones" },
    { value: "protanomaly", label: "Protanomaly (Red-Weak)", description: "Reduced red sensitivity" },
    { value: "deuteranopia", label: "Deuteranopia (Green-Blind)", description: "Missing green cones" },
    { value: "deuteranomaly", label: "Deuteranomaly (Green-Weak)", description: "Reduced green sensitivity" },
    { value: "tritanopia", label: "Tritanopia (Blue-Blind)", description: "Missing blue cones" },
    { value: "tritanomaly", label: "Tritanomaly (Blue-Weak)", description: "Reduced blue sensitivity" },
    { value: "achromatopsia", label: "Achromatopsia (Total Color Blind)", description: "No color perception" },
    { value: "achromatomaly", label: "Achromatomaly (Partial Color Blind)", description: "Reduced color perception" },
  ]

  const handleApplyColor = (nextColor: string) => {
    setColor(nextColor)
    setTempColor(nextColor)
    setShowCustomPicker(false)
  }

  return (
    <div className="space-y-8">
      <Card className="p-1 sm:p-6 space-y-6">
        <div className="space-y-4 px-3 py-3 sm:px-0 sm:py-0">
          <div className="flex items-center justify-between">
             <h2 className="text-2xl font-bold hidden sm:block">Color Blindness Simulator</h2>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <label className="font-medium">Select Color:</label>
            <button
              onClick={() => setShowCustomPicker(true)}
              className="w-20 h-12 rounded-md border-2 border-border cursor-pointer"
              style={{ backgroundColor: color }}
            />
            <span className="font-mono">{color.toUpperCase()}</span>
          </div>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full" aria-label="Select color blindness type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {visionTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-center">Normal Vision</h3>
              <div
                className="w-full h-48 rounded-lg border-2 border-border flex flex-col items-center justify-center gap-2"
                style={{ backgroundColor: color, color: getContrastColor(color) }}
              >
                <div className="text-4xl font-bold">Aa</div>
                <div className="font-mono text-lg">{color.toUpperCase()}</div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-center">{visionTypes.find((t) => t.value === selectedType)?.label}</h3>
              <div
                className="w-full h-48 rounded-lg border-2 border-border flex flex-col items-center justify-center gap-2"
                style={{
                  backgroundColor: simulateColorBlindness(color, selectedType),
                  color: getContrastColor(simulateColorBlindness(color, selectedType)),
                }}
              >
                <div className="text-4xl font-bold">Aa</div>
                <div className="font-mono text-lg">{simulateColorBlindness(color, selectedType).toUpperCase()}</div>
              </div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">{visionTypes.find((t) => t.value === selectedType)?.label}</h4>
            <p className="text-sm text-muted-foreground">
              {visionTypes.find((t) => t.value === selectedType)?.description}
            </p>
          </div>
        </div>
      </Card>

      {showCustomPicker && (
        <CustomColorPicker
          value={tempColor}
          onChange={setTempColor}
          onApply={handleApplyColor}
          onClose={() => setShowCustomPicker(false)}
        />
      )}

      <div className="flex justify-center py-4">
        <ShareButtons title="Color Blindness Simulator Tool - ColorMean" />
      </div>

      <Card className="p-1 sm:p-6 space-y-4">
        <div className="px-3 py-3 sm:px-0 sm:py-0 space-y-4">
          <h2 className="text-xl font-semibold">About the Tool</h2>
          <p className="text-muted-foreground">
            This interactive simulator models common types of color vision deficiency to help evaluate contrast,
            distinguishability, and accessibility in real interfaces, graphics, and design systems. Use it to verify that
            critical information remains perceivable under different viewing conditions.
          </p>
        </div>
      </Card>

      <Card className="p-1 sm:p-6 space-y-4">
        <div className="px-3 py-3 sm:px-0 sm:py-0 space-y-4">
          <h2 className="text-xl font-semibold">How to Use</h2>
          <p className="text-muted-foreground">
            Select a simulation type, provide input colors or upload visuals, and compare results against accessibility
            targets. Adjust palettes and contrast ratios iteratively until key elements remain readable and actionable.
          </p>
        </div>
      </Card>

      <Card className="p-1 sm:p-6 space-y-4">
        <div className="px-3 py-3 sm:px-0 sm:py-0 space-y-4">
          <h2 className="text-xl font-bold">Understanding Color Vision Deficiency</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Color vision deficiency (commonly called color blindness) affects approximately 8% of men and 0.5% of
              women worldwide. It's usually inherited and makes it difficult to see or distinguish certain colors.
            </p>
            <h3 className="text-lg font-semibold text-foreground pt-4">Types of Color Blindness:</h3>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>
                <strong className="text-foreground">Protanopia/Protanomaly:</strong> Difficulty with red colors,
                confusing reds with greens or browns
              </li>
              <li>
                <strong className="text-foreground">Deuteranopia/Deuteranomaly:</strong> Most common type, difficulty
                with green colors
              </li>
              <li>
                <strong className="text-foreground">Tritanopia/Tritanomaly:</strong> Rare, difficulty with blue and
                yellow colors
              </li>
              <li>
                <strong className="text-foreground">Achromatopsia/Achromatomaly:</strong> Very rare, seeing only in
                shades of gray
              </li>
            </ul>
          </div>
        </div>
      </Card>

      

      <Card className="p-1 sm:p-6 space-y-4">
        <div className="px-3 py-3 sm:px-0 sm:py-0 space-y-4">
          <h2 className="text-xl font-bold">Designing for Accessibility</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Don't rely solely on color to convey information</li>
            <li>Use patterns, textures, or labels in addition to color</li>
            <li>Ensure sufficient contrast between foreground and background</li>
            <li>Test your designs with color blindness simulators</li>
            <li>Consider using colorblind-friendly color palettes</li>
          </ul>
        </div>
      </Card>

      <Card className="p-1 sm:p-6 space-y-4">
        <div className="px-3 py-3 sm:px-0 sm:py-0 space-y-4">
          <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-base sm:text-lg">How accurate are color blindness simulators?</AccordionTrigger>
            <AccordionContent>
              Simulators provide approximations based on scientific research. Individual experiences vary, but they're
              useful tools for designers to understand potential accessibility issues.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-base sm:text-lg">Can color blindness be cured?</AccordionTrigger>
            <AccordionContent>
              Currently, there's no cure for inherited color blindness. However, special glasses and contact lenses
              can help some people distinguish colors better. Color blindness caused by other conditions may be
              treatable.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-base sm:text-lg">Why is designing for color blindness important?</AccordionTrigger>
            <AccordionContent>
              It ensures your content is accessible to everyone, improves user experience, and may be required by law
              in some contexts. About 1 in 12 men have some form of color vision deficiency.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        </div>
      </Card>
    </div>
  )
}
