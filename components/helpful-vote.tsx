"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown } from "lucide-react"

export function HelpfulVote({ uri }: { uri: string }) {
  const [voted, setVoted] = useState<"up" | "down" | null>(null)

  useEffect(() => {
    const key = `helpful:${uri}`
    const raw = localStorage.getItem(key)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (parsed?.lastVote) setVoted(parsed.lastVote)
      } catch {}
    }
  }, [uri])

  const storeVote = (vote: "up" | "down") => {
    const key = `helpful:${uri}`
    const raw = localStorage.getItem(key)
    let data = { up: 0, down: 0, lastVote: vote }
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        data.up = parsed.up || 0
        data.down = parsed.down || 0
      } catch {}
    }
    if (vote === "up") data.up += 1
    else data.down += 1
    localStorage.setItem(key, JSON.stringify(data))
    setVoted(vote)
  }

  return (
    <div className="border-t border-border pt-4 mt-6 text-center">
      <h2 className="text-base font-semibold mb-3">Was this helpful?</h2>
      <div className="flex gap-3 justify-center">
        <Button
          variant={voted === "up" ? "default" : "outline"}
          onClick={() => storeVote("up")}
          className="gap-2"
        >
          <ThumbsUp className="w-4 h-4" />
          Yes
        </Button>
        <Button
          variant={voted === "down" ? "default" : "outline"}
          onClick={() => storeVote("down")}
          className="gap-2"
        >
          <ThumbsDown className="w-4 h-4" />
          No
        </Button>
      </div>
    </div>
  )
}
