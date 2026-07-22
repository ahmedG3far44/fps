import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

const systemPrompt = `You are a gaming performance expert. Given a game title and user's PC hardware, estimate the average FPS the user would get at different resolutions.

Return ONLY valid JSON with this exact structure, no markdown, no explanation:
{
  "720p": { "min": number, "max": number },
  "1080p": { "min": number, "max": number },
  "1440p": { "min": number, "max": number },
  "4K": { "min": number, "max": number }
}

Be realistic and conservative. Consider the GPU as the primary bottleneck, then CPU, then RAM. Use real-world benchmark data. If the hardware can't run the game, return min/max of 0.`

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sign in to estimate FPS" }, { status: 401 })
    }

    const hardware = await prisma.hardware.findUnique({
      where: { userId: session.user.id },
    })
    if (!hardware?.gpu && !hardware?.cpu) {
      return NextResponse.json({ error: "Save your PC specs in My PC first" }, { status: 400 })
    }

    const { title, description } = await req.json()
    if (!title) {
      return NextResponse.json({ error: "Game title is required" }, { status: 400 })
    }

    const userPrompt = `Game: ${title}${description ? `\nDescription: ${description}` : ""}\n\nUser Hardware:\nCPU: ${hardware.cpu || "Unknown"}\nGPU: ${hardware.gpu || "Unknown"}\nRAM: ${hardware.ramGB || 16}GB`

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({
        "720p": { min: 0, max: 0 },
        "1080p": { min: 0, max: 0 },
        "1440p": { min: 0, max: 0 },
        "4K": { min: 0, max: 0 },
        error: "AI key not configured",
      })
    }

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error("OpenRouter error:", errorText)
      throw new Error("AI request failed")
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) throw new Error("No content in AI response")

    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("No JSON in AI response")

    const estimates = JSON.parse(jsonMatch[0])

    const validated: Record<string, { min: number; max: number }> = {}
    for (const res of ["720p", "1080p", "1440p", "4K"]) {
      const e = estimates[res]
      validated[res] = {
        min: typeof e?.min === "number" ? Math.max(0, e.min) : 0,
        max: typeof e?.max === "number" ? Math.max(0, e.max) : 0,
      }
    }

    return NextResponse.json(validated)
  } catch (err) {
    console.error("estimate-fps error:", err)
    return NextResponse.json({ error: "Failed to estimate FPS. Try again." }, { status: 500 })
  }
}
