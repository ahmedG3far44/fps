"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"

interface ResolutionData {
  min: number
  max: number
}

interface Props {
  gameTitle: string
  gameDescription?: string
}

const resolutions = [
  { key: "720p", label: "720p", icon: "SD", full: "SD 720P" },
  { key: "1080p", label: "1080p", icon: "HD", full: "HD 1080P" },
  { key: "1440p", label: "2K", icon: "QHD", full: "2K QHD" },
  { key: "4K", label: "4K", icon: "UHD", full: "4K UHD" },
] as const

function statusFor(avg: number): { label: string; color: string; dot: string; bg: string; glow: string; dotGlow: string } {
  if (avg >= 60) return {
    label: "STABLE",
    color: "text-green-400",
    dot: "bg-green-400",
    bg: "bg-green-500/10",
    glow: "rgba(74,222,128,0.08)",
    dotGlow: "rgba(74,222,128,0.6)",
  }
  if (avg >= 30) return {
    label: "UNSTABLE",
    color: "text-yellow-400",
    dot: "bg-yellow-400",
    bg: "bg-yellow-500/10",
    glow: "rgba(250,204,21,0.08)",
    dotGlow: "rgba(250,204,21,0.6)",
  }
  return {
    label: "CRITICAL",
    color: "text-red-400",
    dot: "bg-red-400",
    bg: "bg-red-500/10",
    glow: "rgba(239,68,68,0.08)",
    dotGlow: "rgba(239,68,68,0.6)",
  }
}

function Waveform({ min, max, maxRef, color }: { min: number; max: number; maxRef: number; color: string }) {
  const bars = 14
  const heights = Array.from({ length: bars }, (_, j) => {
    const t = j / (bars - 1)
    const base = min + (max - min) * t
    const noise = Math.sin(j * 0.8) * 0.15 + Math.cos(j * 1.3) * 0.1
    return Math.max(4, (base / maxRef) * 40 * (0.7 + noise))
  })

  return (
    <svg className="w-full h-12" viewBox="0 0 120 48" preserveAspectRatio="none">
      {heights.map((h, i) => {
        const x = (i / bars) * 120 + 2
        const w = Math.max(3, 120 / bars - 4)
        const barH = (h / 48) * 44
        return (
          <rect
            key={i}
            x={x}
            y={48 - barH - 2}
            width={w}
            height={barH}
            rx={1.5}
            fill={color}
            opacity={0.4 + (h / 40) * 0.6}
          />
        )
      })}
    </svg>
  )
}

const qualityLevels = [
  { key: "ultra", label: "Ultra", multiplier: 0 },
  { key: "high", label: "High", multiplier: 0.33 },
  { key: "medium", label: "Medium", multiplier: 0.66 },
  { key: "low", label: "Low", multiplier: 1 },
] as const

function qualityFps(min: number, max: number, multiplier: number): number {
  return Math.round(min + (max - min) * multiplier)
}

function QualityRow({ fps, maxRef, label }: { fps: number; maxRef: number; label: string }) {
  const color = fps >= 60 ? "#22c55e" : fps >= 30 ? "#eab308" : "#ef4444"
  const width = Math.min((fps / maxRef) * 100, 100)
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-medium text-white/40 w-12 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${width}%`,
            backgroundColor: color,
            boxShadow: `0 0 6px ${color}60`,
          }}
        />
      </div>
      <span className="text-[11px] font-semibold tabular-nums w-10 text-right" style={{ color }}>{fps}</span>
    </div>
  )
}

const pipelineColors = [
  { name: "green", from: "#22c55e", to: "#16a34a", mid: "#4ade80" },
  { name: "yellow", from: "#eab308", to: "#ca8a04", mid: "#facc15" },
  { name: "red", from: "#ef4444", to: "#dc2626", mid: "#f87171" },
]

export function FPSPipelineDashboard({ gameTitle, gameDescription }: Props) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [data, setData] = useState<Record<string, ResolutionData> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  const estimate = async () => {
    if (status !== "authenticated" || !session) {
      router.push("/login")
      return
    }
    if (!session.user.onboarded) {
      router.push("/onboarding")
      return
    }
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

  const currentPipelineColors = data
    ? resolutions.map((r) => {
        const d = data[r.key]
        if (!d) return pipelineColors[0]
        const avg = (d.min + d.max) / 2
        if (avg >= 60) return pipelineColors[0]
        if (avg >= 30) return pipelineColors[1]
        return pipelineColors[2]
      })
    : pipelineColors

  return (
    <section className="relative mb-16 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0a0a]">
      <div className="relative z-10 p-6 sm:p-8 lg:p-10">
        <div className="flex items-center gap-3 mb-8">
          <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <polygon points="9 8 15 12 9 16 9 8" fill="currentColor" stroke="none" />
          </svg>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white/90">
            Performance Pipeline
          </h2>
        </div>

        {!data && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-16 gap-5">
            <div className="relative">
              <svg className="w-12 h-12 text-yellow-500/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span className="absolute inset-0 animate-ping rounded-full bg-yellow-500/10" />
            </div>
            <p className="text-sm text-white/40 text-center max-w-xs">
              AI estimates FPS across all resolutions based on your hardware
            </p>
            <button
              onClick={estimate}
              className="relative group inline-flex items-center gap-2.5 rounded-full border border-white/[0.1] bg-white/[0.04] px-6 py-3 text-sm font-medium text-white/70 transition-all hover:bg-white/[0.08] hover:text-white/90 hover:border-white/[0.2]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Estimate FPS
            </button>
          </div>
        )}

        {loading && (
          <div className="py-16">
            <div className="flex flex-col items-center gap-6">
              <svg className="w-10 h-10 animate-spin text-yellow-500/50" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-sm text-white/40">Analyzing <span className="text-white/70">{gameTitle}</span> against your hardware...</p>
              <div className="flex gap-3 w-full max-w-lg">
                {resolutions.map((r, i) => (
                  <div key={r.key} className="flex-1 space-y-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="h-3 w-10 mx-auto rounded-full bg-white/[0.06] animate-pulse" />
                    <div className="h-7 w-14 mx-auto rounded-lg bg-white/[0.06] animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
                    <div className="h-8 w-full rounded-md bg-white/[0.04] animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="py-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-3 text-sm text-red-400 mb-5">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              {error}
            </div>
            <button
              onClick={estimate}
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-5 py-2.5 text-sm text-white/70 hover:bg-white/[0.08] transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Try Again
            </button>
          </div>
        )}

        {data && !loading && (
          <>
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 z-0"
                style={{
                  background: "linear-gradient(to right, rgba(34,197,94,0.4), rgba(234,179,8,0.4), rgba(239,68,68,0.3), rgba(239,68,68,0))",
                  maskImage: "linear-gradient(to right, transparent, black 5%, black 85%, transparent)",
                  WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 85%, transparent)",
                }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
                {resolutions.map((r, i) => {
                  const d = data[r.key]
                  if (!d) return null
                  const avg = Math.round((d.min + d.max) / 2)
                  const status = statusFor(avg)
                  const pc = currentPipelineColors[i]
                  const widthPct = (d.max / maxPossible) * 100

                  const expanded = expandedCard === r.key

                  return (
                    <div key={r.key} className="relative">
                      <button
                        onClick={() => setExpandedCard(expanded ? null : r.key)}
                        className="w-full text-left cursor-pointer"
                      >
                        <div
                          className="relative rounded-xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-white/[0.15] hover:from-white/[0.06] hover:to-white/[0.02] active:scale-[0.98]"
                          style={{
                            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), 0 0 30px -10px ${pc.from}30`,
                          }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span
                              className="text-[10px] font-bold uppercase tracking-[0.2em]"
                              style={{ color: pc.from }}
                            >
                              {r.icon}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-white/30">{r.full}</span>
                              <svg
                                className={`w-3 h-3 text-white/30 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                                viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                              >
                                <path d="M3 4.5l3 3 3-3" />
                              </svg>
                            </div>
                          </div>

                          <div
                            className="text-3xl sm:text-4xl font-bold tabular-nums mb-1 tracking-tight"
                            style={{ color: pc.from }}
                          >
                            {d.min}
                            <span className="text-white/20 text-xl font-light mx-1">&ndash;</span>
                            {d.max}
                          </div>
                          <div className="text-[11px] text-white/30 uppercase tracking-wider mb-4">FPS</div>

                          <div className="relative mb-3">
                            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                style={{
                                  width: `${widthPct}%`,
                                  background: `linear-gradient(to right, ${pc.from}, ${pc.to})`,
                                  boxShadow: `0 0 8px ${pc.from}60`,
                                }}
                              />
                            </div>
                          </div>

                          <div className="mb-3 rounded-lg bg-white/[0.03] p-2 border border-white/[0.04]">
                            <Waveform
                              min={d.min}
                              max={d.max}
                              maxRef={maxPossible}
                              color={pc.from}
                            />
                          </div>

                          <div className="flex items-center justify-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${status.bg} ${status.color}`}
                              style={{ boxShadow: `inset 0 0 12px ${status.glow}` }}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                                style={{ boxShadow: `0 0 4px ${status.dotGlow}` }}
                              />
                              {status.label}
                            </span>
                          </div>

                          {i < resolutions.length - 1 && (
                            <div className="hidden lg:block absolute -right-1.5 top-1/2 -translate-y-1/2 z-20">
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M4 2l4 4-4 4" stroke={pc.to} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={0.5} />
                              </svg>
                            </div>
                          )}
                        </div>
                      </button>

                      <AnimatePresence>
                        {expanded && (
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.97 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="mt-2 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-2.5 origin-top"
                          >
                            <div className="text-[10px] font-semibold uppercase tracking-wider text-white/20 mb-2">Quality Settings</div>
                            {qualityLevels.map((ql) => {
                              const fps = qualityFps(d.min, d.max, ql.multiplier)
                              return (
                                <QualityRow
                                  key={ql.key}
                                  label={ql.label}
                                  fps={fps}
                                  maxRef={maxPossible}
                                />
                              )
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mt-8 pt-4 border-t border-white/[0.04]">
              {[
                { color: "#22c55e", label: "Stable" },
                { color: "#eab308", label: "Unstable" },
                { color: "#ef4444", label: "Critical" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: item.color,
                      boxShadow: `0 0 6px ${item.color}60`,
                    }}
                  />
                  <span className="text-xs font-medium text-white/40">{item.label}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
