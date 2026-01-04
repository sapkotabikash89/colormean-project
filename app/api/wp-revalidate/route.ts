import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function POST(req: Request) {
  try {
    const secretEnv = process.env.REVALIDATE_SECRET
    const body = await req.json().catch(() => ({}))
    const { uri, slug, path, secret } = body || {}

    if (secretEnv) {
      if (!secret || secret !== secretEnv) {
        return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
      }
    }

    let paths = [] as string[]

    if (slug && typeof slug === "string" && slug.trim()) {
      const s = slug.trim()
      const p1 = `/${s}`
      const p2 = `/${s}/`
      revalidatePath(p1)
      revalidatePath(p2)
      paths.push(p1, p2)
    }

    if (uri && typeof uri === "string" && uri.trim()) {
      const u = uri.trim()
      const sitePath = u.endsWith("/") ? u.slice(0, -1) : u
      if (sitePath) {
        revalidatePath(sitePath)
        revalidatePath(u)
        paths.push(sitePath, u)
      }
    }

    if (path && typeof path === "string" && path.trim()) {
      const p = path.trim()
      revalidatePath(p)
      paths.push(p)
    }

    return NextResponse.json({ ok: true, paths })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Unknown error" }, { status: 500 })
  }
}
