import colorData from "@/lib/color-meaning.json"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = (url.searchParams.get("q") || "").trim().toLowerCase()
  if (q.length < 3) {
    return new Response(JSON.stringify({ results: [] }), { headers: { "content-type": "application/json" } })
  }

  const values = Object.values(colorData as any) as Array<{ name: string; hex: string }>
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

