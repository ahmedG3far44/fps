import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-8">
        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} FPS. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="text-sm text-muted hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="text-sm text-muted hover:text-foreground transition-colors">
            Terms
          </Link>
          <Link href="/contact" className="text-sm text-muted hover:text-foreground transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
