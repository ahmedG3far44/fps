import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { getGamePrices } from "@/services/game-pricing/game-pricing.service"
import { auth } from "@/lib/auth"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const game = await prisma.game.findUnique({
    where: { slug },
    select: { id: true, title: true, isFree: true },
  })

  if (!game) {
    return Response.json({ error: "Game not found in local database" }, { status: 404 })
  }

  if (game.isFree) {
    return Response.json({
      bestDeal: null,
      officialStores: [],
      authorizedResellers: [],
      isFree: true,
    })
  }

  let country: string | null = null

  try {
    const session = await auth()
    if (session?.user?.id) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { country: { select: { code: true } } },
      })
      country = user?.country?.code ?? null
    }
  } catch {
    // Proceed without country
  }

  const prices = await getGamePrices({ gameId: game.id }, country)

  return Response.json(prices)
}
