"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ColorSidebar } from "@/components/sidebar";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { ColorPageContent } from "@/components/color-page-content";
import { AnchorHashNav } from "@/components/anchor-hash-nav";
import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  normalizeHex, 
  isValidHex, 
  getContrastColor, 
  hexToRgb, 
  rgbToHsl, 
  rgbToCmyk,
  getColorHarmony,
  hslToRgb
} from "@/lib/color-utils";
import { BreadcrumbSchema, FAQSchema, WebPageSchema } from "@/components/structured-data";

const DEFAULT_HEX = "#5B6FD8";

export default function HtmlColorPickerPage() {
  // Get hex from URL query parameter on client side
  const [initialHex, setInitialHex] = useState(DEFAULT_HEX);
  
  useEffect(() => {
    // Client-side only - parse URL parameters
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const hexParam = urlParams.get('hex');
      if (hexParam && isValidHex(`#${hexParam}`)) {
        setInitialHex(`#${hexParam}`);
      }
    }
  }, []);
  
  return (
    <PickerContent initialHex={initialHex} />
  );
}

function PickerContent({ initialHex = DEFAULT_HEX }: { initialHex?: string }) {
  const [currentHex, setCurrentHex] = useState(initialHex);

  // Update color when hex parameter changes
  useEffect(() => {
    setCurrentHex(initialHex);
  }, [initialHex]);

  // Derived values
  const rgb = hexToRgb(currentHex);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
  const contrastColor = getContrastColor(currentHex);
  const displayLabel = currentHex;
  
  // Mock FAQ items since we don't have the full category utils here
  const faqItems = [
    {
      question: `What is the meaning and symbolism of ${currentHex} color?`,
      answer: `${currentHex} is a versatile color that can carry various meanings depending on its context and cultural associations.`
    },
    {
      question: `What psychological effects does ${currentHex} color have?`,
      answer: `${currentHex} can evoke feelings of creativity, energy, and focus depending on its specific hue and saturation.`
    }
  ];

  // Handle swatch clicks - update in-place without navigation
  const handleSwatchClick = (color: string) => {
    setCurrentHex(color);
    // Update URL without navigation
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('hex', color.replace('#', ''));
    window.history.pushState({}, '', newUrl);
  };

  // Update current hex with validation
  const updateCurrentHex = (hex: string) => {
    const normalized = normalizeHex(hex);
    if (isValidHex(normalized)) {
      setCurrentHex(normalized);
      // Update URL without navigation
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('hex', normalized.replace('#', ''));
      window.history.pushState({}, '', newUrl);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <WebPageSchema 
        name={`${displayLabel} Color Information`} 
        url={`https://colormean.com/html-color-picker?hex=${currentHex.replace("#", "")}`}
        description={`Explore ${currentHex} color information, conversions, harmonies, variations, and accessibility.`}
      />
      <BreadcrumbSchema items={[
        { name: "ColorMean", item: "https://colormean.com" },
        { name: "Color Names", item: "https://colormean.com/colors" },
        { name: currentHex, item: `https://colormean.com/html-color-picker?hex=${currentHex.replace("#", "")}` }
      ]} />
      <FAQSchema faqs={faqItems} />
      
      {/* Meta tags for SEO - noindex for universal picker */}
      <head>
        <meta name="robots" content="noindex, follow" />
      </head>

      <Header />

      {/* Dynamic Color Hero */}
      <section
        className="py-12 px-4 transition-colors duration-300"
        style={{
          backgroundColor: currentHex,
          color: contrastColor,
        }}
      >
        <div className="container mx-auto">
          <BreadcrumbNav
            items={[
              { label: "Color Names", href: "/colors" },
              { label: currentHex, href: `/html-color-picker?hex=${currentHex.replace("#", "")}` },
            ]}
          />
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">{currentHex} Color Information</h1>
            <p className="max-w-3xl mx-auto text-sm md:text-base opacity-90">
              Everything you need to know about {currentHex} including values, color harmonies, shades,
              meanings, and applications in design, branding, and everyday visuals.
            </p>
            <div className="max-w-4xl mx-auto">
              <div className="font-mono text-xs md:text-sm flex flex-wrap justify-center gap-4">
                <CopyButton showIcon={false} variant="ghost" size="sm" className="p-0 h-auto" label={`HEX: ${currentHex}`} value={currentHex} />
                {rgb && (
                  <CopyButton
                    showIcon={false}
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto"
                    label={`RGB: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                    value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                  />
                )}
                {hsl && (
                  <CopyButton
                    showIcon={false}
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto"
                    label={`HSL: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                    value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnchorHashNav
        items={[
          { href: "#information", label: "Information" },
          { href: "#meaning", label: "Meaning" },
          { href: "#conversion", label: "Conversion" },
          { href: "#variations", label: "Variations" },
          { href: "#harmonies", label: "Harmonies" },
          { href: "#contrast-checker", label: "Contrast Checker" },
          { href: "#blindness-simulator", label: "Blindness Simulator" },
          { href: "#css-examples", label: "CSS Examples" },
          { href: "#related-colors", label: "Related Colors" },
          { href: "#faqs", label: "FAQs" },
        ]}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Content Area - 2/3 */}
          <div className="flex-1">
            <div className="space-y-8">
              {/* Color Picker Section - Integrated below hero */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Interactive Color Picker</h2>
                <p className="text-muted-foreground mb-6">
                  Select any color using our advanced color picker and get instant color codes
                </p>
                
                {/* Simple color picker implementation */}
                <div className="flex items-center gap-4 mb-6">
                  <input
                    type="color"
                    value={currentHex}
                    onChange={(e) => updateCurrentHex(e.target.value)}
                    className="w-16 h-16 rounded-lg border-2 border-border cursor-pointer"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={currentHex}
                      onChange={(e) => {
                        const normalized = normalizeHex(e.target.value);
                        if (normalized && isValidHex(normalized)) {
                          updateCurrentHex(normalized);
                        }
                      }}
                      className="w-full px-3 py-2 border border-border rounded-md font-mono"
                      placeholder="#RRGGBB"
                    />
                  </div>
                  <Button 
                    onClick={() => {
                      const randomHex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
                      updateCurrentHex(randomHex);
                    }}
                    variant="outline"
                  >
                    Random
                  </Button>
                </div>
                
                {/* Sample swatches for in-place updates */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Quick Colors (click to update in-place):</h3>
                  <div className="flex flex-wrap gap-2">
                    {['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#FF9F80', '#A8E6CF'].map(color => (
                      <button
                        key={color}
                        onClick={() => handleSwatchClick(color)}
                        className="w-10 h-10 rounded-md border-2 border-border cursor-pointer hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        title={color}
                        aria-label={`Select color ${color}`}
                      />
                    ))}
                  </div>
                </div>
              </Card>

              {/* Color Information - Expanded by default */}
              <details open className="border border-border rounded-lg p-6">
                <summary className="font-semibold text-xl cursor-pointer list-none mb-4">
                  Color Information
                </summary>
                <div className="space-y-4">
                  <p>
                    This page displays information for the color <strong>{currentHex}</strong>. 
                    You can explore different colors using the interactive picker above or by clicking 
                    on the color swatches. All color information updates instantly without page navigation.
                  </p>
                  {rgb && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-muted p-4 rounded">
                        <h4 className="font-semibold mb-2">HEX</h4>
                        <p className="font-mono">{currentHex}</p>
                      </div>
                      <div className="bg-muted p-4 rounded">
                        <h4 className="font-semibold mb-2">RGB</h4>
                        <p className="font-mono">rgb({rgb.r}, {rgb.g}, {rgb.b})</p>
                      </div>
                      {hsl && (
                        <div className="bg-muted p-4 rounded">
                          <h4 className="font-semibold mb-2">HSL</h4>
                          <p className="font-mono">hsl({hsl.h}°, {hsl.s}%, {hsl.l}%)</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </details>

              {/* Color Meanings - Expanded by default */}
              <details open className="border border-border rounded-lg p-6">
                <summary className="font-semibold text-xl cursor-pointer list-none mb-4">
                  Color Meanings
                </summary>
                <div className="space-y-4">
                  <p>
                    Colors carry psychological and cultural meanings that influence how we perceive 
                    and interact with the world around us. The color <strong>{currentHex}</strong> has 
                    its own unique associations and interpretations.
                  </p>
                  <div className="bg-muted p-4 rounded">
                    <h4 className="font-semibold mb-2">General Associations</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Energy and vitality</li>
                      <li>Creativity and inspiration</li>
                      <li>Emotional expression</li>
                      <li>Visual impact and attention</li>
                    </ul>
                  </div>
                </div>
              </details>

              {/* Color Palettes - Expanded by default */}
              <details open className="border border-border rounded-lg p-6">
                <summary className="font-semibold text-xl cursor-pointer list-none mb-4">
                  Color Palettes
                </summary>
                <div className="space-y-4">
                  <p>
                    Create harmonious color combinations using <strong>{currentHex}</strong> as your base color.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-2">Complementary</h4>
                      <div className="flex gap-2">
                        <div className="w-12 h-12 rounded" style={{ backgroundColor: currentHex }}></div>
                        <div className="w-12 h-12 rounded" style={{ backgroundColor: getComplementaryColor(currentHex) }}></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Analogous</h4>
                      <div className="flex gap-2">
                        {getAnalogousColors(currentHex).map((color: string, index: number) => (
                          <div key={index} className="w-12 h-12 rounded" style={{ backgroundColor: color }}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </details>

              {/* Full Color Page Content */}
              <ColorPageContent 
                hex={currentHex} 
                name={undefined} 
                mode="sectionsOnly" 
                colorExistsInDb={false}
              />
            </div>
          </div>

          {/* Sidebar - 1/3 */}
          <ColorSidebar color={currentHex} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Helper functions for color harmonies
function getComplementaryColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#000000";
  return `#${(255 - rgb.r).toString(16).padStart(2, '0')}${(255 - rgb.g).toString(16).padStart(2, '0')}${(255 - rgb.b).toString(16).padStart(2, '0')}`;
}

function getAnalogousColors(hex: string): string[] {
  const rgb = hexToRgb(hex);
  if (!rgb) return [hex, hex, hex];
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  if (!hsl) return [hex, hex, hex];
  
  const colors = [];
  for (let i = -30; i <= 30; i += 30) {
    const newHue = (hsl.h + i + 360) % 360;
    const newRgb = hslToRgb(newHue, hsl.s, hsl.l);
    colors.push(`#${newRgb.r.toString(16).padStart(2, '0')}${newRgb.g.toString(16).padStart(2, '0')}${newRgb.b.toString(16).padStart(2, '0')}`);
  }
  
  return colors;
}