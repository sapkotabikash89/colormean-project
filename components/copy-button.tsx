"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import ReactDOM from "react-dom"

interface CopyButtonProps {
  value: string
  label?: string
  className?: string
  variant?: "ghost" | "outline" | "default"
  size?: "default" | "sm" | "lg" | "icon"
  showIcon?: boolean
  anchorRef?: React.RefObject<HTMLElement | null>
}

export function CopyButton({
  value,
  label,
  className = "",
  variant = "ghost",
  size = "sm",
  showIcon = true,
  anchorRef,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [popupPos, setPopupPos] = useState<{ top: number; left: number } | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const handleCopy = async (e?: React.MouseEvent) => {
    e?.stopPropagation()
    let success = false
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(value)
        success = true
      }
    } catch {
      success = false
    }

    if (!success) {
      try {
        const textarea = document.createElement("textarea")
        textarea.value = value
        textarea.setAttribute("readonly", "")
        textarea.style.position = "fixed"
        textarea.style.top = "-1000px"
        textarea.style.opacity = "0"
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        const ok = document.execCommand("copy")
        document.body.removeChild(textarea)
        success = ok
      } catch {
        success = false
      }
    }

    if (!success) return

    setCopied(true)
    setShowPopup(true)
    const el = (anchorRef?.current as HTMLElement | null) ?? btnRef.current
    if (el) {
      const rect = el.getBoundingClientRect()
      setPopupPos({
        top: Math.max(0, rect.top - 36),
        left: rect.left + rect.width / 2,
      })
    }

    setTimeout(() => {
      setCopied(false)
      setShowPopup(false)
      setPopupPos(null)
    }, 2000)
  }

  return (
    <div className="relative inline-block">
      <Button
        ref={btnRef}
        variant={variant}
        size={size}
        onClick={(e) => handleCopy(e)}
        className={className}
        aria-label={label ? undefined : "Copy to clipboard"}
      >
        {showIcon && (copied ? <Check className="w-3 h-3" aria-hidden="true" /> : <Copy className="w-3 h-3" aria-hidden="true" />)}
        {label && <span className="ml-1">{label}</span>}
      </Button>

      {mounted && showPopup && popupPos &&
        ReactDOM.createPortal(
          <div
            className="fixed bg-foreground text-background px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap animate-in fade-in zoom-in duration-200 pointer-events-none"
            style={{ top: popupPos.top, left: popupPos.left, transform: "translateX(-50%)", zIndex: 9999 }}
            aria-live="polite"
          >
            Copied!
          </div>,
          document.body
        )}
    </div>
  )
}
