import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import "../globals.css" // Import globals for blog posts
import { WebsiteSchema, OrganizationSchema, SoftwareApplicationSchema } from "@/components/structured-data"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://colormean.com"),
  title: "ColorMean - Know Your Color | Color Information, Meanings & Tools",
  description:
    "Explore colors with ColorMean. Get detailed color information, meanings, conversions, harmonies, and use professional color tools including color picker, contrast checker, and more.",
  keywords: [
    "color picker",
    "color codes",
    "hex colors",
    "rgb colors",
    "color converter",
    "color meanings",
    "color harmonies",
    "color palette",
    "contrast checker",
  ],
  authors: [{ name: "ColorMean" }],
  openGraph: {
    title: "ColorMean - Know Your Color",
    description: "Explore colors with detailed information, meanings, conversions, and professional tools.",
    type: "website",
    url: "https://colormean.com",
    siteName: "ColorMean",
    images: [
      {
        url: "https://colormean.com/colormean-know%20your%20color.webp",
        width: 1200,
        height: 630,
        alt: "ColorMean homepage preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ColorMean - Know Your Color",
    description: "Explore colors with detailed information, meanings, conversions, and professional tools.",
    images: ["https://colormean.com/colormean-know%20your%20color.webp"],
  },
  icons: { icon: "/favicon.webp" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "tiT0KL3QCJ4bLgDI-k7s8vphX4Sx6LQCFmkflXUe4pU",
  },
}

export const viewport: Viewport = {
  themeColor: "#5B6FD8",
}

export default function BlogRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="max-w-[1200px] mx-auto">
      {children}
    </div>
  )
}