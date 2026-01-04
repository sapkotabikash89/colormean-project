import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbSchema } from "@/components/structured-data"

import { ShareButtons } from "@/components/share-buttons"

export const metadata: Metadata = {
  title: "About Us - ColorMean",
  description: "Learn about ColorMean. Edit this sample content later.",
}

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <BreadcrumbSchema items={[
        { name: "ColorMean", item: "https://www.colormean.com" },
        { name: "About Us", item: "https://www.colormean.com/about-us" }
      ]} />
      <Header />
      <main className="container mx-auto px-4 py-12 flex-1">
        <BreadcrumbNav items={[{ label: "About Us", href: "/about-us" }]} />
        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl font-bold mb-4">About Us</h1>
            <div className="prose dark:prose-invert max-w-none space-y-6 text-muted-foreground">
              <p>
                Welcome to <strong>ColorMean</strong>, your dedicated space for exploring the deeper side of colors. We focus on the meaning, symbolism, psychology, spirituality, and technical structure of colors, all in one place. Our goal is simple. To help you understand how colors influence thoughts, emotions, culture, and visual communication.
              </p>
              <p>
                Color is not only what we see. It shapes how we feel, how we react, and how we express identity. At ColorMean, we study color from both an emotional and a technical point of view to give you a complete picture.
              </p>

              <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
              <p>
                Our mission is to build a <strong>trusted global reference</strong> for color meaning and color data. We want artists, designers, students, spiritual seekers, and curious minds to find accurate and meaningful color insights without confusion.
              </p>
              <p>We focus on:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Color meanings and symbolism</li>
                <li>Psychological and emotional impact of colors</li>
                <li>Spiritual and cultural interpretations</li>
                <li>Technical color data like HEX, RGB, CMYK, HSL</li>
                <li>Color harmonies, palettes, shades, and contrast</li>
              </ul>
              <p>
                Every page is created to balance <strong>education, clarity, and real-world usability</strong>.
              </p>

              <h2 className="text-2xl font-bold text-foreground">What Makes ColorMean Different</h2>
              <p>
                Many websites talk about colors only from a design angle. We go further.
              </p>
              <p>At ColorMean, we connect:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Emotion with data</li>
                <li>Spiritual meaning with visual science</li>
                <li>Cultural symbolism with modern color systems</li>
              </ul>
              <p>
                This allows you to see colors not only as digital values but as tools of expression, identity, and influence.
              </p>
              <p>We also structure our content so that it is:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Easy to scan</li>
                <li>Deep enough to learn from</li>
                <li>Useful for both beginners and professionals</li>
              </ul>

              <h2 className="text-2xl font-bold text-foreground">How We Create Our Content</h2>
              <p>
                All content on ColorMean follows a clear editorial system.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Symbolism and cultural meanings</strong> are based on traditional interpretations and modern references.</li>
                <li><strong>Psychological insights</strong> focus on commonly observed emotional responses to color.</li>
                <li><strong>Technical color values</strong> are generated using standard digital color models and verified formulas.</li>
                <li><strong>Automated systems</strong> may assist in drafting. Every page is <strong>manually reviewed and refined</strong> before publication.</li>
              </ul>
              <p>
                This ensures that our platform stays <strong>accurate, consistent, and reliable</strong>.
              </p>

              <h2 className="text-2xl font-bold text-foreground">Our Editorial Team</h2>
              <p>
                Instead of publishing under individual author names, all content is curated by the <strong>ColorMean Editorial Team</strong>. This team-based approach ensures:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Uniform quality across the website</li>
                <li>Strong internal review standards</li>
                <li>Long-term accountability</li>
                <li>Consistency in tone and accuracy</li>
              </ul>
              <p>
                You may see the trust label <strong>Reviewed by ColorMean Editorial Team</strong> across our pages. This confirms that content has passed internal verification before publication.
              </p>

              <h2 className="text-2xl font-bold text-foreground">Our Vision for the Future</h2>
              <p>
                We aim to grow ColorMean into one of the most complete color knowledge hubs available online. Our future roadmap includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Expanded shade meaning libraries</li>
                <li>Advanced color tools for creators</li>
                <li>Accessibility focused color testing systems</li>
                <li>Deeper cultural and spiritual research archives</li>
              </ul>
              <p>
                We want ColorMean to remain useful for years to come, not just for trends.
              </p>

              <h2 className="text-2xl font-bold text-foreground">Transparency and Trust</h2>
              <p>
                Trust matters. That is why we commit to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Clear editorial standards</li>
                <li>Honest use of automation</li>
                <li>Ongoing accuracy reviews</li>
                <li>Independent content creation</li>
                <li>Open communication with our users</li>
              </ul>
              <p>
                If any issue is found, we work to correct it quickly.
              </p>

              <h2 className="text-2xl font-bold text-foreground">Get in Touch</h2>
              <p>
                We always welcome feedback, suggestions, and corrections.
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p><strong>Email:</strong> <a href="mailto:info@colormean.com" className="text-primary hover:underline">info@colormean.com</a></p>
                <p><strong>Website:</strong> <a href="https://www.colormean.com" className="text-primary hover:underline">https://www.colormean.com</a></p>
              </div>
              <p>
                If you have ideas for improvement, spot a technical issue, or want to collaborate, feel free to reach out.
              </p>
              <p className="font-medium text-lg pt-4 text-foreground">
                ColorMean exists for one purpose. To help you see color with more meaning.
              </p>
            </div>
            <div className="flex justify-center py-4 mt-8 border-t pt-8">
              <ShareButtons title="About ColorMean" />
            </div>
          </div>
          <ColorSidebar color="#5B6FD8" />
        </div>
      </main>
      <Footer />
    </div>
  )
}
