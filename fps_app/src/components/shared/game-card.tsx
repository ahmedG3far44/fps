import Link from "next/link"
import { Star, Calendar } from "lucide-react"
import { KineticChip } from "@/components/ui/kinetic-chip"

interface GameCardProps {
  slug: string
  title: string
  coverUrl: string | null
  fps?: number
  genre?: string
  rating?: number
  metacritic?: number
  released?: string
}

export function GameCard({ slug, title, coverUrl, fps, genre, rating, metacritic, released }: GameCardProps) {
  const year = released ? new Date(released).getFullYear() : null

  return (
    <Link
      href={`/games/${slug}`}
      className="group relative block rounded-xl overflow-hidden border border-outline-variant hover:border-primary-container/40 transition-all duration-300"
    >
      <div className="aspect-[3/2] relative bg-surface-container-low">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="eager"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-on-surface-variant text-sm">No Cover</span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />

        {metacritic !== null && metacritic !== undefined && (
          <div className={`absolute top-3 right-3 size-8 rounded-lg flex items-center justify-center text-xs font-bold border border-white/20 backdrop-blur-sm ${
            metacritic >= 75 ? "bg-fps-excellent/80 text-white" : metacritic >= 50 ? "bg-fps-good/80 text-black" : "bg-fps-poor/80 text-white"
          }`}>
            {metacritic}
          </div>
        )}

        {rating !== undefined && rating > 0 && (
          <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-sm px-2 py-0.5 text-xs text-white">
            <Star className="size-3 fill-yellow-400 text-yellow-400" />
            {rating.toFixed(1)}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="font-semibold text-white text-sm leading-tight drop-shadow-sm line-clamp-2 relative inline-block after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary-container after:transition-all after:duration-300 group-hover:after:w-full">
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {genre && (
              <span className="text-xs text-gray-300 truncate">{genre}</span>
            )}
            {year && (
              <span className="text-xs text-gray-400 flex items-center gap-0.5 shrink-0">
                <Calendar className="size-3" />
                {year}
              </span>
            )}
            {fps !== undefined && (
              <span className="ml-auto shrink-0">
                <KineticChip variant="fps">{`${fps} FPS`}</KineticChip>
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
