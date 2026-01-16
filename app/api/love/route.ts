import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

// In-memory storage for love counts (Note: This resets on server restart/cold boot)
// For production, replace this with a database connection (e.g., Redis, Postgres, MongoDB)
const loveCounts: Record<string, number> = {}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const hex = searchParams.get("hex")

  if (!hex) {
    return NextResponse.json({ error: "Hex is required" }, { status: 400 })
  }

  const normalizedHex = hex.toUpperCase()
  const count = loveCounts[normalizedHex] !== undefined ? loveCounts[normalizedHex] : 12

  return NextResponse.json({ count })
}

export async function POST(request: Request) {
  try {
    const { hex, increment } = await request.json()

    if (!hex) {
      return NextResponse.json({ error: "Hex is required" }, { status: 400 })
    }

    const normalizedHex = hex.toUpperCase()
    
    if (loveCounts[normalizedHex] === undefined) {
      loveCounts[normalizedHex] = 12
    }

    if (increment) {
      loveCounts[normalizedHex] += 1
    } else {
       // Just returning current count or handling decrement if needed
       // Logic for "unlike" could be added here
       if (loveCounts[normalizedHex] > 0) loveCounts[normalizedHex] -= 1
    }

    return NextResponse.json({ count: loveCounts[normalizedHex] })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
