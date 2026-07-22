"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!token) {
      setError("Invalid reset link")
      return
    }
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    })
    if (res.ok) {
      setDone(true)
      setTimeout(() => router.push("/login"), 3000)
    } else {
      const data = await res.json()
      setError(data.error || "Something went wrong")
    }
  }

  if (done) {
    return (
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-4">Password Reset</h1>
        <p className="text-muted text-sm">Redirecting to sign in...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold text-center mb-8">Reset Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2 text-sm text-red-500">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            New Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            required
            minLength={8}
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Reset Password
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/login" className="text-primary hover:underline">
          Back to Sign In
        </Link>
      </p>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-muted text-sm">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
