import React from "react"

export function ColorWheelSkeleton() {
  return (
    <div role="progressbar" aria-label="Interactive Color Wheel Tool to select colors and generate palettes" className="animate-pulse">
      <div className="h-80 md:h-96 bg-muted rounded-lg" />
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="h-10 bg-muted rounded" />
        <div className="h-10 bg-muted rounded" />
        <div className="h-10 bg-muted rounded" />
      </div>
    </div>
  )
}

export function AdvancedColorPickerSkeleton() {
  return (
    <div role="progressbar" aria-label="Interactive Color Picker Tool to sample and select colors" className="animate-pulse">
      <div className="h-64 bg-muted rounded-lg" />
      <div className="mt-4 h-6 bg-muted rounded w-2/3" />
      <div className="mt-2 grid grid-cols-3 gap-2">
        <div className="h-10 bg-muted rounded" />
        <div className="h-10 bg-muted rounded" />
        <div className="h-10 bg-muted rounded" />
      </div>
    </div>
  )
}

export function ContrastCheckerSkeleton() {
  return (
    <div role="progressbar" aria-label="Contrast Checker Tool to verify color accessibility ratios" className="animate-pulse">
      <div className="h-24 bg-muted rounded-lg" />
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="h-12 bg-muted rounded" />
        <div className="h-12 bg-muted rounded" />
      </div>
      <div className="mt-4 h-10 bg-muted rounded w-1/2" />
    </div>
  )
}

export function ColorBlindnessSimulatorSkeleton() {
  return (
    <div role="progressbar" aria-label="Color Blindness Simulator to test color visibility" className="animate-pulse">
      <div className="h-64 bg-muted rounded-lg" />
      <div className="mt-4 grid grid-cols-4 gap-2">
        {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-muted rounded" />)}
      </div>
    </div>
  )
}

export function ImageColorPickerSkeleton() {
  return (
    <div role="progressbar" aria-label="Image Color Picker Tool to extract colors from images" className="animate-pulse">
      <div className="h-72 bg-muted rounded-lg" />
      <div className="mt-4 grid grid-cols-6 gap-2">
        {[...Array(6)].map((_, i) => <div key={i} className="h-6 bg-muted rounded" />)}
      </div>
    </div>
  )
}

export function PaletteFromImageSkeleton() {
  return (
    <div role="progressbar" aria-label="Palette Generator from Image Tool to create color palettes" className="animate-pulse">
      <div className="h-72 bg-muted rounded-lg" />
      <div className="mt-4 h-8 bg-muted rounded w-2/3" />
      <div className="mt-4 h-16 bg-muted rounded" />
    </div>
  )
}
