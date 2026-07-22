export function PriceError() {
  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-red-500/10">
          <svg className="size-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold">Price Comparison</h2>
      </div>
      <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-8 text-center">
        <p className="text-muted">
          Unable to load current prices. Try again later.
        </p>
      </div>
    </section>
  )
}
