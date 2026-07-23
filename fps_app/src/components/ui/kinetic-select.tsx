"use client"

import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface KineticSelectProps {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  className?: string
}

export function KineticSelect({ value, onChange, options, placeholder, className }: KineticSelectProps) {
  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="kinetic-input w-full appearance-none pr-8 cursor-pointer"
      >
        {placeholder && <option value="" className="bg-surface">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-surface">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant pointer-events-none" />
    </div>
  )
}
