interface CacheEntry<T> {
  data: T
  expiresAt: number
}

export class TTLCache<T> {
  private cache = new Map<string, CacheEntry<T>>()
  private defaultTTL: number

  constructor(defaultTTLMs: number = 12 * 60 * 60 * 1000) {
    this.defaultTTL = defaultTTLMs
  }

  get(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }
    return entry.data
  }

  set(key: string, data: T, ttlMs?: number): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + (ttlMs ?? this.defaultTTL),
    })
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }
}

import type { CheapSharkStore } from "@/types/game-pricing"

export const shopCache = new TTLCache<CheapSharkStore[]>(
  24 * 60 * 60 * 1000
)
