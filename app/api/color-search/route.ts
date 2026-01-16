// For static export compatibility with revalidation
export const dynamic = 'force-static'
export const revalidate = 0 // No caching, always fresh

// Cache the color data in memory to avoid repeated file reads
let cachedColorData: any = null
// Cache search results to avoid repeated computations
const searchCache = new Map<string, Array<{ name: string; hex: string }>>()

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = (url.searchParams.get("q") || "").trim().toLowerCase()
  if (q.length < 3) {
    return new Response(JSON.stringify({ results: [] }), { headers: { "content-type": "application/json" } })
  }

  // Check search cache first
  const cacheKey = `search_${q}`
  if (searchCache.has(cacheKey)) {
    return new Response(JSON.stringify({ results: searchCache.get(cacheKey) }), { 
      headers: { "content-type": "application/json" } 
    })
  }

  // Load color data only once and cache it
  if (!cachedColorData) {
    const colorData = (await import('@/lib/color-meaning.json')).default
    cachedColorData = colorData
  }
  
  // OPTIMIZATION: Use for loop instead of forEach for better performance
  const values = Object.values(cachedColorData as any) as Array<{ name: string; hex: string }>
  const startsWith: Array<{ name: string; hex: string }> = []
  const contains: Array<{ name: string; hex: string }> = []
  
  // OPTIMIZATION: Early termination when we have enough results
  const maxResults = 200
  for (let i = 0; i < values.length && (startsWith.length + contains.length) < maxResults; i++) {
    const v = values[i]
    const n = (v.name || "").toLowerCase()
    if (n.startsWith(q)) {
      startsWith.push(v)
    } else if (n.includes(q)) {
      contains.push(v)
    }
  }

  const results = [...startsWith, ...contains].slice(0, maxResults)
  
  // Cache the search results
  searchCache.set(cacheKey, results)
  
  // Limit cache size
  if (searchCache.size > 100) {
    const firstKey = searchCache.keys().next().value
    if (firstKey) {
      searchCache.delete(firstKey)
    }
  }
  
  return new Response(JSON.stringify({ results }), { headers: { "content-type": "application/json" } })
}