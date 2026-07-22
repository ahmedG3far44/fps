"use client"

import { useState } from "react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    if (res.ok) setSent(true)
  }

  if (sent) {
    return (
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-4">Check Your Email</h1>
        <p className="text-muted text-sm">
          If an account with that email exists, we&apos;ve sent a password reset link.
        </p>
        <Link href="/login" className="mt-6 inline-block text-sm text-primary hover:underline">
          Back to Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold text-center mb-2">Forgot Password</h1>
      <p className="text-sm text-muted text-center mb-8">
        Enter your email and we&apos;ll send you a reset link.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Send Reset Link
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
