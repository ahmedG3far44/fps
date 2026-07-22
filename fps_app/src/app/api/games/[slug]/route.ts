import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const game = await prisma.game.findUnique({
    where: { slug },
    include: {
      developer: true,
      publisher: true,
      genres: { include: { genre: true } },
      benchmarks: true,
      requirements: true,
      recommendations: true,
    },
  })

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 })
  }

  return NextResponse.json(game)
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const data = await req.json()
  const game = await prisma.game.update({
    where: { slug },
    data,
  })
  return NextResponse.json(game)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  await prisma.game.delete({ where: { slug } })
  return NextResponse.json({ success: true })
}
