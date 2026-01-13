import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbSchema, WebPageSchema } from "@/components/structured-data"

import { ShareButtons } from "@/components/share-buttons"

export const metadata: Metadata = {
  title: "Cookie Policy - ColorMean",
  description: "Cookie Policy for ColorMean. Learn how we use cookies to improve your experience.",
}

export default function CokiePolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <WebPageSchema
        name="Cookie Policy"
        url="https://colormean.com/cookie-policy"
        description="Cookie Policy for ColorMean. Learn how we use cookies to improve your experience."
      />
      <BreadcrumbSchema items={[
        { name: "ColorMean", item: "https://colormean.com" },
        { name: "Cookie Policy", item: "https://colormean.com/cookie-policy" }
      ]} />
      <Header />
      <main className="container mx-auto px-4 py-12 flex-1">
        <BreadcrumbNav items={[{ label: "Cookie Policy", href: "/cookie-policy" }]} />
        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl font-bold mb-4">Cookie Policy</h1>
            <div className="prose dark:prose-invert max-w-none space-y-6 text-muted-foreground">
              <p>
                This Cookie Policy explains how <strong>ColorMean</strong> (<a href="https://colormean.com" className="text-primary hover:underline">https://colormean.com</a>) uses cookies and similar technologies to recognize visitors, improve user experience, and analyze website performance.
              </p>
              <p>
                By continuing to use our website, you consent to our use of cookies as described in this policy.
              </p>

              <h2 className="text-2xl font-bold text-foreground">What Are Cookies</h2>
              <p>
                Cookies are small text files that are stored on your device when you visit a website. They help websites remember user preferences, improve functionality, and understand how visitors interact with content.
              </p>
              <p>
                Cookies do not damage your device and do not contain viruses or malware.
              </p>

              <h2 className="text-2xl font-bold text-foreground">How We Use Cookies</h2>
              <p>ColorMean uses cookies for several important purposes, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To improve website speed and performance</li>
                <li>To understand how users navigate our pages</li>
                <li>To remember user preferences</li>
                <li>To analyze traffic trends and popular content</li>
                <li>To maintain site security</li>
              </ul>
              <p>Cookies help us improve both technical functionality and content quality.</p>

              <h2 className="text-2xl font-bold text-foreground">Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-semibold text-foreground">Essential Cookies</h3>
              <p>
                These cookies are necessary for the website to function properly. They enable basic features such as page navigation, security, and access to tools.
              </p>

              <h3 className="text-xl font-semibold text-foreground">Performance and Analytics Cookies</h3>
              <p>
                These cookies collect information about how visitors use the website, such as which pages are visited most often and how users move through the site. This helps us improve usability and content structure.
              </p>

              <h3 className="text-xl font-semibold text-foreground">Functionality Cookies</h3>
              <p>
                These cookies allow the website to remember choices you make, such as language preferences and tool settings.
              </p>

              <h3 className="text-xl font-semibold text-foreground">Advertising Cookies</h3>
              <p>
                These cookies may be used to display relevant advertisements. Advertising partners may use cookies to personalize ads based on browsing behavior.
              </p>

              <h3 className="text-xl font-semibold text-foreground">Third Party Cookies</h3>
              <p>Some cookies on ColorMean may be set by trusted third party services, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Analytics providers</li>
                <li>Advertising networks</li>
                <li>Embedded tools or features</li>
              </ul>
              <p>
                We do not control how third party cookies operate. Each third party service has its own Cookie Policy and Privacy Policy.
              </p>

              <h2 className="text-2xl font-bold text-foreground">Google and Advertising Cookies</h2>
              <p>ColorMean may use Google services such as:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Google Analytics</li>
                <li>Google AdSense</li>
              </ul>
              <p>
                Google may use cookies to display ads based on a user’s visit to this and other websites. Users can manage or disable ad personalization through Google Ad Settings.
              </p>

              <h2 className="text-2xl font-bold text-foreground">How You Can Control Cookies</h2>
              <p>
                You have full control over cookies through your browser settings. You can:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Delete existing cookies</li>
                <li>Block all cookies</li>
                <li>Allow cookies only for selected websites</li>
              </ul>
              <p>
                Please note that disabling cookies may affect certain features and tools on ColorMean.
              </p>
              <p>
                Instructions for managing cookies can be found in your browser’s help section.
              </p>

              <h2 className="text-2xl font-bold text-foreground">Consent</h2>
              <p>
                By using ColorMean, you agree to the use of cookies as outlined in this Cookie Policy.
              </p>
              <p>
                If you do not agree, you should adjust your browser settings or discontinue use of the website.
              </p>

              <h2 className="text-2xl font-bold text-foreground">Updates to This Cookie Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in technology, legal requirements, or website features. Updates will be posted on this page with immediate effect.
              </p>
              <p>We recommend reviewing this page regularly.</p>

              <h2 className="text-2xl font-bold text-foreground">Contact Us</h2>
              <p>If you have any questions about this Cookie Policy, you may contact us at:</p>
              
              <div className="bg-muted p-4 rounded-lg">
                <p className="mb-2">
                  <strong>Email:</strong> <a href="mailto:info@colormean.com" className="text-primary hover:underline">info@colormean.com</a>
                </p>
                <p>
                  <strong>Website:</strong> <a href="https://colormean.com" className="text-primary hover:underline">https://colormean.com</a>
                </p>
              </div>

              <p className="italic">
                ColorMean uses cookies responsibly to deliver a smoother, safer, and more personalized experience.
              </p>
            </div>
            <div className="flex justify-center py-4 mt-8 border-t pt-8">
              <ShareButtons title="ColorMean Cookie Policy" />
            </div>
          </div>
          <ColorSidebar color="#5B6FD8" />
        </div>
      </main>
      <Footer />
    </div>
  )
}
