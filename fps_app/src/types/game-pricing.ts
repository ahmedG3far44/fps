export type StoreType = "OFFICIAL" | "AUTHORIZED_RESELLER"

export interface StoreDTO {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  type: StoreType
}

export interface GamePriceDTO {
  id: string
  store: StoreDTO
  countryCode: string
  currency: string
  currentPrice: number
  originalPrice: number | null
  discount: number | null
  buyUrl: string
  isBestDeal: boolean
}

export interface GamePricesResponse {
  bestDeal: GamePriceDTO | null
  officialStores: GamePriceDTO[]
  authorizedResellers: GamePriceDTO[]
}

export interface CheapSharkStore {
  storeID: string
  storeName: string
  isActive: number
  images: {
    banner: string
    logo: string
    icon: string
  }
}

export interface CheapSharkGameSearchResult {
  gameID: string
  steamAppID: string | null
  cheapest: string
  cheapestDealID: string
  external: string
  internalName: string
  thumb: string
}

export interface CheapSharkDeal {
  storeID: string
  dealID: string
  price: string
  retailPrice: string
  savings: string
}

export interface CheapSharkGameLookup {
  info: {
    title: string
    steamAppID: string | null
    thumb: string
  }
  cheapestPriceEver: {
    price: string
    date: number
  } | null
  deals: CheapSharkDeal[]
}
