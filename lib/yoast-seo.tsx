import type { Metadata } from "next"
import Head from "next/head"

type YoastImage = {
  url: string
  width?: number
  height?: number
  type?: string
  alt?: string
}
type YoastRobots = {
  index?: "index" | "noindex"
  follow?: "follow" | "nofollow"
  "max-snippet"?: string | number
  "max-image-preview"?: string | number
  "max-video-preview"?: string | number
}
type YoastAlternate = { href: string; hreflang: string }
export type YoastJSON = {
  title?: string
  description?: string
  canonical?: string
  og_title?: string
  og_description?: string
  og_url?: string
  og_type?: string
  og_site_name?: string
  og_locale?: string
  og_locale_alternate?: string[]
  og_image?: YoastImage[]
  robots?: YoastRobots
  twitter_card?: "summary" | "summary_large_image"
  twitter_title?: string
  twitter_description?: string
  twitter_image?: string
  twitter_image_alt?: string
  twitter_misc?: { site?: string; creator?: string }
  article_published_time?: string
  article_modified_time?: string
  article_author?: string | string[]
  article_section?: string
  article_tag?: string[] | string
  language?: string
  link?: YoastAlternate[]
  schema?: Record<string, any>
}

function ensureAbsolute(url?: string, base?: string) {
  if (!url) return undefined
  try {
    const u = new URL(url, base)
    return u.toString()
  } catch {
    return undefined
  }
}

function parseRobots(robots?: YoastRobots) {
  const index = robots?.index !== "noindex"
  const follow = robots?.follow !== "nofollow"
  const maxSnippet =
    typeof robots?.["max-snippet"] === "string"
      ? robots?.["max-snippet"]!.replace("max-snippet:", "")
      : robots?.["max-snippet"]
  const maxImagePreview =
    typeof robots?.["max-image-preview"] === "string"
      ? robots?.["max-image-preview"]!.replace("max-image-preview:", "")
      : robots?.["max-image-preview"]
  const maxVideoPreview =
    typeof robots?.["max-video-preview"] === "string"
      ? robots?.["max-video-preview"]!.replace("max-video-preview:", "")
      : robots?.["max-video-preview"]
  return {
    index,
    follow,
    googleBot: {
      index,
      follow,
      maxSnippet: maxSnippet ?? -1,
      maxImagePreview: (maxImagePreview as any) ?? "large",
      maxVideoPreview: maxVideoPreview ?? -1,
    },
  }
}

export function mapYoastToMetadata(opts: {
  yoast: YoastJSON
  siteBase: string
  postUrl: string
  siteName: string
}): Metadata {
  const { yoast, siteBase, postUrl, siteName } = opts
  const metadataBase = new URL(siteBase)
  const canonical = ensureAbsolute(yoast.canonical || postUrl, siteBase)
  const images =
    yoast.og_image?.map((img) => ({
      url: ensureAbsolute(img.url, siteBase)!,
      secureUrl: ensureAbsolute(img.url, siteBase),
      width: img.width,
      height: img.height,
      type: img.type,
      alt: img.alt,
    })) ?? []
  const alternatesLanguages =
    yoast.link?.reduce<Record<string, string>>((acc, l) => {
      if (l.hreflang && l.href) acc[l.hreflang] = ensureAbsolute(l.href, siteBase) as string
      return acc
    }, {}) ?? undefined
  const other: Record<string, string | number | (string | number)[]> = {}
  if (yoast.article_published_time) other["article:published_time"] = yoast.article_published_time
  if (yoast.article_modified_time) other["article:modified_time"] = yoast.article_modified_time
  if (yoast.article_author)
    other["article:author"] = Array.isArray(yoast.article_author)
      ? yoast.article_author
      : yoast.article_author
  if (yoast.article_section) other["article:section"] = yoast.article_section
  if (yoast.article_tag)
    other["article:tag"] = Array.isArray(yoast.article_tag) ? yoast.article_tag : [yoast.article_tag]
  if (yoast.og_locale_alternate?.length) other["og:locale:alternate"] = yoast.og_locale_alternate
  return {
    metadataBase,
    title: yoast.title || yoast.og_title,
    description: yoast.description || yoast.og_description,
    alternates: {
      canonical,
      languages: alternatesLanguages,
    },
    robots: parseRobots(yoast.robots),
    openGraph: {
      type: (yoast.og_type as any) || "article",
      title: yoast.og_title || yoast.title,
      description: yoast.og_description || yoast.description,
      url: ensureAbsolute(yoast.og_url || canonical, siteBase),
      siteName: yoast.og_site_name || siteName,
      locale: yoast.og_locale,
      images,
    },
    twitter: {
      card: yoast.twitter_card || "summary_large_image",
      title: yoast.twitter_title || yoast.og_title || yoast.title,
      description: yoast.twitter_description || yoast.og_description || yoast.description,
      images: yoast.twitter_image ? [ensureAbsolute(yoast.twitter_image, siteBase)!] : images[0]?.url ? [images[0].url] : undefined,
      creator: yoast.twitter_misc?.creator,
      site: yoast.twitter_misc?.site || siteName,
    },
    other,
  }
}

export function HeadExtras(props: {
  yoast: YoastJSON
  siteBase: string
  htmlLang?: string
  shortlink?: string
  preconnect?: string[]
  preloadFonts?: { href: string; type?: string }[]
  preloadCss?: { href: string }[]
  preloadScripts?: { href: string }[]
}) {
  const { yoast, siteBase, htmlLang, shortlink, preconnect, preloadFonts, preloadCss, preloadScripts } = props
  const canonical = ensureAbsolute(yoast.canonical, siteBase)
  const schemaJson = yoast.schema ? JSON.stringify(yoast.schema) : null
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {htmlLang ? <meta httpEquiv="content-language" content={htmlLang} /> : null}
      {canonical ? <link rel="canonical" href={canonical} /> : null}
      {shortlink ? <link rel="shortlink" href={ensureAbsolute(shortlink, siteBase)} /> : null}
      {yoast.link?.map((l, i) => (
        <link key={i} rel="alternate" hrefLang={l.hreflang} href={ensureAbsolute(l.href, siteBase)} />
      ))}
      {preconnect?.map((d, i) => (
        <link key={`pc-${i}`} rel="preconnect" href={d} crossOrigin="" />
      ))}
      {preloadFonts?.map((f, i) => (
        <link key={`font-${i}`} rel="preload" href={f.href} as="font" type={f.type || "font/woff2"} crossOrigin="" />
      ))}
      {preloadCss?.map((c, i) => (
        <link key={`css-${i}`} rel="preload" href={c.href} as="style" />
      ))}
      {preloadScripts?.map((s, i) => (
        <link key={`js-${i}`} rel="preload" href={s.href} as="script" />
      ))}
      {schemaJson ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson }} /> : null}
    </Head>
  )
}
