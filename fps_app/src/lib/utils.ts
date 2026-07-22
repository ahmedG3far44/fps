import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFPS(fps: number): string {
  return `${fps} FPS`
}

export function getFPSColor(fps: number): string {
  if (fps >= 60) return "text-green-500"
  if (fps >= 30) return "text-yellow-500"
  return "text-red-500"
}

export function getFPSBgColor(fps: number): string {
  if (fps >= 60) return "bg-green-500"
  if (fps >= 30) return "bg-yellow-500"
  return "bg-red-500"
}

export function getFPSLabel(fps: number): string {
  if (fps >= 60) return "Stable"
  if (fps >= 30) return "Unstable"
  return "Critical"
}

export function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-")
}
