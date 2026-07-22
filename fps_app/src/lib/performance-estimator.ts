interface Hardware {
  cpu: string
  gpu: string
  ramGB: number
}

interface Requirement {
  cpu?: string | null
  gpu?: string | null
  ramGB?: number | null
}

const gpuScores: Record<string, number> = {
  "GT 710": 3, "GT 730": 5, "GT 740": 7, "GTX 750": 10, "GTX 750 Ti": 12,
  "GTX 760": 16, "GTX 770": 20, "GTX 780": 26, "GTX 780 Ti": 30,
  "GTX 950": 18, "GTX 960": 24, "GTX 970": 34, "GTX 980": 40, "GTX 980 Ti": 48,
  "GT 1030": 8, "GTX 1050": 18, "GTX 1050 Ti": 28,
  "GTX 1060": 35, "GTX 1070": 48, "GTX 1080": 57, "GTX 1080 Ti": 67,
  "GTX 1650": 22, "GTX 1650 Super": 28, "GTX 1660": 33, "GTX 1660 Super": 38, "GTX 1660 Ti": 40,
  "RTX 2060": 51, "RTX 2060 Super": 56, "RTX 2070": 58, "RTX 2070 Super": 62,
  "RTX 2080": 65, "RTX 2080 Super": 68, "RTX 2080 Ti": 81,
  "RTX 3050": 40, "RTX 3060": 55, "RTX 3060 Ti": 61,
  "RTX 3070": 66, "RTX 3070 Ti": 69, "RTX 3080": 79, "RTX 3080 Ti": 85,
  "RTX 3090": 88, "RTX 3090 Ti": 91,
  "RTX 4060": 62, "RTX 4060 Ti": 70, "RTX 4070": 78, "RTX 4070 Super": 82,
  "RTX 4070 Ti": 85, "RTX 4070 Ti Super": 87, "RTX 4080": 91, "RTX 4080 Super": 92,
  "RTX 4090": 100, "RTX 4090 D": 99,
  "RTX 5050": 58, "RTX 5060": 68, "RTX 5060 Ti": 74,
  "RTX 5070": 80, "RTX 5070 Ti": 86, "RTX 5080": 93, "RTX 5090": 100,
  "R7 250": 3, "R7 360": 8, "R7 370": 14, "RX 460": 16, "RX 470": 28,
  "RX 480": 32, "RX 550": 7, "RX 560": 13,
  "RX 570": 28, "RX 580": 33, "RX 590": 36,
  "RX 5500 XT": 32, "RX 5600 XT": 43, "RX 5700": 50, "RX 5700 XT": 56,
  "RX 6400": 16, "RX 6500 XT": 24, "RX 6600": 49, "RX 6600 XT": 55,
  "RX 6650 XT": 57, "RX 6700 XT": 63, "RX 6750 XT": 65,
  "RX 6800": 71, "RX 6800 XT": 77, "RX 6900 XT": 82, "RX 6950 XT": 84,
  "RX 7600": 58, "RX 7600 XT": 63, "RX 7700 XT": 71, "RX 7800 XT": 78,
  "RX 7900 GRE": 79, "RX 7900 XT": 88, "RX 7900 XTX": 93,
  "RX 9060 XT": 66, "RX 9070": 82, "RX 9070 XT": 90,
  "Arc A310": 20, "Arc A380": 28, "Arc A580": 42, "Arc A750": 51, "Arc A770": 55,
  "Arc B580": 58, "Arc B570": 50,
  "HD Graphics": 2, "UHD Graphics": 4, "Iris Xe": 10, "Iris Plus": 8,
}

const cpuScores: Record<string, number> = {
  "i3-12100F": 52, "i3-13100F": 55, "i3-14100F": 57,
  "i5-10400F": 42, "i5-11400F": 48, "i5-12400F": 56, "i5-12600K": 62,
  "i5-13400F": 60, "i5-13600K": 70, "i5-14400F": 62, "i5-14600K": 72,
  "i7-10700K": 50, "i7-11700K": 56, "i7-12700K": 65, "i7-13700K": 76, "i7-14700K": 81,
  "i9-10900K": 54, "i9-11900K": 60, "i9-12900K": 72, "i9-13900K": 85, "i9-13900KS": 88,
  "i9-14900K": 88, "i9-14900KS": 91,
  "Ultra 5 225H": 65, "Ultra 7 265K": 80, "Ultra 9 285K": 90,
  "Ryzen 3 3100": 38, "Ryzen 3 3300X": 42,
  "Ryzen 5 3600": 48, "Ryzen 5 5600": 54, "Ryzen 5 5600X": 56,
  "Ryzen 5 7500F": 62, "Ryzen 5 7600": 64, "Ryzen 5 7600X": 66,
  "Ryzen 5 8400F": 60, "Ryzen 5 9600X": 70,
  "Ryzen 7 3700X": 52, "Ryzen 7 5700X": 62, "Ryzen 7 5700X3D": 65,
  "Ryzen 7 5800X": 64, "Ryzen 7 5800X3D": 70,
  "Ryzen 7 7700": 70, "Ryzen 7 7700X": 72, "Ryzen 7 7800X3D": 82,
  "Ryzen 7 8700G": 66, "Ryzen 7 9700X": 76, "Ryzen 7 9800X3D": 88,
  "Ryzen 9 3900X": 56, "Ryzen 9 3950X": 60,
  "Ryzen 9 5900X": 72, "Ryzen 9 5950X": 76,
  "Ryzen 9 7900": 74, "Ryzen 9 7900X": 78, "Ryzen 9 7950X": 84, "Ryzen 9 7950X3D": 87,
  "Ryzen 9 9900X": 82, "Ryzen 9 9950X": 90,
}

function normalizeGpuName(name: string): string {
  let n = name.replace(/^(NVIDIA|AMD|Intel)\s*/i, "").trim()
  n = n.replace(/\b(GeForce|Radeon|Arc|Graphics|GPU)\b/g, "").trim()
  n = n.replace(/\s*GDDR\d+\s*/i, "").trim()
  n = n.replace(/\s*GB\s*$/i, "").trim()
  n = n.replace(/\s+/g, " ").trim()
  return n
}

function normalizeCpuName(name: string): string {
  let n = name.replace(/^(Intel|AMD)\s*/i, "").trim()
  n = n.replace(/\b(Core|Ryzen|Processor|CPU)\b/g, "").trim()
  n = n.replace(/\s+/g, " ").trim()
  return n
}

function parseGpuScore(name: string): number {
  const norm = normalizeGpuName(name)
  if (gpuScores[norm]) return gpuScores[norm]

  const match = norm.match(/(\d{3,4})\s*(Ti|Super|XT|XTX|GRE)?/i)
  if (match) {
    const num = parseInt(match[1])
    if (num >= 1000) {
      const gen = Math.floor(num / 100)
      const tier = num % 100
      const bonus = match[2] ? { TI: 8, SUPER: 5, XT: 6, XTX: 10, GRE: 4 }[match[2].toUpperCase()] || 0 : 0
      return Math.min(gen + tier + bonus, 100)
    } else {
      const tier = num % 100
      return 10 + tier + (match[2] ? 5 : 0)
    }
  }
  return 30
}

function parseCpuScore(name: string): number {
  const norm = normalizeCpuName(name)
  if (cpuScores[norm]) return cpuScores[norm]

  const match = norm.match(/(\d{4,5})[F]?/i)
  if (match) {
    const num = parseInt(match[1])
    const gen = Math.floor(num / 1000)
    const sku = num % 1000
    return Math.min(gen * 6 + sku * 0.5, 100)
  }

  const ryzenMatch = norm.match(/(\d)\s*(\d{3,4})/i)
  if (ryzenMatch) {
    return Math.min(parseInt(ryzenMatch[1]) * 10 + parseInt(ryzenMatch[2]) * 0.5, 100)
  }

  return 50
}

function scoreToFps(gpuScore: number, reqGpuScore: number, cpuScore: number, reqCpuScore: number, userRam: number, reqRam: number): number {
  if (reqGpuScore === 0) return 60

  const gpuRatio = gpuScore / reqGpuScore
  const cpuRatio = cpuScore / reqCpuScore
  const ramRatio = reqRam > 0 ? userRam / reqRam : 1

  let baseFps: number
  if (gpuRatio >= 1.5) baseFps = 90
  else if (gpuRatio >= 1.3) baseFps = 75
  else if (gpuRatio >= 1.1) baseFps = 60
  else if (gpuRatio >= 0.9) baseFps = 45
  else if (gpuRatio >= 0.7) baseFps = 30
  else baseFps = 20

  if (ramRatio < 1) baseFps *= Math.max(ramRatio, 0.5)
  if (cpuRatio < 0.8) baseFps *= Math.max(cpuRatio / 0.8, 0.6)

  return Math.round(baseFps)
}

function parseRamGb(text: string): number | null {
  const match = text.match(/(\d+)\s*GB/i)
  return match ? parseInt(match[1]) : null
}

function extractGpuFromText(text: string): string | null {
  const lines = text.split(/<br>|\n/)
  for (const line of lines) {
    const cleaned = line.replace(/<\/?[^>]+>/g, "").trim()
    if (/^(graphics|video|gpu|videocard|video card)/i.test(cleaned)) {
      const val = cleaned.replace(/^[^:]+:\s*/, "").trim()
      if (val) return val
    }
  }
  return null
}

function extractCpuFromText(text: string): string | null {
  const lines = text.split(/<br>|\n/)
  for (const line of lines) {
    const cleaned = line.replace(/<\/?[^>]+>/g, "").trim()
    if (/^(processor|cpu)/i.test(cleaned)) {
      const val = cleaned.replace(/^[^:]+:\s*/, "").trim()
      if (val) return val
    }
  }
  return null
}

function extractRamFromText(text: string): number | null {
  const lines = text.split(/<br>|\n/)
  for (const line of lines) {
    const cleaned = line.replace(/<\/?[^>]+>/g, "").trim()
    if (/^(memory|ram)/i.test(cleaned)) {
      const val = cleaned.replace(/^[^:]+:\s*/, "").trim()
      return parseRamGb(val)
    }
  }
  return null
}

export interface EstimateResult {
  fps: number | null
  label: "excellent" | "good" | "poor"
}

export function estimateFps(hardware: Hardware, minReq?: Requirement | null, recReq?: Requirement | null): EstimateResult {
  if (!hardware.gpu && !hardware.cpu) return { fps: null, label: "poor" }

  const userGpuScore = hardware.gpu ? parseGpuScore(hardware.gpu) : 0
  const userCpuScore = hardware.cpu ? parseCpuScore(hardware.cpu) : 50
  const userRam = hardware.ramGB || 16

  if (recReq?.gpu) {
    const recGpuScore = parseGpuScore(recReq.gpu)
    if (recGpuScore > 0) {
      const recCpuScore = recReq.cpu ? parseCpuScore(recReq.cpu) : userCpuScore
      const recRam = recReq.ramGB || 16
      const fps = scoreToFps(userGpuScore, recGpuScore, userCpuScore, recCpuScore, userRam, recRam)
      const label = fps >= 60 ? "excellent" : fps >= 30 ? "good" : "poor"
      return { fps, label }
    }
  }

  if (minReq?.gpu) {
    const minGpuScore = parseGpuScore(minReq.gpu)
    if (minGpuScore > 0) {
      const fps = scoreToFps(userGpuScore, Math.max(minGpuScore, 1), userCpuScore, minReq.cpu ? parseCpuScore(minReq.cpu) : userCpuScore, userRam, minReq.ramGB || 8)
      const label = fps >= 60 ? "excellent" : fps >= 30 ? "good" : "poor"
      return { fps, label }
    }
  }

  return { fps: null, label: "poor" }
}

export function estimateFpsFromRawgText(hardware: Hardware, rawgHtml?: string | null, isRecommended = false): EstimateResult {
  if (!rawgHtml) return { fps: null, label: "poor" }
  const gpu = extractGpuFromText(rawgHtml)
  const cpu = extractCpuFromText(rawgHtml)
  const ram = extractRamFromText(rawgHtml)
  return estimateFps(hardware, isRecommended ? undefined : { gpu, cpu, ramGB: ram }, isRecommended ? { gpu, cpu, ramGB: ram } : undefined)
}

export function estimateFpsFromRequirements(hardware: Hardware, minRawg?: string | null, recRawg?: string | null): EstimateResult {
  if (!minRawg && !recRawg) return { fps: null, label: "poor" }

  if (recRawg) {
    const gpu = extractGpuFromText(recRawg)
    const cpu = extractCpuFromText(recRawg)
    const ram = extractRamFromText(recRawg)
    if (gpu) return estimateFps(hardware, undefined, { gpu, cpu, ramGB: ram })
  }

  if (minRawg) {
    const gpu = extractGpuFromText(minRawg)
    const cpu = extractCpuFromText(minRawg)
    const ram = extractRamFromText(minRawg)
    if (gpu) return estimateFps(hardware, { gpu, cpu, ramGB: ram }, undefined)
  }

  return { fps: null, label: "poor" }
}
