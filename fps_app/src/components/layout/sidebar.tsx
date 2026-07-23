"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import {
  LayoutDashboard,
  Monitor,
  ArrowUpCircle,
  Settings,
  LogOut,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "ADMIN"

  const links = [
    {
      href: isAdmin ? "/admin" : "/dashboard",
      label: isAdmin ? "Admin Panel" : "Dashboard",
      icon: isAdmin ? Shield : LayoutDashboard,
    },
    { href: "/my-pc", label: "My PC", icon: Monitor },
    { href: "/upgrade-planner", label: "Upgrade Planner", icon: ArrowUpCircle },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  const isActiveLink = (href: string) => {
    if (isAdmin && href === "/admin") return pathname.startsWith("/admin")
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-outline-variant bg-surface-container p-4">
      <Link href="/" className="mb-8 text-headline-sm text-primary-container">
        FPS
      </Link>
      <nav className="flex flex-col gap-1 flex-1">
        {links.map((link) => {
          const isActive = isActiveLink(link.href)
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary-container/10 text-primary-container font-medium"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high",
              )}
            >
              <Icon className="size-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-auto flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
      >
        <LogOut className="size-4" />
        Sign Out
      </button>
    </aside>
  )
}
