import Script from "next/script"
import { getFaqsByColorSlug } from "@/lib/faqs"

export interface FAQItem {
  question: string
  answer: string
}

async function loadFaqs(color?: string | null): Promise<FAQItem[]> {
  const faqs = getFaqsByColorSlug(color)
  if (!Array.isArray(faqs)) return []
  return faqs.filter((x) => x && typeof x.question === "string" && typeof x.answer === "string")
}

export async function FAQSection({ color }: { color?: string | null }) {
  const faqs = await loadFaqs(color)
  if (!faqs.length) return null
  const headingColor = (color || "").trim()
  const title =
    headingColor.length > 0
      ? `FAQs about the color ${headingColor.charAt(0).toUpperCase()}${headingColor.slice(1)}`
      : "FAQs"

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

  return (
    <>
      <Script id="color-faq-schema" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(schema)}
      </Script>
      <section id="faqs" className="bg-white rounded-xl border border-border shadow-sm md:shadow p-1 sm:p-2 md:p-4 mt-8">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="space-y-3">
          {faqs.map((item, idx) => (
            <details key={idx} className="group">
              <summary className="cursor-pointer font-semibold text-[1.05rem] leading-snug mb-1">
                {item.question}
              </summary>
              <div className="pl-1">
                <p className="leading-[1.85] my-2">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
