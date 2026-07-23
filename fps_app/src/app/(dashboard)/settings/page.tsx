"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { User, Monitor, MessageSquare, Globe } from "lucide-react"

interface Currency {
  id: string
  code: string
  name: string
  symbol: string
}

interface Country {
  id: string
  code: string
  name: string
  currency: Currency | null
}

interface ProfileData {
  id: string
  name: string | null
  email: string | null
  image: string | null
  country: { code: string } | null
  hardware: unknown | null
  _count: {
    searchHistory: number
    aiConversations: number
  }
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [countryId, setCountryId] = useState<string>("")
  const [countries, setCountries] = useState<Country[]>([])
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<ProfileData | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    if (status !== "authenticated") return

    async function loadData() {
      try {
        const [settingsRes, countriesRes, profileRes] = await Promise.all([
          fetch("/api/settings"),
          fetch("/api/countries"),
          fetch("/api/profile"),
        ])
        if (settingsRes.ok) {
          const settings = await settingsRes.json()
          setCountryId(settings.countryId ?? "")
        }
        if (countriesRes.ok) {
          const data = await countriesRes.json()
          setCountries(data)
        }
        if (profileRes.ok) {
          const data = await profileRes.json()
          setProfile(data)
        }
      } catch {
        // defaults
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [status, router])

  async function handleSave() {
    const selected = countries.find((c) => c.id === countryId)
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        countryId: countryId || null,
        currencyId: selected?.currency?.id || null,
      }),
    })
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const selectedCountry = countries.find((c) => c.id === countryId)

  if (loading) {
    return (
      <div className="space-y-6 md:space-y-8">
        <h1 className="text-headline-md">Settings</h1>
        <div className="kinetic-card p-6 max-w-lg">
          <div className="h-10 w-full animate-pulse rounded-lg bg-surface-container-high" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <h1 className="text-headline-md">Settings</h1>

      {profile && (
        <div className="kinetic-card p-4 md:p-6 space-y-4 md:space-y-6">
          <div className="flex items-center gap-4">
            <div className="size-14 md:size-16 rounded-full bg-primary-container/10 flex items-center justify-center text-xl font-bold text-primary-container shrink-0">
              {(profile.name || "U")[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="text-headline-sm truncate">{profile.name || "Unnamed"}</h2>
              <p className="text-sm text-on-surface-variant truncate">{profile.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <StatCard icon={MessageSquare} value={profile._count.aiConversations} label="AI Chats" />
            <StatCard icon={Monitor} value={profile.hardware ? 1 : 0} label="PC Profiles" />
            <StatCard icon={Globe} value={profile.country?.code || "--"} label="Country" />
          </div>
        </div>
      )}

      <div className="kinetic-card p-4 md:p-6 space-y-6 max-w-lg">
        <div>
          <label className="text-label-caps text-on-surface-variant block mb-1.5">Region</label>
          <select
            value={countryId}
            onChange={(e) => setCountryId(e.target.value)}
            className="kinetic-input w-full appearance-none"
          >
            <option value="" className="bg-surface">Auto-detect from IP</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id} className="bg-surface">
                {country.name} ({country.code})
                {country.currency ? ` ${country.currency.symbol} ${country.currency.code}` : ""}
              </option>
            ))}
          </select>
          {selectedCountry?.currency && (
            <p className="mt-1 text-xs text-on-surface-variant">
              Currency: {selectedCountry.currency.symbol} {selectedCountry.currency.code}
            </p>
          )}
        </div>

        <button onClick={handleSave} className="kinetic-btn-primary">
          {saved ? "Saved!" : "Save Settings"}
        </button>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, value, label }: { icon: React.ComponentType<{ className?: string }>; value: string | number; label: string }) {
  return (
    <div className="rounded-lg bg-surface-container-low p-3 md:p-4 text-center">
      <Icon className="size-4 mx-auto mb-1 text-on-surface-variant" />
      <p className="text-data-mono-lg text-primary-container">{value}</p>
      <p className="text-label-caps text-on-surface-variant mt-0.5">{label}</p>
    </div>
  )
}
