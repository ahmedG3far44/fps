import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      country: true,
      currency: true,
      hardware: true,
      _count: { select: { searchHistory: true, aiConversations: true } },
    },
  })

  return NextResponse.json(user)
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data,
  })

  return NextResponse.json(user)
}
