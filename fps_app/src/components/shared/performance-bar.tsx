import { cn } from "@/lib/utils"

interface PerformanceBarProps {
  fps: number
  label: string
  maxFps?: number
}

function getFPSBarColor(fps: number): string {
  if (fps >= 120) return "bg-fps-excellent"
  if (fps >= 90) return "bg-fps-high"
  if (fps >= 60) return "bg-fps-good"
  if (fps >= 30) return "bg-fps-playable"
  return "bg-fps-poor"
}

export function PerformanceBar({ fps, label, maxFps = 240 }: PerformanceBarProps) {
  const width = Math.min((fps / maxFps) * 100, 100)

  return (
    <div className="flex items-center gap-3 md:gap-4">
      <span className="w-16 md:w-20 text-label-caps text-on-surface-variant shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-surface-container-highest overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", getFPSBarColor(fps))}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="text-data-mono-sm text-on-surface tabular-nums w-16 md:w-20 text-right shrink-0">{fps} FPS</span>
    </div>
  )
}
