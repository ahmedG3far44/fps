"use client"

import { useState } from "react"

interface ResolutionData {
  min: number
  max: number
}

interface Props {
  gameTitle: string
  gameDescription?: string
}

const resolutions = [
  { key: "720p", label: "720p", icon: "SD" },
  { key: "1080p", label: "1080p", icon: "HD" },
  { key: "1440p", label: "2K", icon: "QHD" },
  { key: "4K", label: "4K", icon: "UHD" },
] as const

function fpsColor(fps: number): string {
  if (fps >= 60) return "text-green-400"
  if (fps >= 30) return "text-yellow-400"
  return "text-red-400"
}

function fpsBg(fps: number): string {
  if (fps >= 60) return "bg-green-500/10 border-green-500/30"
  if (fps >= 30) return "bg-yellow-500/10 border-yellow-500/30"
  return "bg-red-500/10 border-red-500/30"
}

function fpsBarColor(fps: number): string {
  if (fps >= 60) return "bg-green-500"
  if (fps >= 30) return "bg-yellow-500"
  return "bg-red-500"
}

export function EstimatedFPS({ gameTitle, gameDescription }: Props) {
  const [data, setData] = useState<Record<string, ResolutionData> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const estimate = async () => {
    setLoading(true)
    setError("")
    setData(null)
    try {
      const res = await fetch("/api/ai/estimate-fps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: gameTitle, description: gameDescription }),
      })
      const json = await res.json()
      if (json.error) {
        setError(json.error)
        return
      }
      setData(json)
    } catch {
      setError("Failed to connect. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const maxPossible = data
    ? Math.max(...Object.values(data).map((d) => d.max), 1)
    : 1

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-semibold">Estimated FPS</h2>
      </div>

      {!data && !loading && !error && (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
          <svg className="w-10 h-10 mx-auto mb-3 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <p className="text-muted-foreground mb-1">Get an AI-powered FPS estimate for your PC</p>
          <p className="text-xs text-muted-foreground/70 mb-4">Based on your saved hardware in <span className="font-medium text-foreground">My PC</span></p>
          <button
            onClick={estimate}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            Estimate FPS
          </button>
        </div>
      )}

      {loading && (
        <div className="rounded-xl border border-border bg-card/50 p-8">
          <div className="flex flex-col items-center gap-4">
            <svg className="w-10 h-10 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm text-muted-foreground">AI is analyzing <span className="font-medium text-foreground">{gameTitle}</span> against your hardware...</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-2">
              {resolutions.map((r) => (
                <div key={r.key} className="space-y-2 p-4 rounded-lg bg-muted/50">
                  <div className="h-4 w-12 bg-muted rounded animate-pulse mx-auto" />
                  <div className="h-8 w-16 bg-muted rounded animate-pulse mx-auto" />
                  <div className="h-2 w-full bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-border bg-card/50 p-8 text-center">
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2 text-sm text-red-500">
            {error}
          </div>
          <button
            onClick={estimate}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            Try Again
          </button>
        </div>
      )}

      {data && !loading && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {resolutions.map((r) => {
              const d = data[r.key]
              if (!d) return null
              const avg = Math.round((d.min + d.max) / 2)
              const width = ((d.max / maxPossible) * 100)
              return (
                <div
                  key={r.key}
                  className={`rounded-xl border p-5 text-center ${fpsBg(avg)} transition-all hover:scale-[1.02]`}
                >
                  <div className={`text-[10px] font-bold uppercase tracking-widest ${fpsColor(avg)} opacity-60`}>
                    {r.icon}
                  </div>
                  <div className="text-sm uppercase text-muted-foreground mt-1 font-medium">{r.label}</div>
                  <div className={`text-3xl font-bold mt-2 ${fpsColor(avg)}`}>
                    {d.min}&ndash;{d.max}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">FPS</div>
                  <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${fpsBarColor(avg)}`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <div className="mt-2 text-[11px] font-medium">
                    <span className={fpsColor(avg)}>
                      {avg >= 60 ? "Smooth" : avg >= 30 ? "Playable" : avg > 0 ? "Choppy" : "Unplayable"}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> 60+ FPS</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500" /> 30–60 FPS</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> &lt;30 FPS</span>
          </div>
        </div>
      )}
    </section>
  )
}
