"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Palette, Grid, BookOpen } from "lucide-react"

export function Hero() {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const palettes = [
        ["#FF5733", "#FF8D1A", "#FFC300", "#DAF7A6"],
        ["#581845", "#900C3F", "#C70039", "#FF5733"],
        ["#1f3b4d", "#0171a1", "#0099e5", "#cfedfb"],
        ["#2c3e50", "#34495e", "#7f8c8d", "#95a5a6"],
        ["#00b894", "#00cec9", "#0984e3", "#6c5ce7"],
        ["#fdcb6e", "#e17055", "#d63031", "#e84393"],
    ]

    return (
        <section className="relative w-full overflow-hidden bg-background py-12 lg:py-20 border-b">
            <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12 relative z-10">
                <div className="w-full lg:w-1/2 space-y-8 text-left">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-balance leading-[1.1]">
                            ColorMean: <span className="text-primary">Know Your Color</span> with Confidence
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed text-pretty">
                            Access professional color tools, meanings, psychology, and precise conversions.
                            The ultimate workspace for creative minds to master the art and science of colors.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/color-picker/">
                            <Button size="lg" className="h-14 px-8 text-base font-semibold gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                                <Palette className="w-5 h-5" />
                                Color Picker
                            </Button>
                        </Link>
                        <Link href="/color-wheel/">
                            <Button size="lg" variant="outline" className="h-14 px-8 text-base font-semibold gap-2 shadow-sm hover:bg-accent transition-all">
                                <Grid className="w-5 h-5" />
                                Tools
                            </Button>
                        </Link>
                        <Link href="/colors/">
                            <Button size="lg" variant="ghost" className="h-14 px-8 text-base font-semibold gap-2 transition-all">
                                <BookOpen className="w-5 h-5" />
                                Color Library
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 h-[400px] md:h-[500px] relative overflow-hidden hidden lg:block rounded-2xl border bg-muted/30">
                    <div className="absolute inset-0 flex gap-4 p-4 opacity-95">
                        {palettes.map((colors, i) => (
                            <div
                                key={i}
                                className="flex-1 flex flex-col gap-2 animate-scroll-vertical"
                                style={{
                                    animationDelay: `${i * 0.5}s`,
                                    animationDuration: `${15 + i * 2}s`
                                }}
                            >
                                {[...colors, ...colors, ...colors].map((color, j) => (
                                    <div
                                        key={j}
                                        className="w-full h-32 rounded-lg shadow-sm"
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/60 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-transparent pointer-events-none" />
                </div>
            </div>

            <style jsx>{`
        @keyframes scroll-vertical {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-scroll-vertical {
          animation: scroll-vertical linear infinite;
        }
      `}</style>
        </section>
    )
}
