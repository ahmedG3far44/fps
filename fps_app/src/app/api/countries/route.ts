import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const countries = await prisma.country.findMany({
    include: { currency: true },
    orderBy: { name: "asc" },
  })

  return NextResponse.json(countries)
}
