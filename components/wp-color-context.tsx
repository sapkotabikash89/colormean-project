"use client"

import { useEffect } from "react"

export function WPColorContext({ color }: { color: string }) {
  useEffect(() => {
    if (!color) return
    try {
      localStorage.setItem("currentPostColor", color)
    } catch {}
    const dispatch = () => window.dispatchEvent(new CustomEvent("colorUpdate", { detail: { color } }))
    dispatch()
    setTimeout(dispatch, 200)
  }, [color])
  return null
}
