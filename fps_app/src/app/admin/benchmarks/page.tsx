import { prisma } from "@/lib/prisma"

export default async function AdminBenchmarksPage() {
  const benchmarks = await prisma.benchmark.findMany({
    orderBy: { updatedAt: "desc" },
    include: { game: { select: { title: true } } },
    take: 50,
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Benchmarks</h1>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted-background">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Game</th>
              <th className="px-4 py-3 text-left font-medium">Resolution</th>
              <th className="px-4 py-3 text-left font-medium">Quality</th>
              <th className="px-4 py-3 text-left font-medium">FPS</th>
            </tr>
          </thead>
          <tbody>
            {benchmarks.map((b) => (
              <tr key={b.id} className="border-b border-border">
                <td className="px-4 py-3">{b.game.title}</td>
                <td className="px-4 py-3 text-muted">{b.resolution.replace("P", "p")}</td>
                <td className="px-4 py-3 text-muted">{b.quality}</td>
                <td className="px-4 py-3 font-medium">{b.fps} FPS</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
