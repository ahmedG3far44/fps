"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface RawgReqs {
  minimum?: string
  recommended?: string
}

interface LocalReq {
  os?: string | null
  cpu?: string | null
  gpu?: string | null
  ramGB?: number | null
  storageGB?: number | null
}

interface GeneratedReqs {
  minimum: LocalReq
  recommended: LocalReq
}

interface SystemRequirementsProps {
  rawgReqs?: RawgReqs | null
  localMinReq?: LocalReq | null
  localRecReq?: LocalReq | null
  gameTitle?: string
  gameDescription?: string
}

const specIcons = {
  os: <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,
  cpu: <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" /></svg>,
  gpu: <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="6" y1="10" x2="10" y2="10" /><line x1="6" y1="14" x2="10" y2="14" /><polyline points="14 10 18 12 14 14" /></svg>,
  ram: <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M6 8v8M10 8v8M14 8v8M18 8v8" /></svg>,
  storage: <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>,
  directx: <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>,
  network: <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="1" y1="1" x2="23" y2="23" /><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" /><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" /><path d="M10.71 5.05A16 16 0 0 1 22.56 9" /><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></svg>,
}

const specColors: Record<string, string> = {
  os: "text-blue-400",
  cpu: "text-cyan-400",
  gpu: "text-purple-400",
  ram: "text-green-400",
  storage: "text-amber-400",
  directx: "text-rose-400",
  network: "text-gray-400",
}

const labelMap: Record<string, string> = {
  os: "os",
  processor: "cpu",
  cpu: "cpu",
  memory: "ram",
  ram: "ram",
  graphics: "gpu",
  gpu: "gpu",
  video: "gpu",
  videocard: "gpu",
  "video card": "gpu",
  storage: "storage",
  hard: "storage",
  "hard drive": "storage",
  "hard disk": "storage",
  directx: "directx",
  direct3d: "directx",
  network: "network",
  internet: "network",
  sound: "network",
  "sound card": "network",
}

function parseRawgText(text: string): { label: string; value: string }[] {
  const lines: { label: string; value: string }[] = []
  const rawLines = text.split(/<br>|\n/).filter(Boolean)

  for (const line of rawLines) {
    const cleaned = line.replace(/<\/?[^>]+>/g, "").trim()
    if (!cleaned) continue
    if (/^(minimum|recommended)/i.test(cleaned)) continue

    const match = cleaned.match(/^([^:]+):\s*(.+)/)
    if (match) {
      const key = match[1].trim().toLowerCase().replace(/[^a-z\s]/g, "")
      const mapped = labelMap[key] || labelMap[key.replace(/\s+/g, "")]
      if (mapped) {
        lines.push({ label: mapped, value: match[2].trim() })
      }
    } else {
      lines.push({ label: "note", value: cleaned })
    }
  }
  return lines
}

function SpecRow({ label, value, index }: { label: string; value: string; index: number }) {
  if (label === "note") {
    return (
      <li key={index} className="text-xs text-muted-foreground italic border-t border-border pt-2 mt-2">
        {value}
      </li>
    )
  }

  const icon = specIcons[label as keyof typeof specIcons]
  const color = specColors[label as keyof typeof specColors] || "text-muted-foreground"

  return (
    <li key={index} className="flex items-start gap-3 py-2 border-b border-border/40 last:border-0">
      <span className={`mt-0.5 ${color}`}>{icon}</span>
      <div className="flex-1 min-w-0">
        <span className="text-xs uppercase tracking-wider text-muted-foreground block">
          {label === "cpu" ? "Processor" :
           label === "gpu" ? "Graphics" :
           label === "ram" ? "Memory" :
           label === "directx" ? "DirectX" :
           label.charAt(0).toUpperCase() + label.slice(1)}
        </span>
        <span className="text-sm font-medium text-foreground block truncate" title={value}>
          {value}
        </span>
      </div>
    </li>
  )
}

function RequirementsCard({ title, specs }: { title: string; specs: { label: string; value: string }[] }) {
  if (specs.length === 0) return null

  const isMin = title.toLowerCase() === "minimum"

  return (
    <div className={`rounded-xl border p-6 ${isMin ? "border-amber-500/30 bg-amber-500/5" : "border-emerald-500/30 bg-emerald-500/5"}`}>
      <div className="flex items-center gap-2 mb-5">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isMin ? "bg-amber-500/20" : "bg-emerald-500/20"}`}>
          <span className={`text-sm font-bold ${isMin ? "text-amber-400" : "text-emerald-400"}`}>
            {isMin ? "1" : "2"}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-lg leading-tight">{title}</h3>
          <p className="text-xs text-muted-foreground">{isMin ? "Hardware needed to run the game" : "Hardware for smooth gameplay"}</p>
        </div>
      </div>
      <ul>
        {specs.map((spec, i) => (
          <SpecRow key={i} label={spec.label} value={spec.value} index={i} />
        ))}
      </ul>
    </div>
  )
}

function toSpecs(localReq: LocalReq): { label: string; value: string }[] {
  const specs: { label: string; value: string }[] = []
  if (localReq.os) specs.push({ label: "os", value: localReq.os })
  if (localReq.cpu) specs.push({ label: "cpu", value: localReq.cpu })
  if (localReq.gpu) specs.push({ label: "gpu", value: localReq.gpu })
  if (localReq.ramGB) specs.push({ label: "ram", value: `${localReq.ramGB} GB` })
  if (localReq.storageGB) specs.push({ label: "storage", value: `${localReq.storageGB} GB` })
  return specs
}

export function SystemRequirements({ rawgReqs, localMinReq, localRecReq, gameTitle, gameDescription }: SystemRequirementsProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [generated, setGenerated] = useState<GeneratedReqs | null>(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState("")

  const minSpecs = rawgReqs?.minimum
    ? parseRawgText(rawgReqs.minimum)
    : generated?.minimum
      ? toSpecs(generated.minimum)
      : localMinReq ? toSpecs(localMinReq) : []

  const recSpecs = rawgReqs?.recommended
    ? parseRawgText(rawgReqs.recommended)
    : generated?.recommended
      ? toSpecs(generated.recommended)
      : localRecReq ? toSpecs(localRecReq) : []

  const hasMinText = rawgReqs?.minimum && rawgReqs.minimum.length > 0
  const hasRecText = rawgReqs?.recommended && rawgReqs.recommended.length > 0

  const hasAnyData = minSpecs.length > 0 || recSpecs.length > 0 || hasMinText || hasRecText

  const generate = async () => {
    if (status !== "authenticated" || !session) {
      router.push("/login")
      return
    }
    if (!session.user.onboarded) {
      router.push("/onboarding")
      return
    }
    setGenerating(true)
    setError("")
    try {
      const res = await fetch("/api/ai/generate-requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: gameTitle, description: gameDescription }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
        return
      }
      if (!data.minimum && !data.recommended) {
        setError("AI returned an invalid response. Try again.")
        return
      }
      setGenerated(data)
    } catch {
      setError("Failed to generate requirements. Check your connection and try again.")
    } finally {
      setGenerating(false)
    }
  }

  if (generating) {
    return (
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-semibold">System Requirements</h2>
        </div>
        <div className="rounded-xl border border-border bg-card/50 p-8">
          <div className="flex flex-col items-center gap-4">
            <svg className="w-10 h-10 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm text-muted-foreground">AI is generating system requirements for <span className="font-medium text-foreground">{gameTitle}</span>...</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-2">
              <div className="space-y-3">
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                <div className="h-3 w-full bg-muted rounded animate-pulse" />
                <div className="h-3 w-full bg-muted rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                <div className="h-3 w-full bg-muted rounded animate-pulse" />
                <div className="h-3 w-full bg-muted rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!hasAnyData && !generated) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">System Requirements</h2>
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
          <p className="text-muted-foreground mb-1">No system requirements available for this game.</p>
          <p className="text-sm text-muted-foreground/70 mb-4">Let AI estimate the minimum and recommended hardware needed to run this game.</p>
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2 text-sm text-red-500">
              {error}
            </div>
          )}
          <button
            onClick={generate}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M3 16v2a2 2 0 002 2h14a2 2 0 002-2v-2" /></svg>
            Generate with AI
          </button>
        </div>
      </section>
    )
  }

  if (minSpecs.length === 0 && recSpecs.length === 0 && !hasMinText && !hasRecText) return null

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-semibold">System Requirements</h2>
        <div className="flex gap-3 ml-auto">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/50" /> Minimum
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/50" /> Recommended
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RequirementsCard title="Minimum" specs={minSpecs} />
        <RequirementsCard title="Recommended" specs={recSpecs} />
      </div>
    </section>
  )
}
