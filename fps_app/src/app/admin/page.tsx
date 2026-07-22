import { prisma } from "@/lib/prisma"

export default async function AdminPage() {
  const [gameCount, userCount, benchmarkCount, hardwareCount] = await Promise.all([
    prisma.game.count(),
    prisma.user.count(),
    prisma.benchmark.count(),
    prisma.hardware.count(),
  ])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Games", value: gameCount },
          { label: "Users", value: userCount },
          { label: "Benchmarks", value: benchmarkCount },
          { label: "Hardware Profiles", value: hardwareCount },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-6">
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
