import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getGameBySlug } from "@/services/rawg"
import { estimateFpsFromRequirements, type EstimateResult } from "@/lib/performance-estimator"

const fallback = { fps: null, label: "poor" as const }

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json(fallback)

  const slug = req.nextUrl.searchParams.get("slug")
  if (!slug) return NextResponse.json(fallback)

  const hardware = await prisma.hardware.findUnique({
    where: { userId: session.user.id },
  })
  if (!hardware?.gpu && !hardware?.cpu) return NextResponse.json(fallback)

  const userHardware = {
    cpu: hardware.cpu || "",
    gpu: hardware.gpu || "",
    ramGB: hardware.ramGB || 16,
  }

  const rawgGame = await getGameBySlug(slug).catch(() => null)
  if (!rawgGame) return NextResponse.json(fallback)

  const pcPlatform = (rawgGame.platforms ?? []).find(
    (p: { platform: { slug: string } }) => p.platform.slug === "pc"
  ) || (rawgGame.platforms ?? []).find(
    (p: { platform: { slug: string }; requirements?: unknown }) => p.requirements
  )

  const rawgReqs = pcPlatform?.requirements as { minimum?: string; recommended?: string } | undefined
  if (!rawgReqs?.minimum && !rawgReqs?.recommended) return NextResponse.json(fallback)

  const result: EstimateResult = estimateFpsFromRequirements(
    userHardware,
    rawgReqs.minimum ?? null,
    rawgReqs.recommended ?? null,
  )

  return NextResponse.json(result)
}
