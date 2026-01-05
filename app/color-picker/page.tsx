import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdvancedColorPicker } from "@/components/tools/advanced-color-picker"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { BreadcrumbSchema } from "@/components/structured-data"
import { ExploreColorTools } from "@/components/tools/explore-color-tools"

export const metadata: Metadata = {
  title: "Color Picker - ColorMean",
  description: "Advanced color picker tool to select and explore colors. Get HEX, RGB, HSL color codes instantly.",
  alternates: {
    canonical: "https://colormean.com/color-picker",
  },
  openGraph: {
    title: "Color Picker - ColorMean",
    description:
      "Advanced color picker tool to select and explore colors. Get HEX, RGB, HSL color codes instantly.",
    url: "https://colormean.com/color-picker",
    siteName: "ColorMean",
    type: "website",
    images: [
      {
        url: "https://colormean.com/placeholder.jpg",
        width: 1200,
        height: 630,
        alt: "Color Picker tool by ColorMean",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Picker - ColorMean",
    description:
      "Advanced color picker tool to select and explore colors. Get HEX, RGB, HSL color codes instantly.",
    images: ["https://colormean.com/placeholder.jpg"],
  },
}

export default function ColorPickerPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <BreadcrumbSchema items={[
        { name: "Home", item: "https://colormean.com" },
        { name: "Color Picker", item: "https://colormean.com/color-picker" }
      ]} />
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <BreadcrumbNav items={[{ label: "Color Picker", href: "/color-picker" }]} />

        <div className="mt-6 space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Color Picker</h1>
            </div>
            <p className="text-muted-foreground mt-2">
              Select any color using our advanced color picker and get instant color codes
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-8">
              <AdvancedColorPicker />
              
              <div className="p-6 border-2 border-border rounded-lg space-y-4">
                <h2 className="text-2xl font-bold">About the Color Picker</h2>
                <p className="text-muted-foreground">
                  Use the Color Picker to select precise colors and get immediate conversions in HEX, RGB, and HSL.
                  Adjust hue, saturation, and lightness to refine your selection and copy values for design and code.
                </p>
              </div>

              <div className="p-6 border-2 border-border rounded-lg space-y-4">
                <h2 className="text-2xl font-bold">How to Use</h2>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Drag on the color area to select a color.</li>
                  <li>Use sliders to fine‑tune hue, saturation, and lightness.</li>
                  <li>Copy HEX, RGB, and HSL codes and paste into your project.</li>
                  <li>Click Explore to open the color’s detailed information page.</li>
                </ol>
              </div>

              <div className="p-6 border-2 border-border rounded-lg space-y-4">
                <h2 className="text-2xl font-bold">Why This Tool Matters</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Ensures accurate, consistent color values across design and code.</li>
                  <li>Speeds up workflows with instant conversions and copy actions.</li>
                  <li>Helps explore related colors and accessibility from the color page.</li>
                </ul>
              </div>
            </div>
            <ColorSidebar color="#5B6FD8" />
          </div>
          
          
        </div>
      </main>
      <ExploreColorTools current="color-picker" />
      <Footer />
    </div>
  )
}
