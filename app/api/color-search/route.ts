// OPTIMIZATION: Use smaller lookup file to reduce bundle size and improve performance
import { KNOWN_COLOR_HEXES } from "@/lib/known-colors-complete"

// Cache the color data in memory to avoid repeated file reads
let cachedColorData: any = null

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = (url.searchParams.get("q") || "").trim().toLowerCase()
  if (q.length < 3) {
    return new Response(JSON.stringify({ results: [] }), { headers: { "content-type": "application/json" } })
  }

  // Load color data only once and cache it
  if (!cachedColorData) {
    const colorData = (await import('@/lib/color-meaning.json')).default
    cachedColorData = colorData
  }
  
  const values = Object.values(cachedColorData as any) as Array<{ name: string; hex: string }>
  const startsWith: Array<{ name: string; hex: string }> = []
  const contains: Array<{ name: string; hex: string }> = []
  values.forEach((v) => {
    const n = (v.name || "").toLowerCase()
    if (n.startsWith(q)) startsWith.push(v)
    else if (n.includes(q)) contains.push(v)
  })

  const results = [...startsWith, ...contains].slice(0, 200)
  return new Response(JSON.stringify({ results }), { headers: { "content-type": "application/json" } })
}

