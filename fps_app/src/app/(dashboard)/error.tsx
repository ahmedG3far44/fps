"use client"

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h2 className="text-xl font-bold">Something went wrong</h2>
      <p className="text-sm text-muted">{error.message}</p>
      <button
        onClick={() => unstable_retry()}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Try again
      </button>
    </div>
  )
}