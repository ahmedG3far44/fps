"use server"

import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { getGamePrices } from "@/services/game-pricing/game-pricing.service"
import type { GamePricesResponse } from "@/types/game-pricing"

export const getGamePricesAction = cache(
  async (gameId: string): Promise<GamePricesResponse> => {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      select: { isFree: true },
    })

    if (!game || game.isFree) {
      return { bestDeal: null, officialStores: [], authorizedResellers: [] }
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

    return getGamePrices({ gameId }, country)
  }
)
