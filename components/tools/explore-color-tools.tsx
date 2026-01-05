'use client'

import Link from "next/link"

const tools = [
  { slug: "color-wheel", title: "Color Wheel", description: "Explore harmonies like complementary, triadic, and analogous." },
  { slug: "contrast-checker", title: "Contrast Checker", description: "Validate WCAG AA/AAA contrast for accessible designs." },
  { slug: "color-picker", title: "Color Picker", description: "Pick colors and get HEX, RGB, HSL instantly." },
  { slug: "screen-color-picker", title: "Screen Color Picker", description: "Pick colors from anywhere on your screen." },
  { slug: "image-color-picker", title: "Image Color Picker", description: "Click an image to sample pixel colors." },
  { slug: "palette-from-image", title: "Palette from Image", description: "Generate harmonious palettes from uploaded images." },
  { slug: "color-blindness-simulator", title: "Color Blindness Simulator", description: "Preview designs for different vision deficiencies." },
]

export function ExploreColorTools({ current }: { current: string }) {
  const items = tools.filter(t => t.slug !== current).slice(0, 4)

  return (
    <section className="w-full bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">Explore Color Tools</h2>
          <p className="text-muted-foreground">
            Discover more professional tools that connect color theory with practical workflows.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <Link
              key={item.slug}
              href={`/${item.slug}`}
              className="group block rounded-xl border-2 border-border bg-background p-6 transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <span className="text-primary transition group-hover:scale-110">→</span>
              </div>
              <p className="mt-2 text-muted-foreground">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
