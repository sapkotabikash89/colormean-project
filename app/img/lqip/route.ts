import { NextRequest } from "next/server"
import sharp from "sharp"
import crypto from "crypto"

export const dynamic = "force-dynamic"

const ALLOWED_HOSTS = new Set([
  "colormean.com",
  "www.colormean.com",
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
    if (!src) return new Response("Missing src", { status: 400 })
    const u = new URL(src)
    if (!ALLOWED_HOSTS.has(u.hostname)) {
      return new Response("Host not allowed", { status: 400 })
    }
    const key = hashKey(`${src}|lqip`)
    const res = await fetch(src, { next: { revalidate: 2592000, tags: [`lqip:${key}`] } })
    if (!res.ok) return new Response("Upstream error", { status: 502 })
    const buf = Buffer.from(await res.arrayBuffer())

    const out = await sharp(buf, { limitInputPixels: false })
      .resize({ width: 24, withoutEnlargement: true })
      .blur(10)
      .webp({ quality: 40 })
      .toBuffer()

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
