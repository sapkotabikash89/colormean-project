"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function NotFound() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if we're on a /colors/ path with any uppercase letters
    if (pathname && pathname.startsWith('/colors/')) {
      const parts = pathname.split('/')
      // Skip empty parts and "colors" segment
      const hexPart = parts.find((p: string) => p && p !== 'colors')

      if (hexPart && /[A-Z]/.test(hexPart)) {
        // We found uppercase letters in the hex part, redirect to lowercase
        const newPath = pathname.toLowerCase()
        router.replace(newPath)
      }
    }
  }, [pathname, router])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center space-y-6 max-w-2xl">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="text-4xl font-bold">Page Not Found</h2>
          <p className="text-lg text-muted-foreground">
            The color or page you're looking for doesn't exist. Try searching for a different color or explore our color
            library.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/">
              <Button size="lg">Go Home</Button>
            </Link>
            <Link href="/colors">
              <Button size="lg" variant="outline" className="bg-transparent">
                Browse Colors
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
