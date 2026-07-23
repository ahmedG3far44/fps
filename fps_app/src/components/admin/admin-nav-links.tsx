"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Cpu, Users, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

const adminLinks = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/hardware", label: "Hardware", icon: Cpu },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/messages", label: "Messages", icon: Mail },
]

export function AdminNavLinks() {
  const pathname = usePathname()

  return (
    <>
      {adminLinks.map((link) => {
        const isActive = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href)
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
    </>
  )
}
