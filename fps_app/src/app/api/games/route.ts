import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q")
  const genre = searchParams.get("genre")
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "24")

  const where: Record<string, unknown> = {}

  if (query) {
    where.title = { contains: query }
  }

  if (genre) {
    where.genres = { some: { genre: { slug: genre } } }
  }

  const [games, total] = await Promise.all([
    prisma.game.findMany({
      where,
      include: {
        genres: { include: { genre: true } },
        benchmarks: { take: 1, orderBy: { fps: "desc" } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.game.count({ where }),
  ])

  return NextResponse.json({ games, total, page, totalPages: Math.ceil(total / limit) })
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const game = await prisma.game.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        engine: data.engine,
        developerId: data.developerId || undefined,
        publisherId: data.publisherId || undefined,
      },
    })
    return NextResponse.json(game)
  } catch {
    return NextResponse.json({ error: "Failed to create game" }, { status: 500 })
  }
}
