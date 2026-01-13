"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { getRelatedColors, getContrastColor } from "@/lib/color-utils"
import { cn } from "@/lib/utils"

interface RelatedColorsSectionProps {
  hex: string
  title?: string
}

export function RelatedColorsSection({ hex, title = "Related Colors" }: RelatedColorsSectionProps) {
  const relatedColors = getRelatedColors(hex, 9)

  return (
    <Card id="related-colors" className="p-0 overflow-hidden space-y-0 scroll-mt-24 my-8">
      <div 
        className="bg-muted/30 border-l-[10px] py-2 px-3"
        style={{ borderLeftColor: hex }}
      >
        <h2 className="text-xl font-bold m-0 leading-tight">{title}</h2>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {relatedColors.map((color) => (
            <Link
              key={color.hex}
              href={`/colors/${color.hex.replace("#", "").toLowerCase()}`}
              className="group flex flex-col gap-2"
            >
              <div
                className="w-full aspect-square rounded-lg border border-border shadow-sm transition-transform group-hover:scale-105 flex items-center justify-center"
                style={{ backgroundColor: color.hex }}
              >
                <span 
                  className="font-mono text-xs font-bold"
                  style={{ color: getContrastColor(color.hex) }}
                >
                  {color.hex.toUpperCase()}
                </span>
              </div>
              <div className="text-center">
                <span className="font-medium text-xs sm:text-sm block leading-tight truncate px-1" title={color.name}>
                  {color.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Card>
  )
}
