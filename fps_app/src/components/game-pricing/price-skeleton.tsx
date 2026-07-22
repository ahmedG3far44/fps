export function PriceSkeleton() {
  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center gap-3">
        <div className="size-10 animate-pulse rounded-lg bg-muted-background" />
        <div className="space-y-1.5">
          <div className="h-6 w-48 animate-pulse rounded bg-muted-background" />
          <div className="h-4 w-28 animate-pulse rounded bg-muted-background" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start gap-4">
            <div className="size-16 animate-pulse rounded-xl bg-muted-background" />
            <div className="flex-1 space-y-3">
              <div className="h-5 w-32 animate-pulse rounded bg-muted-background" />
              <div className="h-8 w-24 animate-pulse rounded bg-muted-background" />
              <div className="flex gap-2">
                <div className="h-5 w-16 animate-pulse rounded-full bg-muted-background" />
                <div className="h-5 w-20 animate-pulse rounded bg-muted-background" />
              </div>
            </div>
            <div className="hidden h-10 w-28 animate-pulse rounded-xl bg-muted-background sm:block" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="size-7 animate-pulse rounded-md bg-muted-background" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted-background" />
          </div>
          <div className="h-20 animate-pulse rounded-xl bg-card" />
          <div className="h-20 animate-pulse rounded-xl bg-card" />
        </div>
      </div>
    </section>
  )
}
