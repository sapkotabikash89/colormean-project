import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbSchema, WebPageSchema } from "@/components/structured-data"
import { ShareButtons } from "@/components/share-buttons"

export const metadata: Metadata = {
  title: "Privacy Policy - ColorMean",
  description: "Privacy practices of ColorMean. Learn how we collect, use, and protect your information.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <WebPageSchema
        name="Privacy Policy"
        url="https://colormean.com/privacy-policy"
        description="Privacy practices of ColorMean. Learn how we collect, use, and protect your information."
      />
      <BreadcrumbSchema items={[
        { name: "ColorMean", item: "https://colormean.com" },
        { name: "Privacy Policy", item: "https://colormean.com/privacy-policy" }
      ]} />
      <Header />
      <main className="container mx-auto px-4 py-12 flex-1">
        <BreadcrumbNav items={[{ label: "Privacy Policy", href: "/privacy-policy" }]} />
        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
            <div className="prose dark:prose-invert max-w-none space-y-6 text-muted-foreground">
              <p>
                At ColorMean, accessible from <a href="https://colormean.com" className="text-primary hover:underline">https://colormean.com</a>, the privacy of our visitors is one of our top priorities. This Privacy Policy document explains the types of information that are collected and recorded by ColorMean and how we use it.
              </p>
              <p>
                By using our website, you agree to the collection and use of information in accordance with this policy.
              </p>

              <h2 className="text-2xl font-bold text-foreground">Information We Collect</h2>
              <p>We may collect personal information when you:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Contact us via email</li>
                <li>Submit feedback or inquiries</li>
                <li>Interact with tools or features on our website</li>
              </ul>
              <p>The personal information you may be asked to provide includes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your name</li>
                <li>Your email address</li>
                <li>Any message or details you submit voluntarily</li>
              </ul>
              <p>We do not collect sensitive personal data such as financial details, government identification, or health information.</p>

              <h2 className="text-2xl font-bold text-foreground">How We Use Your Information</h2>
              <p>We use the information we collect in the following ways:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To respond to your inquiries and support requests</li>
                <li>To improve website performance and user experience</li>
                <li>To analyze usage trends and site activity</li>
                <li>To detect and prevent technical issues and misuse</li>
                <li>To maintain website security</li>
              </ul>
              <p>We never sell, rent, or trade your personal information with third parties.</p>

              <h2 className="text-2xl font-bold text-foreground">Log Files</h2>
              <p>
                ColorMean follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected may include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Internet protocol addresses</li>
                <li>Browser type</li>
                <li>Internet service provider</li>
                <li>Date and time stamp</li>
                <li>Referring and exit pages</li>
                <li>Number of clicks</li>
              </ul>
              <p>
                These are used for analyzing trends, administering the site, and gathering demographic information. This data is not linked to any personally identifiable information.
              </p>

              <h2 className="text-2xl font-bold text-foreground">Cookies and Web Beacons</h2>
              <p>
                Like most websites, ColorMean uses cookies to store information about visitors’ preferences and to optimize website content based on visitors’ browser type or other information.
              </p>
              <p>
                You can choose to disable cookies through your browser settings. More detailed information about cookie management can be found on your browser’s official website.
              </p>

              <h2 className="text-2xl font-bold text-foreground">Google DoubleClick DART Cookie</h2>
              <p>
                Google is one of our third party vendors on our site. It uses cookies known as DART cookies to serve ads to visitors based on their visit to ColorMean and other websites on the internet.
              </p>
              <p>
                Users may decline the use of the DART cookie by visiting the Google ad and content network Privacy Policy.
              </p>

              <h2 className="text-2xl font-bold text-foreground">Advertising Partners Privacy Policies</h2>
              <p>
                You may consult this list to find the Privacy Policy for each of the advertising partners of ColorMean.
              </p>
              <p>
                Third party ad servers or networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on ColorMean. These technologies are used to measure the effectiveness of their advertising campaigns and personalize the advertising content that you see.
              </p>
              <p>
                ColorMean has no access to or control over these cookies that are used by third party advertisers.
              </p>

              <h2 className="text-2xl font-bold text-foreground">Third Party Privacy Policies</h2>
              <p>
                ColorMean’s Privacy Policy does not apply to other advertisers or websites. We advise you to consult the respective Privacy Policies of third party ad servers for more detailed information about their practices and instructions about how to opt out of certain options.
              </p>

              <h2 className="text-2xl font-bold text-foreground">Data Protection Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Request access to your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your personal data</li>
                <li>Restrict or object to processing of your data</li>
              </ul>
              <p>
                If you would like to exercise any of these rights, please contact us using the details provided below. We will respond within a reasonable timeframe.
              </p>

              <h2 className="text-2xl font-bold text-foreground">Children’s Information</h2>
              <p>
                ColorMean does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you believe that your child has provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best to promptly remove such information from our records.
              </p>

              <h2 className="text-2xl font-bold text-foreground">Use of Automated Systems</h2>
              <p>
                Some parts of our content creation and data structuring may use automated systems. Every page is manually reviewed to maintain accuracy, clarity, and consistency before public release.
              </p>

              <h2 className="text-2xl font-bold text-foreground">Consent</h2>
              <p>
                By using our website, you hereby consent to our Privacy Policy and agree to its terms.
              </p>

              <h2 className="text-2xl font-bold text-foreground">Updates to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Any changes will be reflected on this page with a revised effective date.
              </p>
              <p>
                We encourage users to review this page periodically to stay informed about how we protect your data.
              </p>

              <h2 className="text-2xl font-bold text-foreground">Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, you may contact us at:</p>
              <div className="bg-muted p-4 rounded-lg">
                <p><strong>Email:</strong> <a href="mailto:info@colormean.com" className="text-primary hover:underline">info@colormean.com</a></p>
                <p><strong>Website:</strong> <a href="https://colormean.com" className="text-primary hover:underline">https://colormean.com</a></p>
              </div>
              <p className="font-medium text-lg pt-4 text-foreground">
                Your trust matters to us. ColorMean is committed to protecting your privacy and keeping your information secure.
              </p>
            </div>
            <div className="flex justify-center py-4 mt-8 border-t pt-8">
              <ShareButtons title="ColorMean Privacy Policy" />
            </div>
          </div>
          <ColorSidebar color="#5B6FD8" />
        </div>
      </main>
      <Footer />
    </div>
  )
}
