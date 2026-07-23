"use client"

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === "authenticated") {
      router.push(session?.user?.onboarded ? "/dashboard" : "/onboarding")
    }
  }, [status, session, router])

  if (status === "authenticated") return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Something went wrong")
        return
      }

      const result = await signIn("credentials", { email, password, redirect: false })

      if (result?.error) {
        setError("Account created but sign-in failed. Please log in.")
      } else if (result?.ok) {
        router.push("/onboarding")
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
        <h1 className="text-headline-md text-center mb-8">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-error-container/10 border border-error/20 px-4 py-2 text-sm text-error">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="name" className="text-label-caps text-on-surface-variant block mb-1.5">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError("") }}
              className="kinetic-input w-full"
              disabled={loading}
            />
          </div>
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
              minLength={8}
            />
          </div>
          <button type="submit" disabled={loading} className="kinetic-btn-primary w-full disabled:opacity-50">
            {loading ? "Creating account..." : "Create Account"}
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
          <button onClick={() => signIn("google", { callbackUrl: "/onboarding" })} disabled={loading} className="kinetic-btn-secondary w-full disabled:opacity-50">
            Google
          </button>
          <button onClick={() => signIn("github", { callbackUrl: "/onboarding" })} disabled={loading} className="kinetic-btn-secondary w-full disabled:opacity-50">
            GitHub
          </button>
        </div>
        <p className="mt-6 text-center text-sm text-on-surface-variant">
          Already have an account?{" "}
          <Link href="/login" className="text-primary-container hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
