import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ColorPickerClient } from "@/components/tool-wrappers"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { BreadcrumbSchema, FAQSchema, ToolApplicationSchema, WebPageSchema, HowToSchema } from "@/components/structured-data"
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
        url: "https://colormean.com/color%20picker%20online%20free.webp",
        width: 1200,
        height: 630,
        alt: "Interactive Color Picker Tool to sample and select colors",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Picker - ColorMean",
    description:
      "Advanced color picker tool to select and explore colors. Get HEX, RGB, HSL color codes instantly.",
    images: ["https://colormean.com/color%20picker%20online%20free.webp"],
  },
}

export default function ColorPickerPage() {
  const faqs = [
    {
      question: "How do I select a color precisely?",
      answer:
        "Drag on the color area and fine‑tune with sliders for hue, saturation, and lightness. Copy exact HEX, RGB, and HSL values.",
    },
    {
      question: "Can I explore related colors?",
      answer:
        "Yes. Use the Explore action to open the color detail page with harmonies, tints, shades, tones, and accessibility info.",
    },
    {
      question: "Is the tool free to use?",
      answer: "Yes. The Color Picker is completely free with no usage limits.",
    },
  ]
  return (
    <div className="flex flex-col min-h-screen">
      <WebPageSchema
        name="Color Picker"
        url="https://colormean.com/color-picker"
        description="Advanced color picker tool to select and explore colors. Get HEX, RGB, HSL color codes instantly."
      />
      <BreadcrumbSchema items={[
        { name: "Home", item: "https://colormean.com" },
        { name: "Color Picker", item: "https://colormean.com/color-picker" }
      ]} />
      <FAQSchema faqs={faqs} />
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
              <ToolApplicationSchema
                name="Color Picker"
                slug="color-picker"
                description="Interactive Color Picker Tool to sample and select colors"
              />
              <ColorPickerClient />
              
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
              <HowToSchema
                name="How to use Color Picker"
                steps={[
                  "Drag on the color area to select a color.",
                  "Use sliders to fine‑tune hue, saturation, and lightness.",
                  "Copy HEX, RGB, and HSL codes and paste into your project.",
                  "Click Explore to open the color’s detailed information page.",
                ]}
              />

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
      <section className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">FAQs</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="border border-border rounded-md p-4">
                <summary className="font-semibold text-lg cursor-pointer list-none">{faq.question}</summary>
                <div className="mt-2 text-muted-foreground">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
