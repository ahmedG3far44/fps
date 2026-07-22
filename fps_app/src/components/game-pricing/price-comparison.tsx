import { getGamePrices } from "@/services/game-pricing/game-pricing.service"
import { PriceError } from "./price-error"
import { PriceComparisonWrapper } from "./price-comparison-wrapper"
import { CurrencyProvider } from "@/contexts/currency-context"

interface PriceComparisonProps {
  gameId?: string
  gameTitle: string
  isFree?: boolean
  country?: string | null
}

export async function PriceComparison({ gameId, gameTitle, isFree, country }: PriceComparisonProps) {
  if (isFree) {
    return (
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
            <svg className="size-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold">Price Comparison</h2>
        </div>
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-8 text-center">
          <p className="text-lg font-medium text-green-400">
            This game is free to play
          </p>
          <p className="mt-1 text-sm text-muted">
            No purchase required — download and start playing now
          </p>
        </div>
      </section>
    )
  }

  let prices
  try {
    const input = gameId ? { gameId } : { gameTitle }
    prices = await getGamePrices(input, country ?? null)
  } catch {
    return <PriceError />
  }

  const { bestDeal, officialStores, authorizedResellers } = prices
  const hasAnyPrices =
    bestDeal !== null ||
    officialStores.length > 0 ||
    authorizedResellers.length > 0

  if (!hasAnyPrices) {
    return (
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted-background">
            <svg className="size-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold">Price Comparison</h2>
        </div>
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-muted">
            No official prices currently available for this title.
          </p>
        </div>
      </section>
    )
  }

  return (
    <CurrencyProvider>
      <PriceComparisonWrapper prices={prices} />
    </CurrencyProvider>
  )
}
