import { NextResponse } from "next/server"

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

const systemPrompt = `You are a gaming hardware expert. Given a game name, generate realistic minimum and recommended system requirements.

Return ONLY valid JSON with this exact structure:
{
  "minimum": { "os": string, "cpu": string, "gpu": string, "ramGB": number, "storageGB": number },
  "recommended": { "os": string, "cpu": string, "gpu": string, "ramGB": number, "storageGB": number }
}

Use realistic, accurate hardware requirements based on the game's actual specifications. No markdown, no explanation, just JSON.`

export async function POST(req: Request) {
  try {
    const { title, description } = await req.json()
    if (!title) {
      return NextResponse.json({ error: "Game title is required" }, { status: 400 })
    }

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({
        minimum: { os: "Windows 10 64-bit", cpu: "Intel Core i5-6400 / AMD Ryzen 3 1200", gpu: "NVIDIA GTX 960 / AMD Radeon R9 380", ramGB: 8, storageGB: 50 },
        recommended: { os: "Windows 10/11 64-bit", cpu: "Intel Core i7-8700 / AMD Ryzen 5 3600", gpu: "NVIDIA RTX 2060 / AMD RX 5600 XT", ramGB: 16, storageGB: 50 },
      })
    }

    const userPrompt = `Game: ${title}${description ? `\nDescription: ${description}` : ""}`

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
      throw new Error("AI generation failed")
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) throw new Error("No content in AI response")

    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("No JSON in AI response")

    const requirements = JSON.parse(jsonMatch[0])
    return NextResponse.json(requirements)
  } catch {
    return NextResponse.json({
      minimum: { os: "Windows 10 64-bit", cpu: "Intel Core i5-6400 / AMD Ryzen 3 1200", gpu: "NVIDIA GTX 960 / AMD Radeon R9 380", ramGB: 8, storageGB: 50 },
      recommended: { os: "Windows 10/11 64-bit", cpu: "Intel Core i7-8700 / AMD Ryzen 5 3600", gpu: "NVIDIA RTX 2060 / AMD RX 5600 XT", ramGB: 16, storageGB: 50 },
    })
  }
}
