import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function HistoryPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const history = await prisma.searchHistory.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Search History</h1>

      {history.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-muted text-sm">No search history yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-border bg-card px-4 py-3 flex items-center justify-between"
            >
              <p className="text-sm">{item.query}</p>
              <p className="text-xs text-muted">
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
