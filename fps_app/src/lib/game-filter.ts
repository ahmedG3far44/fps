const BLOCKED_GENRE_SLUGS = new Set([
  "erotic",
  "adult",
  "sexual",
  "nsfw",
  "hentai",
  "erotica",
])

const BLOCKED_TAG_SLUGS = new Set([
  "adult",
  "erotic",
  "sexual-content",
  "nsfw",
  "nudity",
  "hentai",
  "sex",
  "pornographic",
  "explicit",
  "mature-content",
])

const BLOCKED_NAME_PATTERNS = [
  /hentai/i,
  /porn/i,
  /sex/i,
  /xxx\b/i,
  /adult.?game/i,
  /erotic/i,
  /strip.?poker/i,
  /naughty/i,
  /lust/i,
  /seduce/i,
  /sweet.?home.?studio/i,
  /breeding/i,
  /naked/i,
  /nude/i,
]

interface GameLike {
  name?: string
  genres?: { name: string; slug: string }[]
  tags?: { name: string; slug: string }[]
  esrb_rating?: { name: string } | null
}

export function isAdultGame(game: GameLike): boolean {
  if (!game) return false

  if (game.genres?.some((g) => BLOCKED_GENRE_SLUGS.has(g.slug))) return true

  if (game.tags?.some((t) => BLOCKED_TAG_SLUGS.has(t.slug))) return true

  if (game.esrb_rating?.name === "Adults Only") return true

  const name = game.name
  if (name && BLOCKED_NAME_PATTERNS.some((p) => p.test(name))) return true

  return false
}

export function filterGames<T extends GameLike>(games: T[]): T[] {
  return games.filter((g) => !isAdultGame(g))
}
