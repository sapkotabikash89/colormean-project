'use client'

import dynamic from "next/dynamic"
import {
  ColorWheelSkeleton,
  AdvancedColorPickerSkeleton,
  ContrastCheckerSkeleton,
  ColorBlindnessSimulatorSkeleton,
  ImageColorPickerSkeleton,
  PaletteFromImageSkeleton,
} from "@/components/tool-skeletons"

export const ColorWheelClient = dynamic(
  () => import("@/components/tools/color-wheel-tool").then((m) => m.ColorWheelTool),
  { ssr: false, loading: () => <ColorWheelSkeleton /> },
)

export const ColorPickerClient = dynamic(
  () => import("@/components/tools/advanced-color-picker").then((m) => m.AdvancedColorPicker),
  { ssr: false, loading: () => <AdvancedColorPickerSkeleton /> },
)

export const ContrastCheckerClient = dynamic(
  () => import("@/components/tools/contrast-checker-tool").then((m) => m.ContrastCheckerTool),
  { ssr: false, loading: () => <ContrastCheckerSkeleton /> },
)

export const ColorBlindnessSimulatorClient = dynamic(
  () =>
    import("@/components/tools/color-blindness-simulator-tool").then((m) => m.ColorBlindnessSimulatorTool),
  { ssr: false, loading: () => <ColorBlindnessSimulatorSkeleton /> },
)

export const ImageColorPickerClient = dynamic(
  () => import("@/components/tools/image-color-picker-tool").then((m) => m.ImageColorPickerTool),
  { ssr: false, loading: () => <ImageColorPickerSkeleton /> },
)

export const PaletteFromImageClient = dynamic(
  () => import("@/components/tools/palette-from-image-tool").then((m) => m.PaletteFromImageTool),
  { ssr: false, loading: () => <PaletteFromImageSkeleton /> },
)

export const ScreenColorPickerClient = dynamic(
  () => import("@/components/tools/screen-color-picker-tool").then((m) => m.ScreenColorPickerTool),
  { ssr: false, loading: () => <AdvancedColorPickerSkeleton /> },
)
