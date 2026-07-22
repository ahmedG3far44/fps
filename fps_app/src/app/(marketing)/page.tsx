import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl">
        Know Your PC&apos;s Gaming{" "}
        <span className="text-primary">Performance</span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">
        Automatically detect your PC hardware, predict expected FPS across thousands of
        games, analyze bottlenecks, and get AI-powered upgrade recommendations with
        local market pricing.
      </p>
      <div className="mt-10 flex items-center gap-4">
        <Link
          href="/register"
          className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Get Started Free
        </Link>
        <Link
          href="/games"
          className="rounded-lg border border-border px-6 py-3 text-sm font-medium hover:bg-card transition-colors"
        >
          Browse Games
        </Link>
      </div>
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {[
          { title: "Hardware Detection", desc: "Detect your PC specs automatically with our companion app" },
          { title: "FPS Predictions", desc: "See expected FPS for any game at any resolution and quality" },
          { title: "AI Upgrades", desc: "Get personalized upgrade recommendations within your budget" },
        ].map((feature) => (
          <div key={feature.title} className="rounded-xl border border-border bg-card p-6 text-left">
            <h3 className="font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
