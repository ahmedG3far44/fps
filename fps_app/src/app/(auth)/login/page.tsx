"use client"

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.role === "ADMIN") router.push("/admin")
      else router.push(session?.user?.onboarded ? "/dashboard" : "/onboarding")
    }
  }, [status, session, router])

  if (status === "authenticated") return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const check = await fetch("/api/auth/check-blocked", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const { blocked } = await check.json()
      if (blocked) {
        setError("Your account has been blocked")
        return
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else if (result?.ok) {
        router.push("/dashboard")
        router.refresh()
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-lg kinetic-card p-6 md:p-8">
        <h1 className="text-headline-md text-center mb-8">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-error-container/10 border border-error/20 px-4 py-2 text-sm text-error">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="text-label-caps text-on-surface-variant block mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError("") }}
              className="kinetic-input w-full"
              disabled={loading}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="text-label-caps text-on-surface-variant block mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError("") }}
              className="kinetic-input w-full"
              disabled={loading}
              required
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <Link href="/forgot-password" className="text-on-surface-variant hover:text-on-surface">
              Forgot password?
            </Link>
          </div>
          <button type="submit" disabled={loading} className="kinetic-btn-primary w-full disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="mt-6 space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-surface-container px-2 text-on-surface-variant">Or continue with</span>
            </div>
          </div>
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            disabled={loading}
            className="kinetic-btn-secondary w-full disabled:opacity-50"
          >
            Google
          </button>
          <button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            disabled={loading}
            className="kinetic-btn-secondary w-full disabled:opacity-50"
          >
            GitHub
          </button>
        </div>
        <p className="mt-6 text-center text-sm text-on-surface-variant">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary-container hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
