import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message } = await req.json()

    const hardware = await prisma.hardware.findUnique({
      where: { userId: session.user.id },
    })

    const hardwareContext = hardware
      ? `User's PC specs: CPU: ${hardware.cpu || "Unknown"}, GPU: ${hardware.gpu || "Unknown"}, RAM: ${hardware.ramGB || "Unknown"}GB`
      : "User has not synced their PC hardware yet."

    const reply = `Based on your system:\n\n${hardwareContext}\n\nRegarding "${message}": For a detailed analysis, please ensure your hardware is synced. I can help with game performance predictions, upgrade recommendations, and optimization tips.`

    await prisma.aIConversation.create({
      data: {
        userId: session.user.id,
        role: "user",
        content: message,
      },
    })

    await prisma.aIConversation.create({
      data: {
        userId: session.user.id,
        role: "assistant",
        content: reply,
      },
    })

    return NextResponse.json({ reply })
  } catch {
    return NextResponse.json({ reply: "I encountered an error. Please try again." })
  }
}
