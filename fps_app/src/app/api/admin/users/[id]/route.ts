import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const target = await prisma.user.findUnique({
    where: { id },
    select: { role: true },
  })

  if (!target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  if (target.role === "ADMIN") {
    return NextResponse.json({ error: "Cannot modify another admin" }, { status: 403 })
  }

  const { blocked } = await req.json()

  if (typeof blocked !== "boolean") {
    return NextResponse.json({ error: "blocked must be a boolean" }, { status: 400 })
  }

  const user = await prisma.user.update({
    where: { id },
    data: { blocked },
  })

  return NextResponse.json(user)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  await prisma.user.delete({ where: { id } })

  return NextResponse.json({ success: true })
}