"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { getCurrencyForCountry } from "@/lib/currency"

export const COMMON_CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "MXN", name: "Mexican Peso", symbol: "MX$" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "DKK", name: "Danish Krone", symbol: "kr" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
]

interface CurrencyContextValue {
  detectedCountry: string | null
  detectedCurrency: string
  selectedCurrency: string | null
  setSelectedCurrency: (currency: string | null) => void
  displayCurrency: string
  convertPrice: (usdPrice: number, rate: number) => number
  allRates: Record<string, number>
  isDetecting: boolean
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

const EXCHANGE_RATE_CACHE_KEY = "framewise-exchange-rates"
const CACHE_DURATION_MS = 60 * 60 * 1000

interface CachedRates {
  rates: Record<string, number>
  timestamp: number
}

function getCountryFromLocale(): string | null {
  try {
    const locale = navigator.language || "en-US"
    const parts = locale.split("-")
    const countryCode = parts[parts.length - 1]?.toUpperCase()
    if (countryCode && countryCode.length === 2 && countryCode !== "US") {
      return countryCode
    }
  } catch {
    // ignore
  }
  return null
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null)
  const [rates, setRates] = useState<Record<string, number>>({})
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null)
  const [isDetecting, setIsDetecting] = useState(true)

  const detectedCurrency = detectedCountry ? getCurrencyForCountry(detectedCountry) : "USD"
  const displayCurrency = selectedCurrency || detectedCurrency

  useEffect(() => {
    async function detectAndLoad() {
      try {
        const cached = localStorage.getItem(EXCHANGE_RATE_CACHE_KEY)
        if (cached) {
          const parsed: CachedRates = JSON.parse(cached)
          if (Date.now() - parsed.timestamp < CACHE_DURATION_MS) {
            setRates(parsed.rates)
          }
        }

        const res = await fetch("/api/get-country", { cache: "no-store" })
        if (res.ok) {
          const data = await res.json()
          if (data.country && data.country !== "US") {
            setDetectedCountry(data.country)
            setIsDetecting(false)
            return
          }
        }
      } catch {
        // proceed to locale fallback
      }

      const localeCountry = getCountryFromLocale()
      if (localeCountry) {
        setDetectedCountry(localeCountry)
      }

      setIsDetecting(false)
    }

    detectAndLoad()
  }, [])

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD",
          { cache: "no-store" }
        )
        if (!res.ok) return

        const data = await res.json()
        if (data.rates) {
          setRates(data.rates)
          localStorage.setItem(
            EXCHANGE_RATE_CACHE_KEY,
            JSON.stringify({ rates: data.rates, timestamp: Date.now() })
          )
        }
      } catch {
        // Use cached rates or USD
      }
    }

    fetchRates()
  }, [])

  const convertPrice = useCallback(
    (usdPrice: number, _rate: number): number => {
      if (!displayCurrency || displayCurrency === "USD") return usdPrice
      const rate = rates[displayCurrency]
      if (!rate) return usdPrice
      const converted = usdPrice * rate
      return Math.round(converted * 100) / 100
    },
    [displayCurrency, rates]
  )

  return (
    <CurrencyContext.Provider
      value={{
        detectedCountry,
        detectedCurrency,
        selectedCurrency,
        setSelectedCurrency,
        displayCurrency,
        convertPrice,
        allRates: rates,
        isDetecting,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
