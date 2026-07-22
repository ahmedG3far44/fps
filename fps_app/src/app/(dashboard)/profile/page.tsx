import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      country: true,
      currency: true,
      hardware: true,
      _count: { select: { searchHistory: true, aiConversations: true } },
    },
  })

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Profile</h1>

      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
            {(user?.name || "U")[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.name || "Unnamed"}</h2>
            <p className="text-sm text-muted">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg bg-muted-background p-4 text-center">
            <p className="text-2xl font-bold">{user?._count.searchHistory}</p>
            <p className="text-xs text-muted">Searches</p>
          </div>
          <div className="rounded-lg bg-muted-background p-4 text-center">
            <p className="text-2xl font-bold">{user?._count.aiConversations}</p>
            <p className="text-xs text-muted">AI Chats</p>
          </div>
          <div className="rounded-lg bg-muted-background p-4 text-center">
            <p className="text-2xl font-bold">{user?.hardware ? 1 : 0}</p>
            <p className="text-xs text-muted">PC Profiles</p>
          </div>
          <div className="rounded-lg bg-muted-background p-4 text-center">
            <p className="text-2xl font-bold">{user?.country?.code || "--"}</p>
            <p className="text-xs text-muted">Country</p>
          </div>
        </div>
      </div>
    </div>
  )
}
