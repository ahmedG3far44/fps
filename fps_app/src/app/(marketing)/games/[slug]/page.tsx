import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { getGameBySlug, getGameMovies, getGameScreenshots, type RawgMovie, type RawgScreenshot } from "@/services/rawg"
import { PerformanceBar } from "@/components/shared/performance-bar"
import { MovieCarousel } from "@/components/shared/movie-carousel"
import { ScreenshotsGrid } from "@/components/shared/screenshots-grid"
import { SystemRequirements } from "@/components/shared/system-requirements"
import { PlatformBadge } from "@/components/shared/platform-badge"
import { FPSPipelineDashboard } from "@/components/shared/fps-pipeline-dashboard"
import { PriceComparison } from "@/components/game-pricing/price-comparison"

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
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
    // Proceed without country
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
  const pcPlatform = rawgGame?.platforms?.find(
    (p) => p.platform.slug === "pc" || p.requirements
  )
  const rawgReqs = pcPlatform?.requirements

  const heroImage = rawgGame?.background_image || rawgGame?.background_image_additional || coverUrl

  const heroScreenshots = rawgGame?.background_image_additional
    ? [{ id: -1, image: rawgGame.background_image_additional }]
    : []

  const shortScreenshots = (rawgGame?.short_screenshots?.filter((s) => s.image !== rawgGame?.background_image) ?? [])
    .map((s, i) => ({ id: Number(`-${i + 2}`), image: s.image }))

  const apiScreenshots = screenshots

  const allScreenshots = [...heroScreenshots, ...shortScreenshots, ...apiScreenshots]

  return (
    <>
      {heroImage && (
        <div className="-mt-16 relative h-[70vh] min-h-[500px] flex items-end">
          <div
            className="absolute inset-0 bg-no-repeat"
            style={{ backgroundImage: `url(${heroImage})`, backgroundSize: "100% auto", backgroundPosition: "top center" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
          <div className="relative z-10 w-full mx-auto max-w-7xl px-4 pb-12">
            <div className="flex flex-col lg:flex-row lg:items-end gap-8">
              <div className="lg:flex-1">
                <h1 className="text-4xl md:text-5xl font-bold text-white">{title}</h1>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-300">
                  {rawgGame?.developers && rawgGame.developers.length > 0 && (
                    <span>{rawgGame.developers[0].name}</span>
                  )}
                  {localGame?.developer && (
                    <span>{localGame.developer.name}</span>
                  )}
                  {genres.map((g) => (
                    <span key={g.slug} className="rounded-full bg-white/10 px-3 py-1 text-white/80">{g.name}</span>
                  ))}
                  {rawgGame?.released && (
                    <span>{new Date(rawgGame.released).getFullYear()}</span>
                  )}
                  {localGame?.releaseDate && (
                    <span>{new Date(localGame.releaseDate).getFullYear()}</span>
                  )}
                </div>

                {rawgGame?.description_raw && (
                  <p className="mt-4 text-gray-400 leading-relaxed line-clamp-3 max-w-2xl">{rawgGame.description_raw}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-6 shrink-0">
                {rawgGame && (
                  <>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{rawgGame.rating.toFixed(1)}</div>
                      <div className="text-xs text-gray-400">Rating</div>
                    </div>
                    {rawgGame.metacritic && (
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-400">{rawgGame.metacritic}</div>
                        <div className="text-xs text-gray-400">Metacritic</div>
                      </div>
                    )}
                    {rawgGame.playtime > 0 && (
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">{rawgGame.playtime}h</div>
                        <div className="text-xs text-gray-400">Playtime</div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{rawgGame.esrb_rating?.name ?? "N/A"}</div>
                      <div className="text-xs text-gray-400">ESRB</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {rawgGame?.platforms && rawgGame.platforms.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {rawgGame.platforms.map((p) => (
                  <PlatformBadge key={p.platform.slug} name={p.platform.name} slug={p.platform.slug} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className={`mx-auto max-w-7xl px-4 py-12 ${heroImage ? "-mt-16" : ""}`}>

      {(movies.length > 0 || rawgGame?.clip) && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Trailers & Clips</h2>
          <MovieCarousel movies={movies} clip={rawgGame?.clip} />
        </section>
      )}

      {allScreenshots.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Screenshots</h2>
          <ScreenshotsGrid screenshots={allScreenshots} />
        </section>
      )}

      {localGame && localGame.benchmarks.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Expected Performance</h2>
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            {(["P720", "P1080", "P1440", "P4K"] as const).map((res) => {
              const bench = localGame!.benchmarks.find((b) => b.resolution === res)
              if (!bench) return null
              return (
                <PerformanceBar key={res} label={res.replace("P", "") + "p"} fps={bench.fps} />
              )
            })}
          </div>
        </section>
      )}

      <FPSPipelineDashboard gameTitle={title} gameDescription={rawgGame?.description_raw ?? undefined} />

      <PriceComparison
        gameId={localGame?.id}
        gameTitle={title}
        isFree={localGame?.isFree}
        country={userCountry}
      />

      <SystemRequirements
        rawgReqs={rawgReqs}
        localMinReq={localGame?.requirements?.find((r) => r.type === "minimum") ?? null}
        localRecReq={localGame?.requirements?.find((r) => r.type === "recommended") ?? null}
        gameTitle={title}
        gameDescription={rawgGame?.description_raw ?? undefined}
      />
    </div>
    </>
  )
}
