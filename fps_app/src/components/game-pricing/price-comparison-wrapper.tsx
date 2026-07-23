"use client"

import { useCallback } from "react"
import type { GamePricesResponse, GamePriceDTO } from "@/types/game-pricing"
import { useCurrency } from "@/contexts/currency-context"
import { formatPrice } from "@/lib/utils"
import { getCurrencyForCountry, getCurrencySymbol } from "@/lib/currency"

const COUNTRY_NAMES: Record<string, string> = {
  US: "United States", GB: "United Kingdom", DE: "Germany", FR: "France",
  IT: "Italy", ES: "Spain", NL: "Netherlands", BE: "Belgium", AT: "Austria",
  CH: "Switzerland", SE: "Sweden", NO: "Norway", DK: "Denmark", FI: "Finland",
  PL: "Poland", CZ: "Czech Republic", PT: "Portugal", IE: "Ireland",
  HU: "Hungary", RO: "Romania", GR: "Greece", BG: "Bulgaria", HR: "Croatia",
  LT: "Lithuania", SI: "Slovenia", LV: "Latvia", EE: "Estonia", CY: "Cyprus",
  MT: "Malta", LU: "Luxembourg", CA: "Canada", AU: "Australia", NZ: "New Zealand",
  JP: "Japan", KR: "South Korea", BR: "Brazil", MX: "Mexico", AR: "Argentina",
  CL: "Chile", CO: "Colombia", PE: "Peru", ZA: "South Africa", TR: "Turkey",
  RU: "Russia", IN: "India", ID: "Indonesia", MY: "Malaysia", PH: "Philippines",
  SG: "Singapore", TH: "Thailand", VN: "Vietnam", CN: "China", TW: "Taiwan",
  HK: "Hong Kong", IL: "Israel", SA: "Saudi Arabia", AE: "UAE", QA: "Qatar",
  KW: "Kuwait", OM: "Oman", BH: "Bahrain", JO: "Jordan", LB: "Lebanon",
  EG: "Egypt", MA: "Morocco", TN: "Tunisia", DZ: "Algeria", IS: "Iceland",
  UA: "Ukraine", NG: "Nigeria", KE: "Kenya", PK: "Pakistan", BD: "Bangladesh",
  LK: "Sri Lanka", UY: "Uruguay", PY: "Paraguay", BO: "Bolivia",
}

interface PriceComparisonWrapperProps {
  prices: GamePricesResponse
  country: string | null
}

function ConvertedPriceCard({ price, convertPrice, targetCurrency }: {
  price: GamePriceDTO
  convertPrice: (usd: number) => number
  targetCurrency: string
}) {
  const convertedCurrent = convertPrice(price.currentPrice)
  const convertedOriginal = price.originalPrice !== null ? convertPrice(price.originalPrice) : null
  const convertedSavings = convertedOriginal !== null ? convertedOriginal - convertedCurrent : null

  return (
    <a
      href={price.buyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
      aria-label={`Buy ${price.store.name} for ${formatPrice(convertedCurrent, targetCurrency)}`}
    >
      <div className="relative shrink-0">
        <div className="flex size-12 items-center justify-center rounded-lg bg-muted-background ring-1 ring-white/5">
          {price.store.logoUrl ? (
            <img
              src={price.store.logoUrl}
              alt={`${price.store.name} logo`}
              className="size-8 object-contain"
              loading="lazy"
            />
          ) : (
            <span className="text-sm font-bold text-muted">
              {price.store.name.charAt(0)}
            </span>
          )}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-foreground">
            {price.store.name}
          </span>
          <span className="shrink-0 rounded-full border border-border px-1.5 py-0.5 text-[9px] font-medium text-muted">
            {price.store.type === "OFFICIAL" ? "Official" : "Reseller"}
          </span>
        </div>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-base font-semibold tabular-nums text-foreground">
            {formatPrice(convertedCurrent, targetCurrency)}
          </span>
          {convertedOriginal !== null && (
            <span className="text-xs text-muted line-through">
              {formatPrice(convertedOriginal, targetCurrency)}
            </span>
          )}
        </div>

        {(price.discount !== null || convertedSavings !== null) && (
          <div className="mt-1 flex items-center gap-2">
            {price.discount !== null && price.discount > 0 && (
              <span className="text-xs font-medium text-green-400">
                -{price.discount}%
              </span>
            )}
            {convertedSavings !== null && convertedSavings > 0 && (
              <span className="text-xs text-muted">
                Save {formatPrice(convertedSavings, targetCurrency)}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="hidden shrink-0 sm:flex sm:items-center">
        <span className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted transition-all group-hover:border-primary/50 group-hover:text-primary">
          Buy
          <svg className="size-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </span>
      </div>
    </a>
  )
}

function ConvertedBestDealCard({ price, convertPrice, targetCurrency }: {
  price: GamePriceDTO
  convertPrice: (usd: number) => number
  targetCurrency: string
}) {
  const convertedCurrent = convertPrice(price.currentPrice)
  const convertedOriginal = price.originalPrice !== null ? convertPrice(price.originalPrice) : null
  const convertedSavings = convertedOriginal !== null ? convertedOriginal - convertedCurrent : null

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card shadow-lg shadow-primary/5 transition-all hover:shadow-xl hover:shadow-primary/10">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <div className="flex size-16 items-center justify-center rounded-xl bg-card shadow-sm ring-1 ring-white/10">
                {price.store.logoUrl ? (
                  <img
                    src={price.store.logoUrl}
                    alt={`${price.store.name} logo`}
                    className="size-10 object-contain"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-xl font-bold text-muted">
                    {price.store.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full bg-primary shadow-sm">
                <svg className="size-3.5 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xl font-semibold text-foreground">
                  {price.store.name}
                </span>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  Best Price
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-bold tabular-nums text-foreground">
                  {formatPrice(convertedCurrent, targetCurrency)}
                </span>
                {convertedOriginal !== null && (
                  <span className="text-base text-muted line-through">
                    {formatPrice(convertedOriginal, targetCurrency)}
                  </span>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                {price.discount !== null && price.discount > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-400">
                    <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    {price.discount}% off
                  </span>
                )}
                {convertedSavings !== null && convertedSavings > 0 && (
                  <span className="text-xs text-green-400/70">
                    You save {formatPrice(convertedSavings, targetCurrency)}
                  </span>
                )}
                <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted">
                  {price.store.type === "OFFICIAL" ? "Official Store" : "Authorized Reseller"}
                </span>
              </div>
            </div>
          </div>

          <a
            href={price.buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md active:scale-[0.98]"
            aria-label={`Buy now on ${price.store.name} for ${formatPrice(convertedCurrent, targetCurrency)}`}
          >
            Buy Now
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

function ConvertedStoreSection({ title, prices, icon, convertPrice, targetCurrency }: {
  title: string
  prices: GamePriceDTO[]
  icon: "official" | "reseller"
  convertPrice: (usd: number) => number
  targetCurrency: string
}) {
  if (prices.length === 0) return null

  return (
    <section>
      <div className="mb-3 flex items-center gap-2.5">
        <div className={`flex size-7 items-center justify-center rounded-md ${icon === "official" ? "bg-primary/10" : "bg-amber-500/10"}`}>
          {icon === "official" ? (
            <svg className="size-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          ) : (
            <svg className="size-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.15c0 .415.336.75.75.75z" />
            </svg>
          )}
        </div>
        <h3 className="text-sm font-medium text-foreground">
          {title}
        </h3>
        <span className="rounded-full bg-muted-background px-2 py-0.5 text-[10px] font-medium text-muted">
          {prices.length}
        </span>
      </div>
      <div className="space-y-2">
        {prices.map((price) => (
          <ConvertedPriceCard
            key={`${price.store.slug}-${price.currency}`}
            price={price}
            convertPrice={convertPrice}
            targetCurrency={targetCurrency}
          />
        ))}
      </div>
    </section>
  )
}

export function PriceComparisonWrapper({ prices, country }: PriceComparisonWrapperProps) {
  const { detectedCountry, allRates } = useCurrency()
  const { bestDeal, officialStores, authorizedResellers } = prices

  const effectiveCountry = country || detectedCountry
  const displayCurrency = effectiveCountry ? getCurrencyForCountry(effectiveCountry) : "USD"
  const currencySymbol = getCurrencySymbol(displayCurrency)
  const countryName = effectiveCountry ? COUNTRY_NAMES[effectiveCountry] : null

  const convertPrice = useCallback(
    (usdPrice: number): number => {
      if (displayCurrency === "USD") return usdPrice
      const rate = allRates[displayCurrency]
      if (!rate) return usdPrice
      return Math.round(usdPrice * rate * 100) / 100
    },
    [displayCurrency, allRates]
  )

  const totalStores = (bestDeal ? 1 : 0) + officialStores.length + authorizedResellers.length

  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <svg className="size-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Price Comparison</h2>
            <p className="text-sm text-muted">
              Found at {totalStores} {totalStores === 1 ? "store" : "stores"}
            </p>
          </div>
        </div>

        {effectiveCountry && (
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted">
            <span>{countryName || effectiveCountry}</span>
            <span className="text-muted-foreground">•</span>
            <span>{currencySymbol} {displayCurrency}</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {bestDeal && (
          <ConvertedBestDealCard
            price={bestDeal}
            convertPrice={convertPrice}
            targetCurrency={displayCurrency}
          />
        )}

        {officialStores.length > 0 && (
          <ConvertedStoreSection
            title="Official Stores"
            prices={officialStores}
            icon="official"
            convertPrice={convertPrice}
            targetCurrency={displayCurrency}
          />
        )}

        {authorizedResellers.length > 0 && (
          <ConvertedStoreSection
            title="Authorized Resellers"
            prices={authorizedResellers}
            icon="reseller"
            convertPrice={convertPrice}
            targetCurrency={displayCurrency}
          />
        )}
      </div>
    </section>
  )
}
