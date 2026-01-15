"use client";

import { useState, useEffect, useRef } from "react";
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
  getContrastColor as originalGetContrastColor, 
  hexToRgb, 
  rgbToHsl, 
  rgbToCmyk,
  getColorHarmony,
  hslToRgb,
  rgbToHex
} from "@/lib/color-utils";
import { BreadcrumbSchema, FAQSchema, WebPageSchema } from "@/components/structured-data";
import { ShareButtons } from "@/components/share-buttons";

const DEFAULT_HEX = "#5B6FD8";

export default function HtmlColorPickerPage() {
  // Get hex from URL query parameter on client side
  const [initialHex, setInitialHex] = useState<string | null>(null);
  
  useEffect(() => {
    // Client-side only - parse URL parameters
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const hexParam = urlParams.get('hex');
      if (hexParam && isValidHex(`#${hexParam}`)) {
        setInitialHex(`#${hexParam}`);
      } else {
        // If no hex parameter, default to DEFAULT_HEX
        setInitialHex(DEFAULT_HEX);
      }
    }
    
    // Listen for URL changes to update color when hex parameter changes
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const hexParam = urlParams.get('hex');
      if (hexParam && isValidHex(`#${hexParam}`)) {
        setInitialHex(`#${hexParam}`);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  
  // Don't render anything until we have the initial hex from URL
  if (initialHex === null) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
            <p className="mt-2 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <PickerContent initialHex={initialHex} />
  );
}

function PickerContent({ initialHex = DEFAULT_HEX }: { initialHex?: string }) {
  const [currentHex, setCurrentHex] = useState(initialHex);

  // Update color when hex parameter changes
  useEffect(() => {
    setCurrentHex(initialHex);
    // Update URL to reflect current color
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('hex', initialHex.replace('#', ''));
    window.history.replaceState({}, '', newUrl);
  }, [initialHex]);

  // Derived values
  const rgb = hexToRgb(currentHex);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
  const contrastColor = originalGetContrastColor(currentHex);
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
        url={`https://colormean.com/html-color-picker?hex=${currentHex.replace("#", "").toUpperCase()}`}
        description={`Explore ${currentHex} color information, conversions, harmonies, variations, and accessibility.`}
      />
      <BreadcrumbSchema items={[
        { name: "ColorMean", item: "https://colormean.com" },
        { name: "Color Names", item: "https://colormean.com/colors" },
        { name: currentHex.toUpperCase(), item: `https://colormean.com/html-color-picker?hex=${currentHex.replace("#", "").toUpperCase()}` }
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
              { label: currentHex.toUpperCase(), href: `/html-color-picker?hex=${currentHex.replace("#", "").toUpperCase()}` },
            ]}
          />
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">{currentHex.toUpperCase()} Color Information</h1>
            <p className="max-w-3xl mx-auto text-sm md:text-base opacity-90">
              Everything you need to know about {currentHex.toUpperCase()} including values, color harmonies, shades,
              meanings, and applications in design, branding, and everyday visuals.
            </p>
            <div className="max-w-4xl mx-auto">
              <div className="font-mono text-xs md:text-sm flex flex-wrap justify-center gap-4">
                <CopyButton showIcon={false} variant="ghost" size="sm" className="p-0 h-auto" label={`HEX: ${currentHex.toUpperCase()}`} value={currentHex.toUpperCase()} />
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
        ]}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Content Area - 2/3 */}
          <div className="flex-1">
            <div className="space-y-8">


              {/* Advanced Color Picker Tool */}
              <AdvancedColorPickerComponent 
                selectedColor={currentHex}
                onColorChange={updateCurrentHex}
              />
              
              {/* Social Share Section */}
              <div className="flex justify-center py-4">
                <ShareButtons url={`https://colormean.com/html-color-picker?hex=${currentHex.replace("#", "").toUpperCase()}`} title={`${currentHex.toUpperCase()} Color Information - ColorMean`} />
              </div>
              
              {/* Static color page sections (exact parity) */}
              <ColorPageContent 
                hex={currentHex} 
                name={undefined} 
                mode="full" 
                colorExistsInDb={false}
                onColorChange={updateCurrentHex}
              />
            </div>
          </div>

          {/* Sidebar - 1/3 */}
          <ColorSidebar color={currentHex} onColorChange={updateCurrentHex} />
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

// Advanced Color Picker Component (inlined for this page)
function AdvancedColorPickerComponent({ selectedColor, onColorChange }: { selectedColor: string; onColorChange: (color: string) => void }) {
  const [hue, setHue] = useState(230);
  const [saturation, setSaturation] = useState(70);
  const [lightness, setLightness] = useState(60);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Extract HSL from current color to initialize sliders
  useEffect(() => {
    const rgb = hexToRgb(selectedColor);
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setHue(hsl.h);
      setSaturation(hsl.s);
      setLightness(hsl.l);
    }
  }, [selectedColor]);

  useEffect(() => {
    drawColorSpace();
  }, [hue]);

  const drawColorSpace = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Draw saturation and lightness gradient
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const s = (x / width) * 100;
        const l = 100 - (y / height) * 100;
        const rgb = hslToRgb(hue, s, l);
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        ctx.fillStyle = hex;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  };

  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    let clientX: number;
    let clientY: number;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(clientY - rect.top, rect.height));

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const canvasX = x * scaleX;
    const canvasY = y * scaleY;

    const newSaturation = (canvasX / canvas.width) * 100;
    const newLightness = 100 - (canvasY / canvas.height) * 100;

    setSaturation(Math.max(0, Math.min(100, Math.round(newSaturation))));
    setLightness(Math.max(0, Math.min(100, Math.round(newLightness))));

    const rgb = hslToRgb(hue, newSaturation, newLightness);
    const newColor = rgbToHex(rgb.r, rgb.g, rgb.b);
    onColorChange(newColor);
  };

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHue = Number.parseInt(e.target.value);
    setHue(newHue);
    const rgb = hslToRgb(newHue, saturation, lightness);
    const newColor = rgbToHex(rgb.r, rgb.g, rgb.b);
    onColorChange(newColor);
  };

  const rgb = hexToRgb(selectedColor);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  const pickerX = `${Math.max(0, Math.min(100, saturation))}%`;
  const pickerY = `${Math.max(0, Math.min(100, 100 - lightness))}%`;

  return (
    <Card className="p-3 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold">Interactive Color Picker</h2>
      </div>

      <div className="space-y-6">
        {/* Color Space Canvas and Hue Slider */}
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
          <div className="relative w-full max-w-[320px] sm:max-w-[400px]">
            <canvas
              ref={canvasRef}
              width={400}
              height={280}
              className="w-full h-auto aspect-[10/7] rounded-lg border-2 border-border cursor-crosshair touch-none"
              onClick={handleCanvasInteraction}
              onMouseMove={(e) => isDragging && handleCanvasInteraction(e)}
              onMouseDown={(e) => {
                setIsDragging(true);
                handleCanvasInteraction(e);
              }}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onTouchStart={(e) => {
                setIsDragging(true);
                handleCanvasInteraction(e);
              }}
              onTouchMove={(e) => {
                e.preventDefault();
                handleCanvasInteraction(e);
              }}
              onTouchEnd={() => setIsDragging(false)}
            />
            <div
              className="absolute w-4 h-4 sm:w-5 sm:h-5 border-2 border-white rounded-full pointer-events-none"
              style={{
                left: pickerX,
                top: pickerY,
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)",
              }}
            />
          </div>

          {/* Hue Slider */}
          <div className="space-y-2 w-full max-w-[320px] sm:max-w-[400px]">
            <label className="text-sm font-medium">Hue: {hue}°</label>
            <input
              type="range"
              min="0"
              max="360"
              value={hue}
              onChange={handleHueChange}
              className="w-full h-3 sm:h-4 rounded-lg appearance-none cursor-pointer"
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

        {/* Color Display and Values - Now Below Picker on All Screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column: Color Preview */}
          <div className="space-y-3">
            <div
              className="w-full h-32 sm:h-40 rounded-lg border-2 border-border flex items-center justify-center font-mono font-semibold text-base sm:text-lg"
              style={{ backgroundColor: selectedColor, color: originalGetContrastColor(selectedColor) }}
            >
              {selectedColor.toUpperCase()}
            </div>
          </div>

          {/* Right Column: Color Values */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-md">
              <div className="min-w-0 flex-1">
                <span className="text-xs sm:text-sm text-muted-foreground">HEX</span>
                <p className="font-mono font-semibold text-sm sm:text-base truncate">{selectedColor}</p>
              </div>
              <CopyButton value={selectedColor} />
            </div>
            {rgb && (
              <>
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div className="min-w-0 flex-1">
                    <span className="text-xs sm:text-sm text-muted-foreground">RGB</span>
                    <p className="font-mono text-sm sm:text-base truncate">
                      ({rgb.r}, {rgb.g}, {rgb.b})
                    </p>
                  </div>
                  <CopyButton value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
                </div>
                {hsl && (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div className="min-w-0 flex-1">
                      <span className="text-xs sm:text-sm text-muted-foreground">HSL</span>
                      <p className="font-mono text-sm sm:text-base truncate">
                        ({hsl.h}°, {hsl.s}%, {hsl.l}%)
                      </p>
                    </div>
                    <CopyButton value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

