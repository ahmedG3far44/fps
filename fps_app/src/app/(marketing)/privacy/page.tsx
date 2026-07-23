export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24">
      <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-on-surface-variant mb-8">Last updated: July 2026</p>

      <div className="prose prose-invert text-on-surface-variant space-y-6 max-w-none">
        <p>
          FPS (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your privacy. This policy explains
          what data we collect, how we use it, and how we protect it.
        </p>

        <h2 className="text-on-surface text-xl font-semibold mt-10">1. Information We Collect</h2>

        <h3 className="text-on-surface text-lg font-medium mt-6">Account Information</h3>
        <p>When you register, we collect:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Name and email address</li>
          <li>Password hash (bcrypt, never stored in plain text)</li>
          <li>Profile image (if using Google or GitHub OAuth)</li>
          <li>Authentication tokens for OAuth providers (Google, GitHub)</li>
        </ul>

        <h3 className="text-on-surface text-lg font-medium mt-6">Hardware Profile</h3>
        <p>You manually provide your PC specifications:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>CPU model (e.g., Intel Core i7-14700K, AMD Ryzen 7 7800X3D)</li>
          <li>GPU model (e.g., NVIDIA RTX 4070, AMD RX 7800 XT)</li>
          <li>RAM amount (4–256 GB)</li>
          <li>Storage size and type (SSD, HDD, NVMe, SSHD)</li>
          <li>Operating system (Windows, macOS, Linux, SteamOS)</li>
        </ul>
        <p>
          We do not automatically scan or detect your hardware. All hardware data is entered by you
          and can be updated or deleted at any time from the My PC or Settings pages.
        </p>

        <h3 className="text-on-surface text-lg font-medium mt-6">Usage Data</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Game searches and browsing history (last 50 queries stored per account)</li>
          <li>AI chat conversations (message content, model used, token count)</li>
          <li>Pages visited and features used within the service</li>
          <li>Country/region (determined from your IP address by our hosting provider, used for local pricing)</li>
        </ul>

        <h3 className="text-on-surface text-lg font-medium mt-6">Contact Messages</h3>
        <p>
          If you contact us through the contact form, we collect your name, email, and message content.
          These are stored for support purposes and are accessible to our admin team.
        </p>

        <h2 className="text-on-surface text-xl font-semibold mt-10">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>FPS Predictions</strong> — Your hardware profile and game selection are processed by our estimation engine and AI models to generate performance predictions.</li>
          <li><strong>Upgrade Recommendations</strong> — Your hardware data is compared against a database of hardware benchmarks and market prices to suggest optimal upgrades.</li>
          <li><strong>AI Chat</strong> — Your messages and hardware profile are sent to OpenRouter (GPT-4o-mini) to generate contextual responses about PC performance.</li>
          <li><strong>Local Pricing</strong> — Your country setting is used to fetch game prices in your local currency via CheapShark.</li>
          <li><strong>Service Improvement</strong> — Aggregated, anonymized usage patterns help us improve the service.</li>
          <li><strong>Account Management</strong> — Authentication, security, and customer support.</li>
        </ul>

        <h2 className="text-on-surface text-xl font-semibold mt-10">3. How We Share Your Information</h2>
        <p>We do <strong>not</strong> sell your personal data. We share data only in these cases:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Third-Party Service Providers</strong> — Data is sent to OpenRouter (AI inference), CheapShark (pricing), and RAWG (game data) solely to provide the features you use. These providers process data under their own privacy policies.</li>
          <li><strong>Legal Requirements</strong> — We may disclose data if required by law, court order, or governmental request.</li>
          <li><strong>Business Transfers</strong> — In the event of a merger, acquisition, or sale of assets, user data may be transferred as part of that transaction.</li>
        </ul>

        <h2 className="text-on-surface text-xl font-semibold mt-10">4. Data Retention</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Account data</strong> — Retained until you delete your account.</li>
          <li><strong>Hardware profile</strong> — Retained until you update or delete it.</li>
          <li><strong>AI conversations</strong> — Retained until you delete your account.</li>
          <li><strong>Search history</strong> — Last 50 queries retained per account; older entries are automatically pruned.</li>
          <li><strong>Contact messages</strong> — Retained indefinitely for support reference.</li>
        </ul>

        <h2 className="text-on-surface text-xl font-semibold mt-10">5. Data Security</h2>
        <p>
          We implement industry-standard security measures including encrypted data transmission (TLS/HTTPS),
          bcrypt password hashing (12 rounds), session-based authentication with secure tokens, and
          role-based access control for administrative features. However, no method of transmission or
          storage is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2 className="text-on-surface text-xl font-semibold mt-10">6. Your Rights</h2>
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Access</strong> — Request a copy of the data we hold about you.</li>
          <li><strong>Rectification</strong> — Correct inaccurate personal data.</li>
          <li><strong>Erasure</strong> — Request deletion of your account and associated data.</li>
          <li><strong>Portability</strong> — Receive your data in a machine-readable format.</li>
          <li><strong>Objection</strong> — Object to processing of your personal data.</li>
        </ul>
        <p>
          To exercise these rights, contact us through the{" "}
          <a href="/contact" className="text-primary-container hover:underline">contact page</a> or
          delete your account from the Settings page.
        </p>

        <h2 className="text-on-surface text-xl font-semibold mt-10">7. Cookies and Local Storage</h2>
        <p>
          FPS uses session cookies for authentication and local storage for UI preferences (theme, sidebar
          state). We do not use advertising cookies or third-party tracking scripts.
        </p>

        <h2 className="text-on-surface text-xl font-semibold mt-10">8. Children&apos;s Privacy</h2>
        <p>
          FPS is not directed at children under 13. We do not knowingly collect personal data from children.
          If you believe a child has provided us with personal data, contact us to have it removed.
        </p>

        <h2 className="text-on-surface text-xl font-semibold mt-10">9. International Data Transfers</h2>
        <p>
          Your data may be processed in countries other than your own. Our infrastructure is hosted on
          Vercel (global edge network). By using FPS, you consent to the transfer of your data to these
          locations.
        </p>

        <h2 className="text-on-surface text-xl font-semibold mt-10">10. Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. We will notify registered users of material
          changes via email or in-app notification. Continued use of the service after changes constitutes
          acceptance of the revised policy.
        </p>

        <h2 className="text-on-surface text-xl font-semibold mt-10">11. Contact</h2>
        <p>
          Questions about this policy? Contact us through the{" "}
          <a href="/contact" className="text-primary-container hover:underline">contact page</a>.
        </p>
      </div>
    </div>
  )
}
