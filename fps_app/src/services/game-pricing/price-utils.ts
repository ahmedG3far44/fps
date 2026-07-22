import type { GamePriceDTO, StoreType } from "@/types/game-pricing"

export function sortPricesByPriceAsc(prices: GamePriceDTO[]): GamePriceDTO[] {
  return [...prices].sort((a, b) => a.currentPrice - b.currentPrice)
}

export function findBestDeal(prices: GamePriceDTO[]): GamePriceDTO | null {
  if (prices.length === 0) return null
  return sortPricesByPriceAsc(prices)[0]
}

export function filterByStoreType(
  prices: GamePriceDTO[],
  type: StoreType
): GamePriceDTO[] {
  return prices
    .filter((p) => p.store.type === type)
    .sort((a, b) => a.currentPrice - b.currentPrice)
}

export function calculateDiscount(
  currentPrice: number,
  originalPrice: number | null
): number | null {
  if (originalPrice === null || originalPrice <= 0) return null
  if (currentPrice >= originalPrice) return null
  return Math.round((1 - currentPrice / originalPrice) * 100)
}

export function groupByStoreType(
  prices: GamePriceDTO[]
): { official: GamePriceDTO[]; authorized: GamePriceDTO[] } {
  return {
    official: filterByStoreType(prices, "OFFICIAL"),
    authorized: filterByStoreType(prices, "AUTHORIZED_RESELLER"),
  }
}
