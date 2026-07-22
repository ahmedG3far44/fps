import { NextResponse } from "next/server"
import { searchGames, getPopularGames } from "@/services/rawg"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q")
  const page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("page_size") || "20")
  const filters = {
    year: searchParams.get("year") || undefined,
    genre: searchParams.get("genre") || undefined,
    publisher: searchParams.get("publisher") || undefined,
    rating: searchParams.get("rating") || undefined,
  }
  const hasFilters = filters.year || filters.genre || filters.publisher || filters.rating

  try {
    const data = query || hasFilters
      ? await searchGames(query ?? "", page, pageSize, filters)
      : await getPopularGames(page, pageSize, filters)

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 })
  }
}
