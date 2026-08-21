import { useState } from 'react'

const BENEFITS = [
  { title: 'Residencies', text: 'Priority access to cross-border artistic residencies.', accent: 'gold' },
  { title: 'Co-production', text: 'Co-produce work with partners across the continent.', accent: 'green' },
  { title: 'Funding Intel', text: 'Shared intelligence on grants and funding opportunities.', accent: 'blue' },
  { title: 'Collective Voice', text: 'A stronger, united voice for African arts in policy spaces.', accent: 'coral' },
];

const accentBar = {
  gold: 'bg-gold',
  green: 'bg-anika-green',
  blue: 'bg-anika-blue',
  coral: 'bg-coral',
};

export default function AlliancePage() {
  const [form, setForm] = useState({ name: '', org: '', country: '', phone: '', role: '', consent: true });
  const [status, setStatus] = useState(null);

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || form.phone.trim().length < 9) {
      setStatus('error')
      return
    }
    setStatus('done')
  }

  return (
    <main className="min-h-screen bg-cream">
      <section className="bg-ink px-6 py-16 text-cream md:px-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="font-body text-sm font-semibold uppercase tracking-[0.25em] text-anika-blue">
            Pan-African Arts Alliance
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl uppercase leading-[0.95] sm:text-7xl">
            Join the <span className="text-coral">Alliance.</span>
          </h1>
          <p className="mt-6 max-w-2xl font-editorial text-xl italic text-cream/80 sm:text-2xl">
            A living network for artists, cultural organisations, enablers and institutions
            building work that crosses borders.
          </p>
        </div>
      </section>

      <section className="bg-white px-6 py-20 md:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div>
            <p className="font-body text-sm font-semibold uppercase tracking-[0.25em] text-anika-blue">
              Member benefits
            </p>
            <h2 className="mt-3 max-w-lg font-display text-4xl uppercase leading-tight text-ink sm:text-5xl">
              Build further, together.
            </h2>
            <p className="mt-4 max-w-xl font-body text-lg leading-8 text-ink/70">
              The Alliance turns shared ambition into practical exchange, stronger work and a
              collective voice for African arts.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {BENEFITS.map((b) => (
                <div key={b.title} className="border border-ink/15 bg-cream p-5">
                  <div className={`h-1.5 w-10 ${accentBar[b.accent]}`} />
                  <h3 className="mt-4 font-display text-lg uppercase tracking-wide text-ink">{b.title}</h3>
                  <p className="mt-2 font-body text-sm leading-6 text-ink/70">{b.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-ink/15 bg-cream p-6 sm:p-8">
            <p className="font-body text-sm font-semibold uppercase tracking-[0.25em] text-coral">Membership application</p>
            <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-ink">
              Apply in under 2 minutes
            </h2>
            <p className="mt-3 font-body text-sm leading-6 text-ink/70">
              Share a few details and the ANIKA team will follow up via WhatsApp.
            </p>

            {status === 'done' ? (
              <div className="mt-6 border border-anika-green bg-anika-green p-5 text-white">
                <p className="font-display text-xl uppercase tracking-wide">Application received.</p>
                <p className="mt-2 font-body text-sm leading-6">
                  Thank you, {form.name || 'friend'}. We’ll be in touch on WhatsApp shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="a-name" className="mb-1 block font-body text-xs font-extrabold uppercase">
                    Full Name *
                  </label>
                  <input
                    id="a-name"
                    className="field w-full border border-ink/25 bg-white px-4 py-3 font-body text-sm text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-anika-blue focus:ring-2 focus:ring-anika-blue/20"
                    placeholder="Peter Kariuki"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="a-org" className="mb-1 block font-body text-xs font-extrabold uppercase">
                      Organisation
                    </label>
                    <input
                      id="a-org"
                      className="field w-full border border-ink/25 bg-white px-4 py-3 font-body text-sm text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-anika-blue focus:ring-2 focus:ring-anika-blue/20"
                      placeholder="Lake Arts Collective"
                      value={form.org}
                      onChange={(e) => setForm({ ...form, org: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="a-country" className="mb-1 block font-body text-xs font-extrabold uppercase">
                      Country
                    </label>
                    <input
                      id="a-country"
                      className="field w-full border border-ink/25 bg-white px-4 py-3 font-body text-sm text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-anika-blue focus:ring-2 focus:ring-anika-blue/20"
                      placeholder="Kenya"
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="a-role" className="mb-1 block font-body text-xs font-extrabold uppercase">
                    I am a…
                  </label>
                  <select
                    id="a-role"
                    className="field w-full border border-ink/25 bg-white px-4 py-3 font-body text-sm text-ink outline-none transition-colors focus:border-anika-blue focus:ring-2 focus:ring-anika-blue/20"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="">Select role</option>
                    <option>Artist</option>
                    <option>Cultural Organisation</option>
                    <option>Enabler / Partner</option>
                    <option>Institution</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="a-phone" className="mb-1 block font-body text-xs font-extrabold uppercase">
                    WhatsApp Number *
                  </label>
                  <input
                    id="a-phone"
                    type="tel"
                    className="field w-full border border-ink/25 bg-white px-4 py-3 font-body text-sm text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-anika-blue focus:ring-2 focus:ring-anika-blue/20"
                    placeholder="+254 712 345 678"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <label className="flex cursor-pointer items-start gap-3 border border-anika-green/30 bg-anika-green/10 p-3">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                    className="mt-1 h-4 w-4 accent-green"
                  />
                  <span className="font-body text-sm leading-6 text-ink/80">
                    I agree to receive Alliance updates via WhatsApp.
                  </span>
                </label>

                {status === 'error' && (
                  <p className="font-body text-sm font-semibold text-coral">
                    Please provide your name and a valid WhatsApp number.
                  </p>
                )}

                <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full">
                  {status === 'submitting' ? 'Submitting...' : 'Request Membership'}
                  {status !== 'submitting' && <span aria-hidden>→</span>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

