"use client"

import { signOut } from "next-auth/react"
import Link from "next/link"
import { Home, LogOut } from "lucide-react"

export function AdminSidebarActions() {
  return (
    <div className="mt-auto flex flex-col gap-1">
      <Link
        href="/"
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
      >
        <Home className="size-4" />
        Home
      </Link>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
      >
        <LogOut className="size-4" />
        Sign Out
      </button>
    </div>
  )
}
