import { cn, getFPSBgColor, formatFPS } from "@/lib/utils"

interface PerformanceBarProps {
  fps: number
  label: string
  maxFps?: number
}

export function PerformanceBar({ fps, label, maxFps = 240 }: PerformanceBarProps) {
  const width = Math.min((fps / maxFps) * 100, 100)

  return (
    <div className="flex items-center gap-4">
      <span className="w-20 text-sm text-muted">{label}</span>
      <div className="flex-1 h-4 rounded-full bg-muted-background overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", getFPSBgColor(fps))}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="w-20 text-right text-sm font-medium">{formatFPS(fps)}</span>
    </div>
  )
}
