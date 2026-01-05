"use client"

import { useRouter } from "next/navigation"
import { useRef } from "react"
import { getContrastColor } from "@/lib/color-utils"

function CombinationStripe({
  hex,
  isOriginal,
  onClick,
}: {
  hex: string
  isOriginal: boolean
  onClick: () => void
}) {
  const stripeRef = useRef<HTMLButtonElement>(null)
  return (
    <div className="flex-1 min-w-0 flex flex-col items-center group">
      <button
        ref={stripeRef}
        className="w-full h-full relative transition-transform group-hover:scale-105 first:rounded-l-2xl last:rounded-r-2xl"
        style={{ backgroundColor: hex }}
        onClick={onClick}
        title={hex}
      >
        {!isOriginal ? null : (
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ width: 6, height: 6, backgroundColor: getContrastColor(hex) }}
          />
        )}
      </button>
    </div>
  )
}

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
    <div className="w-full">
      <div className="w-full rounded-2xl overflow-hidden flex items-stretch" style={{ height }}>
        {colors.map((hex) => (
          <CombinationStripe
            key={hex}
            hex={hex}
            isOriginal={!!(baseHex && hex.toLowerCase() === baseHex.toLowerCase())}
            onClick={() => navigate(hex)}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-2 font-mono text-xs">
        {colors.map((hex) => (
          <span key={`${hex}-label`} className="opacity-80">{hex.toUpperCase()}</span>
        ))}
      </div>
    </div>
  )
}
