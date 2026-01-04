import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbSchema } from "@/components/structured-data"

import { ShareButtons } from "@/components/share-buttons"

export const metadata: Metadata = {
  title: "Contact Us - ColorMean",
  description: "Get in touch with ColorMean. Edit this sample content later.",
}

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <BreadcrumbSchema items={[
        { name: "ColorMean", item: "https://www.colormean.com" },
        { name: "Contact", item: "https://www.colormean.com/contact" }
      ]} />
      <Header />
      <main className="container mx-auto px-4 py-12 flex-1">
        <BreadcrumbNav items={[{ label: "Contact", href: "/contact" }]} />
        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
            <div className="prose dark:prose-invert max-w-none space-y-6 text-muted-foreground">
              <p>
                We are always happy to hear from our readers, creators, researchers, and partners. Whether you have a question about color meanings, need technical clarification, want to suggest an improvement, or report an issue, the ColorMean team is here to help.
              </p>
              <p>
                Your feedback helps us refine our content and improve the experience for everyone who uses ColorMean.
              </p>

              <h2 className="text-2xl font-bold text-foreground">How You Can Reach Us</h2>
              <div className="bg-muted p-4 rounded-lg">
                <p><strong>Email:</strong> <a href="mailto:info@colormean.com" className="text-primary hover:underline">info@colormean.com</a></p>
                <p><strong>Website:</strong> <a href="https://www.colormean.com" className="text-primary hover:underline">https://www.colormean.com</a></p>
              </div>
              <p>For faster assistance, please include clear details in your message such as:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The page URL you are referring to</li>
                <li>The nature of your question or concern</li>
                <li>Any supporting information if applicable</li>
              </ul>

              <h2 className="text-2xl font-bold text-foreground">What You Can Contact Us About</h2>
              <p>You may contact us for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Content corrections or factual updates</li>
                <li>Feedback on color meanings, symbolism, or technical data</li>
                <li>Tool related issues or feature requests</li>
                <li>Collaboration and partnership inquiries</li>
                <li>Accessibility concerns</li>
                <li>Legal or copyright related requests</li>
              </ul>
              <p>We review every message carefully and respond as quickly as possible.</p>

              <h2 className="text-2xl font-bold text-foreground">Editorial and Content Queries</h2>
              <p>
                If you have questions about how our content is created, reviewed, or updated, you are welcome to reach out. Transparency is important to us, and we are always open to constructive discussion.
              </p>

              <h2 className="text-2xl font-bold text-foreground">Business and Collaboration</h2>
              <p>If you are interested in working with ColorMean for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Educational projects</li>
                <li>Brand collaborations</li>
                <li>Marketing partnerships</li>
                <li>Technical integrations</li>
              </ul>
              <p>Please send a detailed proposal to our email so the appropriate team can review it.</p>

              <h2 className="text-2xl font-bold text-foreground">Response Time</h2>
              <p>
                We aim to reply to most queries within 24 to 72 business hours. During peak periods, response times may vary slightly.
              </p>
              <p className="font-medium text-lg pt-4 text-foreground">
                Thank you for being part of the ColorMean audience. Your voice helps shape the future of this platform.
              </p>
            </div>
            <div className="flex justify-center py-4 mt-8 border-t pt-8">
              <ShareButtons title="Contact ColorMean" />
            </div>
          </div>
          <ColorSidebar color="#5B6FD8" />
        </div>
      </main>
      <Footer />
    </div>
  )
}
