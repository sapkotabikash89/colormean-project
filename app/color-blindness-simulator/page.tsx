import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ToolApplicationSchema, WebPageSchema } from "@/components/structured-data"
import { ColorBlindnessSimulatorClient } from "@/components/tool-wrappers"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { BreadcrumbSchema, FAQSchema } from "@/components/structured-data"
import { ExploreColorTools } from "@/components/tools/explore-color-tools"

export const metadata: Metadata = {
  title: "Color Blindness Simulator - ColorMean",
  description:
    "Simulate how colors appear to people with different types of color vision deficiency. Test your designs for accessibility.",
  alternates: {
    canonical: "https://colormean.com/color-blindness-simulator",
  },
  openGraph: {
    title: "Color Blindness Simulator - ColorMean",
    description:
      "Simulate how colors appear to people with different types of color vision deficiency. Test your designs for accessibility.",
    url: "https://colormean.com/color-blindness-simulator",
    siteName: "ColorMean",
    type: "website",
    images: [
      {
        url: "https://colormean.com/color%20blindness%20simulator%20online%20free.webp",
        width: 1200,
        height: 630,
        alt: "Color Blindness Simulator to test color visibility",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Blindness Simulator - ColorMean",
    description:
      "Simulate how colors appear to people with different types of color vision deficiency.",
    images: ["https://colormean.com/color%20blindness%20simulator%20online%20free.webp"],
  },
}

export default function ColorBlindnessSimulatorPage() {
  const faqs = [
    {
      question: "How accurate are color blindness simulators?",
      answer:
        "They provide approximations based on research. Individual perception varies, but simulators are useful for spotting accessibility issues.",
    },
    {
      question: "Can color blindness be cured?",
      answer:
        "Inherited color blindness cannot be cured, though special glasses may help. Some acquired cases are treatable.",
    },
    {
      question: "Why design for color blindness?",
      answer:
        "It ensures accessibility and usability for everyone, and helps meet legal requirements in some contexts.",
    },
  ]
  return (
    <div className="flex flex-col min-h-screen">
      <WebPageSchema
        name="Color Blindness Simulator"
        url="https://colormean.com/color-blindness-simulator"
        description="Simulate how colors appear for different color vision deficiencies."
      />
      <BreadcrumbSchema items={[
        { name: "Home", item: "https://colormean.com" },
        { name: "Color Blindness Simulator", item: "https://colormean.com/color-blindness-simulator" }
      ]} />
      <FAQSchema faqs={faqs} />
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
            <ToolApplicationSchema
              name="Color Blindness Simulator"
              slug="color-blindness-simulator"
              description="Color Blindness Simulator to test color visibility"
            />
            <ColorBlindnessSimulatorClient />
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
