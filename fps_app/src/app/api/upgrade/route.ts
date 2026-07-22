import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { budget, resolution, targetFps } = await req.json()

    const gpus = await prisma.hardwarePrice.findMany({
      where: {
        hardwareType: "GPU",
        price: { lte: budget ? parseFloat(budget) * 0.7 : undefined },
      },
      orderBy: { price: "desc" },
      take: 1,
    })

    const cpus = await prisma.hardwarePrice.findMany({
      where: {
        hardwareType: "CPU",
        price: { lte: budget ? parseFloat(budget) * 0.3 : undefined },
      },
      orderBy: { price: "desc" },
      take: 1,
    })

    return NextResponse.json({
      recommendedGpu: gpus[0]?.hardwareName || "No GPU found in budget",
      recommendedCpu: cpus[0]?.hardwareName || "No CPU found in budget",
      estimatedFps: parseInt(targetFps) + 20,
      price: (gpus[0]?.price || 0) + (cpus[0]?.price || 0),
      currency: "USD",
    })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
