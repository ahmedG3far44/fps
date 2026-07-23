export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24">
      <h1 className="text-4xl font-bold mb-8">Changelog</h1>
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold">v1.0.0 - Initial Release</h2>
          <p className="text-sm text-muted mt-2">First public release of FPS.</p>
          <ul className="mt-2 space-y-1 text-sm text-muted list-disc list-inside">
            <li>Hardware detection via companion app</li>
            <li>Game database with FPS predictions</li>
            <li>AI-powered upgrade recommendations</li>
            <li>Local market pricing</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
