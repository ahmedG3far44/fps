export default function FeaturesPage() {
  const features = [
    {
      title: "Hardware Detection",
      desc: "Our companion app automatically detects your CPU, GPU, RAM, and other components for accurate analysis.",
    },
    {
      title: "FPS Predictions",
      desc: "See expected FPS for thousands of games at any resolution (720p, 1080p, 1440p, 4K) and quality setting.",
    },
    {
      title: "Bottleneck Analysis",
      desc: "Identify which component is limiting your gaming performance with AI-powered analysis.",
    },
    {
      title: "Upgrade Recommendations",
      desc: "Get personalized upgrade suggestions based on your budget and local market pricing.",
    },
    {
      title: "AI Assistant",
      desc: "Ask questions about your PC's performance, compare components, and get optimization tips.",
    },
    {
      title: "Local Pricing",
      desc: "See hardware prices in your country and currency for accurate upgrade cost estimates.",
    },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-24">
      <h1 className="text-4xl font-bold text-center mb-4">Features</h1>
      <p className="text-center text-muted mb-16 max-w-2xl mx-auto">
        Everything you need to understand and improve your PC gaming performance.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h3 className="font-semibold mb-2">{f.title}</h3>
            <p className="text-sm text-muted">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
