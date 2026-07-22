import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

const adminLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/games", label: "Games" },
  { href: "/admin/hardware", label: "Hardware" },
  { href: "/admin/prices", label: "Prices" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/benchmarks", label: "Benchmarks" },
  { href: "/admin/blog", label: "Blog" },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-border bg-card p-4">
        <Link href="/admin" className="mb-8 block text-lg font-bold text-primary">
          Admin Panel
        </Link>
        <nav className="flex flex-col gap-1">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-muted hover:text-foreground hover:bg-muted-background transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
