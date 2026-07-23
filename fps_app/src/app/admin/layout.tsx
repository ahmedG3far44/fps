import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { AdminSidebarActions } from "@/components/admin/admin-sidebar-actions"
import { AdminNavLinks } from "@/components/admin/admin-nav-links"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") redirect("/dashboard")

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-outline-variant bg-surface-container p-4 flex flex-col shrink-0">
        <Link href="/admin" className="mb-8 block text-headline-sm text-primary-container">
          Admin Panel
        </Link>
        <nav className="flex flex-col gap-1 flex-1">
          <AdminNavLinks />
        </nav>
        <AdminSidebarActions />
      </aside>
      <main className="flex-1 p-4 md:p-6 overflow-x-hidden">{children}</main>
    </div>
  )
}
