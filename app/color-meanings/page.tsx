import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { Card } from "@/components/ui/card"
import Link from "next/link"

async function fetchPosts() {
  const res = await fetch("https://cms.colormean.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query Posts {
          posts(first: 24) {
            nodes {
              title
              excerpt
              uri
              date
              featuredImage {
                node {
                  sourceUrl
                  altText
                }
              }
            }
          }
        }
      `,
    }),
    // OPTIMIZATION: Increased revalidate time for Vercel free plan
    next: { revalidate: 3600 },  // 1 hour instead of 10 min
  })
  const json = await res.json()
  return json?.data?.posts?.nodes ?? []
}

export const metadata = {
  title: "Color Meanings - Explore Psychology, Spirituality and Culture",
  description:
    "Explore color meanings, psychology, spirituality, and cultural symbolism. Curated articles from our headless WordPress CMS.",
}

export default async function ColorMeaningsPage() {
  const posts = await fetchPosts()
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <section className="bg-muted/30 py-12 px-4">
        <div className="container mx-auto">
          <BreadcrumbNav items={[{ label: "Color Meanings", href: "/color-meanings" }]} />
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Color Meanings</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Read expert guides about colors, their psychology, spirituality, history, and usage in design
            </p>
          </div>
        </div>
      </section>
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: any, i: number) => {
            const img = post?.featuredImage?.node?.sourceUrl
            const alt = post?.featuredImage?.node?.altText || post?.title
            const excerpt = (post?.excerpt || "").replace(/<\/?[^>]+(>|$)/g, "")
            return (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={post?.uri || "#"} className="block">
                  {img && (
                    <img
                      src={img}
                      alt={alt}
                      width={1200}
                      height={800}
                      className="w-full h-auto object-cover"
                      style={{ aspectRatio: "1200 / 800" }}
                    />
                  )}
                  <div className="p-4 space-y-2">
                    <h2 className="text-lg font-bold line-clamp-2">{post?.title}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-3">{excerpt}</p>
                    <div className="text-xs text-muted-foreground">{new Date(post?.date).toLocaleDateString()}</div>
                  </div>
                </Link>
              </Card>
            )
          })}
        </div>
      </main>
      <Footer />
    </div>
  )
}
