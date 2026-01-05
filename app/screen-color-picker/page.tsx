import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScreenColorPickerTool } from "@/components/tools/screen-color-picker-tool"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ShareButtons } from "@/components/share-buttons"
import { BreadcrumbSchema } from "@/components/structured-data"
import { ExploreColorTools } from "@/components/tools/explore-color-tools"

export const metadata: Metadata = {
  title: "Screen Color Picker - ColorMean",
  description:
    "Pick colors directly from your screen using the EyeDropper API. Extract colors from anywhere on your display.",
  alternates: {
    canonical: "https://www.colormean.com/screen-color-picker",
  },
  openGraph: {
    title: "Screen Color Picker - ColorMean",
    description:
      "Pick colors directly from your screen using the EyeDropper API. Extract colors from anywhere on your display.",
    url: "https://www.colormean.com/screen-color-picker",
    siteName: "ColorMean",
    type: "website",
    images: [
      {
        url: "https://www.colormean.com/placeholder.jpg",
        width: 1200,
        height: 630,
        alt: "Screen Color Picker tool by ColorMean",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Screen Color Picker - ColorMean",
    description:
      "Pick colors directly from your screen using the EyeDropper API. Extract colors from anywhere on your display.",
    images: ["https://www.colormean.com/placeholder.jpg"],
  },
}

export default function ScreenColorPickerPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <BreadcrumbSchema items={[
        { name: "Home", item: "https://www.colormean.com" },
        { name: "Screen Color Picker", item: "https://www.colormean.com/screen-color-picker" }
      ]} />
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <BreadcrumbNav items={[{ label: "Screen Color Picker", href: "/screen-color-picker" }]} />

        <div className="mt-6 space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Screen Color Picker</h1>
              <ShareButtons title="Screen Color Picker by ColorMean" />
            </div>
            <p className="text-muted-foreground mt-2">
              Pick colors from anywhere on your screen using the native color picker
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <ScreenColorPickerTool />
            </div>
            <ColorSidebar color="#5B6FD8" />
          </div>
        </div>
      </main>
      
      <ExploreColorTools current="screen-color-picker" />
      <Footer />
    </div>
  )
}
