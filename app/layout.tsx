import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { WebsiteSchema, OrganizationSchema, SoftwareApplicationSchema } from "@/components/structured-data"
import { ScrollToTop } from "@/components/scroll-to-top"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://www.colormean.com"),
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
    url: "https://www.colormean.com",
    siteName: "ColorMean",
  },
  twitter: {
    card: "summary_large_image",
    title: "ColorMean - Know Your Color",
    description: "Explore colors with detailed information, meanings, conversions, and professional tools.",
  },
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
    google: "your-google-verification-code",
  },
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#5B6FD8",
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <WebsiteSchema />
        <OrganizationSchema />
        <SoftwareApplicationSchema />
      </head>
      <body className={`${inter.className} px-[2px] sm:px-4`}>
        {children}
        <ScrollToTop />
        <Analytics />
      </body>
    </html>
  )
}
