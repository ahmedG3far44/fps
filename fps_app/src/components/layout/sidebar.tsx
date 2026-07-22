"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/my-pc", label: "My PC" },
  { href: "/games", label: "Games" },
  { href: "/upgrade-planner", label: "Upgrade Planner" },
  { href: "/ai", label: "AI Assistant" },
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
  { href: "/history", label: "History" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card p-4">
      <Link href="/dashboard" className="mb-8 text-lg font-bold text-primary">
        FrameWise AI
      </Link>
      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted hover:text-foreground hover:bg-muted-background"
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
