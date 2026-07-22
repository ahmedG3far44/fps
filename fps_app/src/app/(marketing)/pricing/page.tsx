import Link from "next/link"

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      desc: "Get started with basic features",
      features: [
        "Hardware detection",
        "Game search & browsing",
        "Basic FPS predictions",
        "3 AI chats per month",
      ],
    },
    {
      name: "Pro",
      price: "$9",
      desc: "For serious gamers",
      features: [
        "Everything in Free",
        "Unlimited AI chats",
        "Detailed bottleneck analysis",
        "Upgrade planner",
        "Local pricing data",
      ],
      popular: true,
    },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-24">
      <h1 className="text-4xl font-bold text-center mb-4">Pricing</h1>
      <p className="text-center text-muted mb-16">
        Choose the plan that fits your needs.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl border p-8 ${
              plan.popular
                ? "border-primary bg-primary/5"
                : "border-border bg-card"
            }`}
          >
            {plan.popular && (
              <span className="mb-4 inline-block rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                Most Popular
              </span>
            )}
            <h2 className="text-2xl font-bold">{plan.name}</h2>
            <p className="mt-2 text-4xl font-bold">
              {plan.price}
              <span className="text-lg font-normal text-muted">/mo</span>
            </p>
            <p className="mt-2 text-sm text-muted">{plan.desc}</p>
            <ul className="mt-6 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="text-sm flex items-center gap-2">
                  <span className="text-primary">&check;</span> {f}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className={`mt-8 block w-full rounded-lg px-4 py-2 text-center text-sm font-medium ${
                plan.popular
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "border border-border hover:bg-card"
              } transition-colors`}
            >
              Get Started
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
