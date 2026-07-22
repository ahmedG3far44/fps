import { filterGames, isAdultGame } from "@/lib/game-filter"

const RAWG_BASE = "https://api.rawg.io/api"
const RAWG_KEY = process.env.RAWG_API_KEY || process.env.RAWG_API

export interface RawgGameResult {
  id: number
  slug: string
  name: string
  name_original: string
  description_raw: string
  released: string | null
  background_image: string | null
  background_image_additional: string | null
  rating: number
  rating_top: number
  genres: { name: string; slug: string }[]
  platforms: {
    platform: { name: string; slug: string }
    requirements?: {
      minimum?: string
      recommended?: string
    }
  }[]
  metacritic: number | null
  esrb_rating: { name: string } | null
  short_screenshots: { id: number; image: string }[]
  developers: { name: string; slug: string }[]
  publishers: { name: string; slug: string }[]
  tags: { name: string; slug: string }[]
  website: string
  reddit_url: string
  playtime: number
  clip: {
    clip: string
    clips: { 320: string; 640: string; full: string }
    video: string
    preview: string
  } | null
}

export interface RawgMovie {
  id: number
  name: string
  preview: string
  data: { 480: string; max: string }
}

export interface RawgScreenshot {
  id: number
  image: string
  width: number
  height: number
}

interface RawgSearchResponse {
  count: number
  next: string | null
  previous: string | null
  results: RawgGameResult[]
}

interface GameFilters {
  year?: string
  genre?: string
  publisher?: string
  rating?: string
}

function buildParams(base: Record<string, string>, filters?: GameFilters): URLSearchParams {
  const params = new URLSearchParams(base)
  if (filters?.year) {
    params.set("dates", `${filters.year}-01-01,${filters.year}-12-31`)
  }
  if (filters?.genre) {
    params.set("genres", filters.genre)
  }
  if (filters?.publisher) {
    params.set("publishers", filters.publisher)
  }
  if (filters?.rating) {
    params.set("metacritic", filters.rating)
  }
  return params
}

export async function searchGames(query: string, page = 1, pageSize = 20, filters?: GameFilters): Promise<RawgSearchResponse> {
  const params = buildParams({
    key: RAWG_KEY!,
    search: query,
    page: String(page),
    page_size: String(pageSize),
    ordering: "-rating",
  }, filters)
  const res = await fetch(`${RAWG_BASE}/games?${params}`)
  if (!res.ok) throw new Error(`RAWG API error: ${res.status}`)
  const data: RawgSearchResponse = await res.json()
  data.results = filterGames(data.results)
  return data
}

export async function getPopularGames(page = 1, pageSize = 20, filters?: GameFilters): Promise<RawgSearchResponse> {
  const params = buildParams({
    key: RAWG_KEY!,
    page: String(page),
    page_size: String(pageSize),
    ordering: "-rating",
  }, filters)
  const res = await fetch(`${RAWG_BASE}/games?${params}`)
  if (!res.ok) throw new Error(`RAWG API error: ${res.status}`)
  const data: RawgSearchResponse = await res.json()
  data.results = filterGames(data.results)
  return data
}

export async function getGameBySlug(slug: string): Promise<RawgGameResult | null> {
  const params = new URLSearchParams({ key: RAWG_KEY! })
  const res = await fetch(`${RAWG_BASE}/games/${slug}?${params}`)
  if (!res.ok) throw new Error(`RAWG API error: ${res.status}`)
  const game: RawgGameResult = await res.json()
  if (isAdultGame(game)) return null
  return game
}

export async function getGameMovies(slug: string): Promise<RawgMovie[]> {
  const params = new URLSearchParams({ key: RAWG_KEY! })
  const res = await fetch(`${RAWG_BASE}/games/${slug}/movies?${params}`)
  if (!res.ok) throw new Error(`RAWG API error: ${res.status}`)
  const body = await res.json()
  return body.results ?? []
}

export async function getGameScreenshots(slug: string): Promise<RawgScreenshot[]> {
  const params = new URLSearchParams({ key: RAWG_KEY! })
  const res = await fetch(`${RAWG_BASE}/games/${slug}/screenshots?${params}`)
  if (!res.ok) throw new Error(`RAWG API error: ${res.status}`)
  const body = await res.json()
  return body.results ?? []
}
