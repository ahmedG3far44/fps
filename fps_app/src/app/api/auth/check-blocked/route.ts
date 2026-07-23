import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const { email } = await req.json()
  if (!email) {
    return NextResponse.json({ blocked: false })
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { blocked: true },
  })

  return NextResponse.json({ blocked: user?.blocked ?? false })
}