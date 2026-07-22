import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { FPSChip } from "@/components/shared/fps-chip"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const hardware = await prisma.hardware.findUnique({
    where: { userId: session.user.id },
  })

  const recentGames = await prisma.searchHistory.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted mt-1">
          Welcome back, {session.user.name || "Gamer"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-medium text-muted">Hardware Status</h3>
          {hardware ? (
            <div className="mt-2 space-y-1">
              <p className="font-semibold">{hardware.cpu || "Unknown CPU"}</p>
              <p className="text-sm text-muted">{hardware.gpu || "Unknown GPU"}</p>
              <p className="text-sm text-muted">{hardware.ramGB ? `${hardware.ramGB} GB RAM` : "Unknown RAM"}</p>
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-sm text-muted">No hardware detected</p>
              <Link
                href="/my-pc"
                className="mt-2 inline-block text-sm text-primary hover:underline"
              >
                Sync your PC
              </Link>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-medium text-muted">Gaming Score</h3>
          {hardware ? (
            <p className="mt-2 text-3xl font-bold text-primary">
              {hardware.gpu ? "Ready" : "N/A"}
            </p>
          ) : (
            <p className="mt-2 text-sm text-muted">Sync hardware to see score</p>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-medium text-muted">Quick Search</h3>
          <Link
            href="/games"
            className="mt-2 inline-block text-sm text-primary hover:underline"
          >
            Browse all games &rarr;
          </Link>
        </div>
      </div>

      {recentGames.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Searches</h2>
          <div className="space-y-2">
            {recentGames.map((search) => (
              <div
                key={search.id}
                className="rounded-lg border border-border bg-card px-4 py-3"
              >
                <p className="text-sm">{search.query}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
