import { useState } from 'react'
import { resolveApiBase } from '../lib/apiBaseUrl'

/**
 * Shared newsletter subscribe band -- used on the homepage and reused
 * (same look) by the Get Involved page's own newsletter and unsubscribe
 * sections, so all three read as one consistent design instead of three
 * different treatments of the same idea.
 */
export default function NewsletterSignup({
  eyebrow = 'Stay Connected',
  heading = "Don't miss what's next.",
  body = 'Get event invites, new stories and open calls for artists straight to your inbox.',
}) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [message, setMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    setMessage('')
    try {
      const API_BASE = resolveApiBase('')
      const res = await fetch(`${API_BASE}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Subscription failed.')
      setStatus('done')
      setMessage(data.message || "You're on the list. Check your inbox for a confirmation.")
      setEmail('')
    } catch (err) {
      setStatus('error')
      setMessage(err.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <section className="bg-cream px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-body text-base font-semibold uppercase tracking-[0.25em] text-coral">
          {eyebrow}
        </p>
        <h2 className="mt-3 font-display text-3xl uppercase text-ink sm:text-4xl">{heading}</h2>
        <p className="mt-4 font-body text-base leading-relaxed text-ink/60">{body}</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 font-body text-sm text-ink outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/20 sm:max-w-sm"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="shrink-0 rounded-lg bg-ink px-6 py-3 font-body text-sm font-bold uppercase tracking-wide text-cream transition hover:opacity-90 disabled:opacity-60"
          >
            {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 font-body text-sm ${status === 'error' ? 'text-red-600' : 'text-anika-green'}`}
          >
            {message}
          </p>
        )}
      </div>
    </section>
  )
}
