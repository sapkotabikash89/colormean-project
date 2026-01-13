import { NextRequest } from "next/server"
import sharp from "sharp"
import crypto from "crypto"

export const dynamic = "force-dynamic"

const ALLOWED_HOSTS = new Set([
  "colormean.com",
  "www.colormean.com",
  "cms.colormean.com",
  "images.unsplash.com",
  "static.wixstatic.com",
])

function hashKey(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex")
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const src = searchParams.get("src")
    const wStr = searchParams.get("w") || ""
    const qStr = searchParams.get("q") || ""
    const width = Math.max(1, Math.min(4096, parseInt(wStr || "0") || 0)) || undefined
    const quality = Math.max(1, Math.min(100, parseInt(qStr || "90") || 90))
    if (!src) return new Response("Missing src", { status: 400 })
    const u = new URL(src)
    if (!ALLOWED_HOSTS.has(u.hostname)) {
      return new Response("Host not allowed", { status: 400 })
    }
    const key = hashKey(`${src}|${width || "auto"}|${quality}`)

    const res = await fetch(src, { next: { revalidate: 2592000, tags: [`img:${key}`] } })
    if (!res.ok) return new Response("Upstream error", { status: 502 })
    const buf = Buffer.from(await res.arrayBuffer())

    let pipeline = sharp(buf, { limitInputPixels: false })
    if (width) pipeline = pipeline.resize({ width, withoutEnlargement: true })
    const out = await pipeline.webp({ quality }).toBuffer()

    return new Response(new Uint8Array(out), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
        ETag: `"${key}"`,
      },
    })
  } catch {
    return new Response("Internal error", { status: 500 })
  }
}
