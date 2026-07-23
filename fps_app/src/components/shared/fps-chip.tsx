import { cn, getFPSBgColor, getFPSLabel } from "@/lib/utils"

interface FPSChipProps {
  fps: number
  className?: string
}

export function FPSChip({ fps, className }: FPSChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-label-caps text-white",
        getFPSBgColor(fps),
        className,
      )}
    >
      {fps} FPS - {getFPSLabel(fps)}
    </span>
  )
}
