import { prisma } from "@/lib/prisma"
import { Mail, User, MessageSquare, CheckCircle, Circle } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  })

  const unread = messages.filter((m) => !m.read).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-headline-md">Messages</h1>
        <p className="text-body-lg text-on-surface-variant mt-1">
          {messages.length} total{unread > 0 && <span className="ml-2 text-primary-container font-medium">{unread} unread</span>}
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="kinetic-card p-12 text-center">
          <Mail className="size-10 text-on-surface-variant mx-auto mb-3" />
          <p className="text-on-surface-variant">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`kinetic-card p-4 md:p-5 ${!msg.read ? "border-l-2 border-l-primary-container" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-9 shrink-0 rounded-full bg-primary-container/10 flex items-center justify-center">
                    <User className="size-4 text-primary-container" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-headline-sm truncate">{msg.name}</span>
                      <span className="text-xs text-on-surface-variant truncate">{msg.email}</span>
                    </div>
                    <p className="text-sm text-on-surface mt-1 whitespace-pre-wrap">{msg.message}</p>
                    <p className="text-xs text-on-surface-variant mt-2">
                      {new Date(msg.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 mt-1">
                  {msg.read ? (
                    <CheckCircle className="size-4 text-on-surface-variant" />
                  ) : (
                    <Circle className="size-4 text-primary-container" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
