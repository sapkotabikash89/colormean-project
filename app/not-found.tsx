import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function NotFound() {
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
