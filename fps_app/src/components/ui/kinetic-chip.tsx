import { cn } from "@/lib/utils"

interface KineticChipProps {
  children: string
  variant?: "fps" | "status" | "hardware" | "info"
  className?: string
}

const variantStyles = {
  fps: "bg-primary-container/15 text-primary-container",
  status: "bg-green-500/15 text-green-400",
  hardware: "bg-hardware-gpu/15 text-hardware-gpu",
  info: "bg-surface-container-high text-on-surface-variant",
}

export function KineticChip({ children, variant = "info", className }: KineticChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-label-caps",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
