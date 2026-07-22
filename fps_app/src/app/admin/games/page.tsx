import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function AdminGamesPage() {
  const games = await prisma.game.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { benchmarks: true } } },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Games</h1>
        <Link
          href="/admin/games/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Add Game
        </Link>
      </div>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted-background">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Title</th>
              <th className="px-4 py-3 text-left font-medium">Benchmarks</th>
              <th className="px-4 py-3 text-left font-medium">Created</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game.id} className="border-b border-border">
                <td className="px-4 py-3">{game.title}</td>
                <td className="px-4 py-3 text-muted">{game._count.benchmarks}</td>
                <td className="px-4 py-3 text-muted">
                  {new Date(game.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/games/edit/${game.slug}`}
                    className="text-primary hover:underline text-sm"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
