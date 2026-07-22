import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const [games, gpus, cpus] = await Promise.all([
    prisma.game.findMany({
      where: { title: { contains: q } },
      take: 5,
      select: { id: true, title: true, slug: true, coverUrl: true },
    }),
    prisma.hardwarePrice.findMany({
      where: { hardwareName: { contains: q }, hardwareType: "GPU" },
      take: 5,
      distinct: ["hardwareName"],
    }),
    prisma.hardwarePrice.findMany({
      where: { hardwareName: { contains: q }, hardwareType: "CPU" },
      take: 5,
      distinct: ["hardwareName"],
    }),
  ])

  return NextResponse.json({
    results: {
      games: games.map((g) => ({ ...g, type: "game" })),
      gpus: [...new Set(gpus.map((g) => g.hardwareName))],
      cpus: [...new Set(cpus.map((g) => g.hardwareName))],
    },
  })
}
