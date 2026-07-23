import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search") || ""
  const role = searchParams.get("role") || ""
  const status = searchParams.get("status") || ""
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "20")))

  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
    ]
  }

  if (role === "USER" || role === "ADMIN") {
    where.role = role
  }

  if (status === "active") {
    where.blocked = false
  } else if (status === "blocked") {
    where.blocked = true
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        accounts: { select: { provider: true } },
        country: { select: { code: true, name: true } },
        hardware: { select: { id: true } },
        _count: { select: { searchHistory: true, aiConversations: true } },
      },
    }),
    prisma.user.count({ where }),
  ])

  return NextResponse.json({ users, total, page, limit, totalPages: Math.ceil(total / limit) })
}