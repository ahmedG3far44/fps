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

  useEffect(() => {
    if (status === "authenticated") router.push("/games")
  }, [status, router])

  if (status === "authenticated") return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Invalid email or password")
    } else {
      router.push("/games")
      router.refresh()
    }
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold text-center mb-8">Sign In</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2 text-sm text-red-500">
            {error}
          </div>
        )}
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
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            required
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <Link href="/forgot-password" className="text-muted hover:text-foreground">
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Sign In
        </button>
      </form>
      <div className="mt-6 space-y-3">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-muted">Or continue with</span>
          </div>
        </div>
        <button
          onClick={() => signIn("google", { callbackUrl: "/games" })}
          className="w-full rounded-lg border border-border px-4 py-2 text-sm hover:bg-card transition-colors"
        >
          Google
        </button>
        <button
          onClick={() => signIn("github", { callbackUrl: "/games" })}
          className="w-full rounded-lg border border-border px-4 py-2 text-sm hover:bg-card transition-colors"
        >
          GitHub
        </button>
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
