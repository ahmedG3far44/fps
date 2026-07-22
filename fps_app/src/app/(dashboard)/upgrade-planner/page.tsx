"use client"

import { useState } from "react"

export default function UpgradePlannerPage() {
  const [budget, setBudget] = useState("")
  const [resolution, setResolution] = useState("1080p")
  const [targetFps, setTargetFps] = useState("60")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    recommendedGpu: string
    recommendedCpu: string
    estimatedFps: number
    price: number
    currency: string
  } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          budget: parseFloat(budget),
          resolution,
          targetFps: parseInt(targetFps),
        }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Upgrade Planner</h1>

      <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-1">Budget ($)</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Target Resolution</label>
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="1080p">1080p</option>
            <option value="1440p">1440p</option>
            <option value="4K">4K</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Target FPS</label>
          <select
            value={targetFps}
            onChange={(e) => setTargetFps(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="60">60 FPS</option>
            <option value="90">90 FPS</option>
            <option value="120">120 FPS</option>
            <option value="144">144 FPS</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Plan Upgrade"}
        </button>
      </form>

      {result && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-xl font-semibold">Recommendations</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted">Recommended GPU</p>
              <p className="font-medium">{result.recommendedGpu}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Recommended CPU</p>
              <p className="font-medium">{result.recommendedCpu}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Estimated FPS</p>
              <p className="font-medium text-primary">{result.estimatedFps} FPS</p>
            </div>
            <div>
              <p className="text-sm text-muted">Estimated Price</p>
              <p className="font-medium">${result.price.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
