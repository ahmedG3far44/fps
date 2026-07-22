export default function ContactPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24">
      <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
      <form className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
          <input id="name" type="text" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input id="email" type="email" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" required />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
          <textarea id="message" rows={5} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" required />
        </div>
        <button type="submit" className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
          Send Message
        </button>
      </form>
    </div>
  )
}
