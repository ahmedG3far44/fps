export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24">
      <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-on-surface-variant mb-8">Last updated: July 2026</p>

      <div className="prose prose-invert text-on-surface-variant space-y-6 max-w-none">
        <p>
          Welcome to FPS. By accessing or using our service, you agree to be bound by these Terms of Service.
          If you do not agree, do not use the service.
        </p>

        <h2 className="text-on-surface text-xl font-semibold mt-10">1. Description of Service</h2>
        <p>
          FPS is a PC gaming performance analysis platform that helps you understand your hardware&apos;s gaming
          capabilities. The service includes:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Hardware Profile Management</strong> — Manual entry of your CPU, GPU, RAM, storage, and OS specifications.</li>
          <li><strong>FPS Prediction Engine</strong> — Estimates expected frames-per-second for thousands of games across four resolutions (720p, 1080p, 1440p, 4K) at multiple quality presets, using both rule-based algorithms and AI models.</li>
          <li><strong>Bottleneck Analysis</strong> — Identifies which component limits your performance and explains why.</li>
          <li><strong>AI Chat Assistant</strong> — A conversational assistant that answers questions about PC performance, component comparisons, and game optimization, using your hardware profile as context.</li>
          <li><strong>AI System Requirements Generation</strong> — Generates minimum and recommended system requirements for games not yet in our database.</li>
          <li><strong>Upgrade Planner</strong> — Recommends GPU and CPU upgrades within a given budget to reach a target resolution and frame rate, using real market pricing.</li>
          <li><strong>Game Browser</strong> — Browse, search, and filter thousands of games with details including screenshots, trailers, ratings, and system requirements.</li>
          <li><strong>Price Comparison</strong> — Aggregates game prices from official stores and authorized resellers in your local currency.</li>
          <li><strong>Search History</strong> — Tracks your recent searches for quick re-access.</li>
        </ul>

        <h2 className="text-on-surface text-xl font-semibold mt-10">2. Account Registration</h2>
        <p>
          You may register using email/password or through a third-party provider (Google, GitHub). You are
          responsible for maintaining the confidentiality of your credentials and for all activity that occurs
          under your account. You must be at least 13 years old to create an account.
        </p>

        <h2 className="text-on-surface text-xl font-semibold mt-10">3. Your Hardware Data</h2>
        <p>
          You manually enter your PC hardware specifications (CPU, GPU, RAM, storage, OS). This data is used
          to generate performance predictions and upgrade recommendations. You may update or delete your
          hardware profile at any time from the Settings page. We do not automatically collect or scan your
          hardware — all data is user-provided.
        </p>

        <h2 className="text-on-surface text-xl font-semibold mt-10">4. AI-Generated Content</h2>
        <p>
          FPS uses AI models (currently GPT-4o-mini via OpenRouter) to estimate FPS, generate system
          requirements, and power the chat assistant. AI-generated predictions and recommendations are
          <strong> estimates only</strong>. They are based on benchmark data, hardware specifications, and model
          reasoning — not real-world testing. Actual performance may vary due to drivers, background processes,
          game updates, thermal throttling, and other factors.
        </p>

        <h2 className="text-on-surface text-xl font-semibold mt-10">5. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Use automated tools (bots, scrapers) to access or extract data from the service.</li>
          <li>Attempt to bypass rate limits, authentication, or access controls.</li>
          <li>Use the service for any unlawful purpose.</li>
          <li>Impersonate another person or misrepresent your identity.</li>
          <li>Reverse-engineer or decompile any part of the service.</li>
        </ul>

        <h2 className="text-on-surface text-xl font-semibold mt-10">6. Intellectual Property</h2>
        <p>
          All content, design, code, and branding on FPS are owned by FPS and protected by applicable
          intellectual property laws. Game names, images, and data displayed on the service are the property
          of their respective owners and are used for identification and informational purposes only.
        </p>

        <h2 className="text-on-surface text-xl font-semibold mt-10">7. Third-Party Services</h2>
        <p>FPS integrates with the following third-party services:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>RAWG API</strong> — Game database, screenshots, trailers, system requirements, and ratings.</li>
          <li><strong>CheapShark API</strong> — Game pricing and deal aggregation from multiple stores.</li>
          <li><strong>OpenRouter</strong> — AI model inference for FPS estimation and requirements generation.</li>
          <li><strong>Google / GitHub</strong> — Optional OAuth authentication providers.</li>
        </ul>
        <p>
          Your use of these integrations is subject to their respective terms of service. We do not control
          their availability or accuracy.
        </p>

        <h2 className="text-on-surface text-xl font-semibold mt-10">8. Pricing and Payments</h2>
        <p>
          FPS offers a free tier and a Pro tier ($9/month). Free-tier users receive basic FPS predictions,
          game browsing, and limited AI chats (3 per month). Pro users receive unlimited AI chats, detailed
          bottleneck analysis, the upgrade planner, and local market pricing. Payments are processed by our
          payment provider. You may cancel your subscription at any time.
        </p>

        <h2 className="text-on-surface text-xl font-semibold mt-10">9. Disclaimer of Warranties</h2>
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER
          EXPRESS OR IMPLIED. FPS DOES NOT WARRANT THAT PERFORMANCE PREDICTIONS, UPGRADE RECOMMENDATIONS,
          OR AI-GENERATED CONTENT ARE ACCURATE, COMPLETE, OR RELIABLE. USE THE SERVICE AT YOUR OWN RISK.
        </p>

        <h2 className="text-on-surface text-xl font-semibold mt-10">10. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, FPS shall not be liable for any indirect, incidental,
          special, consequential, or punitive damages, or any loss of profits or revenue, whether incurred
          directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting
          from your use of the service.
        </p>

        <h2 className="text-on-surface text-xl font-semibold mt-10">11. Termination</h2>
        <p>
          We may suspend or terminate your account at any time for violations of these terms. You may delete
          your account at any time through the Settings page or by contacting us. Upon termination, your data
          will be deleted in accordance with our Privacy Policy.
        </p>

        <h2 className="text-on-surface text-xl font-semibold mt-10">12. Changes to These Terms</h2>
        <p>
          We may update these terms from time to time. Continued use of the service after changes
          constitutes acceptance of the revised terms. We will notify registered users of material changes.
        </p>

        <h2 className="text-on-surface text-xl font-semibold mt-10">13. Contact</h2>
        <p>
          Questions about these terms? Contact us through the{" "}
          <a href="/contact" className="text-primary-container hover:underline">contact page</a>.
        </p>
      </div>
    </div>
  )
}
