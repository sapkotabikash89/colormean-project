import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbSchema, WebPageSchema } from "@/components/structured-data"

import { ShareButtons } from "@/components/share-buttons"

export const metadata: Metadata = {
  title: "Disclaimer - ColorMean",
  description: "Disclaimer for ColorMean. Read our limitations of liability and information policies.",
}

export default function DisclaimerPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <WebPageSchema
        name="Disclaimer"
        url="https://colormean.com/disclaimer"
        description="Disclaimer for ColorMean. Read our limitations of liability and information policies."
      />
      <BreadcrumbSchema items={[
        { name: "ColorMean", item: "https://colormean.com" },
        { name: "Disclaimer", item: "https://colormean.com/disclaimer" }
      ]} />
      <Header />
      <main className="container mx-auto px-4 py-12 flex-1">
        <BreadcrumbNav items={[{ label: "Disclaimer", href: "/disclaimer" }]} />
        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl font-bold mb-4">Disclaimer</h1>
            <div className="prose dark:prose-invert max-w-none space-y-6 text-muted-foreground">
              <p>
                The information provided by <strong>ColorMean</strong> (<a href="https://colormean.com" className="text-primary hover:underline">https://colormean.com</a>) is for general informational and educational purposes only. All content on this website is published in good faith and is intended to help users understand color meanings, symbolism, psychology, spirituality, and technical color data.
              </p>
              <p>
                By using this website, you agree to this Disclaimer in full.
              </p>

              <h2 className="text-2xl font-bold text-foreground">No Professional Advice</h2>
              <p>
                The content on ColorMean does not constitute professional advice of any kind, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Psychological advice</li>
                <li>Medical advice</li>
                <li>Spiritual or religious guidance</li>
                <li>Legal or financial advice</li>
              </ul>
              <p>
                Color meanings, emotional responses, and symbolic interpretations may vary by culture, belief system, personal experience, and context. You should always consult a qualified professional for specific advice related to your situation.
              </p>

              <h2 className="text-2xl font-bold text-foreground">Accuracy of Information</h2>
              <p>
                While we strive to keep the information on ColorMean accurate and up to date:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We make no guarantees about the completeness, reliability, or accuracy of any content</li>
                <li>Symbolic and spiritual interpretations are based on traditional beliefs, research, and general interpretations</li>
                <li>Technical color values such as HEX, RGB, CMYK, and HSL are generated using standard digital models and formulas</li>
              </ul>
              <p>
                Any action you take based on the information you find on this website is strictly at your own risk.
              </p>

              <h2 className="text-2xl font-bold text-foreground">Use of Tools and Generators</h2>
              <p>ColorMean provides interactive tools such as:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Color pickers</li>
                <li>Palette generators</li>
                <li>Random color generators</li>
                <li>Contrast and accessibility checkers</li>
                <li>Color harmonies and shade tools</li>
              </ul>
              <p>
                These tools are offered as is and without any warranties. We do not guarantee that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Generated values will always be error free</li>
                <li>Outputs will be suitable for specific design, branding, print, or commercial purposes</li>
                <li>Tools will be available without interruption</li>
              </ul>
              <p>
                ColorMean is not responsible for design outcomes, usability issues, or business decisions made using our tools.
              </p>

              <h2 className="text-2xl font-bold text-foreground">External Links Disclaimer</h2>
              <p>
                ColorMean may contain links to external websites that are not provided or maintained by us. While we aim to link only to useful and ethical sources:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We do not control the content or policies of third party websites</li>
                <li>We do not guarantee the accuracy of information found on external sites</li>
                <li>We are not responsible for any loss or damage caused by visiting third party links</li>
              </ul>
              <p>
                Users should review the Privacy Policies and Terms of those websites before engaging with them.
              </p>

              <h2 className="text-2xl font-bold text-foreground">Affiliate and Advertising Disclosure</h2>
              <p>
                ColorMean may display advertisements and promotional content from third party advertising networks. These ads help support the operation of the website.
              </p>
              <p>
                We do not directly endorse every product or service shown in advertisements. Any interaction with ads is purely between you and the advertiser.
              </p>

              <h2 className="text-2xl font-bold text-foreground">Limitation of Liability</h2>
              <p>
                Under no circumstances shall ColorMean, its owners, or its editorial team be held liable for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Any direct or indirect loss or damage</li>
                <li>Any content inaccuracies or omissions</li>
                <li>Any technical errors or site downtime</li>
                <li>Any losses arising from the use of tools or generated data</li>
                <li>Any spiritual, emotional, or interpretive decisions based on symbolic content</li>
              </ul>
              <p>
                Your use of this website is entirely at your own discretion and risk.
              </p>

              <h2 className="text-2xl font-bold text-foreground">Consent</h2>
              <p>
                By using our website, you hereby consent to this Disclaimer and agree to its terms.
              </p>

              <h2 className="text-2xl font-bold text-foreground">Updates to This Disclaimer</h2>
              <p>
                We may update this Disclaimer at any time without prior notice. Any changes will be posted on this page and will take effect immediately after publication.
              </p>
              <p>
                We encourage users to review this page periodically.
              </p>

              <h2 className="text-2xl font-bold text-foreground">Contact Us</h2>
              <p>
                If you have any questions about this Disclaimer, you may contact us at:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p><strong>Email:</strong> <a href="mailto:info@colormean.com" className="text-primary hover:underline">info@colormean.com</a></p>
                <p><strong>Website:</strong> <a href="https://colormean.com" className="text-primary hover:underline">https://colormean.com</a></p>
              </div>
              <p className="font-medium text-lg pt-4 text-foreground">
                ColorMean provides knowledge for learning and exploration, not as a substitute for professional guidance.
              </p>
            </div>
            <div className="flex justify-center py-4 mt-8 border-t pt-8">
              <ShareButtons title="ColorMean Disclaimer" />
            </div>
          </div>
          <ColorSidebar color="#5B6FD8" />
        </div>
      </main>
      <Footer />
    </div>
  )
}
