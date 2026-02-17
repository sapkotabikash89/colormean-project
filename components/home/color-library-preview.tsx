"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const colorGroups = {
    Red: [
        { name: "Crimson", hex: "#DC143C" },
        { name: "Scarlet", hex: "#FF2400" },
        { name: "Ruby", hex: "#E0115F" },
        { name: "Fire Engine", hex: "#CE2029" },
        { name: "Cinnabar", hex: "#E34234" },
        { name: "Cardinal", hex: "#C41E3A" },
        { name: "Garnet", hex: "#733635" },
        { name: "Carmine", hex: "#960018" },
        { name: "Rose", hex: "#FF007F" },
        { name: "Maroon", hex: "#800000" },
    ],
    Blue: [
        { name: "Royal Blue", hex: "#4169E1" },
        { name: "Sky Blue", hex: "#87CEEB" },
        { name: "Navy", hex: "#000080" },
        { name: "Azure", hex: "#007FFF" },
        { name: "Cobalt", hex: "#0047AB" },
        { name: "Sapphire", hex: "#0F52BA" },
        { name: "Cyan", hex: "#00FFFF" },
        { name: "Turquoise", hex: "#40E0D0" },
        { name: "Zaffre", hex: "#0014A8" },
        { name: "Cerulean", hex: "#2A52BE" },
    ],
    Green: [
        { name: "Emerald", hex: "#50C878" },
        { name: "Forest", hex: "#228B22" },
        { name: "Lime", hex: "#00FF00" },
        { name: "Olive", hex: "#808000" },
        { name: "Jade", hex: "#00A36C" },
        { name: "Mint", hex: "#98FB98" },
        { name: "Sea Green", hex: "#2E8B57" },
        { name: "Teal", hex: "#008080" },
        { name: "Viridian", hex: "#40826D" },
        { name: "Shamrock", hex: "#009E60" },
    ],
    Yellow: [
        { name: "Gold", hex: "#FFD700" },
        { name: "Lemon", hex: "#FFF700" },
        { name: "Amber", hex: "#FFBF00" },
        { name: "Saffron", hex: "#F4C430" },
        { name: "Cream", hex: "#FFFDD0" },
        { name: "Citrine", hex: "#E4D00A" },
        { name: "Maize", hex: "#FBEC5D" },
        { name: "Mustard", hex: "#FFDB58" },
        { name: "Sand", hex: "#C2B280" },
        { name: "Topaz", hex: "#FFC87C" },
    ],
}

export function ColorLibraryPreview() {
    return (
        <Card className="p-4 sm:p-6 space-y-4">
            <Tabs defaultValue="Red" className="w-full">
                <TabsList className="w-full flex justify-start overflow-x-auto bg-muted/50 p-1 h-auto mb-6">
                    {Object.keys(colorGroups).map((color) => (
                        <TabsTrigger
                            key={color}
                            value={color}
                            className="px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                        >
                            {color}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {Object.entries(colorGroups).map(([group, colors]) => (
                    <TabsContent key={group} value={group} className="mt-0 focus-visible:outline-none">
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                            {colors.map((color) => (
                                <Link
                                    key={color.hex}
                                    href={`/colors/${color.hex.replace("#", "").toLowerCase()}/`}
                                    className="group block space-y-2 transition-transform hover:-translate-y-1"
                                >
                                    <div
                                        className="w-full aspect-square rounded-xl shadow-sm border border-black/5"
                                        style={{ backgroundColor: color.hex }}
                                    />
                                    <div className="text-center">
                                        <p className="text-sm font-semibold truncate">{color.name}</p>
                                        <p className="text-xs text-muted-foreground uppercase">{color.hex}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>

            {/* Link to Full Library */}
            <div className="pt-4 flex justify-start border-t">
                <Link
                    href="/colors/"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors shadow-lg mt-4"
                >
                    Browse full color library
                    <span className="text-xl">→</span>
                </Link>
            </div>
        </Card>
    )
}
