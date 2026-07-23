import { cn, getFPSLabel } from "@/lib/utils"

interface KineticFPSGaugeProps {
  fps: number
  className?: string
  showLabel?: boolean
}

function getFPSColor(fps: number): string {
  if (fps >= 120) return "bg-fps-excellent"
  if (fps >= 90) return "bg-fps-high"
  if (fps >= 60) return "bg-fps-good"
  if (fps >= 30) return "bg-fps-playable"
  return "bg-fps-poor"
}

function getFPSFill(fps: number): number {
  if (fps >= 144) return 100
  if (fps <= 0) return 0
  return Math.round((fps / 144) * 100)
}

const tierColors: Record<string, string> = {
  excellent: "text-fps-excellent",
  high: "text-fps-high",
  good: "text-fps-good",
  playable: "text-fps-playable",
  poor: "text-fps-poor",
}

function getFPSLabelColor(fps: number): string {
  if (fps >= 120) return tierColors.excellent
  if (fps >= 90) return tierColors.high
  if (fps >= 60) return tierColors.good
  if (fps >= 30) return tierColors.playable
  return tierColors.poor
}

export function KineticFPSGauge({ fps, className, showLabel = true }: KineticFPSGaugeProps) {
  const fill = getFPSFill(fps)
  const barColor = getFPSColor(fps)
  const labelColor = getFPSLabelColor(fps)
  const label = getFPSLabel(fps)

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className={cn("text-data-mono-lg tabular-nums", labelColor)}>
        {fps}
        <span className="text-xs text-on-surface-variant ml-0.5">FPS</span>
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", barColor)}
          style={{ width: `${fill}%` }}
        />
      </div>
      {showLabel && (
        <span className={cn("text-label-caps", labelColor)}>{label}</span>
      )}
    </div>
  )
}
