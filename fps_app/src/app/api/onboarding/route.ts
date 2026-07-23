import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  let session
  try {
    session = await auth()
  } catch (e) {
    console.error("Onboarding auth() error:", e)
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
  }

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()
  const { cpu, gpu, ramGB, storageGB, storageType, os, countryId } = data

  try {
    await prisma.hardware.upsert({
      where: { userId: session.user.id },
      update: { cpu, gpu, ramGB: Number(ramGB) || null, storageGB: Number(storageGB) || null, storageType, os },
      create: { userId: session.user.id, cpu, gpu, ramGB: Number(ramGB) || null, storageGB: Number(storageGB) || null, storageType, os },
    })

    let currencyId: string | null = null
    if (countryId) {
      const country = await prisma.country.findUnique({
        where: { id: countryId },
        select: { currencyId: true },
      })
      currencyId = country?.currencyId ?? null
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { onboarded: true, countryId: countryId || null, currencyId },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("Onboarding error:", e)
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unknown error" }, { status: 500 })
  }
}
