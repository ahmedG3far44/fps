import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface KineticCardProps {
  children: ReactNode
  className?: string
  hardware?: "cpu" | "gpu" | "vram" | null
  onClick?: () => void
}

const hardwareBorderMap = {
  cpu: "border-t-hardware-cpu",
  gpu: "border-t-hardware-gpu",
  vram: "border-t-hardware-vram",
}

export function KineticCard({ children, className, hardware, onClick }: KineticCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "kinetic-card p-4",
        hardware && "kinetic-card-hardware border-t-2",
        hardware && hardwareBorderMap[hardware],
        onClick && "cursor-pointer hover:bg-surface-container-high transition-colors",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function KineticCardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-between mb-3", className)}>
      {children}
    </div>
  )
}
