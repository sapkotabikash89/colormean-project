"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import ReactDOM from "react-dom"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { hexToRgb, rgbToHsl, hslToRgb, rgbToHex } from "@/lib/color-utils"

interface CustomColorPickerProps {
  value: string
  onChange: (color: string) => void
  onApply?: (color: string) => void
  onClose: () => void
}

export function CustomColorPicker({ value, onChange, onApply, onClose }: CustomColorPickerProps) {
  const [hue, setHue] = useState(0)
  const [saturation, setSaturation] = useState(100)
  const [lightness, setLightness] = useState(50)
  const [hexInput, setHexInput] = useState(value)
  const [tempColor, setTempColor] = useState(value)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const rgb = hexToRgb(value)
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
      setHue(hsl.h)
      setSaturation(hsl.s)
      setLightness(hsl.l)
      setHexInput(value)
      setTempColor(value)
    }
  }, [value])

  useEffect(() => {
    drawColorSpace()
  }, [hue])

  const drawColorSpace = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const s = (x / width) * 100
        const l = 100 - (y / height) * 100
        const rgb = hslToRgb(hue, s, l)
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
        ctx.fillStyle = hex
        ctx.fillRect(x, y, 1, 1)
      }
    }
  }

  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()

    let clientX: number
    let clientY: number

    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const x = clientX - rect.left
    const y = clientY - rect.top

    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const canvasX = Math.max(0, Math.min(x * scaleX, canvas.width))
    const canvasY = Math.max(0, Math.min(y * scaleY, canvas.height))

    const newSaturation = (canvasX / canvas.width) * 100
    const newLightness = 100 - (canvasY / canvas.height) * 100

    setSaturation(Math.max(0, Math.min(100, Math.round(newSaturation))))
    setLightness(Math.max(0, Math.min(100, Math.round(newLightness))))

    const rgb = hslToRgb(hue, newSaturation, newLightness)
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
    setHexInput(hex)
    setTempColor(hex)
  }

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHue = Number.parseInt(e.target.value)
    setHue(newHue)
    const rgb = hslToRgb(newHue, saturation, lightness)
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
    setHexInput(hex)
    setTempColor(hex)
  }

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setHexInput(input)
    if (/^#[0-9A-F]{6}$/i.test(input)) {
      setTempColor(input)
      const rgb = hexToRgb(input)
      if (rgb) {
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
        setHue(hsl.h)
        setSaturation(hsl.s)
        setLightness(hsl.l)
      }
    }
  }

  const pickerX = `${Math.max(0, Math.min(100, saturation))}%`
  const pickerY = `${Math.max(0, Math.min(100, 100 - lightness))}%`

  const handleDone = () => {
    onChange(tempColor)
    if (onApply) {
      onApply(tempColor)
    } else {
      onClose()
    }
  }

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4" onClick={onClose}>
      <div className="bg-background rounded-lg p-4 shadow-xl max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Pick a Color</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={300}
              height={200}
              className="w-full rounded-lg border-2 border-border cursor-crosshair touch-none"
              onClick={handleCanvasInteraction}
              onMouseMove={(e) => isDragging && handleCanvasInteraction(e)}
              onMouseDown={(e) => {
                setIsDragging(true)
                handleCanvasInteraction(e)
              }}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onTouchStart={(e) => {
                e.preventDefault()
                setIsDragging(true)
                handleCanvasInteraction(e)
              }}
              onTouchMove={(e) => {
                e.preventDefault()
                if (isDragging) {
                  handleCanvasInteraction(e)
                }
              }}
              onTouchEnd={() => setIsDragging(false)}
            />
            <div
              className="absolute w-4 h-4 border-2 border-white rounded-full pointer-events-none"
              style={{
                left: pickerX,
                top: pickerY,
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)",
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Hue: {hue}°</label>
            <input
              type="range"
              min="0"
              max="360"
              value={hue}
              onChange={handleHueChange}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, 
                  hsl(0, 100%, 50%), 
                  hsl(60, 100%, 50%), 
                  hsl(120, 100%, 50%), 
                  hsl(180, 100%, 50%), 
                  hsl(240, 100%, 50%), 
                  hsl(300, 100%, 50%), 
                  hsl(360, 100%, 50%))`,
              }}
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-sm font-medium">Hex</label>
              <input
                type="text"
                value={hexInput}
                onChange={handleHexInputChange}
                className="w-full px-3 py-2 border border-border rounded-md font-mono uppercase"
              />
            </div>
            <div className="w-12 flex flex-col justify-end">
              <div
                className="w-full h-10 rounded-md border border-border"
                style={{ backgroundColor: tempColor }}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleDone}>
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
