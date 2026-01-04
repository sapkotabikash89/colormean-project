import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbSchema } from "@/components/structured-data"
import { ShareButtons } from "@/components/share-buttons"

export const metadata: Metadata = {
  title: "Terms and Conditions - ColorMean",
  description: "Terms and conditions for using ColorMean. Read our rules and guidelines.",
}

export default function TermsAndConditionsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <BreadcrumbSchema items={[
        { name: "ColorMean", item: "https://www.colormean.com" },
        { name: "Terms and Conditions", item: "https://www.colormean.com/terms-and-conditions" }
      ]} />
      <Header />
      <main className="container mx-auto px-4 py-12 flex-1">
        <BreadcrumbNav items={[{ label: "Terms and Conditions", href: "/terms-and-conditions" }]} />
        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
            <div className="prose dark:prose-invert max-w-none space-y-6 text-muted-foreground">
              <p>
                Welcome to <strong>ColorMean</strong>. These Terms and Conditions outline the rules and guidelines for using our website, located at <a href="https://www.colormean.com" className="text-primary hover:underline">https://www.colormean.com</a>.
              </p>
              <p>
                By accessing this website, you accept these Terms and Conditions in full. If you do not agree with any part of these terms, please discontinue use of ColorMean.
              </p>

              <h2 className="text-2xl font-bold text-foreground">Use of the Website</h2>
              <p>By using ColorMean, you agree that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You will use the website for lawful purposes only</li>
                <li>You will not use the website in any way that causes damage or impairs accessibility</li>
                <li>You will not attempt to gain unauthorized access to any part of the website</li>
                <li>You will not misuse our tools, data, or content for harmful or illegal activities</li>
              </ul>
              <p>All users must comply with applicable local and international laws.</p>

              <h2 className="text-2xl font-bold text-foreground">Intellectual Property Rights</h2>
              <p>
                Unless otherwise stated, ColorMean and its editorial team own the intellectual property rights for all content published on this website, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Articles and written content</li>
                <li>Color data organization and presentation</li>
                <li>Tools and generators</li>
                <li>Layout structure and branding</li>
              </ul>
              <p>You may:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>View and read content for personal use</li>
                <li>Share links to our pages with proper attribution</li>
              </ul>
              <p>You may not:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Republish our content without written permission</li>
                <li>Copy large sections of content for commercial use</li>
                <li>Sell, rent, or license our content</li>
                <li>Reproduce our tools or databases without approval</li>
              </ul>

              <h2 className="text-2xl font-bold text-foreground">Educational and Informational Purpose</h2>
              <p>
                All content on ColorMean is provided for <strong>educational and informational purposes only</strong>. While we strive for accuracy:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Symbolism, psychology, and spiritual meanings may vary by culture and personal belief</li>
                <li>Technical color values are presented using standard digital models but may differ slightly across displays and devices</li>
              </ul>
              <p>We do not guarantee absolute accuracy in every context.</p>

              <h2 className="text-2xl font-bold text-foreground">User Submissions</h2>
              <p>If you submit feedback, suggestions, or messages to ColorMean:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You grant us the right to use that feedback for improvement purposes</li>
                <li>You confirm that your submission does not violate any third party rights</li>
                <li>You agree not to submit false, misleading, or harmful information</li>
              </ul>
              <p>We reserve the right to remove or ignore any inappropriate submissions.</p>

              <h2 className="text-2xl font-bold text-foreground">Tools and Interactive Features</h2>
              <p>ColorMean offers color related tools such as:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Color generators</li>
                <li>Color pickers</li>
                <li>Palettes and harmonies</li>
                <li>Contrast and accessibility checkers</li>
              </ul>
              <p>
                These tools are provided as is, without any guarantees of accuracy, availability, or uninterrupted access.
              </p>
              <p>We are not responsible for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Errors in generated values</li>
                <li>Design outcomes based on tool use</li>
                <li>Business decisions made using our data</li>
              </ul>

              <h2 className="text-2xl font-bold text-foreground">External Links</h2>
              <p>
                ColorMean may contain links to third party websites. These external sites are not operated by us. We:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Do not control their content or policies</li>
                <li>Are not responsible for damages or losses caused by third party services</li>
                <li>Encourage users to review third party terms before interacting</li>
              </ul>

              <h2 className="text-2xl font-bold text-foreground">Limitation of Liability</h2>
              <p>ColorMean and its editorial team shall not be held liable for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Any direct or indirect loss or damage</li>
                <li>Data loss or business interruption</li>
                <li>Design, branding, or creative outcomes based on our content</li>
                <li>Misinterpretation of symbolic or spiritual content</li>
              </ul>
              <p>Use of the website is entirely at your own risk.</p>

              <h2 className="text-2xl font-bold text-foreground">Termination of Access</h2>
              <p>We reserve the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Restrict or terminate access to any user</li>
                <li>Block harmful traffic</li>
                <li>Remove abusive interactions</li>
                <li>Disable access without notice in case of misuse</li>
              </ul>

              <h2 className="text-2xl font-bold text-foreground">Changes to These Terms</h2>
              <p>
                We may update these Terms and Conditions at any time. Changes become effective immediately after being posted on this page. Continued use of the website means you accept the updated terms.
              </p>
              <p>We recommend reviewing this page regularly.</p>

              <h2 className="text-2xl font-bold text-foreground">Governing Law</h2>
              <p>
                These Terms and Conditions are governed in accordance with applicable international digital use standards. Any disputes shall be resolved under the relevant jurisdictional guidelines.
              </p>

              <h2 className="text-2xl font-bold text-foreground">Contact Information</h2>
              <p>If you have any questions about these Terms and Conditions, you may contact us at:</p>
              <div className="bg-muted p-4 rounded-lg">
                <p><strong>Email:</strong> <a href="mailto:info@colormean.com" className="text-primary hover:underline">info@colormean.com</a></p>
                <p><strong>Website:</strong> <a href="https://www.colormean.com" className="text-primary hover:underline">https://www.colormean.com</a></p>
              </div>
              <p className="font-medium text-lg pt-4 text-foreground">
                By continuing to use ColorMean, you confirm that you understand and agree to these Terms and Conditions.
              </p>
            </div>
            <div className="flex justify-center py-4 mt-8 border-t pt-8">
              <ShareButtons title="ColorMean Terms and Conditions" />
            </div>
          </div>
          <ColorSidebar color="#5B6FD8" />
        </div>
      </main>
      <Footer />
    </div>
  )
}
