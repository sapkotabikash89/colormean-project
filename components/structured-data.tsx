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
    url: "https://www.colormean.com",
    description: "Know your color - Explore color information, meanings, conversions, and professional tools",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.colormean.com/colors/{search_term_string}",
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
    url: "https://www.colormean.com",
    logo: "https://www.colormean.com/logo.png",
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
