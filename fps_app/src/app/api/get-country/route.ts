import { NextResponse, type NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (session?.user?.id) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          country: { select: { code: true } },
        },
      })

      if (user?.country?.code) {
        return NextResponse.json({ country: user.country.code, source: "user" })
      }
    }
  } catch {
    // Fall back to IP detection
  }

  const country = request.headers.get("x-vercel-ip-country") ?? "US"
  return NextResponse.json({ country, source: "ip" })
}
