"use client"

import { useRouter } from "next/navigation"
import { getContrastColor } from "@/lib/color-utils"

export function ColorCombination({
  colors,
  baseHex,
  height = 56,
}: {
  colors: string[]
  baseHex?: string
  height?: number
}) {
  const router = useRouter()
  const navigate = (hex: string) => {
    const clean = hex.replace("#", "")
    router.push(`/colors/${clean.toLowerCase()}`)
  }
  return (
    <div className="w-full rounded-2xl overflow-hidden flex" style={{ height }}>
      {colors.map((hex, i) => {
        const isOriginal = baseHex && hex.toLowerCase() === baseHex.toLowerCase()
        const contrast = getContrastColor(hex)
        const border = isOriginal ? `2px solid ${contrast}` : "0px solid transparent"
        return (
          <button
            key={`${hex}-${i}`}
            className="flex-1 h-full relative"
            style={{ backgroundColor: hex, border }}
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
          </button>
        )
      })}
    </div>
  )
}
