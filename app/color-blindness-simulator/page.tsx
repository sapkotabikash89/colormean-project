import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ColorBlindnessSimulatorTool } from "@/components/tools/color-blindness-simulator-tool"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { BreadcrumbSchema } from "@/components/structured-data"
import { ExploreColorTools } from "@/components/tools/explore-color-tools"

export const metadata: Metadata = {
  title: "Color Blindness Simulator - ColorMean",
  description:
    "Simulate how colors appear to people with different types of color vision deficiency. Test your designs for accessibility.",
  alternates: {
    canonical: "https://www.colormean.com/color-blindness-simulator",
  },
  openGraph: {
    title: "Color Blindness Simulator - ColorMean",
    description:
      "Simulate how colors appear to people with different types of color vision deficiency. Test your designs for accessibility.",
    url: "https://www.colormean.com/color-blindness-simulator",
    siteName: "ColorMean",
    type: "website",
    images: [
      {
        url: "https://www.colormean.com/color-blindness-simulator-og.jpg",
        secureUrl: "https://www.colormean.com/color-blindness-simulator-og.jpg",
        type: "image/jpeg",
        width: 1200,
        height: 630,
        alt: "Color Blindness Simulator tool by ColorMean",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Blindness Simulator - ColorMean",
    description:
      "Simulate how colors appear to people with different types of color vision deficiency.",
    images: ["https://www.colormean.com/color-blindness-simulator-og.jpg"],
  },
}

export default function ColorBlindnessSimulatorPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <BreadcrumbSchema items={[
        { name: "Home", item: "https://www.colormean.com" },
        { name: "Color Blindness Simulator", item: "https://www.colormean.com/color-blindness-simulator" }
      ]} />
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <BreadcrumbNav items={[{ label: "Color Blindness Simulator", href: "/color-blindness-simulator" }]} />

        <div className="mt-6 space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Color Blindness Simulator</h1>
            </div>
            <p className="text-muted-foreground mt-2">
              See how colors appear to people with different types of color vision deficiency
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <ColorBlindnessSimulatorTool />
            </div>
            <ColorSidebar color="#5B6FD8" />
          </div>

          


        </div>
      </main>
      <ExploreColorTools current="color-blindness-simulator" />
      <Footer />
    </div>
  )
}
