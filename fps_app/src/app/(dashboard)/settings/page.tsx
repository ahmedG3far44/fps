"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface Country {
  id: string
  code: string
  name: string
  currency: {
    id: string
    code: string
    name: string
    symbol: string
  } | null
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const [theme, setTheme] = useState("dark")
  const [countryId, setCountryId] = useState<string>("")
  const [currencyId, setCurrencyId] = useState<string>("")
  const [countries, setCountries] = useState<Country[]>([])
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSettings() {
      try {
        const [settingsRes, countriesRes] = await Promise.all([
          fetch("/api/settings"),
          fetch("/api/countries"),
        ])

        if (settingsRes.ok) {
          const settings = await settingsRes.json()
          setTheme(settings.theme ?? "dark")
          setCountryId(settings.countryId ?? "")
          setCurrencyId(settings.currencyId ?? "")
        }

        if (countriesRes.ok) {
          const data = await countriesRes.json()
          setCountries(data)
        }
      } catch {
        // Use defaults
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  async function handleSave() {
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme, countryId: countryId || null, currencyId: currencyId || null }),
    })
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <div className="rounded-xl border border-border bg-card p-6 max-w-lg">
          <div className="space-y-4">
            <div className="h-10 w-full animate-pulse rounded-lg bg-muted-background" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-muted-background" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-muted-background" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="rounded-xl border border-border bg-card p-6 space-y-6 max-w-lg">
        <div>
          <label className="block text-sm font-medium mb-1">Theme</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Region</label>
          <select
            value={countryId}
            onChange={(e) => {
              const selectedId = e.target.value
              setCountryId(selectedId)
              const selected = countries.find((c) => c.id === selectedId)
              if (selected?.currency) {
                setCurrencyId(selected.currency.id)
              }
            }}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">Auto-detect from IP</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name} ({country.code})
                {country.currency ? ` — ${country.currency.symbol} ${country.currency.code}` : ""}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted">
            Used for game price comparison. Leave empty to auto-detect from your location.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Language</label>
          <select
            defaultValue="en"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="en">English</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          {saved ? "Saved!" : "Save Settings"}
        </button>
      </div>
    </div>
  )
}
