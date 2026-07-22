"use client"

interface PlatformBadgeProps {
  name: string
  slug: string
}

const platformStyles: Record<string, { color: string; bg: string; icon: string }> = {
  pc: { color: "#ffffff", bg: "#2a2a2a", icon: "🖥" },
  playstation: { color: "#ffffff", bg: "#003791", icon: "🎮" },
  playstation2: { color: "#ffffff", bg: "#003791", icon: "🎮" },
  playstation3: { color: "#ffffff", bg: "#003791", icon: "🎮" },
  playstation4: { color: "#ffffff", bg: "#003791", icon: "🎮" },
  playstation5: { color: "#ffffff", bg: "#003791", icon: "🎮" },
  ps: { color: "#ffffff", bg: "#003791", icon: "🎮" },
  ps1: { color: "#ffffff", bg: "#003791", icon: "🎮" },
  ps2: { color: "#ffffff", bg: "#003791", icon: "🎮" },
  ps3: { color: "#ffffff", bg: "#003791", icon: "🎮" },
  ps4: { color: "#ffffff", bg: "#003791", icon: "🎮" },
  ps5: { color: "#ffffff", bg: "#003791", icon: "🎮" },
  "ps-vita": { color: "#ffffff", bg: "#003791", icon: "🎮" },
  psp: { color: "#ffffff", bg: "#003791", icon: "🎮" },
  xbox: { color: "#ffffff", bg: "#107C10", icon: "🎮" },
  xbox360: { color: "#ffffff", bg: "#107C10", icon: "🎮" },
  xboxone: { color: "#ffffff", bg: "#107C10", icon: "🎮" },
  "xbox-series-x": { color: "#ffffff", bg: "#107C10", icon: "🎮" },
  "xbox-series-s": { color: "#ffffff", bg: "#107C10", icon: "🎮" },
  "xbox-old": { color: "#ffffff", bg: "#107C10", icon: "🎮" },
  nintendo: { color: "#ffffff", bg: "#E60012", icon: "🎮" },
  "nintendo-64": { color: "#ffffff", bg: "#E60012", icon: "🎮" },
  "nintendo-ds": { color: "#ffffff", bg: "#E60012", icon: "🎮" },
  "nintendo-3ds": { color: "#ffffff", bg: "#E60012", icon: "🎮" },
  "nintendo-switch": { color: "#ffffff", bg: "#E60012", icon: "🎮" },
  "nintendo-wii": { color: "#ffffff", bg: "#E60012", icon: "🎮" },
  "nintendo-wii-u": { color: "#ffffff", bg: "#E60012", icon: "🎮" },
  gameboy: { color: "#ffffff", bg: "#8B5CF6", icon: "🎮" },
  "game-boy": { color: "#ffffff", bg: "#8B5CF6", icon: "🎮" },
  "game-boy-advance": { color: "#ffffff", bg: "#8B5CF6", icon: "🎮" },
  "game-boy-color": { color: "#ffffff", bg: "#8B5CF6", icon: "🎮" },
  "gameboy-advance": { color: "#ffffff", bg: "#8B5CF6", icon: "🎮" },
  "gameboy-color": { color: "#ffffff", bg: "#8B5CF6", icon: "🎮" },
  sega: { color: "#ffffff", bg: "#0055A4", icon: "🎮" },
  dreamcast: { color: "#ffffff", bg: "#0055A4", icon: "🎮" },
  "sega-saturn": { color: "#ffffff", bg: "#0055A4", icon: "🎮" },
  "sega-genesis": { color: "#ffffff", bg: "#0055A4", icon: "🎮" },
  "sega-master-system": { color: "#ffffff", bg: "#0055A4", icon: "🎮" },
  "sega-game-gear": { color: "#ffffff", bg: "#0055A4", icon: "🎮" },
  mac: { color: "#ffffff", bg: "#555555", icon: "💻" },
  "macos": { color: "#ffffff", bg: "#555555", icon: "💻" },
  "apple-macintosh": { color: "#ffffff", bg: "#555555", icon: "💻" },
  linux: { color: "#ffffff", bg: "#dd4814", icon: "🐧" },
  android: { color: "#ffffff", bg: "#3DDC84", icon: "📱" },
  ios: { color: "#ffffff", bg: "#000000", icon: "📱" },
  web: { color: "#ffffff", bg: "#4285F4", icon: "🌐" },
  steam: { color: "#ffffff", bg: "#1b2838", icon: "🖥" },
  "steam-os": { color: "#ffffff", bg: "#1b2838", icon: "🖥" },
  epic: { color: "#ffffff", bg: "#313131", icon: "🖥" },
  "epic-games": { color: "#ffffff", bg: "#313131", icon: "🖥" },
  gog: { color: "#ffffff", bg: "#8B4513", icon: "🖥" },
}

function getPlatformStyle(slug: string) {
  const key = slug.toLowerCase().replace(/\s+/g, "-")
  return platformStyles[key] || { color: "#ffffff", bg: "#555555", icon: "🎮" }
}

function PlatformIcon({ style, size }: { style: { icon: string }; size: number }) {
  const text = style.icon
  return (
    <span className="shrink-0 leading-none" style={{ fontSize: size }}>
      {text}
    </span>
  )
}

export function PlatformBadge({ name, slug }: PlatformBadgeProps) {
  const style = getPlatformStyle(slug)
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      <PlatformIcon style={style} size={12} />
      {name}
    </span>
  )
}

export function PlatformIconOnly({ slug, size = 16 }: { slug: string; size?: number }) {
  const style = getPlatformStyle(slug)
  return <PlatformIcon style={style} size={size} />
}
