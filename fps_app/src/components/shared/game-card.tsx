import Link from "next/link"
import { FPSChip } from "./fps-chip"

interface GameCardProps {
  slug: string
  title: string
  coverUrl: string | null
  fps?: number
  genre?: string
}

export function GameCard({ slug, title, coverUrl, fps, genre }: GameCardProps) {
  return (
    <Link
      href={`/games/${slug}`}
      className="group relative block rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-colors"
    >
      <div className="aspect-video relative">
        {coverUrl ? (
          <img src={coverUrl} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-muted-background flex items-center justify-center">
            <span className="text-muted text-sm">No Cover</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
          <h3 className="font-semibold text-white truncate drop-shadow-sm">{title}</h3>
          {genre && <p className="text-xs text-gray-300 mt-0.5">{genre}</p>}
          {fps !== undefined && (
            <div className="mt-2">
              <FPSChip fps={fps} />
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
