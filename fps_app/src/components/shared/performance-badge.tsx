"use client"

import { useState, useEffect } from "react"

interface PerformanceBadgeProps {
  slug: string
  className?: string
}

export function PerformanceBadge({ slug, className = "" }: PerformanceBadgeProps) {
  const [fps, setFps] = useState<number | null>(null)
  const [label, setLabel] = useState<"excellent" | "good" | "poor" | null>(null)
  const [loading, setLoading] = useState(true)
  const [noData, setNoData] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNoData(false)
    fetch(`/api/estimate-fps?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        if (data.fps !== undefined && data.fps !== null) {
          setFps(data.fps)
          setLabel(data.label)
        } else {
          setNoData(true)
        }
      })
      .catch(() => { setNoData(true) })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [slug])

  if (loading) {
    return (
      <div className={`w-16 h-7 rounded-lg bg-white/10 animate-pulse ${className}`} />
    )
  }

  if (noData) return null

  if (fps === null || !label) return null

  const colorMap = {
    excellent: "bg-green-500/20 border-green-500/40 text-green-400",
    good: "bg-yellow-500/20 border-yellow-500/40 text-yellow-400",
    poor: "bg-red-500/20 border-red-500/40 text-red-400",
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-semibold ${colorMap[label]} ${className || "text-xs"}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${label === "excellent" ? "bg-green-400" : label === "good" ? "bg-yellow-400" : "bg-red-400"}`} />
      {fps} FPS
    </div>
  )
}
