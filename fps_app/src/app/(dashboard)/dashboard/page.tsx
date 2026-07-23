import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Monitor, Zap, Clock } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role === "ADMIN") redirect("/admin")

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboarded: true },
  })
  if (!dbUser?.onboarded) redirect("/onboarding")

  let hardware: { cpu: string | null; gpu: string | null; ramGB: number | null } | null = null
  let recentGames: { id: string; query: string }[] = []

  try {
    hardware = await prisma.hardware.findUnique({
      where: { userId: session.user.id },
    })
  } catch (e) {
    console.error("Failed to fetch hardware:", e)
  }

  try {
    recentGames = await prisma.searchHistory.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    })
  } catch (e) {
    console.error("Failed to fetch search history:", e)
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-headline-md">Dashboard</h1>
        <p className="text-body-lg text-on-surface-variant mt-1">
          Welcome back, {session.user.name || "Gamer"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="kinetic-card p-4 md:p-6">
          <div className="flex items-center gap-2 text-label-caps text-on-surface-variant mb-3">
            <Monitor className="size-3.5" />
            HARDWARE STATUS
          </div>
          {hardware ? (
            <div className="space-y-1.5">
              <p className="text-data-mono-sm text-hardware-cpu">{hardware.cpu || "Unknown CPU"}</p>
              <p className="text-data-mono-sm text-hardware-gpu">{hardware.gpu || "Unknown GPU"}</p>
              <p className="text-data-mono-sm text-on-surface-variant">{hardware.ramGB ? `${hardware.ramGB} GB RAM` : "Unknown RAM"}</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-on-surface-variant">No hardware detected</p>
              <Link href="/my-pc" className="mt-2 inline-flex text-sm text-primary-container hover:underline">
                Sync your PC &rarr;
              </Link>
            </div>
          )}
        </div>

        <div className="kinetic-card p-4 md:p-6">
          <div className="flex items-center gap-2 text-label-caps text-on-surface-variant mb-3">
            <Zap className="size-3.5" />
            GAMING SCORE
          </div>
          {hardware ? (
            <p className="text-data-mono-lg text-primary-container">
              {hardware.gpu ? "Ready" : "N/A"}
            </p>
          ) : (
            <p className="text-sm text-on-surface-variant">Sync hardware to see score</p>
          )}
        </div>

      </div>

      {recentGames.length > 0 && (
        <div>
          <div className="flex items-center gap-2 text-label-caps text-on-surface-variant mb-4">
            <Clock className="size-3.5" />
            RECENT SEARCHES
          </div>
          <div className="space-y-2">
            {recentGames.map((search) => (
              <div key={search.id} className="kinetic-card px-4 py-3">
                <p className="text-sm text-on-surface">{search.query}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
