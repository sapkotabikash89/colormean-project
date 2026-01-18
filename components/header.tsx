"use client"

import type React from "react"
import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Palette, Droplet, Contrast, Eye, ImageIcon, CircleDot, Search, Menu, Pipette } from "lucide-react"
import { CustomColorPicker } from "@/components/custom-color-picker"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { getColorPageLink } from "@/lib/color-linking-utils"
import { performDeterministicSearch } from "@/lib/search-utils"

export function Header() {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState("")
  const [pickerColor, setPickerColor] = useState("#5B6FD8")
  const [showCustomPicker, setShowCustomPicker] = useState(false)
  const [tempColor, setTempColor] = useState("#5B6FD8")
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    try {
      const c = localStorage.getItem("currentPostColor")
      if (c) setPickerColor(c)
    } catch {}
    const handleColorUpdate = (e: CustomEvent) => {
      setPickerColor(e.detail.color)
    }
    window.addEventListener("colorUpdate", handleColorUpdate as EventListener)
    return () => window.removeEventListener("colorUpdate", handleColorUpdate as EventListener)
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Use deterministic search logic
    const searchResult = await performDeterministicSearch(searchValue)
    
    if (searchResult) {
      // Use Next.js router for navigation to avoid Cloudflare redirects
      router.push(searchResult.replace('https://colormean.com', ''))
    } else {
      // Fallback for empty/invalid input - do nothing
      return
    }
  }
  

  const handleColorChange = (color: string) => {
    setTempColor(color)
  }

  const handleColorApply = (color?: string) => {
    const selectedColor = typeof color === "string" ? color : tempColor
    setPickerColor(selectedColor)
    const cleanHex = selectedColor.replace("#", "")
    setShowCustomPicker(false)

    // Dispatch color update event for sidebar
    window.dispatchEvent(new CustomEvent("colorUpdate", { detail: { color: selectedColor } }))

    // Navigate to the appropriate color page using centralized linking logic
    // Use Next.js router to avoid Cloudflare redirects
    const link = getColorPageLink(selectedColor)
    const relativeLink = link.replace('https://colormean.com', '')
    router.push(relativeLink)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container max-w-[1200px] mx-auto flex justify-center h-16 items-center gap-4 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <img src="/logo.webp" alt="ColorMean logo" className="h-8 w-auto" width="120" height="32" />
          <span className="hidden sm:inline-block">ColorMean</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {/* Tools submenu */}
          <div className="relative group">
            <Link href="/color-wheel">
              <Button variant="ghost" size="sm" className="gap-2" aria-label="Tools">
                <CircleDot className="w-4 h-4" aria-hidden="true" />
                <span className="hidden xl:inline">Tools</span>
              </Button>
            </Link>
            <div className="absolute left-0 mt-2 min-w-max w-auto bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-200">
              <Link href="/color-wheel">
                <Button variant="ghost" className="w-full justify-start gap-2" aria-label="Color Wheel">
                  <CircleDot className="w-4 h-4" aria-hidden="true" />
                  Color Wheel
                </Button>
              </Link>
              <Link href="/color-picker">
                <Button variant="ghost" className="w-full justify-start gap-2" aria-label="Color Picker">
                  <Droplet className="w-4 h-4" aria-hidden="true" />
                  Color Picker
                </Button>
              </Link>
              <Link href="/contrast-checker">
                <Button variant="ghost" className="w-full justify-start gap-2" aria-label="Contrast Checker">
                  <Contrast className="w-4 h-4" aria-hidden="true" />
                  Contrast Checker
                </Button>
              </Link>
              <Link href="/color-blindness-simulator">
                <Button variant="ghost" className="w-full justify-start gap-2" aria-label="Color Blindness Simulator">
                  <Eye className="w-4 h-4" aria-hidden="true" />
                  Color Blindness Simulator
                </Button>
              </Link>
              <Link href="/image-color-picker">
                <Button variant="ghost" className="w-full justify-start gap-2" aria-label="Image Color Picker">
                  <ImageIcon className="w-4 h-4" aria-hidden="true" />
                  Image Color Picker
                </Button>
              </Link>
              <Link href="/palette-from-image">
                <Button variant="ghost" className="w-full justify-start gap-2" aria-label="Palette from Image">
                  <Palette className="w-4 h-4" aria-hidden="true" />
                  Palette from Image
                </Button>
              </Link>
            </div>
          </div>
          <Link href="/colors">
            <Button variant="ghost" size="sm" className="gap-2" aria-label="Color Library">
              <Palette className="w-4 h-4" aria-hidden="true" />
              <span className="hidden xl:inline">Color Library</span>
            </Button>
          </Link>
          <Link href="/category/shades-meaning">
            <Button variant="ghost" size="sm" className="gap-2" aria-label="Shades">
              <CircleDot className="w-4 h-4" aria-hidden="true" />
              <span className="hidden xl:inline">Shades</span>
            </Button>
          </Link>
          <Link href="/category/color-meaning">
            <Button variant="ghost" size="sm" className="gap-2" aria-label="Color Meaning">
              <Droplet className="w-4 h-4" aria-hidden="true" />
              <span className="hidden xl:inline">Color Meaning</span>
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="ghost" size="sm" className="gap-2" aria-label="Contact">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span className="hidden xl:inline">Contact</span>
            </Button>
          </Link>
          <Link href="/privacy-policy">
            <Button variant="ghost" size="sm" className="gap-2" aria-hidden="true" aria-label="Privacy">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span className="hidden xl:inline">Privacy</span>
            </Button>
          </Link>
        </nav>

        {/* Color Picker & Search */}
        <div className="flex items-center gap-2 flex-1 md:flex-none justify-end md:justify-start">
          <div className="relative">
            <button
              onClick={() => setShowCustomPicker(true)}
              className="w-10 h-10 md:w-9 md:h-9 rounded-md border-2 border-border cursor-pointer flex-shrink-0 flex items-center justify-center"
              style={{ backgroundColor: pickerColor }}
              title="Pick a color"
              aria-label="Pick a color"
            >
              <Pipette className="w-5 h-5 text-white mix-blend-difference" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex items-center flex-1 md:flex-none md:w-auto">
            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="relative hidden md:block w-40 xl:w-64">
              <Input
                type="text"
                placeholder="Search color..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pr-10"
              />
              <Button type="submit" size="sm" variant="ghost" className="absolute right-0 top-0 h-full px-3" aria-label="Search">
                <Search className="w-4 h-4" />
              </Button>
            </form>

            {/* Mobile Search - Always Visible */}
            <form onSubmit={handleSearch} className="relative md:hidden w-full flex-1">
              <Input
                type="text"
                placeholder="Search color..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pr-10 w-full"
              />
              <Button type="submit" size="sm" variant="ghost" className="absolute right-0 top-0 h-full px-3" aria-label="Search">
                <Search className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* Mobile Menu Icon */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-10 w-10 border-2 border-black rounded-md flex-shrink-0" aria-label="Open menu">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="sr-only">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/color-wheel">
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <CircleDot className="w-4 h-4" />
                    Color Wheel
                  </Button>
                </Link>
                <Link href="/color-picker">
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Droplet className="w-4 h-4" />
                    Color Picker
                  </Button>
                </Link>
                <Link href="/contrast-checker">
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Contrast className="w-4 h-4" />
                    Contrast Checker
                  </Button>
                </Link>
                <Link href="/color-blindness-simulator">
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Eye className="w-4 h-4" />
                    Color Blindness Simulator
                  </Button>
                </Link>
                <Link href="/image-color-picker">
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Image Color Picker
                  </Button>
                </Link>
                <Link href="/palette-from-image">
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Palette className="w-4 h-4" />
                    Palette from Image
                  </Button>
                </Link>
                <Link href="/colors">
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Palette className="w-4 h-4" />
                    Color Library
                  </Button>
                </Link>
                <Link href="/category/shades-meaning">
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <CircleDot className="w-4 h-4" />
                    Shades
                  </Button>
                </Link>
                <Link href="/category/color-meaning">
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Droplet className="w-4 h-4" />
                    Color Meaning
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    Contact
                  </Button>
                </Link>
                <Link href="/privacy-policy">
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    Privacy
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Custom Color Picker Dialog */}
      {showCustomPicker && (
        <CustomColorPicker
          value={pickerColor}
          onChange={handleColorChange}
          onApply={handleColorApply}
          onClose={() => setShowCustomPicker(false)}
        />
      )}
    </header>
  )
}
