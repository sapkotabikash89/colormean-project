import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"

export const metadata = {
  title: "Color Meanings - Explore Psychology, Spirituality and Culture",
  description:
    "Explore color meanings, psychology, spirituality, and cultural symbolism.",
}

export default function ColorMeaningsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <section className="bg-muted/30 py-12 px-4">
        <div className="container mx-auto">
          <BreadcrumbNav items={[{ label: "Color Meanings", href: "/color-meanings" }]} />
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Color Meanings</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Coming soon: Expert guides about colors, their psychology, spirituality, history, and usage in design.
            </p>
          </div>
        </div>
      </section>
      <main className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-muted-foreground mb-8">
            We're working on bringing you comprehensive color meaning content.
          </p>
          <a 
            href="/blog/" 
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Visit Our Blog
          </a>
        </div>
      </main>
      <Footer />
    </div>
  )
}
