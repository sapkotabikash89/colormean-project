"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { hexToRgb, rgbToHsl } from "@/lib/color-utils"
import { CopyButton } from "@/components/copy-button"
import { getColorPageLink } from "@/lib/color-linking-utils"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function CompactImageColorPicker() {
    const [image, setImage] = useState<string | null>(null)
    const [selectedColor, setSelectedColor] = useState("#5B6FD8")
    const [isCustomImage, setIsCustomImage] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imageRef = useRef<HTMLImageElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const magnifierRef = useRef<HTMLCanvasElement>(null)
    const [showMagnifier, setShowMagnifier] = useState(false)
    const [magnifierPos, setMagnifierPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
    const [imageLoaded, setImageLoaded] = useState(false)
    const router = useRouter()

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                setImage(event.target?.result as string)
                setIsCustomImage(true)
            }
            reader.readAsDataURL(file)
        }
    }

    useEffect(() => {
        if (!image) {
            const defaultImg =
                "https://images.unsplash.com/photo-1599345697595-2d1398084369?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            setImage(defaultImg)
            setIsCustomImage(false)
        }
    }, [])

    useEffect(() => {
        if (image && canvasRef.current) {
            const canvas = canvasRef.current
            const ctx = canvas.getContext("2d")
            if (!ctx) return
            const imgObj = new Image()
            imgObj.crossOrigin = "anonymous"
            imgObj.onload = () => {
                canvas.width = imgObj.naturalWidth
                canvas.height = imgObj.naturalHeight
                ctx.drawImage(imgObj, 0, 0)
                setImageLoaded(true)
            }
            imgObj.src = image
        }
    }, [image])

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height
        const x = (e.clientX - rect.left) * scaleX
        const y = (e.clientY - rect.top) * scaleY

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const imageData = ctx.getImageData(x, y, 1, 1)
        const [r, g, b] = imageData.data

        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`
        setSelectedColor(hex)
        window.dispatchEvent(new CustomEvent("colorUpdate", { detail: { color: hex } }))
    }

    const lastCursorPos = useRef<{ x: number; y: number } | null>(null)

    const drawMagnifier = (clientX: number, clientY: number) => {
        const canvas = canvasRef.current
        const mag = magnifierRef.current
        if (!canvas || !mag || !imageLoaded) return

        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height
        const x = (clientX - rect.left) * scaleX
        const y = (clientY - rect.top) * scaleY

        const ctx = canvas.getContext("2d")
        const mctx = mag.getContext("2d")
        if (!ctx || !mctx) return

        const zoomLevel = 11
        const magSize = 120

        const half = Math.floor(zoomLevel / 2)
        const sx = Math.max(0, Math.min(canvas.width - zoomLevel, Math.floor(x - half)))
        const sy = Math.max(0, Math.min(canvas.height - zoomLevel, Math.floor(y - half)))

        let src: ImageData | null = null
        try {
            src = ctx.getImageData(sx, sy, zoomLevel, zoomLevel)
        } catch {
            return
        }
        if (!src) return

        mag.width = magSize
        mag.height = magSize
        mctx.imageSmoothingEnabled = false

        const temp = document.createElement("canvas")
        temp.width = zoomLevel
        temp.height = zoomLevel
        const tctx = temp.getContext("2d")
        if (!tctx) return

        const imgData = new ImageData(src.data, zoomLevel, zoomLevel)
        tctx.putImageData(imgData, 0, 0)

        mctx.clearRect(0, 0, mag.width, mag.height)
        mctx.drawImage(temp, 0, 0, zoomLevel, zoomLevel, 0, 0, mag.width, mag.height)

        mctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
        mctx.lineWidth = 1
        const cell = mag.width / zoomLevel

        for (let i = 0; i <= zoomLevel; i++) {
            mctx.beginPath()
            mctx.moveTo(i * cell, 0)
            mctx.lineTo(i * cell, mag.height)
            mctx.stroke()
            mctx.beginPath()
            mctx.moveTo(0, i * cell)
            mctx.lineTo(mag.width, i * cell)
            mctx.stroke()
        }

        mctx.strokeStyle = "#ef4444"
        mctx.lineWidth = 2
        mctx.strokeRect(Math.floor(zoomLevel / 2) * cell, Math.floor(zoomLevel / 2) * cell, cell, cell)

        mctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
        mctx.lineWidth = 1
        mctx.strokeRect(Math.floor(zoomLevel / 2) * cell - 1, Math.floor(zoomLevel / 2) * cell - 1, cell + 2, cell + 2)
    }

    useEffect(() => {
        if (showMagnifier && lastCursorPos.current) {
            requestAnimationFrame(() => {
                if (magnifierRef.current && lastCursorPos.current) {
                    drawMagnifier(lastCursorPos.current.x, lastCursorPos.current.y)
                }
            })
        }
    }, [showMagnifier])

    const updateMagnifierState = (clientX: number, clientY: number) => {
        const canvas = canvasRef.current
        if (!canvas || !imageLoaded) return
        const rect = canvas.getBoundingClientRect()

        if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
            setShowMagnifier(false)
            return
        }

        lastCursorPos.current = { x: clientX, y: clientY }

        const offsetX = clientX - rect.left
        const offsetY = clientY - rect.top
        const magSize = 120
        const pad = 20
        const sep = 24
        const isCoarse =
            typeof window !== "undefined" &&
            !!window.matchMedia &&
            window.matchMedia("(pointer: coarse)").matches

        const isLeftHalf = offsetX < rect.width / 2
        const isTopHalf = offsetY < rect.height / 2
        let mx: number
        let my: number

        if (isCoarse) {
            mx = isLeftHalf ? Math.max(pad, rect.width - magSize - pad) : pad
            my = isTopHalf ? Math.max(pad, rect.height - magSize - pad) : pad
        } else {
            let targetX = rect.width * (isLeftHalf ? 0.6 : 0.4) - magSize / 2
            targetX = Math.max(pad, Math.min(rect.width - magSize - pad, targetX))
            if (isLeftHalf) {
                if (targetX - offsetX < sep) {
                    targetX = Math.min(rect.width - magSize - pad, offsetX + sep)
                }
            } else {
                if (offsetX - (targetX + magSize) < sep) {
                    targetX = Math.max(pad, offsetX - magSize - sep)
                }
            }
            mx = targetX
            let targetY = offsetY - magSize / 2
            targetY = Math.max(pad, Math.min(rect.height - magSize - pad, targetY))
            my = targetY
        }

        setMagnifierPos({ x: mx, y: my })
        setShowMagnifier(true)

        if (magnifierRef.current) {
            drawMagnifier(clientX, clientY)
        }
    }

    const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        updateMagnifierState(e.clientX, e.clientY)
    }

    const handleCanvasTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault()
        const touch = e.touches[0]
        updateMagnifierState(touch.clientX, touch.clientY)
    }

    const handleCanvasTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault()
        const touch = e.touches[0]
        updateMagnifierState(touch.clientX, touch.clientY)
    }

    const handleCanvasTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
        setShowMagnifier(false)
        if (e.changedTouches.length > 0) {
            const touch = e.changedTouches[0]
            const canvas = canvasRef.current
            if (!canvas) return
            const rect = canvas.getBoundingClientRect()
            const scaleX = canvas.width / rect.width
            const scaleY = canvas.height / rect.height
            const x = (touch.clientX - rect.left) * scaleX
            const y = (touch.clientY - rect.top) * scaleY
            const ctx = canvas.getContext("2d")
            if (!ctx) return
            const imageData = ctx.getImageData(x, y, 1, 1)
            const [r, g, b] = imageData.data
            const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`
            setSelectedColor(hex)
            window.dispatchEvent(new CustomEvent("colorUpdate", { detail: { color: hex } }))
        }
    }

    const handleCanvasMouseLeave = () => {
        setShowMagnifier(false)
    }

    const rgb = hexToRgb(selectedColor)
    const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null

    return (
        <Card className="p-4 sm:p-6 space-y-4">
            <div className="space-y-4">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <Button onClick={() => fileInputRef.current?.click()} className="w-full gap-2" size="lg">
                    <Upload className="w-5 h-5" />
                    Upload Image
                </Button>

                {image && (
                    <div className="space-y-4">
                        <div className="relative border-2 border-dashed border-lime-400 bg-lime-50 rounded-lg overflow-hidden">
                            <img ref={imageRef} src={image || "/placeholder.svg"} alt="Uploaded" className="hidden" crossOrigin="anonymous" />
                            <canvas
                                ref={canvasRef}
                                onClick={handleCanvasClick}
                                onMouseMove={handleCanvasMouseMove}
                                onMouseLeave={handleCanvasMouseLeave}
                                onTouchStart={handleCanvasTouchStart}
                                onTouchMove={handleCanvasTouchMove}
                                onTouchEnd={handleCanvasTouchEnd}
                                className="w-full cursor-crosshair max-h-[500px] object-contain touch-none"
                            />
                            {!isCustomImage && image && (
                                <a
                                    href={image}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute bottom-2 right-2 text-[11px] px-2 py-1 rounded bg-black/50 text-white"
                                >
                                    Photo © Unsplash
                                </a>
                            )}
                            {showMagnifier && (
                                <div
                                    className="absolute z-10 border-4 border-white bg-background rounded-full shadow-2xl pointer-events-none overflow-hidden"
                                    style={{ left: magnifierPos.x, top: magnifierPos.y, width: 120, height: 120 }}
                                >
                                    <canvas ref={magnifierRef} className="w-full h-full" />
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-muted rounded-lg space-y-3">
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-24 h-24 rounded-lg border-2 border-border"
                                    style={{ backgroundColor: selectedColor }}
                                />
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-sm text-muted-foreground">HEX:</span>
                                            <span className="ml-2 font-mono font-semibold">{selectedColor}</span>
                                        </div>
                                        <CopyButton value={selectedColor} />
                                    </div>
                                    {rgb && (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="text-sm text-muted-foreground">RGB:</span>
                                                    <span className="ml-2 font-mono">
                                                        {rgb.r}, {rgb.g}, {rgb.b}
                                                    </span>
                                                </div>
                                                <CopyButton value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
                                            </div>
                                            {hsl && (
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="text-sm text-muted-foreground">HSL:</span>
                                                        <span className="ml-2 font-mono">
                                                            {hsl.h}°, {hsl.s}%, {hsl.l}%
                                                        </span>
                                                    </div>
                                                    <CopyButton value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
                                                </div>
                                            )}
                                        </>
                                    )}
                                    <Button
                                        variant="outline"
                                        className="w-full mt-2"
                                        onClick={() => router.push(getColorPageLink(selectedColor))}
                                    >
                                        Explore This Color
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Link to Full Tool */}
            <div className="pt-4 flex justify-start border-t mt-6">
                <Link
                    href="/image-color-picker"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors shadow-lg mt-4"
                >
                    Open full Image Color Picker tool
                    <span className="text-xl">→</span>
                </Link>
            </div>
        </Card>
    )
}
