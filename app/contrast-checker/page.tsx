import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { ToolApplicationSchema, WebPageSchema } from "@/components/structured-data"
import { ContrastCheckerClient } from "@/components/tool-wrappers"
import { BreadcrumbSchema, FAQSchema } from "@/components/structured-data"
import { ExploreColorTools } from "@/components/tools/explore-color-tools"

export const metadata: Metadata = {
  title: "Contrast Checker - WCAG Accessibility Tool | ColorMean",
  description:
    "Check color contrast ratios for accessibility compliance. Ensure your designs meet WCAG AA and AAA standards for text, UI components, and graphics.",
  keywords: ["contrast checker", "WCAG compliance", "accessibility", "color contrast", "AA AAA standards"],
  alternates: {
    canonical: "https://colormean.com/contrast-checker",
  },
  openGraph: {
    title: "Contrast Checker - WCAG Accessibility Tool | ColorMean",
    description:
      "Check color contrast ratios for accessibility compliance. Ensure your designs meet WCAG AA and AAA standards for text, UI components, and graphics.",
    url: "https://colormean.com/contrast-checker",
    siteName: "ColorMean",
    type: "website",
    images: [
      {
        url: "https://colormean.com/color%20contrast%20checker%20online%20free.webp",
        width: 1200,
        height: 630,
        alt: "Contrast Checker Tool to verify color accessibility ratios",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contrast Checker - WCAG Accessibility Tool | ColorMean",
    description:
      "Check color contrast ratios for accessibility compliance. Ensure your designs meet WCAG AA and AAA standards.",
    images: ["https://colormean.com/color%20contrast%20checker%20online%20free.webp"],
  },
}

export default function ContrastCheckerPage() {
  const faqs = [
    {
      question: "What is a good contrast ratio?",
      answer:
        "For normal text, aim for at least 4.5:1 (WCAG AA) or 7:1 (WCAG AAA). For large text, 3:1 (AA) or 4.5:1 (AAA) is acceptable.",
    },
    {
      question: "Do I need to meet AAA standards?",
      answer:
        "AA is required for most sites. AAA is ideal but not always practical—prioritize AA, and use AAA for critical content when possible.",
    },
    {
      question: "What if my brand colors don't meet standards?",
      answer:
        "Use darker or lighter variants for text and pair colors to ensure sufficient contrast while retaining brand identity.",
    },
  ]
  return (
    <div className="flex flex-col min-h-screen">
      <WebPageSchema
        name="Contrast Checker"
        url="https://colormean.com/contrast-checker"
        description="Check color contrast ratios for accessibility compliance (WCAG AA and AAA)."
      />
      <BreadcrumbSchema items={[
        { name: "Home", item: "https://colormean.com" },
        { name: "Contrast Checker", item: "https://colormean.com/contrast-checker" }
      ]} />
      <FAQSchema faqs={faqs} />
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
            <ToolApplicationSchema
              name="Contrast Checker"
              slug="contrast-checker"
              description="Contrast Checker Tool to verify color accessibility ratios"
            />
            <ContrastCheckerClient />
          </div>
          <ColorSidebar color="#5B6FD8" />
        </div>

        
      </main>

      <ExploreColorTools current="contrast-checker" />

      <Footer />
    </div>
  )
}
