import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbSchema } from "@/components/structured-data"

import { ShareButtons } from "@/components/share-buttons"

export const metadata: Metadata = {
  title: "Editorial Policy - ColorMean",
  description: "Editorial standards of ColorMean. Learn how we create, review, and maintain content.",
}

export default function EditorialPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <BreadcrumbSchema items={[
        { name: "ColorMean", item: "https://colormean.com" },
        { name: "Editorial Policy", item: "https://colormean.com/editorial-policy" }
      ]} />
      <Header />
      <main className="container mx-auto px-4 py-12 flex-1">
        <BreadcrumbNav items={[{ label: "Editorial Policy", href: "/editorial-policy" }]} />
        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl font-bold mb-4">Editorial Policy</h1>
            <div className="prose dark:prose-invert max-w-none space-y-6 text-muted-foreground">
              <p>
                At <strong>ColorMean</strong>, our mission is to provide accurate, meaningful, and well-researched information about colors, their symbolism, psychological impact, spiritual value, and technical properties. Every page published on this website follows a clear editorial standard focused on quality, clarity, and trust.
              </p>
              <p>
                This Editorial Policy explains how our content is created, reviewed, updated, and maintained.
              </p>

              <h2 className="text-2xl font-bold text-foreground">1. Our Content Purpose</h2>
              <p>ColorMean exists to help users understand:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Color meanings and symbolism</li>
                <li>Psychological and emotional influence of colors</li>
                <li>Spiritual interpretations of colors</li>
                <li>Cultural and historical color significance</li>
                <li>Technical color data such as HEX, RGB, CMYK, HSL, harmonies, contrast, and accessibility</li>
              </ul>
              <p>Our content is created strictly for educational and informational purposes.</p>

              <h2 className="text-2xl font-bold text-foreground">2. Research and Information Sources</h2>
              <p>All content published on ColorMean is based on:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Established color theory principles</li>
                <li>Visual perception and psychology research</li>
                <li>Cultural symbolism references</li>
                <li>Spiritual and traditional interpretations</li>
                <li>Artistic and historical usage of colors</li>
                <li>Standard digital color models and conversion systems</li>
              </ul>
              <p>We aim to present information in a balanced way that reflects both traditional meaning and modern interpretation.</p>

              <h2 className="text-2xl font-bold text-foreground">3. Editorial Review Process</h2>
              <p>Every page published on ColorMean goes through a structured review process that includes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Language and clarity review</li>
                <li>Fact validation for symbolism and psychology topics</li>
                <li>Technical verification of color values</li>
                <li>Internal consistency checks across related color pages</li>
                <li>Readability and usability review for both desktop and mobile users</li>
              </ul>
              <p>No content is published without passing internal quality checks.</p>

              <h2 className="text-2xl font-bold text-foreground">4. Accuracy of Technical Color Data</h2>
              <p>All technical color information displayed on ColorMean, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>HEX codes</li>
                <li>RGB values</li>
                <li>CMYK values</li>
                <li>HSL values</li>
                <li>Color harmonies</li>
                <li>Shades, tints, and tones</li>
                <li>Contrast ratios and accessibility checks</li>
              </ul>
              <p>Is generated using algorithmic color models and verified using standard industry formulas. We continuously test and validate these values to ensure accuracy.</p>

              <h2 className="text-2xl font-bold text-foreground">5. Use of Automation and AI</h2>
              <p>To support large scale content creation:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Certain drafts may be generated using automated systems or AI tools</li>
                <li>Every AI-assisted page is manually reviewed, edited, and verified by our editorial team before publication</li>
                <li>Automation is used only as a productivity aid, never as a replacement for human editorial judgment</li>
              </ul>
              <p>We do not publish fully unreviewed automated content.</p>

              <h2 className="text-2xl font-bold text-foreground">6. Editorial Independence and Neutrality</h2>
              <p>ColorMean maintains full editorial independence. We do not accept:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Paid symbolism interpretations</li>
                <li>Sponsored psychological claims</li>
                <li>Manipulated emotional narratives</li>
                <li>Influenced spiritual meanings</li>
              </ul>
              <p>All interpretations are presented for educational understanding, not commercial persuasion.</p>

              <h2 className="text-2xl font-bold text-foreground">7. Content Updates and Corrections</h2>
              <p>Our editorial team regularly reviews older content to maintain relevance and accuracy. If an error is discovered:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The content is corrected promptly</li>
                <li>Technical values are revalidated</li>
                <li>Interpretations are refined when required</li>
              </ul>
              <p>We encourage users to report inaccuracies through our Contact page.</p>

              <h2 className="text-2xl font-bold text-foreground">8. No Medical, Psychological, or Legal Advice</h2>
              <p>Although ColorMean discusses psychological and emotional color effects:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Our content does not constitute medical, therapeutic, legal, or professional advice</li>
                <li>Users should always consult licensed professionals for clinical, medical, or legal concerns</li>
              </ul>
              <p>Our goal is educational insight, not diagnosis or treatment.</p>

              <h2 className="text-2xl font-bold text-foreground">9. Authorship and Editorial Responsibility</h2>
              <p>ColorMean follows a team-based editorial model. Instead of listing individual authors on every page, all content is:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Researched</li>
                <li>Reviewed</li>
                <li>Curated by the ColorMean Editorial Team</li>
              </ul>
              <p>This ensures consistency, accuracy, and long-term accountability across the entire website.</p>

              <h2 className="text-2xl font-bold text-foreground">10. Transparency and User Trust</h2>
              <p>We believe trust is the foundation of educational content. That is why we commit to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Clear editorial standards</li>
                <li>Transparent use of automation</li>
                <li>Continuous accuracy improvements</li>
                <li>Open feedback and corrections</li>
                <li>Independent content creation</li>
              </ul>
              <p>ColorMean is built to be a reliable, long-term reference for color knowledge worldwide.</p>
            </div>
            <div className="flex justify-center py-4 mt-8 border-t pt-8">
              <ShareButtons title="ColorMean Editorial Policy" />
            </div>
          </div>
          <ColorSidebar color="#5B6FD8" />
        </div>
      </main>
      <Footer />
    </div>
  )
}
