import { cache } from "react"
import { prisma } from "@/lib/prisma"
import type { GamePricesResponse, GamePriceDTO, CheapSharkStore } from "@/types/game-pricing"
import { getStores, searchGame, getGameDeals } from "./cheapshark.service"
import { isSupportedStore, mapDealToPriceDTO } from "./cheapshark.mapper"
import { findBestDeal, filterByStoreType, sortPricesByPriceAsc } from "./price-utils"

const SUPPORTED_COUNTRIES = new Set([
  "US", "GB", "DE", "FR", "IT", "ES", "NL", "BE", "AT", "CH",
  "SE", "NO", "DK", "FI", "PL", "CZ", "PT", "IE", "HU", "RO",
  "GR", "SK", "BG", "HR", "LT", "SI", "LV", "EE", "CY", "MT",
  "LU", "CA", "AU", "NZ", "JP", "KR", "BR", "MX", "AR", "CL",
  "CO", "PE", "ZA", "TR", "RU", "IN", "ID", "MY", "PH", "SG",
  "TH", "VN", "CN", "TW", "HK", "IL", "SA", "AE", "QA", "KW",
  "OM", "BH", "JO", "LB", "EG", "MA", "TN", "DZ",
])

const DEFAULT_COUNTRY = "US"

function resolveCountry(userCountry: string | null | undefined): string {
  if (userCountry && SUPPORTED_COUNTRIES.has(userCountry.toUpperCase())) {
    return userCountry.toUpperCase()
  }
  return DEFAULT_COUNTRY
}

async function getPricesFromCheapShark(
  cheapSharkGameId: string,
  _country: string
): Promise<GamePricesResponse> {
  const [stores, gameData] = await Promise.all([
    getStores(),
    getGameDeals(cheapSharkGameId),
  ])

  if (!gameData || !gameData.deals || gameData.deals.length === 0) {
    return { bestDeal: null, officialStores: [], authorizedResellers: [] }
  }

  const storeMap = new Map<string, CheapSharkStore>()
  for (const store of stores) {
    storeMap.set(store.storeID, store)
  }

  const dtoMap = new Map<string, GamePriceDTO>()

  for (const deal of gameData.deals) {
    const store = storeMap.get(deal.storeID)
    if (!store || !isSupportedStore(deal.storeID)) continue

    const dto = mapDealToPriceDTO(deal, store, false)
    if (dto) {
      const key = `${deal.storeID}-${dto.currency}`
      const existing = dtoMap.get(key)
      if (!existing || dto.currentPrice < existing.currentPrice) {
        dtoMap.set(key, dto)
      }
    }
  }

  const allPrices = sortPricesByPriceAsc(Array.from(dtoMap.values()))
  const bestDeal = findBestDeal(allPrices)

  if (bestDeal) {
    const match = allPrices.find((p) => p.store.slug === bestDeal.store.slug)
    if (match) match.isBestDeal = true
  }

  return {
    bestDeal: bestDeal ? { ...bestDeal, isBestDeal: true } : null,
    officialStores: filterByStoreType(allPrices, "OFFICIAL"),
    authorizedResellers: filterByStoreType(allPrices, "AUTHORIZED_RESELLER"),
  }
}

export const getGamePrices = cache(
  async (
    gameOrTitle: { gameId: string } | { gameTitle: string },
    country: string | null = null
  ): Promise<GamePricesResponse> => {
    const resolvedCountry = resolveCountry(country)

    let title: string
    let cheapSharkGameId: string | null = null
    let isFree = false

    if ("gameId" in gameOrTitle) {
      const game = await prisma.game.findUnique({
        where: { id: gameOrTitle.gameId },
        select: { title: true, isFree: true },
      })

      if (!game || game.isFree) {
        return { bestDeal: null, officialStores: [], authorizedResellers: [] }
      }

      title = game.title
      isFree = game.isFree

      const result = await searchGame(title)
      cheapSharkGameId = result?.gameID ?? null
    } else {
      title = gameOrTitle.gameTitle
      const result = await searchGame(title)
      cheapSharkGameId = result?.gameID ?? null
    }

    if (isFree || !cheapSharkGameId) {
      return { bestDeal: null, officialStores: [], authorizedResellers: [] }
    }

    return getPricesFromCheapShark(cheapSharkGameId, resolvedCountry)
  }
)

export type GetGamePricesFn = typeof getGamePrices
