"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { GameCard } from "@/components/shared/game-card"
import { KineticSelect } from "@/components/ui/kinetic-select"
import { Search, Filter } from "lucide-react"

interface RawgGame {
  id: number
  slug: string
  name: string
  released: string | null
  background_image: string | null
  rating: number
  genres: { name: string; slug: string }[]
  metacritic: number | null
}

const GENRES = [
  { value: "", label: "All Genres" },
  { value: "action", label: "Action" },
  { value: "adventure", label: "Adventure" },
  { value: "rpg", label: "RPG" },
  { value: "strategy", label: "Strategy" },
  { value: "simulation", label: "Simulation" },
  { value: "sports", label: "Sports" },
  { value: "racing", label: "Racing" },
  { value: "fighting", label: "Fighting" },
  { value: "puzzle", label: "Puzzle" },
  { value: "platformer", label: "Platformer" },
  { value: "shooter", label: "Shooter" },
  { value: "indie", label: "Indie" },
  { value: "arcade", label: "Arcade" },
  { value: "casual", label: "Casual" },
  { value: "horror", label: "Horror" },
]

const RATINGS = [
  { value: "", label: "Any Rating" },
  { value: "90,100", label: "90+" },
  { value: "80,100", label: "80+" },
  { value: "70,100", label: "70+" },
  { value: "60,100", label: "60+" },
  { value: "0,59", label: "Below 60" },
]

const PUBLISHERS = [
  { value: "", label: "All Publishers" },
  { value: "electronic-arts", label: "Electronic Arts" },
  { value: "ubisoft", label: "Ubisoft" },
  { value: "activision", label: "Activision" },
  { value: "take-two-interactive", label: "Take-Two Interactive" },
  { value: "microsoft", label: "Microsoft" },
  { value: "sony", label: "Sony" },
  { value: "nintendo", label: "Nintendo" },
  { value: "square-enix", label: "Square Enix" },
  { value: "sega", label: "Sega" },
  { value: "capcom", label: "Capcom" },
  { value: "bandai-namco", label: "Bandai Namco" },
  { value: "konami", label: "Konami" },
  { value: "bethesda", label: "Bethesda" },
  { value: "2k-games", label: "2K Games" },
  { value: "rockstar-games", label: "Rockstar Games" },
  { value: "blizzard-entertainment", label: "Blizzard" },
  { value: "epic-games", label: "Epic Games" },
  { value: "valve", label: "Valve" },
  { value: "cd-projekt", label: "CD Projekt" },
  { value: "warner-bros", label: "Warner Bros" },
  { value: "deep-silver", label: "Deep Silver" },
  { value: "thq-nordic", label: "THQ Nordic" },
  { value: "paradox-interactive", label: "Paradox Interactive" },
  { value: "focus-home", label: "Focus Home" },
  { value: "devolver-digital", label: "Devolver Digital" },
  { value: "team17", label: "Team17" },
  { value: "raw-fury", label: "Raw Fury" },
  { value: "annapurna-interactive", label: "Annapurna Interactive" },
  { value: "coffee-stain", label: "Coffee Stain" },
  { value: "tinybuild", label: "TinyBuild" },
  { value: "kadokawa", label: "Kadokawa" },
  { value: "atlus", label: "Atlus" },
  { value: "kairosoft", label: "Kairosoft" },
  { value: "sega-publishing", label: "Sega Publishing" },
  { value: "marvelous", label: "Marvelous" },
  { value: "505-games", label: "505 Games" },
  { value: "headup-games", label: "Headup Games" },
  { value: "galactic-cafe", label: "Galactic Cafe" },
]

const currentYear = new Date().getFullYear()
const YEARS = [
  { value: "", label: "All Years" },
  ...Array.from({ length: currentYear - 1989 }, (_, i) => {
    const y = String(currentYear - i)
    return { value: y, label: y }
  }),
]

export default function GamesPage() {
  const [games, setGames] = useState<RawgGame[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [year, setYear] = useState("")
  const [genre, setGenre] = useState("")
  const [publisher, setPublisher] = useState("")
  const [rating, setRating] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [loadMore, setLoadMore] = useState(0)
  const observerRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef(1)
  const hasMoreRef = useRef(true)
  const filtersRef = useRef({ search: "", year: "", genre: "", publisher: "", rating: "" })

  const doFetch = useCallback(async (pageNum: number, replace: boolean) => {
    setLoading(true)
    const f = filtersRef.current
    try {
      const params = new URLSearchParams({ page: String(pageNum), page_size: "20" })
      if (f.search) params.set("q", f.search)
      if (f.year) params.set("year", f.year)
      if (f.genre) params.set("genre", f.genre)
      if (f.publisher) params.set("publisher", f.publisher)
      if (f.rating) params.set("rating", f.rating)
      const res = await fetch(`/api/rawg/games?${params}`)
      const data = await res.json()
      if (replace) {
        setGames(data.results || [])
      } else {
        setGames((prev) => [...prev, ...(data.results || [])])
      }
      hasMoreRef.current = data.next !== null
    } catch (err) {
      console.error("Failed to fetch games:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const searchWithFilters = useCallback((s: string, y: string, g: string, p: string, r: string) => {
    filtersRef.current = { search: s, year: y, genre: g, publisher: p, rating: r }
    pageRef.current = 1
    hasMoreRef.current = true
    doFetch(1, true)
  }, [doFetch])

  useEffect(() => {
    if (loadMore > 0) {
      pageRef.current += 1
      doFetch(pageRef.current, false)
    }
  }, [loadMore, doFetch])

  useEffect(() => {
    const el = observerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreRef.current && !loading) {
          setLoadMore((n) => n + 1)
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [loading])

  return (
    <div className="relative min-h-screen -mt-16 pt-16">
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url(/wallpaper.jpg)" }} />
      <div className="fixed inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      <div className="fixed inset-0 backdrop-blur-[1px]" />

      <div className="relative z-10 container-kinetic py-8 md:py-12">
        <h1 className="text-display-lg text-white mb-2">Browse Games</h1>
        <p className="text-body-lg text-on-surface-variant mb-6 md:mb-8">
          Discover thousands of games and check their performance
        </p>

        <div className="relative w-full max-w-md mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search games..."
            value={search}
            onChange={(e) => {
              const v = e.target.value
              setSearch(v)
              searchWithFilters(v, year, genre, publisher, rating)
            }}
            className="kinetic-input w-full pl-9 bg-white/10 border-white/20 text-white placeholder-gray-400 backdrop-blur-md"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface mb-4"
        >
          <Filter className="size-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        <div className={`flex flex-wrap gap-2 mb-8 ${showFilters ? "flex" : "hidden md:flex"}`}>
          <KineticSelect
            value={year}
            onChange={(v) => { setYear(v); searchWithFilters(search, v, genre, publisher, rating) }}
            options={YEARS}
            className="w-32"
          />
          <KineticSelect
            value={genre}
            onChange={(v) => { setGenre(v); searchWithFilters(search, year, v, publisher, rating) }}
            options={GENRES}
            className="w-36"
          />
          <KineticSelect
            value={publisher}
            onChange={(v) => { setPublisher(v); searchWithFilters(search, year, genre, v, rating) }}
            options={PUBLISHERS}
            className="w-44"
          />
          <KineticSelect
            value={rating}
            onChange={(v) => { setRating(v); searchWithFilters(search, year, genre, publisher, v) }}
            options={RATINGS}
            className="w-32"
          />
        </div>

        {games.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {games.map((game) => (
              <GameCard
                key={game.id}
                slug={game.slug}
                title={game.name}
                coverUrl={game.background_image}
                genre={game.genres?.[0]?.name}
                rating={game.rating}
                metacritic={game.metacritic ?? undefined}
                released={game.released ?? undefined}
              />
            ))}
          </div>
        ) : !loading && (
          <p className="text-on-surface-variant text-center mt-20">No games found. Try a different search.</p>
        )}

        {loading && (
          <div className="flex justify-center mt-8">
            <div className="size-6 border-2 border-primary-container/30 border-t-primary-container rounded-full animate-spin" />
          </div>
        )}
        <div ref={observerRef} className="h-10" />
      </div>
    </div>
  )
}
