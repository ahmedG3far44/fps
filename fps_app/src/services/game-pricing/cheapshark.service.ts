import { cache } from "react"
import type { CheapSharkStore, CheapSharkGameSearchResult, CheapSharkGameLookup } from "@/types/game-pricing"
import { shopCache } from "./cache"

const BASE_URL = "https://www.cheapshark.com/api/1.0"
const IMAGE_BASE = "https://www.cheapshark.com"
const USER_AGENT = "FrameWiseAI/1.0 (https://framewise.ai)"

export const getStores = cache(async (): Promise<CheapSharkStore[]> => {
  const cached = shopCache.get("all")
  if (cached) return cached

  const url = `${BASE_URL}/stores`
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } })

  if (!res.ok) {
    console.error(`CheapShark stores fetch failed: ${res.status}`)
    return []
  }

  const data: CheapSharkStore[] = await res.json()
  shopCache.set("all", data, 24 * 60 * 60 * 1000)
  return data
})

function sanitizeTitle(title: string): string {
  return title
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function normalizeForComparison(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

const STOP_WORDS = new Set(["the", "a", "an", "of", "for", "and", "or", "in", "on", "at", "to", "is", "it"])

function titleSimilarity(searchTitle: string, candidateTitle: string): number {
  const normSearch = normalizeForComparison(searchTitle)
  const normCandidate = normalizeForComparison(candidateTitle)

  if (normSearch === normCandidate) return 1
  if (normSearch.includes(normCandidate) || normCandidate.includes(normSearch)) return 0.9

  const searchWords = normSearch.split(" ").filter((w) => w.length > 1 && !STOP_WORDS.has(w))
  const candidateWords = normCandidate.split(" ").filter((w) => w.length > 1 && !STOP_WORDS.has(w))

  if (searchWords.length === 0 || candidateWords.length === 0) return 0

  let matches = 0
  for (const sw of searchWords) {
    for (const cw of candidateWords) {
      if (sw === cw || sw.includes(cw) || cw.includes(sw)) {
        matches++
        break
      }
    }
  }

  return matches / Math.max(searchWords.length, candidateWords.length)
}

function isGoodMatch(searchTitle: string, candidateTitle: string): boolean {
  return titleSimilarity(searchTitle, candidateTitle) >= 0.6
}

async function trySearch(query: string): Promise<CheapSharkGameSearchResult | null> {
  const url = `${BASE_URL}/games?title=${encodeURIComponent(query)}&limit=1`
  const res = await fetch(url, { cache: "no-store", headers: { "User-Agent": USER_AGENT } })

  if (!res.ok) {
    if (res.status !== 404) {
      const body = await res.text().catch(() => "")
      console.error(`CheapShark search failed [${res.status}] for "${query}": ${body.slice(0, 200)}`)
    }
    return null
  }

  const data: CheapSharkGameSearchResult[] = await res.json()
  return data[0] ?? null
}

async function searchWithValidation(query: string, originalTitle: string): Promise<CheapSharkGameSearchResult | null> {
  const url = `${BASE_URL}/games?title=${encodeURIComponent(query)}&limit=10`
  const res = await fetch(url, { cache: "no-store", headers: { "User-Agent": USER_AGENT } })

  if (!res.ok) {
    if (res.status !== 404) {
      const body = await res.text().catch(() => "")
      console.error(`CheapShark search failed [${res.status}] for "${query}": ${body.slice(0, 200)}`)
    }
    return null
  }

  const data: CheapSharkGameSearchResult[] = await res.json()
  if (data.length === 0) return null

  let bestMatch: CheapSharkGameSearchResult | null = null
  let bestScore = 0

  for (const game of data) {
    const externalName = game.external || ""
    const internalName = game.internalName || ""
    const score = Math.max(
      titleSimilarity(originalTitle, externalName),
      titleSimilarity(originalTitle, internalName)
    )
    if (score > bestScore) {
      bestScore = score
      bestMatch = game
    }
  }

  if (bestScore >= 0.6 && bestMatch) {
    return bestMatch
  }

  return null
}

export const searchGame = cache(async (title: string): Promise<CheapSharkGameSearchResult | null> => {
  const cleanTitle = sanitizeTitle(title)
  if (!cleanTitle) return null

  let result = await searchWithValidation(cleanTitle, title)
  if (result) return result

  const words = cleanTitle.split(/\s+/)
  if (words.length > 2) {
    const shorter = words.slice(0, 2).join(" ")
    result = await searchWithValidation(shorter, title)
    if (result) return result
  }

  if (words.length > 1) {
    result = await searchWithValidation(words[0], title)
    if (result) return result
  }

  result = await trySearch(cleanTitle)
  return result
})

export const getGameDeals = cache(async (gameId: string): Promise<CheapSharkGameLookup | null> => {
  const url = `${BASE_URL}/games?id=${gameId}`
  const res = await fetch(url, { cache: "no-store", headers: { "User-Agent": USER_AGENT } })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    console.error(`CheapShark game lookup failed for ${gameId}: ${res.status} - ${body.slice(0, 200)}`)
    return null
  }

  return res.json()
})

export function getStoreLogoUrl(store: CheapSharkStore): string {
  return `${IMAGE_BASE}${store.images.logo}`
}
