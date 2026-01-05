import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { ContrastCheckerTool } from "@/components/tools/contrast-checker-tool"
import { BreadcrumbSchema } from "@/components/structured-data"
import { ExploreColorTools } from "@/components/tools/explore-color-tools"

export const metadata: Metadata = {
  title: "Contrast Checker - WCAG Accessibility Tool | ColorMean",
  description:
    "Check color contrast ratios for accessibility compliance. Ensure your designs meet WCAG AA and AAA standards for text, UI components, and graphics.",
  keywords: ["contrast checker", "WCAG compliance", "accessibility", "color contrast", "AA AAA standards"],
  alternates: {
    canonical: "https://www.colormean.com/contrast-checker",
  },
  openGraph: {
    title: "Contrast Checker - WCAG Accessibility Tool | ColorMean",
    description:
      "Check color contrast ratios for accessibility compliance. Ensure your designs meet WCAG AA and AAA standards for text, UI components, and graphics.",
    url: "https://www.colormean.com/contrast-checker",
    siteName: "ColorMean",
    type: "website",
    images: [
      {
        url: "https://www.colormean.com/placeholder.jpg",
        width: 1200,
        height: 630,
        alt: "Contrast Checker tool for WCAG compliance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contrast Checker - WCAG Accessibility Tool | ColorMean",
    description:
      "Check color contrast ratios for accessibility compliance. Ensure your designs meet WCAG AA and AAA standards.",
    images: ["https://www.colormean.com/placeholder.jpg"],
  },
}

export default function ContrastCheckerPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <BreadcrumbSchema items={[
        { name: "Home", item: "https://www.colormean.com" },
        { name: "Contrast Checker", item: "https://www.colormean.com/contrast-checker" }
      ]} />
      <Header />

      <section className="bg-muted/30 py-12 px-4">
        <div className="container mx-auto">
          <BreadcrumbNav items={[{ label: "Contrast Checker", href: "/contrast-checker" }]} />
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Contrast Checker</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Check color contrast for accessibility and ensure your designs meet WCAG standards
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <ContrastCheckerTool />
          </div>
          <ColorSidebar color="#5B6FD8" />
        </div>

        
      </main>

      <ExploreColorTools current="contrast-checker" />

      <Footer />
    </div>
  )
}
