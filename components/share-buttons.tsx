"use client"

import { Facebook, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface ShareButtonsProps {
  url?: string
  title?: string
  className?: string
}

export function ShareButtons({ url, title, className = "" }: ShareButtonsProps) {
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "")
  const shareTitle = title || "Check out ColorMean"

  const shareTo = (platform: "facebook" | "x" | "copy") => {
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedText = encodeURIComponent(shareTitle)

    if (platform === "copy") {
      navigator.clipboard.writeText(shareUrl)
      toast.success("Link copied to clipboard")
      return
    }

    const targetUrl =
      platform === "facebook"
        ? `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        : `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`
    
    if (typeof window !== "undefined") window.open(targetUrl, "_blank")
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm font-medium">Share</span>
      <Button size="sm" variant="ghost" onClick={() => shareTo("facebook")} className="gap-2">
        <Facebook className="w-4 h-4" />
      </Button>
      <Button size="sm" variant="ghost" onClick={() => shareTo("x")} className="gap-2">
        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-current"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
      </Button>
      <Button size="sm" variant="ghost" onClick={() => shareTo("copy")} className="gap-2">
        <Link className="w-4 h-4" />
      </Button>
    </div>
  )
}
