"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getColorHarmony, hslToRgb, rgbToHex, hexToRgb, rgbToHsl } from "@/lib/color-utils"
import { ColorCombination } from "@/components/color-combination"
import { getColorPageLink } from "@/lib/color-linking-utils"
import Link from "next/link"

export function CompactColorWheel() {
    const [baseColor, setBaseColor] = useState("#5B6FD8")
    const [harmonyType, setHarmonyType] = useState("complementary")
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [canvasSize, setCanvasSize] = useState(450)
    const staticCanvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const event = new CustomEvent("colorUpdate", { detail: { color: baseColor } })
        window.dispatchEvent(event)
    }, [baseColor])

    useEffect(() => {
        const updateCanvasSize = () => {
            if (window.innerWidth < 640) {
                const size = Math.min(window.innerWidth - 40, 360)
                setCanvasSize(size)
            } else if (window.innerWidth < 1024) {
                setCanvasSize(380)
            } else {
                setCanvasSize(450)
            }
        }

        updateCanvasSize()
        window.addEventListener("resize", updateCanvasSize)
        return () => window.removeEventListener("resize", updateCanvasSize)
    }, [])

    useEffect(() => {
        drawStaticWheel()
        drawOverlay()
    }, [canvasSize])

    useEffect(() => {
        drawOverlay()
    }, [baseColor, harmonyType])

    const drawStaticWheel = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const outerRadius = Math.min(centerX, centerY) - 40

        const offscreen = document.createElement("canvas")
        offscreen.width = canvas.width
        offscreen.height = canvas.height
        const offCtx = offscreen.getContext("2d")
        if (!offCtx) return

        offCtx.clearRect(0, 0, offscreen.width, offscreen.height)

        for (let angle = 0; angle < 360; angle++) {
            const startAngle = (angle - 90) * (Math.PI / 180)
            const endAngle = (angle + 1 - 90) * (Math.PI / 180)

            for (let r = 0; r <= outerRadius; r += 1) {
                const saturation = (r / outerRadius) * 100
                const lightness = 100 - (r / outerRadius) * 50
                const rgb = hslToRgb(angle, saturation, lightness)
                const hex = rgbToHex(rgb.r, rgb.g, rgb.b)

                offCtx.beginPath()
                offCtx.arc(centerX, centerY, r, startAngle, endAngle)
                offCtx.strokeStyle = hex
                offCtx.lineWidth = 1.5
                offCtx.stroke()
            }
        }

        staticCanvasRef.current = offscreen
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(offscreen, 0, 0)
    }

    const drawOverlay = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const outerRadius = Math.min(centerX, centerY) - 40

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        if (staticCanvasRef.current) {
            ctx.drawImage(staticCanvasRef.current, 0, 0)
        }

        const ringInner = outerRadius + 10
        const ringOuter = outerRadius + 30

        const baseRgb = hexToRgb(baseColor)
        if (baseRgb) {
            const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b)

            for (let angle = 0; angle < 360; angle++) {
                const startAngle = (angle - 90) * (Math.PI / 180)
                const endAngle = (angle + 1 - 90) * (Math.PI / 180)

                const lightness = (angle / 360) * 100
                const rgb = hslToRgb(baseHsl.h, baseHsl.s, lightness)
                const hex = rgbToHex(rgb.r, rgb.g, rgb.b)

                for (let r = ringInner; r <= ringOuter; r += 1) {
                    ctx.beginPath()
                    ctx.arc(centerX, centerY, r, startAngle, endAngle)
                    ctx.strokeStyle = hex
                    ctx.lineWidth = 1
                    ctx.stroke()
                }
            }
        }

        const baseRgb2 = hexToRgb(baseColor)
        if (baseRgb2) {
            const baseHsl = rgbToHsl(baseRgb2.r, baseRgb2.g, baseRgb2.b)
            const angle = (baseHsl.h - 90) * (Math.PI / 180)
            const distance = (baseHsl.s / 100) * outerRadius

            const x = centerX + Math.cos(angle) * distance
            const y = centerY + Math.sin(angle) * distance

            ctx.beginPath()
            ctx.arc(x, y, 12, 0, 2 * Math.PI)
            ctx.fillStyle = "#FFFFFF"
            ctx.fill()
            ctx.strokeStyle = "#000000"
            ctx.lineWidth = 4
            ctx.stroke()

            ctx.beginPath()
            ctx.arc(x, y, 7, 0, 2 * Math.PI)
            ctx.fillStyle = baseColor
            ctx.fill()
        }

        const harmonies = getColorHarmony(baseColor, harmonyType)
        harmonies.forEach((color) => {
            if (color !== baseColor) {
                drawColorMarker(ctx, centerX, centerY, outerRadius, color, false)
            }
        })
    }

    const drawColorMarker = (
        ctx: CanvasRenderingContext2D,
        centerX: number,
        centerY: number,
        radius: number,
        color: string,
        isBase = false,
    ) => {
        const rgb = hexToRgb(color)
        if (!rgb) return

        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
        const angle = (hsl.h - 90) * (Math.PI / 180)
        const distance = (hsl.s / 100) * radius

        const x = centerX + Math.cos(angle) * distance
        const y = centerY + Math.sin(angle) * distance

        ctx.beginPath()
        ctx.arc(x, y, 10, 0, 2 * Math.PI)
        ctx.fillStyle = "#FFFFFF"
        ctx.fill()
        ctx.strokeStyle = "#000000"
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(x, y, 6, 0, 2 * Math.PI)
        ctx.fillStyle = color
        ctx.fill()
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
            clientX = (e as React.MouseEvent).clientX
            clientY = (e as React.MouseEvent).clientY
        }

        const x = clientX - rect.left
        const y = clientY - rect.top

        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height

        const canvasX = x * scaleX
        const canvasY = y * scaleY

        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const outerRadius = Math.min(centerX, centerY) - 40

        const dx = canvasX - centerX
        const dy = canvasY - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > outerRadius) return

        const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90
        const normalizedAngle = angle < 0 ? angle + 360 : angle

        const saturation = (distance / outerRadius) * 100
        const lightness = 100 - (distance / outerRadius) * 50

        const rgb = hslToRgb(normalizedAngle, saturation, lightness)
        const newColor = rgbToHex(rgb.r, rgb.g, rgb.b)
        setBaseColor(newColor)
    }

    const harmonies = getColorHarmony(baseColor, harmonyType)

    return (
        <Card className="p-2 sm:p-6 space-y-3 sm:space-y-4">
            <div className="space-y-6">
                {/* Color Wheel - Centered */}
                <div className="flex justify-center items-center">
                    <canvas
                        ref={canvasRef}
                        width={canvasSize}
                        height={canvasSize}
                        className="border-2 border-border rounded-lg cursor-crosshair"
                        style={{
                            width: `${canvasSize}px`,
                            height: `${canvasSize}px`,
                            aspectRatio: "1/1",
                            touchAction: "none",
                        }}
                        onClick={handleCanvasInteraction}
                        onMouseMove={(e) => isDragging && handleCanvasInteraction(e)}
                        onMouseDown={() => setIsDragging(true)}
                        onMouseUp={() => setIsDragging(false)}
                        onMouseLeave={() => setIsDragging(false)}
                        onTouchStart={(e) => {
                            setIsDragging(true)
                            handleCanvasInteraction(e)
                        }}
                        onTouchMove={(e) => {
                            e.preventDefault()
                            if (isDragging) handleCanvasInteraction(e)
                        }}
                        onTouchEnd={() => setIsDragging(false)}
                    />
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Left Column: Base Color and Harmony Type */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                            <label className="font-medium text-sm sm:text-base">Base Color:</label>
                            <div
                                className="w-12 h-8 sm:w-16 sm:h-10 rounded-md border-2 border-border"
                                style={{ backgroundColor: baseColor }}
                            />
                            <span className="font-mono font-semibold text-sm sm:text-base">{baseColor.toUpperCase()}</span>
                        </div>

                        <div className="space-y-2">
                            <label className="font-medium text-sm sm:text-base">Harmony Type:</label>
                            <Select value={harmonyType} onValueChange={setHarmonyType}>
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="complementary">Complementary</SelectItem>
                                    <SelectItem value="analogous">Analogous</SelectItem>
                                    <SelectItem value="triadic">Triadic</SelectItem>
                                    <SelectItem value="tetradic">Tetradic</SelectItem>
                                    <SelectItem value="split-complementary">Split Complementary</SelectItem>
                                    <SelectItem value="square">Square</SelectItem>
                                    <SelectItem value="double-split-complementary">Double Split Complementary</SelectItem>
                                    <SelectItem value="monochromatic">Monochromatic</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Right Column: Color Harmony */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-sm sm:text-base">Color Harmony</h3>
                        <div className="space-y-2">
                            <div className="w-full">
                                <ColorCombination colors={harmonies} baseHex={baseColor} height={56} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Link to Full Tool */}
            <div className="pt-4 flex justify-start border-t mt-6">
                <Link
                    href="/color-wheel"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors shadow-lg mt-4"
                >
                    Open full Color Wheel tool
                    <span className="text-xl">→</span>
                </Link>
            </div>
        </Card>
    )
}
