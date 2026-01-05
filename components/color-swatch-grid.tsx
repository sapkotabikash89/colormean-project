"use client"

import { useMemo } from "react"
import { ColorSwatch } from "@/components/color-swatch"

export function ColorSwatchGrid({
  colors,
  limit = colors.length,
  smallGap = true,
  showHex = true,
}: {
  colors: string[]
  limit?: number
  smallGap?: boolean
  showHex?: boolean
}) {
  const items = useMemo(() => colors.slice(0, limit), [colors, limit])
  const gapClass = smallGap ? "gap-[2px]" : "gap-3"
  return (
    <div className={`grid grid-cols-5 md:grid-cols-10 justify-center ${gapClass} place-items-center`}>
      {items.map((hex, i) => (
        <ColorSwatch key={`${hex}-${i}`} color={hex} showHex={showHex} fullWidth />
      ))}
    </div>
  )
}
