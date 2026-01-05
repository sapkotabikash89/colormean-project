import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { ShareButtons } from "@/components/share-buttons"
import { HelpfulVote } from "@/components/helpful-vote"
import { WPColorContext } from "@/components/wp-color-context"
import { ColorPageContent } from "@/components/color-page-content"
import { WPSEOHead } from "@/components/wpseo-head"
import { BreadcrumbSchema } from "@/components/structured-data"
import { CopyButton } from "@/components/copy-button"
import { getContrastColor, hexToRgb, rgbToHsl } from "@/lib/color-utils"

async function fetchPostByUri(uri: string) {
  const variants = Array.from(
    new Set([
      uri,
      uri.endsWith("/") ? uri.slice(0, -1) : `${uri}/`,
      decodeURI(uri),
      encodeURI(uri),
      (() => {
        const s = lastSegment(uri)
        return s ? `/color-meanings/${s}/` : uri
      })(),
    ])
  )
  for (const u of variants) {
    try {
      const res = await fetch("https://cms.colormean.com/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query NodeByUri($uri: String!) {
          nodeByUri(uri: $uri) {
            __typename
            ... on Post {
              title
              content
              uri
              date
              featuredImage {
                node {
                  sourceUrl
                  altText
                }
              }
              tags { nodes { name uri databaseId } }
              categories { nodes { name uri databaseId } }
              seo {
                title
                metaDesc
                canonical
                focuskw
                metaRobotsNoindex
                metaRobotsNofollow
                metaRobotsAdvanced
                opengraphTitle
                opengraphDescription
                opengraphType
                opengraphUrl
                opengraphSiteName
                opengraphPublishedTime
                opengraphModifiedTime
                opengraphAuthor
                opengraphSection
                opengraphTags
                opengraphLocale
                opengraphLocaleAlternate
                opengraphImage {
                  mediaItemUrl
                  altText
                  mediaDetails { width height }
                  sourceUrl
                }
                twitterTitle
                twitterDescription
                twitterCard
                twitterSite
                twitterCreator
                twitterImage {
                  mediaItemUrl
                  altText
                  sourceUrl
                }
                breadcrumbs {
                  text
                  url
                }
                schema {
                  raw
                }
                cornerstone
                estimatedReadingTime
              }
            }
            ... on Page {
              title
              content
              uri
              date
              featuredImage {
                node {
                  sourceUrl
                  altText
                }
              }
              seo {
                title
                metaDesc
                canonical
                focuskw
                metaRobotsNoindex
                metaRobotsNofollow
                metaRobotsAdvanced
                opengraphTitle
                opengraphDescription
                opengraphType
                opengraphUrl
                opengraphSiteName
                opengraphPublishedTime
                opengraphModifiedTime
                opengraphAuthor
                opengraphSection
                opengraphTags
                opengraphLocale
                opengraphLocaleAlternate
                opengraphImage {
                  mediaItemUrl
                  altText
                  mediaDetails { width height }
                  sourceUrl
                }
                twitterTitle
                twitterDescription
                twitterCard
                twitterSite
                twitterCreator
                twitterImage {
                  mediaItemUrl
                  altText
                  sourceUrl
                }
                breadcrumbs {
                  text
                  url
                }
                schema {
                  raw
                }
                cornerstone
                estimatedReadingTime
              }
            }
            ... on Category {
              name
              uri
              description
            }
          }
        }
      `,
          variables: { uri: u },
        }),
        next: { revalidate: 600, tags: [`wp:node:${u}`] },
      })
      const json = await res.json()
      if (json?.data?.nodeByUri) return json.data.nodeByUri
    } catch {}
  }
  return null
}

// No longer using REST Yoast; rely on WPGraphQL `seo` fields for metadata

async function fetchPostBySlug(slug: string) {
  try {
    const res = await fetch("https://cms.colormean.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query PostBySlug($slug: ID!) {
            post(id: $slug, idType: SLUG) {
              __typename
              title
              content
              uri
              date
              featuredImage { node { sourceUrl altText } }
              tags { nodes { name uri databaseId } }
              categories { nodes { name uri databaseId } }
              seo {
                title
                metaDesc
                canonical
                focuskw
                metaRobotsNoindex
                metaRobotsNofollow
                metaRobotsAdvanced
                opengraphTitle
                opengraphDescription
                opengraphType
                opengraphUrl
                opengraphSiteName
                opengraphPublishedTime
                opengraphModifiedTime
                opengraphAuthor
                opengraphSection
                opengraphTags
                opengraphLocale
                opengraphLocaleAlternate
                opengraphImage { mediaItemUrl altText mediaDetails { width height } sourceUrl }
                twitterTitle
                twitterDescription
                twitterCard
                twitterSite
                twitterCreator
                twitterImage { mediaItemUrl altText sourceUrl }
                breadcrumbs { text url }
                schema { raw }
                cornerstone
                estimatedReadingTime
              }
            }
          }
        `,
        variables: { slug },
      }),
      next: { revalidate: 600, tags: [`wp:slug:${slug}`] },
    })
    const json = await res.json()
    return json?.data?.post ?? null
  } catch {
    return null
  }
}

async function fetchContentByUri(uri: string) {
  try {
    const res = await fetch("https://cms.colormean.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query ContentByUri($uri: ID!) {
            post(id: $uri, idType: URI) {
              __typename
              title
              content
              uri
              date
              featuredImage { node { sourceUrl altText } }
              tags { nodes { name uri databaseId } }
              categories { nodes { name uri databaseId } }
              seo {
                title
                metaDesc
                canonical
                focuskw
                metaRobotsNoindex
                metaRobotsNofollow
                metaRobotsAdvanced
                opengraphTitle
                opengraphDescription
                opengraphType
                opengraphUrl
                opengraphSiteName
                opengraphPublishedTime
                opengraphModifiedTime
                opengraphAuthor
                opengraphSection
                opengraphTags
                opengraphLocale
                opengraphLocaleAlternate
                opengraphImage { mediaItemUrl altText mediaDetails { width height } sourceUrl }
                twitterTitle
                twitterDescription
                twitterCard
                twitterSite
                twitterCreator
                twitterImage { mediaItemUrl altText sourceUrl }
                breadcrumbs { text url }
                schema { raw }
                cornerstone
                estimatedReadingTime
              }
            }
            page(id: $uri, idType: URI) {
              __typename
              title
              content
              uri
              date
              featuredImage { node { sourceUrl altText } }
              seo {
                title
                metaDesc
                canonical
                focuskw
                metaRobotsNoindex
                metaRobotsNofollow
                metaRobotsAdvanced
                opengraphTitle
                opengraphDescription
                opengraphType
                opengraphUrl
                opengraphSiteName
                opengraphPublishedTime
                opengraphModifiedTime
                opengraphAuthor
                opengraphSection
                opengraphTags
                opengraphLocale
                opengraphLocaleAlternate
                opengraphImage { mediaItemUrl altText mediaDetails { width height } sourceUrl }
                twitterTitle
                twitterDescription
                twitterCard
                twitterSite
                twitterCreator
                twitterImage { mediaItemUrl altText sourceUrl }
                breadcrumbs { text url }
                schema { raw }
                cornerstone
                estimatedReadingTime
              }
            }
          }
        `,
        variables: { uri },
      }),
      next: { revalidate: 600, tags: [`wp:uri:${uri}`] },
    })
    const json = await res.json()
    return json?.data?.post ?? json?.data?.page ?? null
  } catch {
    return null
  }
}

async function fetchAnyBySearch(term: string) {
  try {
    const res = await fetch("https://cms.colormean.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query SearchContent($q: String!) {
            posts(where: { search: $q }, first: 1) {
              nodes {
                __typename
                title
                content
                uri
                date
                featuredImage { node { sourceUrl altText } }
                tags { nodes { name uri databaseId } }
                categories { nodes { name uri databaseId } }
                seo {
                  title
                  metaDesc
                  canonical
                  focuskw
                  metaRobotsNoindex
                  metaRobotsNofollow
                  metaRobotsAdvanced
                  opengraphTitle
                  opengraphDescription
                  opengraphType
                  opengraphUrl
                  opengraphSiteName
                  opengraphPublishedTime
                  opengraphModifiedTime
                  opengraphAuthor
                  opengraphSection
                  opengraphTags
                  opengraphLocale
                  opengraphLocaleAlternate
                  opengraphImage { mediaItemUrl altText mediaDetails { width height } sourceUrl }
                  twitterTitle
                  twitterDescription
                  twitterCard
                  twitterSite
                  twitterCreator
                  twitterImage { mediaItemUrl altText sourceUrl }
                  breadcrumbs { text url }
                  schema { raw }
                  cornerstone
                  estimatedReadingTime
                }
              }
            }
            pages(where: { search: $q }, first: 1) {
              nodes {
                __typename
                title
                content
                uri
                date
                featuredImage { node { sourceUrl altText } }
                seo {
                  title
                  metaDesc
                  canonical
                  focuskw
                  metaRobotsNoindex
                  metaRobotsNofollow
                  metaRobotsAdvanced
                  opengraphTitle
                  opengraphDescription
                  opengraphType
                  opengraphUrl
                  opengraphSiteName
                  opengraphPublishedTime
                  opengraphModifiedTime
                  opengraphAuthor
                  opengraphSection
                  opengraphTags
                  opengraphLocale
                  opengraphLocaleAlternate
                  opengraphImage { mediaItemUrl altText mediaDetails { width height } sourceUrl }
                  twitterTitle
                  twitterDescription
                  twitterCard
                  twitterSite
                  twitterCreator
                  twitterImage { mediaItemUrl altText sourceUrl }
                  breadcrumbs { text url }
                  schema { raw }
                  cornerstone
                  estimatedReadingTime
                }
              }
            }
          }
        `,
        variables: { q: term },
      }),
      next: { revalidate: 600, tags: [`wp:search:${term}`] },
    })
    const json = await res.json()
    const post = json?.data?.posts?.nodes?.[0]
    const page = json?.data?.pages?.nodes?.[0]
    return post ?? page ?? null
  } catch {
    return null
  }
}

function lastSegment(path: string) {
  const parts = path.split("/").filter(Boolean)
  return parts[parts.length - 1] || ""
}

async function fetchRestFeaturedMedia(id: number) {
  if (!id || id <= 0) return null
  try {
    const res = await fetch(`https://cms.colormean.com/wp-json/wp/v2/media/${id}?_fields=source_url,alt_text`, {
      next: { revalidate: 600 },
    })
    const json = await res.json()
    if (!json || !json.source_url) return null
    return { sourceUrl: json.source_url, altText: json.alt_text || "" }
  } catch {
    return null
  }
}

function mapYoastToSeo(yoast: any, link: string) {
  if (!yoast) {
    return {
      title: undefined,
      metaDesc: undefined,
      canonical: link || undefined,
    }
  }
  const ogImg = Array.isArray(yoast.og_image) && yoast.og_image.length ? yoast.og_image[0] : null
  return {
    title: yoast.title || undefined,
    metaDesc: yoast.description || undefined,
    canonical: yoast.canonical || link || undefined,
    opengraphTitle: yoast.og_title || undefined,
    opengraphDescription: yoast.og_description || undefined,
    opengraphType: yoast.og_type || undefined,
    opengraphUrl: yoast.og_url || undefined,
    opengraphSiteName: yoast.og_site_name || undefined,
    opengraphPublishedTime: yoast.article_published_time || undefined,
    opengraphModifiedTime: yoast.article_modified_time || undefined,
    opengraphAuthor: Array.isArray(yoast.article_author) ? yoast.article_author[0] : yoast.article_author || undefined,
    opengraphSection: yoast.article_section || undefined,
    opengraphTags: yoast.article_tag || undefined,
    opengraphLocale: yoast.og_locale || undefined,
    opengraphLocaleAlternate: yoast.og_locale_alternate || undefined,
    opengraphImage: ogImg ? { mediaItemUrl: ogImg.url, sourceUrl: ogImg.url, altText: ogImg.alt || "" } : undefined,
    twitterTitle: yoast.twitter_title || undefined,
    twitterDescription: yoast.twitter_description || undefined,
    twitterCard: yoast.twitter_card || undefined,
    twitterSite: yoast.twitter_misc?.site || undefined,
    twitterCreator: yoast.twitter_misc?.creator || undefined,
    twitterImage: yoast.twitter_image ? { mediaItemUrl: yoast.twitter_image, sourceUrl: yoast.twitter_image } : undefined,
    schema: yoast.schema ? { raw: JSON.stringify(yoast.schema) } : undefined,
  }
}

async function fetchRestPostBySlug(slug: string) {
  try {
    const res = await fetch(
      `https://cms.colormean.com/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_fields=title,content,link,featured_media,yoast_head_json`,
      { next: { revalidate: 600, tags: [`wp:rest:post:${slug}`] } }
    )
    const arr = await res.json()
    const post = Array.isArray(arr) ? arr[0] : null
    if (!post) return null
    const media = await fetchRestFeaturedMedia(post.featured_media)
    const url = new URL(post.link)
    const uri = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`
    return {
      __typename: "Post",
      title: post.title?.rendered || "",
      content: post.content?.rendered || "",
      uri,
      featuredImage: media ? { node: media } : undefined,
      tags: { nodes: [] },
      categories: { nodes: [] },
      seo: mapYoastToSeo(post.yoast_head_json, post.link),
    }
  } catch {
    return null
  }
}

async function fetchRestPageBySlug(slug: string) {
  try {
    const res = await fetch(
      `https://cms.colormean.com/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&_fields=title,content,link,featured_media,yoast_head_json`,
      { next: { revalidate: 600, tags: [`wp:rest:page:${slug}`] } }
    )
    const arr = await res.json()
    const page = Array.isArray(arr) ? arr[0] : null
    if (!page) return null
    const media = await fetchRestFeaturedMedia(page.featured_media)
    const url = new URL(page.link)
    const uri = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`
    return {
      __typename: "Page",
      title: page.title?.rendered || "",
      content: page.content?.rendered || "",
      uri,
      featuredImage: media ? { node: media } : undefined,
      seo: mapYoastToSeo(page.yoast_head_json, page.link),
    }
  } catch {
    return null
  }
}

async function fetchPostsByTagIds(tagIds: number[], count: number) {
  const res = await fetch("https://cms.colormean.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query RelatedByTags($tagIds: [ID], $count: Int) {
          posts(where: { tagIn: $tagIds }, first: $count) {
            nodes {
              title
              uri
              featuredImage { node { sourceUrl altText } }
            }
          }
        }
      `,
      variables: { tagIds, count },
    }),
    next: { revalidate: 600, tags: [`wp:related`] },
  })
  const json = await res.json()
  return json?.data?.posts?.nodes ?? []
}

async function fetchPostsByCategoryIds(catIds: number[], count: number) {
  const res = await fetch("https://cms.colormean.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query RelatedByCats($catIds: [ID], $count: Int) {
          posts(where: { categoryIn: $catIds }, first: $count) {
            nodes {
              title
              uri
              featuredImage { node { sourceUrl altText } }
            }
          }
        }
      `,
      variables: { catIds, count },
    }),
    next: { revalidate: 600, tags: [`wp:related`] },
  })
  const json = await res.json()
  return json?.data?.posts?.nodes ?? []
}

async function fetchRandomPosts(count: number) {
  const res = await fetch("https://cms.colormean.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query RandomPosts($count: Int) {
          posts(first: $count) {
            nodes {
              title
              uri
              featuredImage { node { sourceUrl altText } }
            }
          }
        }
      `,
      variables: { count },
    }),
    next: { revalidate: 600, tags: [`wp:related`] },
  })
  const json = await res.json()
  return json?.data?.posts?.nodes ?? []
}

function detectColorFromTitle(title: string): string | null {
  const hexMatch = title.match(/#([0-9a-f]{6})/i)
  if (hexMatch) return `#${hexMatch[1].toUpperCase()}`
  const lower = title.toLowerCase()
  const map: Record<string, string> = {
    green: "#008000",
    red: "#FF0000",
    blue: "#0000FF",
    yellow: "#FFD700",
    orange: "#FF8C00",
    purple: "#800080",
    violet: "#8F00FF",
    cyan: "#00FFFF",
    magenta: "#FF00FF",
    pink: "#FF69B4",
    black: "#000000",
    white: "#FFFFFF",
    gray: "#808080",
    brown: "#8B4513",
  }
  for (const key of Object.keys(map)) {
    if (lower.includes(key)) return map[key]
  }
  return null
}

interface WPPageProps {
  params: Promise<{ wp: string[] }>
}

export async function generateMetadata({ params }: WPPageProps): Promise<Metadata> {
  const { wp } = await params
  const uri = `/${(wp || []).join("/")}/`
  let node = await fetchPostByUri(uri)
  if (!node && uri) {
    const slug = lastSegment(uri)
    if (slug) node = await fetchPostBySlug(slug)
    if (!node) node = await fetchContentByUri(uri)
    if (!node && slug) node = await fetchAnyBySearch(slug.replace(/-/g, " "))
    if (!node && slug) node = await fetchRestPostBySlug(slug)
    if (!node && slug) node = await fetchRestPageBySlug(slug)
  }
  if (!node?.seo) return { title: node?.title || "Article" }
  const ogImg =
    node.seo?.opengraphImage?.mediaItemUrl ||
    node.seo?.opengraphImage?.sourceUrl ||
    undefined
  const twImg =
    node.seo?.twitterImage?.mediaItemUrl ||
    node.seo?.twitterImage?.sourceUrl ||
    undefined
  const site = "https://www.colormean.com"
  const canonical = node?.uri ? new URL(node.uri, site).toString() : node.seo?.canonical || node.seo?.opengraphUrl || undefined
  const robotsIndex = node.seo?.metaRobotsNoindex === "noindex" ? false : true
  const robotsFollow = node.seo?.metaRobotsNofollow === "nofollow" ? false : true
  const adv = node.seo?.metaRobotsAdvanced || ""
  const googleBot: Record<string, any> = {}
  adv.split(",").forEach((pair: string) => {
    const [k, v] = pair.split(":").map((s) => s.trim())
    if (!k) return
    if (k === "max-snippet") googleBot["max-snippet"] = v ? Number.isNaN(Number(v)) ? v : Number(v) : undefined
    if (k === "max-image-preview") googleBot["max-image-preview"] = v || undefined
    if (k === "max-video-preview") googleBot["max-video-preview"] = v ? Number.isNaN(Number(v)) ? v : Number(v) : undefined
    if (k === "noarchive") googleBot["noarchive"] = true
    if (k === "noimageindex") googleBot["noimageindex"] = true
  })
  return {
    title: node.seo.title || node.title,
    description: node.seo.metaDesc || node.seo.opengraphDescription || "",
    alternates: {
      canonical,
    },
    robots: {
      index: robotsIndex,
      follow: robotsFollow,
      googleBot,
    },
    openGraph: {
      title: node.seo.opengraphTitle || node.seo.title || node.title,
      description: node.seo.opengraphDescription || node.seo.metaDesc || "",
      type: node.seo.opengraphType || "article",
      url: canonical,
      siteName: "ColorMean",
      publishedTime: node.seo.opengraphPublishedTime || undefined,
      modifiedTime: node.seo.opengraphModifiedTime || undefined,
      authors: node.seo.opengraphAuthor ? [node.seo.opengraphAuthor] : undefined,
      images: ogImg ? [{ url: ogImg }] : undefined,
    },
    twitter: {
      title: node.seo.twitterTitle || node.seo.title || node.title,
      description: node.seo.twitterDescription || node.seo.metaDesc || "",
      images: twImg ? [twImg] : undefined,
      card: node.seo.twitterCard || "summary_large_image",
      site: node.seo.twitterSite || "ColorMean",
      creator: node.seo.twitterCreator || undefined,
    },
  }
}

export default async function WPPostPage({ params }: WPPageProps) {
  const { wp } = await params
  const uri = `/${(wp || []).join("/")}/`
  let node = await fetchPostByUri(uri)
  if (!node && uri) {
    const slug = lastSegment(uri)
    if (slug) node = await fetchPostBySlug(slug)
    if (!node) node = await fetchContentByUri(uri)
    if (!node && slug) node = await fetchAnyBySearch(slug.replace(/-/g, " "))
    if (!node && slug) node = await fetchRestPostBySlug(slug)
    if (!node && slug) node = await fetchRestPageBySlug(slug)
  }
  if (!node) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold">Content not available</h1>
          <p className="mt-4">The requested post could not be loaded.</p>
        </main>
        <Footer />
      </div>
    )
  }
  if (node.__typename === "Category") {
    const crumbs = [
      { label: "Color Meanings", href: "/color-meanings" },
      { label: node.name, href: node.uri },
    ]
    const related = await fetchRandomPosts(12)
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <section className="bg-muted/30 py-12 px-4">
          <div className="container mx-auto">
            <BreadcrumbNav items={crumbs} />
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">{node.name}</h1>
            </div>
          </div>
        </section>
        <main className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p: any, i: number) => (
              <div key={i} className="rounded-lg overflow-hidden border-2 border-border hover:shadow-lg transition-shadow">
                <Link href={p.uri} className="block">
                  {p?.featuredImage?.node?.sourceUrl && (
                    <img
                      src={p.featuredImage.node.sourceUrl}
                      alt={p.featuredImage.node.altText || p.title}
                      width={1200}
                      height={800}
                      className="w-full h-auto object-cover"
                      style={{ aspectRatio: "1200 / 800" }}
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold line-clamp-2">{p.title}</h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    )
  }
  const img = node?.featuredImage?.node?.sourceUrl
  const alt = node?.featuredImage?.node?.altText || node?.title
  const schemaRaw = node?.seo?.schema?.raw || undefined
  const site = "https://www.colormean.com"
  const canonical = node?.uri ? new URL(node.uri, site).toString() : undefined
  const postColor = detectColorFromTitle(node.title) || "#000000"
  const pieces = parseContentPieces(node.content || "")
  const firstShort = pieces.find((p) => p.kind === "shortcode") as { kind: "shortcode"; hex: string } | undefined
  const shortcodeHex = firstShort ? firstShort.hex : null
  const crumbs = [
    { label: "Color Meanings", href: "/color-meanings" },
    { label: shortTitle(node.title), href: node.uri },
  ]
  const tagIds = (node?.tags?.nodes || []).map((t: any) => t.databaseId)
  const catIds = (node?.categories?.nodes || []).map((c: any) => c.databaseId)
  const seen = new Set<string>([node.uri])
  let related: any[] = []
  if (tagIds.length) {
    const tagPosts = (await fetchPostsByTagIds(tagIds, 12)) || []
    for (const p of tagPosts) {
      if (p?.uri && !seen.has(p.uri)) {
        related.push(p)
        seen.add(p.uri)
        if (related.length >= 6) break
      }
    }
  }
  if (related.length < 6 && catIds.length) {
    const catPosts = (await fetchPostsByCategoryIds(catIds, 12)) || []
    for (const p of catPosts) {
      if (p?.uri && !seen.has(p.uri)) {
        related.push(p)
        seen.add(p.uri)
        if (related.length >= 6) break
      }
    }
  }
  if (related.length < 6) {
    const randPosts = (await fetchRandomPosts(12)) || []
    for (const p of randPosts) {
      if (p?.uri && !seen.has(p.uri)) {
        related.push(p)
        seen.add(p.uri)
        if (related.length >= 6) break
      }
    }
  }
  const moreLink = node?.categories?.nodes?.[0]?.uri || "/color-meanings"
  return (
    <div className="flex flex-col min-h-screen">
      {schemaRaw || canonical ? (
        <WPSEOHead
          schemaRaw={schemaRaw}
          canonical={canonical}
          focuskw={node?.seo?.focuskw}
          robotsAdvanced={node?.seo?.metaRobotsAdvanced || undefined}
          ogAuthor={node?.seo?.opengraphAuthor || undefined}
          ogSection={node?.seo?.opengraphSection || undefined}
          ogTags={node?.seo?.opengraphTags || undefined}
          twitterCreator={node?.seo?.twitterCreator || undefined}
          estimatedReadingTime={node?.seo?.estimatedReadingTime || undefined}
          cornerstone={node?.seo?.cornerstone || undefined}
        />
      ) : null}
      <WPColorContext color={postColor} />
      <Header />
      <section
        className="py-12 px-4 transition-colors"
        style={{
          backgroundColor: shortcodeHex || postColor,
          color: getContrastColor(shortcodeHex || postColor),
        }}
      >
        <div className="container mx-auto">
          <BreadcrumbNav items={crumbs} />
          <BreadcrumbSchema
            items={[
              { name: "ColorMean", item: site },
              { name: "Color Meanings", item: `${site}/color-meanings` },
              { name: shortTitle(node.title), item: `${site}${node.uri}` },
            ]}
          />
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">{node.title}</h1>
            {(() => {
              const HEX = (shortcodeHex || postColor).toUpperCase()
              const rgb = hexToRgb(HEX)
              const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null
              return (
                <div className="max-w-4xl mx-auto">
                  <div className="font-mono text-xs md:text-sm flex flex-wrap justify-center gap-4">
                    <CopyButton showIcon={false} variant="ghost" size="sm" className="p-0 h-auto" label={`HEX: ${HEX}`} value={HEX} />
                    {rgb && (
                      <CopyButton
                        showIcon={false}
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto"
                        label={`RGB: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                        value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                      />
                    )}
                    {hsl && (
                      <CopyButton
                        showIcon={false}
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto"
                        label={`HSL: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                        value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                      />
                    )}
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      </section>
      <div className="w-full py-3 px-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-1 text-black font-medium text-[11px] sm:text-sm">
            <a href="#definition" className="px-0.5 text-purple-600">Definition</a>
            <span>|</span>
            <a href="#history" className="px-0.5 text-purple-600">History</a>
            <span>|</span>
            <a href="#symbolism" className="px-0.5 text-purple-600">Symbolism</a>
            <span>|</span>
            <a href="#spiritual-meaning" className="px-0.5 text-purple-600">Spiritual Meaning</a>
            <span>|</span>
            <a href="#psychology" className="px-0.5 text-purple-600">Psychology</a>
            <span>|</span>
            <a href="#personality" className="px-0.5 text-purple-600">Personality</a>
            <span>|</span>
            <a href="#cultural-meaning" className="px-0.5 text-purple-600">Cultural Meaning</a>
            <span>|</span>
            <a href="#dreams-meaning" className="px-0.5 text-purple-600">Dreams Meaning</a>
            <span>|</span>
            <a href="#uses" className="px-0.5 text-purple-600">Uses</a>
            <span>|</span>
            <a href="#technical-information" className="px-0.5 text-purple-600">Technical Information</a>
          </div>
        </div>
      </div>
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            {img && (
              <img
                src={img}
                alt={alt}
                width={1200}
                height={800}
                className="w-full h-auto rounded-lg border-2 border-border"
                style={{ aspectRatio: "1200 / 800" }}
              />
            )}
            <article className="max-w-none space-y-6">
              {pieces.length === 0 ? (
                <div className="cm-wrap" dangerouslySetInnerHTML={{ __html: enhanceContentHtml(node.content || "", postColor) }} />
              ) : (
                pieces.map((p: any, i: number) =>
                  p.kind === "html" ? (
                    <div key={`h-${i}`} className="cm-wrap" dangerouslySetInnerHTML={{ __html: enhanceContentHtml(p.html, postColor) }} />
                  ) : (
                    <div key={`s-${i}`} className="mt-6">
                      <ColorPageContent hex={p.hex} mode="sectionsOnly" />
                    </div>
                  )
                )
              )}
            </article>
            <div className="flex justify-center py-4">
              <ShareButtons title={node.title} />
            </div>
            <HelpfulVote uri={uri} />
            {related.length > 0 && (
              <div className="mt-8">
                <h3 className="text-2xl font-bold mb-4">Related Posts</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {related.map((p: any, i: number) => (
                    <div key={i} className="rounded-lg overflow-hidden border-2 border-border hover:shadow-lg transition-shadow">
                      <Link href={p.uri} className="block">
                        {p?.featuredImage?.node?.sourceUrl && (
                          <img
                            src={p.featuredImage.node.sourceUrl}
                            alt={p.featuredImage.node.altText || p.title}
                            width={1200}
                            height={800}
                            className="w-full h-auto object-cover"
                            style={{ aspectRatio: "1200 / 800" }}
                          />
                        )}
                        <div className="p-4">
                          <h4 className="text-base font-semibold line-clamp-2">{p.title}</h4>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-center">
                  <Link href={moreLink} className="px-4 py-2 rounded-md border-2 border-border hover:bg-muted">
                    More Posts
                  </Link>
                </div>
              </div>
            )}
          </div>
          <ColorSidebar color={postColor} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

function parseContentPieces(html: string): Array<{ kind: "html"; html: string } | { kind: "shortcode"; hex: string }> {
  const input = html || ""
  const re =
    /(\[|&#91;|&#x005[bB];|&#x5[bB];)\s*colormean\b([\s\S]*?)(\]|&#93;|&#x005[dD];|&#x5[dD];)/gi
  const out: Array<{ kind: "html"; html: string } | { kind: "shortcode"; hex: string }> = []
  let last = 0
  for (const m of input.matchAll(re) as any) {
    const start = m.index as number
    const full = m[0] as string
    const attrs = m[2] as string
    const prev = input.slice(last, start)
    if (prev) out.push({ kind: "html", html: prev })
    const hex = parseAttrsHex(attrs)
    if (hex) out.push({ kind: "shortcode", hex })
    last = start + full.length
  }
  const rest = input.slice(last)
  if (rest) out.push({ kind: "html", html: rest })
  return out
}

function parseAttrsHex(attrs: string): string | null {
  const decoded = (attrs || "")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&ldquo;/gi, '"')
    .replace(/&rdquo;/gi, '"')
    .replace(/&lsquo;/gi, "'")
    .replace(/&rsquo;/gi, "'")
    .replace(/&#34;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#8220;/gi, '"')
    .replace(/&#8221;/gi, '"')
    .replace(/&#8216;/gi, "'")
    .replace(/&#8217;/gi, "'")
    .replace(/\u201C|\u201D/g, '"')
    .replace(/\u2018|\u2019/g, "'")
  let val: string | undefined
  const re = /([a-zA-Z0-9_-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"']+))/g
  for (const m of decoded.matchAll(re) as any) {
    const key = String(m[1] || "").trim().toLowerCase()
    if (key === "hex") {
      val = (m[2] ?? m[3] ?? m[4] ?? "").trim()
      break
    }
  }
  if (!val) return null
  const raw = val.replace(/^#/, "").toLowerCase()
  if (/^[0-9a-f]{6}$/.test(raw)) return `#${raw.toUpperCase()}`
  if (/^[0-9a-f]{3}$/.test(raw)) {
    const exp = `${raw[0]}${raw[0]}${raw[1]}${raw[1]}${raw[2]}${raw[2]}`
    return `#${exp.toUpperCase()}`
  }
  return null
}

function enhanceContentHtml(html: string, accentColor: string): string {
  const h2 = "text-3xl md:text-4xl font-bold leading-tight mt-6 mb-3"
  const h3 = "text-2xl md:text-3xl font-semibold leading-snug mt-5 mb-3"
  const h4 = "text-lg md:text-xl font-semibold leading-normal mt-4 mb-2"
  const p = "leading-[1.85] my-4"
  const img = "max-w-full h-auto object-contain rounded-md"
  const blockquote = "border-l-4 pl-4 italic my-4 text-muted-foreground"
  const table = "w-full border-collapse my-4"
  const th = "border px-3 py-2 bg-muted text-foreground"
  const td = "border px-3 py-2"
  const ul = "my-4 space-y-2 cm-ul"
  const ol = "my-4 space-y-2 cm-ol"
  const style = `
    <style>
      .cm-wrap { overflow-wrap: anywhere; word-break: break-word; }
      .cm-wrap p, .cm-wrap li { overflow-wrap: anywhere; word-break: break-word; }
      .cm-wrap table { max-width: 100%; }
      .cm-wrap a { color: #1D4ED8; }
      .cm-wrap a[href^="/"],
      .cm-wrap a[href*="//colormean.com"],
      .cm-wrap a[href*="//www.colormean.com"] { text-decoration: underline; }
      .cm-wrap a[href^="http"]:not([href*="//colormean.com"]):not([href*="//www.colormean.com"]) { text-decoration: none; }
      .cm-wrap [style*="background-color"],
      .cm-wrap [style*="background:"] { padding-top: 0.75rem; padding-bottom: 0.75rem; }
      .cm-wrap [style*="background-color"],
      .cm-wrap [style*="background:"] { color: #ffffff !important; }
      .cm-wrap [style*="background-color"] *:not([style*="color"]),
      .cm-wrap [style*="background:"] *:not([style*="color"]) { color: #ffffff !important; }
      .cm-ul { list-style: none; padding-left: 0; margin-left: 0; }
      .cm-ul li { position: relative; padding-left: 1.75rem; }
      .cm-ul li::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0.5rem;
        color: ${accentColor};
        width: 0.5rem; height: 0.5rem;
        border-radius: 50%;
        background: ${accentColor};
      }
      .cm-ol { counter-reset: item; list-style: none; padding-left: 0; margin-left: 0; }
      .cm-ol li { position: relative; padding-left: 2rem; counter-increment: item; }
      .cm-ol li::before {
        content: counter(item);
        position: absolute;
        left: 0;
        top: 0.3rem;
        display: inline-block;
        width: 1.5rem; height: 1.5rem;
        border-radius: 50%;
        background: ${accentColor};
        color: #ffffff;
        font-size: 0.9rem;
        text-align: center;
        line-height: 1.5rem;
      }
      @media (max-width: 640px) {
        .cm-ul li::before { font-size: 0.95rem; }
        .cm-ol li::before { width: 1.35rem; height: 1.35rem; font-size: 0.85rem; line-height: 1.35rem; }
      }
    </style>
  `
  const addClass = (input: string, tag: string, cls: string) => {
    return input.replace(new RegExp(`<${tag}([^>]*)>`, "gi"), (m, attrs) => {
      const a = attrs || ""
      const dbl = a.match(/\bclass\s*=\s*"([^"]*)"/i)
      const sgl = a.match(/\bclass\s*=\s*'([^']*)'/i)
      if (dbl) {
        const full = dbl[0]
        const val = dbl[1]
        const rep = `class="${`${val} ${cls}`.trim()}"`
        return `<${tag}${a.replace(full, rep)}>`
      }
      if (sgl) {
        const full = sgl[0]
        const val = sgl[1]
        const rep = `class="${`${val} ${cls}`.trim()}"`
        return `<${tag}${a.replace(full, rep)}>`
      }
      const trimmed = a.trim()
      const extra = trimmed.length ? ` ${trimmed}` : ""
      return `<${tag}${extra} class="${cls}">`
    })
  }
  const addImg = (input: string, cls: string) => {
    return input.replace(/<img([^>]*)>/gi, (m, attrs) => {
      let a = attrs || ""
      if (!/\balt\s*=/.test(a)) a = ` alt="" ${a}`.trim()
      const dbl = a.match(/\bclass\s*=\s*"([^"]*)"/i)
      const sgl = a.match(/\bclass\s*=\s*'([^']*)'/i)
      if (dbl) {
        const full = dbl[0]
        const val = dbl[1]
        a = a.replace(full, `class="${`${val} ${cls}`.trim()}"`)
      } else if (sgl) {
        const full = sgl[0]
        const val = sgl[1]
        a = a.replace(full, `class="${`${val} ${cls}`.trim()}"`)
      } else {
        a = `${a.trim()} class="${cls}"`
      }
      if (!/\bloading\s*=/.test(a)) a = `${a.trim()} loading="lazy"`
      return `<img ${a}>`
    })
  }
  let out = html.replace(/^/, style)
  out = addClass(out, "h2", h2)
  out = addClass(out, "h3", h3)
  out = addClass(out, "h4", h4)
  out = addClass(out, "p", p)
  out = addImg(out, img)
  out = addClass(out, "blockquote", blockquote)
  out = addClass(out, "table", table)
  out = addClass(out, "th", th)
  out = addClass(out, "td", td)
  out = addClass(out, "ul", ul)
  out = addClass(out, "ol", ol)
  const rewriteHref = (url: string) => {
    const site = "https://www.colormean.com"
    try {
      const u = new URL(url, site)
      if (u.hostname === "localhost" || u.hostname === "cms.colormean.com") {
        u.protocol = "https:"
        u.hostname = "www.colormean.com"
        return u.toString()
      }
      return u.toString()
    } catch {
      if (/^http:\/\/localhost:3000/i.test(url)) return url.replace(/^http:\/\/localhost:3000/i, site)
      if (/^https?:\/\/cms\.colormean\.com/i.test(url)) return url.replace(/^https?:\/\/cms\.colormean\.com/i, site)
      return url
    }
  }
  out = out.replace(/href="([^"]+)"/gi, (m, s1) => {
    return `href="${rewriteHref(s1)}"`
  })
  out = out.replace(/href='([^']+)'/gi, (m, s1) => {
    return `href='${rewriteHref(s1)}'`
  })
  const toRgb = (hex: string) => {
    const h = hex.replace("#", "").trim()
    if (h.length === 3) {
      const r = parseInt(h[0] + h[0], 16)
      const g = parseInt(h[1] + h[1], 16)
      const b = parseInt(h[2] + h[2], 16)
      return { r, g, b }
    }
    const r = parseInt(h.slice(0, 2), 16)
    const g = parseInt(h.slice(2, 4), 16)
    const b = parseInt(h.slice(4, 6), 16)
    return { r, g, b }
  }
  const hslToRgb = (h: number, s: number, l: number) => {
    const C = (1 - Math.abs(2 * l - 1)) * s
    const X = C * (1 - Math.abs(((h / 60) % 2) - 1))
    const m0 = l - C / 2
    let r1 = 0,
      g1 = 0,
      b1 = 0
    if (h >= 0 && h < 60) {
      r1 = C
      g1 = X
      b1 = 0
    } else if (h < 120) {
      r1 = X
      g1 = C
      b1 = 0
    } else if (h < 180) {
      r1 = 0
      g1 = C
      b1 = X
    } else if (h < 240) {
      r1 = 0
      g1 = X
      b1 = C
    } else if (h < 300) {
      r1 = X
      g1 = 0
      b1 = C
    } else {
      r1 = C
      g1 = 0
      b1 = X
    }
    const r = Math.round((r1 + m0) * 255)
    const g = Math.round((g1 + m0) * 255)
    const b = Math.round((b1 + m0) * 255)
    return { r, g, b }
  }
  const named: Record<string, string> = {
    black: "#000000",
    white: "#ffffff",
    red: "#ff0000",
    green: "#008000",
    lime: "#00ff00",
    blue: "#0000ff",
    navy: "#000080",
    teal: "#008080",
    olive: "#808000",
    yellow: "#ffff00",
    orange: "#ffa500",
    purple: "#800080",
    fuchsia: "#ff00ff",
    magenta: "#ff00ff",
    cyan: "#00ffff",
    aqua: "#00ffff",
    gray: "#808080",
    silver: "#c0c0c0",
    maroon: "#800000",
    pink: "#ffc0cb",
    brown: "#8b4513",
    violet: "#8f00ff",
    indigo: "#4b0082",
    gold: "#ffd700",
    lightgray: "#d3d3d3",
    darkgray: "#a9a9a9",
  }
  const parseColor = (input: string) => {
    const s = (input || "").trim().toLowerCase()
    const hx = s.match(/#([0-9a-f]{6}|[0-9a-f]{3})/)
    if (hx) return toRgb(`#${hx[1]}`)
    const rgb = s.match(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*[\d.]+)?\s*\)/)
    if (rgb) {
      const r = Math.min(255, parseInt(rgb[1], 10))
      const g = Math.min(255, parseInt(rgb[2], 10))
      const b = Math.min(255, parseInt(rgb[3], 10))
      return { r, g, b }
    }
    const hsl = s.match(/hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*[\d.]+)?\s*\)/)
    if (hsl) {
      const h = parseFloat(hsl[1])
      const ss = Math.max(0, Math.min(100, parseFloat(hsl[2]))) / 100
      const ll = Math.max(0, Math.min(100, parseFloat(hsl[3]))) / 100
      return hslToRgb(h, ss, ll)
    }
    if (named[s]) return toRgb(named[s])
    return null
  }
  const luminance = (r: number, g: number, b: number) => {
    const sr = r / 255
    const sg = g / 255
    const sb = b / 255
    const rl = sr <= 0.04045 ? sr / 12.92 : Math.pow((sr + 0.055) / 1.055, 2.4)
    const gl = sg <= 0.04045 ? sg / 12.92 : Math.pow((sg + 0.055) / 1.055, 2.4)
    const bl = sb <= 0.04045 ? sb / 12.92 : Math.pow((sb + 0.055) / 1.055, 2.4)
    return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl
  }
  const adjustStyleColor = (styleStr: string) => {
    const hasColor = /\bcolor\s*:/i.test(styleStr)
    const bgc = styleStr.match(/background-color\s*:\s*([^;]+)/i)
    const bg = styleStr.match(/background\s*:\s*([^;]+)/i)
    const target = bgc?.[1] || bg?.[1] || ""
    const parsed = parseColor(target || styleStr)
    if (!parsed) return styleStr
    const lum = luminance(parsed.r, parsed.g, parsed.b)
    const hasPad = /\bpadding(-top|-bottom)?\s*:/i.test(styleStr)
    let next = styleStr.trim()
    if (!hasPad) next = `${next}${next.endsWith(";") ? "" : ";"}padding-top:0.75rem;padding-bottom:0.75rem`
    if (lum < 0.5 && !hasColor) {
      const trimmed = styleStr.trim()
      const sep = trimmed.endsWith(";") ? "" : ";"
      return `${next}${sep}color:#ffffff`
    }
    return next
  }
  out = out.replace(/style="([^"]*)"/gi, (m, s1) => {
    return `style="${adjustStyleColor(s1)}"`
  })
  out = out.replace(/style='([^']*)'/gi, (m, s1) => {
    return `style='${adjustStyleColor(s1)}'`
  })
  const stripHtml = (s: string) => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
  const addAnchors = (input: string) => {
    return input.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (m, attrs, inner) => {
      const text = stripHtml(inner).toLowerCase()
      let id = ""
      if (/^what is the color\b/.test(text)) id = "definition"
      else if (/^history of the color\b/.test(text)) id = "history"
      else if (/^symbolism and representation of\b/.test(text)) id = "symbolism"
      else if (/^meaning of the color\b.*\bin spirituality\b/.test(text)) id = "spiritual-meaning"
      else if (/^the psychological meaning of\b/.test(text)) id = "psychology"
      else if (/^color\b.*\b personality traits\b/.test(text)) id = "personality"
      else if (/^cultural and religious significance of\b/.test(text)) id = "cultural-meaning"
      else if (/^dream interpretations of the color\b/.test(text)) id = "dreams-meaning"
      else if (/^how to use the color\b/.test(text)) id = "uses"
      else if (/^technical information$/.test(text)) id = "technical-information"
      if (!id) return m
      const hasId = /\bid\s*=/.test(attrs || "")
      if (hasId) return `<h2${attrs}>${inner}</h2>`
      const trimmed = (attrs || "").trim()
      const extra = trimmed.length ? ` ${trimmed}` : ""
      return `<h2${extra} id="${id}">${inner}</h2>`
    })
  }
  out = addAnchors(out)
  return out
}

function shortTitle(title: string): string {
  const parts = title.split(" – ")
  if (parts[0]) return parts[0].trim()
  const dash = title.split(" - ")
  return dash[0]?.trim() || title.trim()
}

function extractShortcodeHex(html: string): string | null {
  const pre = (html || "")
    .replace(/&#91;/gi, "[")
    .replace(/&#93;/gi, "]")
    .replace(/&#x005b;/gi, "[")
    .replace(/&#x005d;/gi, "]")
    .replace(/&#x5b;/gi, "[")
    .replace(/&#x5d;/gi, "]")
    .replace(/\u005B/g, "[")
    .replace(/\u005D/g, "]")
  const tag = pre.match(/\[\s*colormean\b([\s\S]*?)\]/i)
  if (!tag) return null
  const attrs = tag[1] || ""
  const decoded = attrs
    // HTML named entities
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&ldquo;/gi, '"')
    .replace(/&rdquo;/gi, '"')
    .replace(/&lsquo;/gi, "'")
    .replace(/&rsquo;/gi, "'")
    // HTML numeric entities
    .replace(/&#34;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#8220;/gi, '"')
    .replace(/&#8221;/gi, '"')
    .replace(/&#8216;/gi, "'")
    .replace(/&#8217;/gi, "'")
    // Literal Unicode curly quotes
    .replace(/\u201C|\u201D/g, '"')
    .replace(/\u2018|\u2019/g, "'")
  let val: string | undefined
  const re = /([a-zA-Z0-9_-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"']+))/g
  for (const m of decoded.matchAll(re) as any) {
    const key = String(m[1] || "").trim().toLowerCase()
    if (key === "hex") {
      val = (m[2] ?? m[3] ?? m[4] ?? "").trim()
      break
    }
  }
  if (!val) return null
  const raw = val.replace(/^#/, "").toLowerCase()
  let clean = ""
  if (/^[0-9a-f]{6}$/.test(raw)) {
    clean = raw
  } else if (/^[0-9a-f]{3}$/.test(raw)) {
    clean = `${raw[0]}${raw[0]}${raw[1]}${raw[1]}${raw[2]}${raw[2]}`
  } else {
    return null
  }
  return `#${clean.toUpperCase()}`
}

function removeShortcode(html: string): string {
  return (html || "")
    .replace(/&#91;/gi, "[")
    .replace(/&#93;/gi, "]")
    .replace(/&#x005b;/gi, "[")
    .replace(/&#x005d;/gi, "]")
    .replace(/&#x5b;/gi, "[")
    .replace(/&#x5d;/gi, "]")
    .replace(/\[\s*colormean\b[\s\S]*?\]/gi, "")
}
