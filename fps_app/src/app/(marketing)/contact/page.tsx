"use client"

import { useState } from "react"
import { Mail, User, MessageSquare, Send, CheckCircle } from "lucide-react"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [sent, setSent] = useState(false)
  const [serverError, setServerError] = useState("")

  function clearError(field: string) {
    setErrors((prev) => { const next = { ...prev }; delete next[field]; return next })
    setServerError("")
  }

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!name.trim() || name.trim().length < 2) e.name = "Name must be at least 2 characters"
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address"
    if (!message.trim() || message.trim().length < 10) e.message = "Message must be at least 10 characters"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!validate()) return

    setSaving(true)
    setServerError("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
      })
      if (!res.ok) {
        const text = await res.text()
        let msg = "Failed to send message"
        try { msg = JSON.parse(text).error } catch {}
        setServerError(msg)
        return
      }
      setSent(true)
    } catch {
      setServerError("Network error. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24">
        <div className="kinetic-card p-8 text-center space-y-4">
          <CheckCircle className="size-12 text-green-400 mx-auto" />
          <h1 className="text-headline-md">Message Sent</h1>
          <p className="text-body-lg text-on-surface-variant">
            Thank you for reaching out. We&apos;ll get back to you soon.
          </p>
          <button onClick={() => { setSent(false); setName(""); setEmail(""); setMessage("") }} className="kinetic-btn-primary mt-4">
            Send Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-24">
      <h1 className="text-headline-md text-center mb-8">Contact Us</h1>
      <form onSubmit={handleSubmit} className="kinetic-card p-6 md:p-8 space-y-5">
        {serverError && (
          <div className="rounded-lg bg-error-container/10 border border-error/20 px-4 py-2 text-sm text-error">{serverError}</div>
        )}

        <div className="space-y-2">
          <label htmlFor="name" className="text-label-caps text-on-surface-variant flex items-center gap-1.5">
            <User className="size-3.5" /> Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); clearError("name") }}
            className={`kinetic-input w-full ${errors.name ? "border-error" : ""}`}
            placeholder="Your name"
          />
          {errors.name && <p className="text-xs text-error">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-label-caps text-on-surface-variant flex items-center gap-1.5">
            <Mail className="size-3.5" /> Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearError("email") }}
            className={`kinetic-input w-full ${errors.email ? "border-error" : ""}`}
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-xs text-error">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-label-caps text-on-surface-variant flex items-center gap-1.5">
            <MessageSquare className="size-3.5" /> Message
          </label>
          <textarea
            id="message"
            rows={5}
            value={message}
            onChange={(e) => { setMessage(e.target.value); clearError("message") }}
            className={`kinetic-input w-full resize-none ${errors.message ? "border-error" : ""}`}
            placeholder="How can we help?"
          />
          {errors.message && <p className="text-xs text-error">{errors.message}</p>}
        </div>

        <button type="submit" disabled={saving} className="kinetic-btn-primary w-full disabled:opacity-50 flex items-center justify-center gap-2">
          <Send className="size-4" />
          {saving ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  )
}
