"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { getContrastColor } from "@/lib/color-utils"
import { getColorPageLink } from "@/lib/color-linking-utils"

export function ColorCombination({
  colors,
  baseHex,
  height = 64,
  onColorChange,
}: {
  colors: string[]
  baseHex?: string
  height?: number
  onColorChange?: (color: string) => void
}) {
  const router = useRouter()
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const navigate = (hex: string) => {
    if (onColorChange) {
      onColorChange(hex)
    } else {
      // Use centralized linking logic for safe color navigation
      router.push(getColorPageLink(hex))
    }
  }
  return (
    <div className="w-full rounded-2xl overflow-hidden flex" style={{ height }}>
      {colors.map((hex, i) => {
        const isOriginal = baseHex && hex.toUpperCase() === baseHex.toUpperCase()
        const contrast = getContrastColor(hex)
        const handleCopy = async (e?: React.MouseEvent) => {
          e?.stopPropagation()
          let success = false
          try {
            if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
              await navigator.clipboard.writeText(hex)
              success = true
            }
          } catch {
            success = false
          }
          if (!success) {
            try {
              const textarea = document.createElement("textarea")
              textarea.value = hex
              textarea.setAttribute("readonly", "")
              textarea.style.position = "fixed"
              textarea.style.top = "-1000px"
              textarea.style.opacity = "0"
              document.body.appendChild(textarea)
              textarea.focus()
              textarea.select()
              const ok = document.execCommand("copy")
              document.body.removeChild(textarea)
              success = ok
            } catch {
              success = false
            }
          }
          if (!success) return
          setCopiedIndex(i)
          setTimeout(() => setCopiedIndex(null), 1500)
        }
        return (
          <button
            key={`${hex}-${i}`}
            className="flex-1 h-full relative"
            style={{ backgroundColor: hex }}
            onClick={() => navigate(hex)}
            title={hex}
          >
            {isOriginal ? (
              <span
                className="absolute top-1 right-1 text-[10px] font-bold"
                style={{ color: contrast }}
              >
                o
              </span>
            ) : null}
            <div className="absolute bottom-1 left-0 right-0 flex justify-center">
              <span
                onClick={handleCopy}
                className="text-[10px] font-mono px-1 rounded bg-black/30 text-white"
                style={{ color: contrast === "#000000" ? "#000" : "#fff", backgroundColor: contrast === "#000000" ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)" }}
              >
                {hex.toUpperCase()}
              </span>
            </div>
            {copiedIndex === i && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-foreground text-background px-2 py-1 rounded text-xs font-medium">
                Copied!
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
