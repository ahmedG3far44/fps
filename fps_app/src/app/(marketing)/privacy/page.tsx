export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose prose-invert text-muted space-y-4">
        <p>FrameWise AI respects your privacy. This policy explains how we collect, use, and protect your information.</p>
        <h2 className="text-white text-xl font-semibold mt-8">Information We Collect</h2>
        <p>We collect your PC hardware information through our companion app to provide accurate performance predictions. We also collect basic account information and usage data.</p>
        <h2 className="text-white text-xl font-semibold mt-8">How We Use Your Information</h2>
        <p>Your hardware data is used solely to generate FPS predictions, analyze bottlenecks, and recommend upgrades. We do not sell your data to third parties.</p>
      </div>
    </div>
  )
}
