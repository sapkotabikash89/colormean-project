import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"
import Script from "next/script"
import dynamic from "next/dynamic"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { WPColorContext } from "@/components/wp-color-context"
import { ColorPageContent } from "@/components/color-page-content"
import { WPSEOHead } from "@/components/wpseo-head"
import { BreadcrumbSchema, ImageObjectSchema, BlogPostingSchema } from "@/components/structured-data"
import { CopyButton } from "@/components/copy-button"
import { getContrastColor, hexToRgb, rgbToHsl } from "@/lib/color-utils"
import { AnchorHashNav } from "@/components/anchor-hash-nav"
import { FAQSection } from "@/components/faq-section"
import { RelatedColorsSection } from "@/components/related-colors-section"
import { BlogPostActions } from "@/components/blog-post-actions"
import { FeaturedImage } from "@/components/blog/featured-image"
import { convertToGumletUrl, convertHtmlImagesToGumlet } from "@/lib/gumlet-image-utils"

const ShareButtons = dynamic(() => import("@/components/share-buttons").then((mod) => mod.ShareButtons))
const HelpfulVote = dynamic(() => import("@/components/helpful-vote").then((mod) => mod.HelpfulVote))

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
              previousPost {
                title
                uri
              }
              nextPost {
                title
                uri
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
        // OPTIMIZATION: Increased revalidate time for Vercel free plan
                next: { revalidate: 3600, tags: [`wp:node:${u}`] },  // 1 hour instead of 10 min
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
      // OPTIMIZATION: Increased revalidate time for Vercel free plan
              next: { revalidate: 3600, tags: [`wp:slug:${slug}`] },  // 1 hour instead of 10 min
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
      // OPTIMIZATION: Increased revalidate time for Vercel free plan
              next: { revalidate: 3600, tags: [`wp:uri:${uri}`] },  // 1 hour instead of 10 min
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
      // OPTIMIZATION: Increased revalidate time for Vercel free plan
              next: { revalidate: 3600, tags: [`wp:search:${term}`] },  // 1 hour instead of 10 min
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
      // OPTIMIZATION: Increased revalidate time for Vercel free plan
              next: { revalidate: 3600 },  // 1 hour instead of 10 min
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
      // OPTIMIZATION: Increased revalidate time for Vercel free plan
              { next: { revalidate: 3600, tags: [`wp:rest:post:${slug}`] } }  // 1 hour instead of 10 min
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
      // OPTIMIZATION: Increased revalidate time for Vercel free plan
              { next: { revalidate: 3600, tags: [`wp:rest:page:${slug}`] } }  // 1 hour instead of 10 min
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
              date
              featuredImage { node { sourceUrl altText } }
            }
          }
        }
      `,
      variables: { tagIds, count },
    }),
    // OPTIMIZATION: Increased revalidate time for Vercel free plan
    next: { revalidate: 3600, tags: [`wp:related`] },  // 1 hour instead of 10 min
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
              date
              featuredImage { node { sourceUrl altText } }
            }
          }
        }
      `,
      variables: { catIds, count },
    }),
    // OPTIMIZATION: Increased revalidate time for Vercel free plan
    next: { revalidate: 3600, tags: [`wp:related`] },  // 1 hour instead of 10 min
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
    // OPTIMIZATION: Increased revalidate time for Vercel free plan
    next: { revalidate: 3600, tags: [`wp:related`] },  // 1 hour instead of 10 min
  })
  const json = await res.json()
  return json?.data?.posts?.nodes ?? []
}

async function resolvePrevNext(node: any): Promise<{ previous: { title: string; uri: string } | null; next: { title: string; uri: string } | null }> {
  try {
    if (node?.previousPost || node?.nextPost) {
      const previous = node.previousPost?.uri ? { title: node.previousPost.title, uri: node.previousPost.uri } : null
      const next = node.nextPost?.uri ? { title: node.nextPost.title, uri: node.nextPost.uri } : null
      if (previous || next) return { previous, next }
    }
    const currentUri: string | undefined = node?.uri
    const catIds: number[] = Array.from(new Set(((node?.categories?.nodes as any[]) || []).map((c) => c?.databaseId).filter(Boolean)))
  const tagIds: number[] = Array.from(new Set(((node?.tags?.nodes as any[]) || []).map((t) => t?.databaseId).filter(Boolean)))
  let list: Array<{ title: string; uri: string; date?: string }> = []
  if (catIds.length) list = await fetchPostsByCategoryIds(catIds, 100)
  if ((!list || list.length === 0) && tagIds.length) list = await fetchPostsByTagIds(tagIds, 100)
  if (!list || list.length === 0 || !currentUri) return { previous: null, next: null }
  list = list.slice().sort((a, b) => {
    const da = a.date ? Date.parse(a.date) : 0
    const db = b.date ? Date.parse(b.date) : 0
    return db - da
  })
  if (!list.some((p) => p.uri === currentUri)) {
    list.push({ title: node.title, uri: currentUri, date: node.date })
    list = list.slice().sort((a, b) => {
      const da = a.date ? Date.parse(a.date) : 0
      const db = b.date ? Date.parse(b.date) : 0
      return db - da
    })
  }
  const idx = list.findIndex((p) => p?.uri === currentUri)
    if (idx < 0) return { previous: null, next: null }
    const previous = list[idx + 1] ? { title: list[idx + 1].title, uri: list[idx + 1].uri } : null
    const next = list[idx - 1] ? { title: list[idx - 1].title, uri: list[idx - 1].uri } : null
    return { previous, next }
  } catch {
    return { previous: null, next: null }
  }
}

function detectColorFromTitle(title: string): string | null {
  const hexMatch = title.match(/#([0-9a-f]{6})/i)
  if (hexMatch) return `#${hexMatch[1].toUpperCase()}`
  const lower = title.toLowerCase()
  const map: Record<string, string> = {
    green: "#008000",
    red: "#FF0000",
    blue: "#0000FF",
    yellow: "#FFFF00",
    orange: "#FFA500",
    purple: "#800080",
    violet: "#EE82EE",
    cyan: "#00FFFF",
    magenta: "#FF00FF",
    pink: "#FFC0CB",
    black: "#000000",
    white: "#FFFFFF",
    gray: "#808080",
    brown: "#A52A2A",
    maroon: "#800000",
    burgundy: "#800020",
  }
  for (const key of Object.keys(map)) {
    if (lower.includes(key)) return map[key]
  }
  return null
}

function detectColorName(node: any, fallbackHex?: string): string | null {
  const title = String(node?.title || "").toLowerCase()
  const names = ["green","red","blue","yellow","orange","purple","violet","cyan","magenta","pink","black","white","gray","brown","maroon","burgundy"]
  for (const n of names) {
    if (title.includes(n)) return n
  }
  const tags = ((node?.tags?.nodes as any[]) || []).map((t) => String(t?.name || "").toLowerCase())
  const cats = ((node?.categories?.nodes as any[]) || []).map((c) => String(c?.name || "").toLowerCase())
  for (const n of names) {
    if (tags.some((x) => x.includes(n)) || cats.some((x) => x.includes(n))) return n
  }
  const hex = (fallbackHex || "").toUpperCase()
  const byHex: Record<string, string> = {
    "#008000": "green",
    "#FF0000": "red",
    "#0000FF": "blue",
    "#FFFF00": "yellow",
    "#FFA500": "orange",
    "#800080": "purple",
    "#EE82EE": "violet",
    "#00FFFF": "cyan",
    "#FF00FF": "magenta",
    "#FFC0CB": "pink",
    "#000000": "black",
    "#FFFFFF": "white",
    "#808080": "gray",
    "#A52A2A": "brown",
    "#800000": "maroon",
    "#800020": "burgundy",
  }
  if (hex && byHex[hex]) return byHex[hex]
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
  const featuredSrc: string | undefined = node?.featuredImage?.node?.sourceUrl || undefined
  const shortcodeHex = extractShortcodeHex(String(node?.content || "")) || detectColorFromTitle(String(node?.title || ""))
  const colorImageAbs = (() => {
    if (!shortcodeHex) return undefined
    const clean = shortcodeHex.replace("#", "").toLowerCase()
    return `https://colormean.com/colors/${clean}/image.webp`
  })()
  
  // Convert WordPress CMS URLs to Gumlet CDN URLs for metadata
  const site = "https://colormean.com"
  const gumletFeaturedUrl = featuredSrc ? convertToGumletUrl(featuredSrc) : undefined
  
  const ogImg =
    gumletFeaturedUrl ||
    (node.seo?.opengraphImage?.mediaItemUrl ? convertToGumletUrl(node.seo.opengraphImage.mediaItemUrl) : undefined) ||
    (node.seo?.opengraphImage?.sourceUrl ? convertToGumletUrl(node.seo.opengraphImage.sourceUrl) : undefined) ||
    undefined
  const twImg =
    gumletFeaturedUrl ||
    (node.seo?.twitterImage?.mediaItemUrl ? convertToGumletUrl(node.seo.twitterImage.mediaItemUrl) : undefined) ||
    (node.seo?.twitterImage?.sourceUrl ? convertToGumletUrl(node.seo.twitterImage.sourceUrl) : undefined) ||
    undefined
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
      images: ogImg
        ? [
            {
              url: ogImg.startsWith("http") ? ogImg : `${site}${ogImg}`,
              width: 1200,
              height: 630,
              alt: `${node.title} featured image`,
            },
          ]
        : undefined,
    },
    twitter: {
      title: node.seo.twitterTitle || node.seo.title || node.title,
      description: node.seo.twitterDescription || node.seo.metaDesc || "",
      images: twImg ? [twImg.startsWith("http") ? twImg : `${site}${twImg}`] : undefined,
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
  async function getBlurDataURL(src: string | undefined): Promise<string | undefined> {
    // Gumlet CDN images don't need blur placeholders - skip LQIP generation
    return undefined
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
            {related.map((p: any, i: number) => {
              const src = p?.featuredImage?.node?.sourceUrl
              return (
                <div key={i} className="rounded-lg overflow-hidden border-2 border-border hover:shadow-lg transition-shadow">
                  <Link href={p.uri} className="block">
                    {src && (
                      <FeaturedImage
                        src={src}
                        alt={p.featuredImage.node.altText || p.title}
                        className="w-full"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold line-clamp-2">{p.title}</h3>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </main>
        <Footer />
      </div>
    )
  }
  const img = node?.featuredImage?.node?.sourceUrl
  const alt = node?.featuredImage?.node?.altText || node?.title
  const schemaRaw = node?.seo?.schema?.raw || undefined
  const site = "https://colormean.com"
  const canonical = node?.uri ? new URL(node.uri, site).toString() : undefined
  const titleHex = detectColorFromTitle(node.title)
  const isYellowPost = /yellow/i.test(String(node?.title || ""))
  const piecesRaw = parseContentPieces(node.content || "")
  const allShorts = piecesRaw.filter((p) => p.kind === "shortcode") as Array<{ kind: "shortcode"; hex: string }>
  const lastShort = allShorts.length ? allShorts[allShorts.length - 1] : undefined
  const shortcodeHex =
    lastShort?.hex ||
    extractShortcodeHexFromGutenberg(node.content || "") ||
    (isYellowPost ? nearestShortcodeHexAroundTechnical(node.content || "") : null)
  
  const effectiveHex = shortcodeHex || titleHex
  const pieces = (effectiveHex && !shortcodeHex)
    ? parseContentPieces(node.content || "", effectiveHex)
    : piecesRaw

  const postColor = effectiveHex || "#000000"
  const accentColor = effectiveHex || "#000000"
  let prevNext = await resolvePrevNext(node)
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
  if (!prevNext.previous && !prevNext.next && related.length >= 2) {
    prevNext = {
      previous: { title: related[0].title, uri: related[0].uri },
      next: { title: related[1].title, uri: related[1].uri },
    }
  }
  const moreLink = node?.categories?.nodes?.[0]?.uri || "/color-meanings"
  const colorName = detectColorName(node, (shortcodeHex || postColor)?.toUpperCase())
  const isSingleColor = !!colorName
  
  // Convert WordPress image URLs to Gumlet CDN
  const gumletImageUrl = img ? convertToGumletUrl(img) : undefined

  return (
    <div className="flex flex-col min-h-screen">
      {(() => {
        const author = node?.seo?.opengraphAuthor || "ColorMean"
        const description = node?.seo?.metaDesc || node?.seo?.opengraphDescription || ""
        const datePublished = node?.seo?.opengraphPublishedTime || node?.date || undefined
        const dateModified = node?.seo?.opengraphModifiedTime || node?.date || undefined
        return (
          <BlogPostingSchema
            title={node.title}
            description={description}
            author={author}
            publisher={{ name: "ColorMean", url: site, logo: `${site}/logo.webp` }}
            image={gumletImageUrl ? { url: gumletImageUrl, width: 1200, height: 800, alt: alt } : undefined as any}
            datePublished={datePublished}
            dateModified={dateModified}
            url={canonical || `${site}${node.uri}`}
          />
        )
      })()}
      <WPColorContext color={accentColor} />
      <Header />
      <section
        className="py-12 px-2 sm:px-4 transition-colors"
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
      {effectiveHex && <AnchorHashNav />}
      <main className="container mx-auto px-2 sm:px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <article className="max-w-none space-y-6">
              {(() => {
                const contentHtml = node.content || ""
                const secs = splitSectionsByH2(contentHtml)
                const isTechnical = (html: string) => /<h2[^>]*>[\s\S]*technical[\s\S]*<\/h2>/i.test(html)
                const preferNearestForYellow = (colorName || "").toLowerCase() === "yellow"
                const nearestHexForYellow = preferNearestForYellow ? nearestShortcodeHexAroundTechnical(contentHtml) : null

                // Helper to render the featured image
                const renderFeaturedImage = () => {
                  if (!img) return null
                  
                  return (
                    <section key="featured-image" className="bg-white rounded-xl border border-border shadow-sm md:shadow p-1 sm:p-2 md:p-4">
                      <FeaturedImage
                        src={img}
                        alt={
                          isSingleColor
                            ? `${alt || ""} – Featured image for color ${colorName}`
                            : `${alt || ""}`
                        }
                        priority={true}
                        className="w-full"
                      />
                      <ImageObjectSchema
                        url={gumletImageUrl!}
                        width={1200}
                        height={800}
                        caption={
                          isSingleColor
                            ? `Infographic showing color meaning, psychology and spirituality association of color ${colorName}`
                            : (node?.seo?.opengraphImage?.altText || alt || undefined)
                        }
                        description={
                          isSingleColor
                            ? `A visual guide for understanding color ${colorName} meaning, symbolism, psychology, and informational data for your next project.`
                            : (node?.seo?.opengraphDescription || node?.seo?.metaDesc || undefined)
                        }
                        author="ColorMean"
                        representativeOfPage={true}
                      />
                      <BlogPostActions
                        loveKey={(shortcodeHex || postColor).replace("#", "")}
                        shareUrl={`${site}${node.uri}`}
                        shareTitle={node.title}
                      />
                    </section>
                  )
                }

                return secs.map((sec: string, i: number) => {
                  const sectionContent = (() => {
                    if (isTechnical(sec)) {
                      const sectionHex: string | undefined =
                        extractSectionShortcodeHex(sec) ||
                        extractShortcodeHexFromGutenberg(sec) ||
                        nearestHexForYellow ||
                        (effectiveHex ?? undefined)
                      const pieces = parseContentPieces(sec, sectionHex)
                      return (
                        <section id="technical-information" style={{ scrollMarginTop: "96px" }} key={`sec-${i}`} className="bg-white rounded-xl border border-border shadow-sm md:shadow p-1 sm:p-2 md:p-4">
                          {pieces.map((p, j) =>
                            p.kind === "html" ? (
                              <div key={`h-${i}-${j}`} className="cm-wrap" style={{ "--page-accent-color": accentColor } as React.CSSProperties} dangerouslySetInnerHTML={{ __html: enhanceContentHtml(p.html, accentColor) }} />
                            ) : (
                              <div key={`s-${i}-${j}`} className="mt-4">
                                {(() => {
                                  const hexForTools = (sectionHex || p.hex || effectiveHex || "#000000") as string
                                  return <ColorPageContent hex={hexForTools} mode="sectionsOnly" />
                                })()}
                              </div>
                            )
                          )}
                        </section>
                      )
                    }
                    return (
                      <section key={`sec-${i}`} className="bg-white rounded-xl border border-border shadow-sm md:shadow overflow-hidden">
                        <div className="cm-wrap" style={{ "--page-accent-color": accentColor } as React.CSSProperties} dangerouslySetInnerHTML={{ __html: enhanceContentHtml(removeShortcode(sec), accentColor) }} />
                      </section>
                    )
                  })()

                  // Render featured image after the first section (intro)
                  if (i === 0) {
                    return [sectionContent, renderFeaturedImage()]
                  }
                  return sectionContent
                })
              })()}
            </article>
            <FAQSection color={colorName} />
            {effectiveHex && <RelatedColorsSection hex={effectiveHex} />}
            <div className="flex justify-between items-center py-6 border-t border-b border-border my-6">
              {prevNext.previous ? (
                <Link href={prevNext.previous.uri} className="flex flex-col items-start max-w-[45%] group">
                  <span className="text-sm text-muted-foreground group-hover:text-foreground mb-1">← Previous Post</span>
                  <span className="font-medium text-purple-600 group-hover:underline line-clamp-2">{prevNext.previous.title}</span>
                </Link>
              ) : <div></div>}
              {prevNext.next ? (
                <Link href={prevNext.next.uri} className="flex flex-col items-end max-w-[45%] text-right group">
                  <span className="text-sm text-muted-foreground group-hover:text-foreground mb-1">Next Post →</span>
                  <span className="font-medium text-purple-600 group-hover:underline line-clamp-2">{prevNext.next.title}</span>
                </Link>
              ) : <div></div>}
            </div>
            <Suspense fallback={<div className="flex justify-center py-4"><span className="h-6 w-24 rounded bg-muted animate-pulse" /></div>}>
              <div className="flex justify-center py-4">
                <ShareButtons title={node.title} url={`${site}${node.uri}`} />
              </div>
            </Suspense>
            <HelpfulVote uri={uri} />
            <Suspense
              fallback={
                <section className="rounded-xl border border-yellow-100 shadow-sm md:shadow p-1 sm:p-2 md:p-4 mt-8" style={{ backgroundColor: "#fff9e6" }}>
                  <h3 className="text-2xl font-bold mb-4">Related Posts</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="rounded-lg overflow-hidden border-2 border-border">
                        <div className="w-full aspect-[3/2] bg-muted animate-pulse" />
                        <div className="p-4">
                          <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              }
            >
              {related.length > 0 && (
                <section className="rounded-xl border border-yellow-100 shadow-sm md:shadow p-1 sm:p-2 md:p-4 mt-8" style={{ backgroundColor: "#fff9e6" }}>
                  <h3 className="text-2xl font-bold mb-4">Related Posts</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {related.map((p: any, i: number) => {
                      const src = p?.featuredImage?.node?.sourceUrl || undefined
                      return (
                        <div key={i} className="rounded-lg overflow-hidden border-2 border-border hover:shadow-lg transition-shadow">
                          <Link href={p.uri} className="block">
                            {src && (
                              <FeaturedImage
                                src={src}
                                alt={p.featuredImage.node.altText || p.title}
                                className="w-full"
                              />
                            )}
                            <div className="p-4">
                              <h4 className="text-base font-semibold line-clamp-2">{p.title}</h4>
                            </div>
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-6 flex justify-center">
                    <Link href={moreLink} className="px-4 py-2 rounded-md border-2 border-border hover:bg-muted">
                      More Posts
                    </Link>
                  </div>
                </section>
              )}
            </Suspense>
          </div>
          <ColorSidebar color={accentColor} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

function parseContentPieces(
  html: string,
  fallbackHex?: string
): Array<{ kind: "html"; html: string } | { kind: "shortcode"; hex: string }> {
  const norm = (html || "")
    .replace(/&(amp;)?#91;?/gi, "[")
    .replace(/&(amp;)?#93;?/gi, "]")
    .replace(/&(amp;)?#x0*5[bB];?/gi, "[")
    .replace(/&(amp;)?#x0*5[dD];?/gi, "]")
    .replace(/&(amp;)?lsqb;?/gi, "[")
    .replace(/&(amp;)?rsqb;?/gi, "]")
    .replace(/&(amp;)?lbrack;?/gi, "[")
    .replace(/&(amp;)?rbrack;?/gi, "]")
    .replace(/\u005B/g, "[")
    .replace(/\u005D/g, "]")
  const re =
    /(\[)\s*colormean\b([\s\S]*?)(\])/gi
  const out: Array<{ kind: "html"; html: string } | { kind: "shortcode"; hex: string }> = []
  let last = 0
  for (const m of norm.matchAll(re) as any) {
    const start = m.index as number
    const full = m[0] as string
    const attrs = m[2] as string
    const prev = norm.slice(last, start)
    if (prev) out.push({ kind: "html", html: removeShortcode(prev) })
    const hex = parseAttrsHex(attrs)
    if (hex) out.push({ kind: "shortcode", hex })
    last = start + full.length
  }
  const rest = norm.slice(last)
  if (rest) out.push({ kind: "html", html: removeShortcode(rest) })
  if (!out.some((p) => p.kind === "shortcode") && fallbackHex) {
    const h2 = norm.match(/<h2[^>]*>[\s\S]*?technical\s+information[\s\S]*?<\/h2>/i)
    if (h2 && h2.index !== undefined) {
      const end = (h2.index as number) + (h2[0] as string).length
      const before = removeShortcode(norm.slice(0, end))
      const after = removeShortcode(norm.slice(end))
      return [
        { kind: "html", html: before },
        { kind: "shortcode", hex: fallbackHex.toUpperCase() },
        { kind: "html", html: after },
      ]
    }
    const marker = norm.match(/technical\s+information/i)
    if (marker && marker.index !== undefined) {
      const end = (marker.index as number) + (marker[0] as string).length
      let before = removeShortcode(norm.slice(0, end))
      const hasAnchor = /\bid\s*=\s*["']technical-information["']/.test(before) || /#[^"']*technical-information/.test(before)
      if (!hasAnchor) before = `${before}<span id="technical-information"></span>`
      const after = removeShortcode(norm.slice(end))
      return [
        { kind: "html", html: before },
        { kind: "shortcode", hex: fallbackHex.toUpperCase() },
        { kind: "html", html: after },
      ]
    }
    return [
      ...out,
      { kind: "shortcode", hex: fallbackHex.toUpperCase() },
    ]
  }
  return out
}

function extractSectionShortcodeHex(html: string): string | null {
  const norm = (html || "")
    .replace(/&(amp;)?#91;?/gi, "[")
    .replace(/&(amp;)?#93;?/gi, "]")
    .replace(/&(amp;)?#x0*5[bB];?/gi, "[")
    .replace(/&(amp;)?#x0*5[dD];?/gi, "]")
    .replace(/&(amp;)?lsqb;?/gi, "[")
    .replace(/&(amp;)?rsqb;?/gi, "]")
    .replace(/&(amp;)?lbrack;?/gi, "[")
    .replace(/&(amp;)?rbrack;?/gi, "]")
    .replace(/\u005B/g, "[")
    .replace(/\u005D/g, "]")
  const re = /(\[)\s*colormean\b([\s\S]*?)(\])/i
  const m = norm.match(re)
  if (!m) return null
  const attrs = m[2] as string
  return parseAttrsHex(attrs)
}

function extractShortcodeHexFromGutenberg(html: string): string | null {
  const content = String(html || "")
  const block = content.match(/<!--\s*wp:shortcode\s*-->([\s\S]*?)<!--\s*\/wp:shortcode\s*-->/i)
  if (!block) return null
  const inner = String(block[1] || "")
  const match = inner.match(/(\[)\s*colormean\b([\s\S]*?)(\])/i)
  if (!match) return null
  const attrs = match[2] as string
  return parseAttrsHex(attrs)
}

function nearestShortcodeHexBeforeTechnical(html: string): string | null {
  const s = String(html || "")
  const h2 = s.match(/<h2[^>]*>[\s\S]*?technical[\s\S]*?<\/h2>/i)
  if (!h2 || typeof h2.index !== "number") return null
  const idx = h2.index as number
  const start = Math.max(0, idx - 3000)
  const window = s.slice(start, idx)
  const g = extractShortcodeHexFromGutenberg(window)
  if (g) return g
  const m = window.match(/(\[)\s*colormean\b([\s\S]*?)(\])/i)
  if (m) {
    const attrs = m[2] as string
    const h = parseAttrsHex(attrs)
    if (h) return h
  }
  const hx = window.match(/#([0-9a-f]{6})/i) || window.match(/\b([0-9a-f]{6})\b/i)
  if (hx) {
    const raw = (hx[1] || "").toLowerCase()
    return `#${raw.toUpperCase()}`
  }
  return null
}

function nearestShortcodeHexAroundTechnical(html: string): string | null {
  const s = String(html || "")
  const h2 = s.match(/<h2[^>]*>[\s\S]*?technical[\s\S]*?<\/h2>/i)
  if (!h2) return null
  const start = (h2.index as number) + (h2[0] as string).length
  const forwardEnd = Math.min(s.length, start + 3000)
  const forward = s.slice(start, forwardEnd)
  const g = extractShortcodeHexFromGutenberg(forward)
  if (g) return g
  const m = forward.match(/(\[)\s*colormean\b([\s\S]*?)(\])/i)
  if (m) {
    const attrs = m[2] as string
    const h = parseAttrsHex(attrs)
    if (h) return h
  }
  const hx = forward.match(/#([0-9a-f]{6})/i) || forward.match(/\b([0-9a-f]{6})\b/i)
  if (hx) {
    const raw = (hx[1] || "").toLowerCase()
    return `#${raw.toUpperCase()}`
  }
  const back = nearestShortcodeHexBeforeTechnical(s)
  if (back) return back
  return null
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
  const h2 = "" // Styling handled by .cm-wrap h2 in globals.css for WikiHow style
  const h3 = "text-2xl md:text-3xl font-semibold leading-snug mt-5 mb-3"
  const h4 = "text-lg md:text-xl font-semibold leading-snug mt-4 mb-2"
  const p = "leading-[1.85] my-4"
  const img = "max-w-full h-auto object-contain rounded-md"
  const blockquote = "border-l-4 pl-4 italic my-4 text-muted-foreground"
  const table = "w-full border-collapse my-4"
  const th = "border px-3 py-2 bg-muted text-foreground"
  const td = "border px-3 py-2"
  const ul = "my-4 space-y-2 cm-ul"
  const ol = "my-4 space-y-2 cm-ol"
  const contrastText = (() => {
    const hex = (accentColor || "#000000").replace("#", "")
    if (!/^[0-9a-f]{6}$/i.test(hex)) return "#FFFFFF"
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128 ? "#000000" : "#FFFFFF"
  })()
  const style = `
    <style>
      .cm-wrap { overflow-wrap: anywhere; word-break: break-word; }
      .cm-wrap p, .cm-wrap li { overflow-wrap: anywhere; word-break: break-word; }
      .cm-wrap table { max-width: 100%; }
      .cm-wrap a { color: #1D4ED8; }
      .cm-wrap a[href^="/"],
      .cm-wrap a[href*="//colormean.com"],
      .cm-wrap a[href*="//colormean.com"] { text-decoration: underline; }
      .cm-wrap a[href^="http"]:not([href*="//colormean.com"]):not([href*="//colormean.com"]) { text-decoration: none; }
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
        color: ${contrastText};
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
      
      // Extract src
      const sMatch = a.match(/\bsrc\s*=\s*["']([^"']+)["']/i)
      const origSrc = sMatch ? sMatch[1] : null
      
      // Parse width and height if available
      const wMatch = a.match(/\bwidth\s*=\s*["']?(\d+)["']?/i)
      const hMatch = a.match(/\bheight\s*=\s*["']?(\d+)["']?/i)
      
      let width = wMatch ? parseInt(wMatch[1]) : 1200
      let height = hMatch ? parseInt(hMatch[1]) : 800

      // Enforce 1200x800 aspect ratio if no dimensions are present or if they differ significantly
      if (!wMatch || !hMatch) {
          width = 1200
          height = 800
      }

      // Add width and height attributes if missing or replace existing ones
      if (wMatch) {
         a = a.replace(wMatch[0], `width="${width}"`)
      } else {
         a = `${a} width="${width}"`
      }
      
      if (hMatch) {
          a = a.replace(hMatch[0], `height="${height}"`)
      } else {
          a = `${a} height="${height}"`
      }

      // Convert WordPress URLs to Gumlet CDN URLs
      if (origSrc) {
        const gumletUrl = convertToGumletUrl(origSrc)
        a = a.replace(sMatch![0], `src="${gumletUrl}"`)
      }
      
      // Handle class
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
      
      // Ensure lazy loading
      if (!/\bloading\s*=/.test(a)) a = `${a.trim()} loading="lazy"`
      
      // Add decoding async for better performance
      if (!/\bdecoding\s*=/.test(a)) a = `${a.trim()} decoding="async"`

      // Add sizes for responsive behavior
      if (!/\bsizes\s*=/.test(a)) a = `${a.trim()} sizes="(min-width: 1024px) 640px, 100vw"`

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
    const site = "https://colormean.com"
    try {
      const u = new URL(url, site)
      if (u.hostname === "localhost" || u.hostname === "cms.colormean.com") {
        u.protocol = "https:"
        u.hostname = "colormean.com"
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
    brown: "#A52A2A",
    violet: "#EE82EE",
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
      if (/(definition|what is)/.test(text)) id = "definition"
      else if (/history/.test(text)) id = "history"
      else if (/symbolism/.test(text)) id = "symbolism"
      else if (/spiritual/.test(text)) id = "spiritual-meaning"
      else if (/psycholog/.test(text)) id = "psychology"
      else if (/personality/.test(text)) id = "personality"
      else if (/(cultural|religious)/.test(text)) id = "cultural-meaning"
      else if (/dream/.test(text)) id = "dreams-meaning"
      else if (/(uses|how to use)/.test(text)) id = "uses"
      else if (/technical/.test(text)) id = "technical-information"
      if (!id) return m
      const hasId = /\bid\s*=/.test(attrs || "")
      const injectStyle = (a: string) => {
        const dbl = a.match(/\bstyle\s*=\s*"([^"]*)"/i)
        const sgl = a.match(/\bstyle\s*=\s*'([^']*)'/i)
        if (dbl) {
          return a.replace(dbl[0], `style="${`${dbl[1]}; scroll-margin-top: 96px`.trim()}"`)
        }
        if (sgl) {
          return a.replace(sgl[0], `style="${`${sgl[1]}; scroll-margin-top: 96px`.trim()}"`)
        }
        const sep = a.trim().length ? " " : ""
        return `${sep}${a.trim()} style="scroll-margin-top: 96px"`
      }
      if (hasId) {
        const styled = injectStyle(attrs || "")
        const idAttr = (attrs || "").match(/\bid\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i)
        const existingId = idAttr ? (idAttr[1] ?? idAttr[2] ?? idAttr[3] ?? "").trim() : ""
        if (existingId.toLowerCase() === id.toLowerCase()) {
          return `<h2${styled}>${inner}</h2>`
        }
        return `<span id="${id}"></span><h2${styled}>${inner}</h2>`
      }
      const trimmed = (attrs || "").trim()
      const extra = trimmed.length ? ` ${trimmed}` : ""
      const styled = injectStyle(extra)
      return `<h2${styled} id="${id}">${inner}</h2>`
    })
  }
  out = addAnchors(out)
  out = out.replace(/<h4([^>]*)>([\s\S]*?)<\/h4>/gi, (m, attrs, inner) => {
    const a = attrs || ""
    const dbl = a.match(/\bclass\s*=\s*"([^"]*)"/i)
    const sgl = a.match(/\bclass\s*=\s*'([^']*)'/i)
    const addClasses = (val: string) => `${val} text-lg md:text-xl font-semibold`.trim()
    if (dbl) {
      const full = dbl[0]
      const val = dbl[1]
      const next = a.replace(full, `class="${addClasses(val)}"`)
      return `<h4${next}>${inner}</h4>`
    }
    if (sgl) {
      const full = sgl[0]
      const val = sgl[1]
      const next = a.replace(full, `class="${addClasses(val)}"`)
      return `<h4${next}>${inner}</h4>`
    }
    const sep = a.trim().length ? " " : ""
    return `<h4${sep}${a.trim()} class="text-lg md:text-xl font-semibold">${inner}</h4>`
  })
  return out
}

function splitSectionsByH2(html: string): string[] {
  const input = html || ""
  const matches: Array<{ start: number; end: number; inner: string }> = []
  const re = /<h2[^>]*>([\s\S]*?)<\/h2>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(input)) !== null) {
    const start = m.index
    const end = start + m[0].length
    const inner = m[1] || ""
    matches.push({ start, end, inner })
  }
  if (!matches.length) return [input]
  const strip = (s: string) => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().toLowerCase()
  const keyIdx = matches.findIndex((x) => /key[\s-]*takeaways/.test(strip(x.inner)))
  const whatIdx = matches.findIndex((x) => /what\s+is/.test(strip(x.inner)) && /color/.test(strip(x.inner)))
  const firstStart = matches[0]?.start ?? 0
  const sections: string[] = []
  if (keyIdx >= 0) {
    sections.push(input.slice(0, matches[keyIdx].start))
    if (whatIdx >= 0 && whatIdx > keyIdx) {
      sections.push(input.slice(matches[keyIdx].start, matches[whatIdx].start))
      for (let i = whatIdx; i < matches.length; i++) {
        const start = matches[i].start
        const next = matches[i + 1]?.start ?? input.length
        sections.push(input.slice(start, next))
      }
    } else {
      sections.push(input.slice(matches[keyIdx].start, input.length))
    }
  } else {
    for (let i = 0; i < matches.length; i++) {
      const start = matches[i].start
      const next = matches[i + 1]?.start ?? input.length
      sections.push(input.slice(start, next))
    }
  }
  return sections
}

function insertFeaturedAfterKeyTakeaways(html: string, src?: string, alt?: string): string {
  if (!src) return html
  const h2KeyRe = /<h2[^>]*>[\s\S]*?key[\s\-]*takeaways[\s\S]*?<\/h2>/i
  const m = html.match(h2KeyRe)
  if (m && m.index !== undefined) {
    const start = m.index
    const afterH2 = start + m[0].length
    const nextH2 = html.indexOf("<h2", afterH2)
    const insertAt = nextH2 >= 0 ? nextH2 : html.length
    const injected = `<img src="${src}" alt="${alt || ""}" width="1200" height="800">`
    return html.slice(0, insertAt) + injected + html.slice(insertAt)
  }
  // Fallback: insert before the next H2 after the first H2; otherwise after the first H2; or at end
  const firstH2 = html.indexOf("<h2")
  if (firstH2 >= 0) {
    const endFirstH2 = html.indexOf("</h2>", firstH2)
    const afterFirst = endFirstH2 >= 0 ? endFirstH2 + "</h2>".length : firstH2
    const nextH2 = html.indexOf("<h2", afterFirst)
    const insertAt = nextH2 >= 0 ? nextH2 : html.length
    const injected = `<img src="${src}" alt="${alt || ""}" width="1200" height="800">`
    return html.slice(0, insertAt) + injected + html.slice(insertAt)
  }
  // No H2 found: append to end to ensure it doesn't disappear
  return `${html}<img src="${src}" alt="${alt || ""}" width="1200" height="800">`
}

function extractImageUrls(html: string): string[] {
  const urls: string[] = []
  const re = /<img[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    const url = m[1]
    if (url) urls.push(url)
  }
  return urls
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
