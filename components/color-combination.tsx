"use client"

import { useRouter } from "next/navigation"
import { useRef } from "react"
import { getContrastColor } from "@/lib/color-utils"
import { CopyButton } from "@/components/copy-button"

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
  const contrast = getContrastColor(hex)
  const border = isOriginal ? `2px solid ${contrast}` : "0px solid transparent"
  return (
    <div className="flex-1 flex flex-col items-center group">
      <button
        ref={stripeRef}
        className="w-full h-full relative transition-transform group-hover:scale-105"
        style={{ backgroundColor: hex, border }}
        onClick={onClick}
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
      <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyButton
          value={hex}
          label={hex}
          variant="ghost"
          size="sm"
          showIcon={false}
          className="text-xs font-mono hover:text-primary px-2 py-1 -mx-2"
          anchorRef={stripeRef}
        />
      </div>
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
    <div className="w-full rounded-2xl overflow-hidden flex items-start gap-1" style={{ height }}>
      {colors.map((hex) => (
        <CombinationStripe
          key={hex}
          hex={hex}
          isOriginal={!!(baseHex && hex.toLowerCase() === baseHex.toLowerCase())}
          onClick={() => navigate(hex)}
        />
      ))}
    </div>
  )
}
