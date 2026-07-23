import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import {
  getGameBySlug,
  getGameMovies,
  getGameScreenshots,
  type RawgMovie,
  type RawgScreenshot,
} from "@/services/rawg"
import { PerformanceBar } from "@/components/shared/performance-bar"
import { MovieCarousel } from "@/components/shared/movie-carousel"
import { ScreenshotsGrid } from "@/components/shared/screenshots-grid"
import { SystemRequirements } from "@/components/shared/system-requirements"
import { PlatformBadge } from "@/components/shared/platform-badge"
import { FPSPipelineDashboard } from "@/components/shared/fps-pipeline-dashboard"
import { PriceComparison } from "@/components/game-pricing/price-comparison"
import { KineticChip } from "@/components/ui/kinetic-chip"

export default async function GameDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let userCountry: string | null = null
  try {
    const session = await auth()
    if (session?.user?.id) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { country: { select: { code: true } } },
      })
      userCountry = user?.country?.code ?? null
    }
  } catch {
    // proceed
  }

  const [rawgGame, localGame, movies, screenshots] = await Promise.all([
    getGameBySlug(slug).catch(() => null),
    prisma.game.findUnique({
      where: { slug },
      include: {
        developer: true,
        publisher: true,
        genres: { include: { genre: true } },
        benchmarks: true,
        requirements: true,
      },
    }),
    getGameMovies(slug).catch(() => [] as RawgMovie[]),
    getGameScreenshots(slug).catch(() => [] as RawgScreenshot[]),
  ])

  if (!rawgGame && !localGame) notFound()

  const title = rawgGame?.name ?? localGame!.title
  const coverUrl = rawgGame?.background_image ?? localGame!.coverUrl
  const genres = rawgGame?.genres ?? localGame!.genres.map((g) => ({ name: g.genre.name, slug: g.genre.slug }))
  const pcPlatform = rawgGame?.platforms?.find((p) => p.platform.slug === "pc" || p.requirements)
  const rawgReqs = pcPlatform?.requirements

  const heroImage = rawgGame?.background_image || rawgGame?.background_image_additional || coverUrl

  const heroScreenshots = rawgGame?.background_image_additional
    ? [{ id: -1, image: rawgGame.background_image_additional }]
    : []

  const shortScreenshots = (rawgGame?.short_screenshots?.filter((s) => s.image !== rawgGame?.background_image) ?? [])
    .map((s, i) => ({ id: Number(`-${i + 2}`), image: s.image }))

  const apiScreenshots = screenshots
  const allScreenshots = [...heroScreenshots, ...shortScreenshots, ...apiScreenshots]

  const releaseYear: number | null = rawgGame?.released
    ? new Date(rawgGame.released).getFullYear()
    : localGame?.releaseDate
    ? new Date(localGame.releaseDate).getFullYear()
    : null

  return (
    <>
      {heroImage && (
        <div className="-mt-16 relative h-[60vh] md:h-[70vh] min-h-[400px] md:min-h-[500px] flex items-end">
          <div
            className="absolute inset-0 bg-no-repeat"
            style={{
              backgroundImage: `url(${heroImage})`,
              backgroundSize: "100% auto",
              backgroundPosition: "top center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/70 to-surface/20" />
          <div className="relative z-10 w-full container-kinetic pb-8 md:pb-12">
            <div className="flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-8">
              <div className="lg:flex-1 min-w-0">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white break-words">
                  {title}
                </h1>

                <div className="mt-3 md:mt-4 flex flex-wrap items-center gap-2 md:gap-3 text-sm">
                  {(rawgGame?.developers?.[0] || localGame?.developer) && (
                    <span className="text-on-surface-variant">
                      {rawgGame?.developers?.[0]?.name || localGame?.developer?.name}
                    </span>
                  )}
                  {genres.map((g) => (
                    <KineticChip key={g.slug} variant="info">
                      {g.name}
                    </KineticChip>
                  ))}
                  {releaseYear && (
                    <span className="text-on-surface-variant">{releaseYear}</span>
                  )}
                </div>

                {rawgGame?.description_raw && (
                  <p className="mt-3 md:mt-4 text-on-surface-variant leading-relaxed line-clamp-3 max-w-2xl text-sm md:text-base">
                    {rawgGame.description_raw}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-4 md:gap-6 shrink-0">
                {rawgGame && (
                  <>
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-primary-container">
                        {rawgGame.rating.toFixed(1)}
                      </div>
                      <div className="text-label-caps text-on-surface-variant mt-1">Rating</div>
                    </div>
                    {rawgGame.metacritic && (
                      <div className="text-center">
                        <div className={`text-2xl md:text-3xl font-bold ${
                          rawgGame.metacritic >= 75 ? "text-fps-excellent" : rawgGame.metacritic >= 50 ? "text-fps-good" : "text-fps-poor"
                        }`}>
                          {rawgGame.metacritic}
                        </div>
                        <div className="text-label-caps text-on-surface-variant mt-1">Metacritic</div>
                      </div>
                    )}
                    {rawgGame.playtime > 0 && (
                      <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-white">
                          {rawgGame.playtime}h
                        </div>
                        <div className="text-label-caps text-on-surface-variant mt-1">Playtime</div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-white">
                        {rawgGame.esrb_rating?.name ?? "N/A"}
                      </div>
                      <div className="text-label-caps text-on-surface-variant mt-1">ESRB</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {rawgGame?.platforms && rawgGame.platforms.length > 0 && (
              <div className="mt-4 md:mt-6 flex flex-wrap gap-2">
                {rawgGame.platforms.map((p) => (
                  <PlatformBadge key={p.platform.slug} name={p.platform.name} slug={p.platform.slug} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className={`container-kinetic py-8 md:py-12 ${heroImage ? "-mt-12 md:-mt-16" : ""}`}>
        {localGame && localGame.benchmarks.length > 0 && (
          <section className="mb-8 md:mb-12">
            <h2 className="text-headline-md mb-4">Expected Performance</h2>
            <div className="kinetic-card p-4 md:p-6 space-y-4">
              {(["P720", "P1080", "P1440", "P4K"] as const).map((res) => {
                const bench = localGame!.benchmarks.find((b) => b.resolution === res)
                if (!bench) return null
                return <PerformanceBar key={res} label={res.replace("P", "") + "p"} fps={bench.fps} />
              })}
            </div>
          </section>
        )}

        <FPSPipelineDashboard gameTitle={title} gameDescription={rawgGame?.description_raw ?? undefined} />

        <SystemRequirements
          rawgReqs={rawgReqs}
          localMinReq={localGame?.requirements?.find((r) => r.type === "minimum") ?? null}
          localRecReq={localGame?.requirements?.find((r) => r.type === "recommended") ?? null}
          gameTitle={title}
          gameDescription={rawgGame?.description_raw ?? undefined}
        />

        <PriceComparison
          gameId={localGame?.id}
          gameTitle={title}
          isFree={localGame?.isFree}
          country={userCountry}
        />

        {(movies.length > 0 || rawgGame?.clip) && (
          <section className="mb-8 md:mb-12">
            <h2 className="text-headline-md mb-4">Trailers & Clips</h2>
            <MovieCarousel movies={movies} clip={rawgGame?.clip} />
          </section>
        )}

        {allScreenshots.length > 0 && (
          <section className="mb-8 md:mb-12">
            <h2 className="text-headline-md mb-4">Screenshots</h2>
            <ScreenshotsGrid screenshots={allScreenshots} />
          </section>
        )}
      </div>
    </>
  )
}
