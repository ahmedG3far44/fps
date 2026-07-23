import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const data = await req.json()
  const { name, email, message } = data

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email and message are required" }, { status: 400 })
  }

  if (typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 })
  }

  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
  }

  if (typeof message !== "string" || message.trim().length < 10) {
    return NextResponse.json({ error: "Message must be at least 10 characters" }, { status: 400 })
  }

  try {
    await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      },
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("Contact message error:", e)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
