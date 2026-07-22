import type { CheapSharkStore, CheapSharkDeal, GamePriceDTO, StoreDTO, StoreType } from "@/types/game-pricing"

const OFFICIAL_STORE_IDS = new Set(["1", "7", "8", "13", "25"])

const AUTHORIZED_RESELLER_IDS = new Set(["3", "11", "15", "27"])

const STORE_INFO: Record<string, { name: string; slug: string; type: StoreType }> = {
  "1":  { name: "Steam",             slug: "steam",              type: "OFFICIAL" },
  "3":  { name: "Green Man Gaming",  slug: "green-man-gaming",   type: "AUTHORIZED_RESELLER" },
  "7":  { name: "GOG",               slug: "gog",                type: "OFFICIAL" },
  "8":  { name: "EA App",            slug: "ea-app",             type: "OFFICIAL" },
  "11": { name: "Humble Bundle",     slug: "humble-bundle",      type: "AUTHORIZED_RESELLER" },
  "13": { name: "Ubisoft Connect",   slug: "ubisoft-connect",    type: "OFFICIAL" },
  "15": { name: "Fanatical",         slug: "fanatical",          type: "AUTHORIZED_RESELLER" },
  "25": { name: "Epic Games Store",  slug: "epic-games-store",   type: "OFFICIAL" },
  "27": { name: "Gamesplanet",       slug: "gamesplanet",        type: "AUTHORIZED_RESELLER" },
}

export function isSupportedStore(storeId: string): boolean {
  return storeId in STORE_INFO
}

export function mapStoreToDTO(store: CheapSharkStore): StoreDTO | null {
  const info = STORE_INFO[store.storeID]
  if (!info) return null

  return {
    id: store.storeID,
    name: info.name,
    slug: info.slug,
    logoUrl: `https://www.cheapshark.com${store.images.logo}`,
    type: info.type,
  }
}

export function mapDealToPriceDTO(
  deal: CheapSharkDeal,
  store: CheapSharkStore,
  isBestDeal: boolean
): GamePriceDTO | null {
  const info = STORE_INFO[deal.storeID]
  if (!info) return null

  const currentPrice = parseFloat(deal.price)
  const retailPrice = parseFloat(deal.retailPrice)
  const savings = parseFloat(deal.savings)

  if (isNaN(currentPrice)) return null

  const discount = !isNaN(savings) && savings > 0 ? Math.round(savings) : null
  const originalPrice = !isNaN(retailPrice) && retailPrice > currentPrice ? retailPrice : null

  return {
    id: `${deal.dealID}`,
    store: {
      id: store.storeID,
      name: info.name,
      slug: info.slug,
      logoUrl: `https://www.cheapshark.com${store.images.logo}`,
      type: info.type,
    },
    countryCode: "US",
    currency: "USD",
    currentPrice,
    originalPrice,
    discount,
    buyUrl: `https://www.cheapshark.com/redirect?dealID=${deal.dealID}`,
    isBestDeal,
  }
}
