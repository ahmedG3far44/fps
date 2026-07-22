import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const hardware = await prisma.hardware.findUnique({
    where: { userId: session.user.id },
  })

  return NextResponse.json(hardware)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()
  const hardware = await prisma.hardware.upsert({
    where: { userId: session.user.id },
    update: {
      ...data,
      lastSyncedAt: new Date(),
    },
    create: {
      userId: session.user.id,
      ...data,
      lastSyncedAt: new Date(),
    },
  })

  return NextResponse.json(hardware)
}
