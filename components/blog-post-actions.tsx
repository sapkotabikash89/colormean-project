"use client"

import { useState, useEffect } from "react"
import { Heart, Link as LinkIcon, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface BlogPostActionsProps {
  loveKey: string
  shareUrl: string
  shareTitle: string
}

export function BlogPostActions({ loveKey, shareUrl, shareTitle }: BlogPostActionsProps) {
  const [loveCount, setLoveCount] = useState(12)
  const [liked, setLiked] = useState(false)
  const [hydratedUrl, setHydratedUrl] = useState(shareUrl)

  useEffect(() => {
    if (!shareUrl && typeof window !== "undefined") {
      setHydratedUrl(window.location.href)
    }
  }, [shareUrl])

  const finalShareUrl = shareUrl || hydratedUrl

  useEffect(() => {
    // If no key provided, we can't track love
    if (!loveKey) return

    const fetchLoveCount = async () => {
      try {
        const res = await fetch(`/api/love?hex=${loveKey}`)
        if (res.ok) {
          const data = await res.json()
          setLoveCount(data.count)
        }
      } catch (error) {
        // Silently fail in development/localhost - API may not be available
        // This is expected behavior and not an error
      }
    }
    fetchLoveCount()

    const key = `love:${loveKey}`
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        setLiked(!!parsed.liked)
      } catch {}
    }
  }, [loveKey])

  const toggleLove = async () => {
    if (!loveKey) return

    const key = `love:${loveKey}`
    const nextLiked = !liked
    setLiked(nextLiked)
    setLoveCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)))

    try {
      await fetch("/api/love", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hex: loveKey, increment: nextLiked }),
      })
      
      const payload = { liked: nextLiked }
      if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(payload))
    } catch (error) {
      // Silently fail in development/localhost - API may not be available
      // Store locally anyway so the UI state persists
      const payload = { liked: nextLiked }
      if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(payload))
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(finalShareUrl)
    toast.success("URL Copied")
  }

  const shareTo = (platform: "facebook" | "x") => {
    const encodedUrl = encodeURIComponent(finalShareUrl)
    const encodedText = encodeURIComponent(shareTitle)
    const targetUrl =
      platform === "facebook"
        ? `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        : `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`
    
    if (typeof window !== "undefined") window.open(targetUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-border">
      {/* Love Button (Left) */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleLove}
        className={`flex items-center gap-2 hover:bg-red-50 hover:text-red-600 px-2 ${liked ? "text-red-600" : "text-muted-foreground"}`}
        aria-label="Show Love"
      >
        <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
        <span className="font-medium">Show Love ({loveCount})</span>
      </Button>

      {/* Share Buttons (Right) */}
      <div className="flex items-center gap-1 sm:gap-2">
        <span className="text-sm font-medium text-muted-foreground mr-1">Share</span>
        <Button variant="ghost" size="icon" onClick={() => shareTo("facebook")} aria-label="Share on Facebook" className="h-8 w-8 text-muted-foreground hover:text-[#1877F2] hover:bg-blue-50">
          <Facebook className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => shareTo("x")} aria-label="Share on X" className="h-8 w-8 text-muted-foreground hover:text-black hover:bg-gray-100">
           <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-current"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
        </Button>
        <Button variant="ghost" size="icon" onClick={copyToClipboard} aria-label="Copy Link" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-gray-100">
          <LinkIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
