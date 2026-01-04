import Link from "next/link"
import { Palette } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card mt-auto">
      <div className="container max-w-7xl mx-auto px-[5px] sm:px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent">
                <Palette className="w-5 h-5 text-primary-foreground" />
              </div>
              <span>ColorMean</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Know your color. Explore meanings, conversions, and professional color tools.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold mb-4">Color Tools</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/color-wheel" className="text-muted-foreground hover:text-foreground transition-colors">
                  Color Wheel
                </Link>
              </li>
              <li>
                <Link href="/color-picker" className="text-muted-foreground hover:text-foreground transition-colors">
                  Color Picker
                </Link>
              </li>
              <li>
                <Link
                  href="/contrast-checker"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contrast Checker
                </Link>
              </li>
              <li>
                <Link
                  href="/color-blindness-simulator"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Color Blindness Simulator
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/color-meanings" className="text-muted-foreground hover:text-foreground transition-colors">
                  Color Meanings
                </Link>
              </li>
              <li>
                <Link href="/colors" className="text-muted-foreground hover:text-foreground transition-colors">
                  Color Library
                </Link>
              </li>
              <li>
                <Link
                  href="/image-color-picker"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Image Color Picker
                </Link>
              </li>
              <li>
                <Link
                  href="/palette-from-image"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Palette from Image
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="grid grid-cols-2 gap-y-2 gap-x-6 text-sm">
              <li>
                <Link href="/about-us" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-muted-foreground hover:text-foreground transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/cokie-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/editorial-policy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Editorial Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2025 ColorMean. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
