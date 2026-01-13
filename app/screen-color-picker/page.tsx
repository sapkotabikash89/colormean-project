import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbSchema, FAQSchema, ToolApplicationSchema, WebPageSchema } from "@/components/structured-data"
import { ScreenColorPickerClient } from "@/components/tool-wrappers"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ShareButtons } from "@/components/share-buttons"
import { ExploreColorTools } from "@/components/tools/explore-color-tools"

export const metadata: Metadata = {
  title: "Screen Color Picker - ColorMean",
  description:
    "Pick colors directly from your screen using the EyeDropper API. Extract colors from anywhere on your display.",
  alternates: {
    canonical: "https://colormean.com/screen-color-picker",
  },
  openGraph: {
    title: "Screen Color Picker - ColorMean",
    description:
      "Pick colors directly from your screen using the EyeDropper API. Extract colors from anywhere on your display.",
    url: "https://colormean.com/screen-color-picker",
    siteName: "ColorMean",
    type: "website",
    images: [
      {
        url: "https://colormean.com/screen-color-picker-online-free.webp",
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
    images: ["https://colormean.com/screen-color-picker-online-free.webp"],
  },
}

export default function ScreenColorPickerPage() {
  const faqs = [
    {
      question: "Which browsers support the screen color picker?",
      answer:
        "The EyeDropper API works in Chrome 95+, Edge 95+, and Opera 81+. Safari and Firefox don’t currently support it.",
    },
    {
      question: "Can I pick colors from other applications?",
      answer:
        "Yes. You can sample colors from other apps, windows, and your desktop wallpaper as the picker scans the whole screen.",
    },
    {
      question: "Is this tool free to use?",
      answer: "Yes, it’s completely free and has no usage limits.",
    },
  ]
  return (
    <div className="flex flex-col min-h-screen">
      <WebPageSchema
        name="Screen Color Picker"
        url="https://colormean.com/screen-color-picker"
        description="Pick colors directly from your screen using the EyeDropper API."
      />
      <BreadcrumbSchema items={[
        { name: "Home", item: "https://colormean.com" },
        { name: "Screen Color Picker", item: "https://colormean.com/screen-color-picker" }
      ]} />
      <FAQSchema faqs={faqs} />
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <BreadcrumbNav items={[{ label: "Screen Color Picker", href: "/screen-color-picker" }]} />

        <div className="mt-6 space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Screen Color Picker</h1>
            </div>
            <p className="text-muted-foreground mt-2">
              Pick colors from anywhere on your screen using the native color picker
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8" aria-label="Interactive Screen Color Picker Tool to sample colors anywhere on your display">
            <div className="flex-1">
              <ToolApplicationSchema
                name="Screen Color Picker"
                slug="screen-color-picker"
                description="Interactive Screen Color Picker Tool to sample colors anywhere on your display"
              />
              <ScreenColorPickerClient />
              <div className="mt-8">
                <ShareButtons title="Screen Color Picker by ColorMean" />
              </div>
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
