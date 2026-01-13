import Script from "next/script"

interface BreadcrumbItem {
  name: string
  item: string
}

interface FAQItem {
  question: string
  answer: string
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  }

  return <Script id="breadcrumb-schema" type="application/ld+json" strategy="beforeInteractive">{JSON.stringify(schema)}</Script>
}

export function FAQSchema({ faqs }: { faqs: FAQItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return <Script id="faq-schema" type="application/ld+json" strategy="beforeInteractive">{JSON.stringify(schema)}</Script>
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ColorMean",
    url: "https://colormean.com",
    description: "Know your color - Explore color information, meanings, conversions, and professional tools",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://colormean.com/colors/{search_term_string}",
      "query-input": "required name=search_term_string",
    },
  }

  return <Script id="website-schema" type="application/ld+json" strategy="beforeInteractive">{JSON.stringify(schema)}</Script>
}

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ColorMean",
    url: "https://colormean.com",
    logo: "https://colormean.com/logo.webp",
    description: "Professional color tools and information for designers, developers, and artists",
    sameAs: [],
  }

  return <Script id="organization-schema" type="application/ld+json" strategy="beforeInteractive">{JSON.stringify(schema)}</Script>
}

export function SoftwareApplicationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ColorMean",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: "Free online color tools including color picker, contrast checker, and color harmonies generator",
  }

  return <Script id="software-app-schema" type="application/ld+json" strategy="beforeInteractive">{JSON.stringify(schema)}</Script>
}

export function ImageObjectSchema({
  url,
  width,
  height,
  alt,
  caption,
  description,
  author,
  representativeOfPage,
}: {
  url: string
  width: number
  height: number
  alt?: string
  caption?: string
  description?: string
  author?: string
  representativeOfPage?: boolean
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    url,
    contentUrl: url,
    encodingFormat: "image/webp",
    width,
    height,
    caption: caption ?? alt,
    description: description ?? undefined,
    author: author ?? undefined,
    representativeOfPage: representativeOfPage ?? undefined,
  }
  return <Script id="imageobject-schema" type="application/ld+json" strategy="beforeInteractive">{JSON.stringify(schema)}</Script>
}

export function ToolApplicationSchema({
  name,
  slug,
  description,
}: {
  name: string
  slug: string
  description: string
}) {
  const url = `https://www.colormean.com/${slug}`
  const image = `https://www.colormean.com/tools/${slug}-snapshot.webp`
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    url,
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    description,
    image,
  }
  return <Script id={`${slug}-webapp-schema`} type="application/ld+json" strategy="beforeInteractive">{JSON.stringify(schema)}</Script>
}

export function WebPageSchema({
  name,
  url,
  description,
}: {
  name: string
  url: string
  description?: string
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    url,
    description: description ?? undefined,
  }
  return <Script id="webpage-schema" type="application/ld+json" strategy="beforeInteractive">{JSON.stringify(schema)}</Script>
}

export function HowToSchema({
  name,
  steps,
}: {
  name: string
  steps: string[]
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s,
      text: s,
    })),
  }
  return <Script id="howto-schema" type="application/ld+json" strategy="beforeInteractive">{JSON.stringify(schema)}</Script>
}

export function CollectionPageSchema({
  name,
  url,
}: {
  name: string
  url: string
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url,
  }
  return <Script id="collectionpage-schema" type="application/ld+json" strategy="beforeInteractive">{JSON.stringify(schema)}</Script>
}

export function ItemListSchema({
  items,
}: {
  items: Array<{ name: string; url: string }>
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  }
  return <Script id="itemlist-schema" type="application/ld+json" strategy="beforeInteractive">{JSON.stringify(schema)}</Script>
}

export function BlogPostingSchema({
  title,
  description,
  author,
  publisher,
  image,
  datePublished,
  dateModified,
  url,
}: {
  title: string
  description?: string
  author: string
  publisher: { name: string; url: string; logo?: string }
  image?: { url: string; width?: number; height?: number; alt?: string }
  datePublished?: string
  dateModified?: string
  url: string
}) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description ?? undefined,
    author: { "@type": "Person", name: author },
    publisher: {
      "@type": "Organization",
      name: publisher.name,
      url: publisher.url,
      logo: publisher.logo ?? undefined,
    },
    datePublished: datePublished ?? undefined,
    dateModified: dateModified ?? undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
  }
  if (image?.url) {
    schema.image = {
      "@type": "ImageObject",
      url: image.url,
      width: image.width ?? undefined,
      height: image.height ?? undefined,
    }
  }
  return <Script id="blogposting-schema" type="application/ld+json" strategy="beforeInteractive">{JSON.stringify(schema)}</Script>
}
