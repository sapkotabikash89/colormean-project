"use client"

import type React from "react"
import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Palette, Droplet, Contrast, Eye, ImageIcon, CircleDot, Search, Menu } from "lucide-react"
import { CustomColorPicker } from "@/components/custom-color-picker"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"

export function Header() {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState("")
  const [pickerColor, setPickerColor] = useState("#5B6FD8")
  const [showCustomPicker, setShowCustomPicker] = useState(false)
  const [tempColor, setTempColor] = useState("#5B6FD8")

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanHex = searchValue.replace("#", "")
    if (/^[0-9A-F]{6}$/i.test(cleanHex)) {
      router.push(`/colors/${cleanHex.toLowerCase()}`)
      return
    }
    const q = searchValue.trim()
    if (q.length > 0) {
      router.push(`/colors?q=${encodeURIComponent(q)}`)
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

    // Navigate to the color page
    router.push(`/colors/${cleanHex.toLowerCase()}`)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container max-w-7xl mx-auto flex justify-center h-16 items-center gap-4 px-[5px] sm:px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent">
            <Palette className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="hidden sm:inline-block">ColorMean</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          <Link href="/color-wheel">
            <Button variant="ghost" size="sm" className="gap-2">
              <CircleDot className="w-4 h-4" />
              <span className="hidden lg:inline">Color Wheel</span>
            </Button>
          </Link>
          <Link href="/color-picker">
            <Button variant="ghost" size="sm" className="gap-2">
              <Droplet className="w-4 h-4" />
              <span className="hidden lg:inline">Picker</span>
            </Button>
          </Link>
          <Link href="/contrast-checker">
            <Button variant="ghost" size="sm" className="gap-2">
              <Contrast className="w-4 h-4" />
              <span className="hidden lg:inline">Contrast</span>
            </Button>
          </Link>
          <Link href="/color-blindness-simulator">
            <Button variant="ghost" size="sm" className="gap-2">
              <Eye className="w-4 h-4" />
              <span className="hidden lg:inline">Blindness</span>
            </Button>
          </Link>
          <Link href="/image-color-picker">
            <Button variant="ghost" size="sm" className="gap-2">
              <ImageIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Image</span>
            </Button>
          </Link>
          <Link href="/color-meanings">
            <Button variant="ghost" size="sm" className="gap-2">
              <Palette className="w-4 h-4" />
              <span className="hidden lg:inline">Color Meanings</span>
            </Button>
          </Link>
        </nav>

        {/* Color Picker */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowCustomPicker(true)}
              className="w-10 h-10 md:w-9 md:h-9 rounded-md border-2 border-border cursor-pointer"
              style={{ backgroundColor: pickerColor }}
              title="Pick a color"
            />
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative w-40 sm:w-48 lg:w-64">
            <Input
              type="text"
              placeholder="Search color..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pr-10"
            />
            <Button type="submit" size="sm" variant="ghost" className="absolute right-0 top-0 h-full px-3">
              <Search className="w-4 h-4" />
            </Button>
          </form>

          {/* Mobile Menu Icon */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-10 w-10 border-2 border-black rounded-md">
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
                    Color Blindness
                  </Button>
                </Link>
                <Link href="/image-color-picker">
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Image Picker
                  </Button>
                </Link>
                <Link href="/colors">
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Palette className="w-4 h-4" />
                    Color Library
                  </Button>
                </Link>
                <Link href="/color-meanings">
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Palette className="w-4 h-4" />
                    Color Meanings
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
