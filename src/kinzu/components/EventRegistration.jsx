import { useState } from 'react';
import { submitRegistration } from '../lib/api';

export default function EventRegistration({ event, compact = false }) {
  const [form, setForm] = useState({ name: '', phone: '', consent: true });
  const [status, setStatus] = useState(null); // 'submitting' | 'done' | 'error'
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || form.phone.trim().length < 9) {
      setError('Please provide your full name and a valid WhatsApp number.');
      return;
    }
    setError('');
    setStatus('submitting');
    const result = await submitRegistration({
      name: form.name.trim(),
      phone: form.phone.trim(),
      eventTitle: event?.title || 'General event',
      consent: form.consent,
      source: 'web',
    });
    if (result.ok) setStatus('done');
    else setStatus('error');
  }

  return (
    <form onSubmit={handleSubmit} className={`border-2 border-black bg-white ${compact ? 'p-5' : 'p-7'}`}>
      <h3 className="font-display text-xl uppercase tracking-wide">Register to Attend</h3>

      <div className="mt-5 space-y-5">
        <div>
          <label htmlFor={`${event?.id}-name`} className="mb-1 block font-body text-xs font-extrabold uppercase tracking-wider">
            Full Name *
          </label>
          <input
            id={`${event?.id}-name`}
            type="text"
            className="w-full border border-ink/25 bg-white px-4 py-3 font-body text-sm text-ink outline-none placeholder:text-ink/40 focus:border-coral focus:ring-2 focus:ring-coral/20"
            placeholder="Jane Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor={`${event?.id}-phone`} className="mb-1 block font-body text-xs font-extrabold uppercase tracking-wider">
            WhatsApp Number *
          </label>
          <input
            id={`${event?.id}-phone`}
            type="tel"
            className="w-full border border-ink/25 bg-white px-4 py-3 font-body text-sm text-ink outline-none placeholder:text-ink/40 focus:border-coral focus:ring-2 focus:ring-coral/20"
            placeholder="+254 712 345 678"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <label className="flex cursor-pointer items-start gap-3 border border-anika-green/30 bg-anika-green/10 p-4">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => setForm({ ...form, consent: e.target.checked })}
            className="mt-1 h-4 w-4 accent-green"
          />
          <span className="font-body text-sm leading-relaxed text-gray-800">
            Receive instant registration updates, event reminders, and follow-ups via WhatsApp.
          </span>
        </label>

        {error && <p className="font-body text-sm font-semibold text-coral">{error}</p>}
        {status === 'error' && (
          <p className="font-body text-sm font-semibold text-coral">
            Something went wrong. Please try again or message our WhatsApp assistant.
          </p>
        )}

        {status === 'done' ? (
          <div className="border border-anika-green bg-anika-green p-4 font-body text-sm font-bold uppercase tracking-wide text-white">
            ✦ You’re in! A WhatsApp confirmation is on its way.
          </div>
        ) : (
          <button type="submit" disabled={status === 'submitting'} className="w-full bg-coral px-5 py-3 font-body text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60">
            {status === 'submitting' ? 'Sending…' : 'Confirm Registration'}
            {status !== 'submitting' && <span aria-hidden>→</span>}
          </button>
        )}
      </div>

      <p className="mt-4 font-body text-[11px] uppercase tracking-wider text-gray-500">
        Ethical rule: <span className="font-extrabold text-coral">Open, never expose.</span>
      </p>
    </form>
  );
}
