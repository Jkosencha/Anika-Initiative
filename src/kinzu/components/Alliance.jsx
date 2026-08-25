import SectionHeading from './SectionHeading';

export default function Alliance({ onAirItOut }) {
  return (
    <section id="alliance" className="bg-white py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading
            kicker="Pan-African Arts Alliance"
            title="Build the alliance of the continent"
            accent="blue"
          />
          <p className="mt-4 max-w-xl font-body text-gray-700">
            The Alliance connects artists, cultural organisations, enablers, and institutions
            across the continent — trading craft, amplifying voices, and co-producing work that
            crosses borders.
          </p>
          <ul className="mt-6 space-y-3 font-body text-sm text-gray-800">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 h-2 w-2 shrink-0 bg-anika-blue" />
              Cross-border artistic residencies &amp; co-production
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 h-2 w-2 shrink-0 bg-gold" />
              Shared resource &amp; funding intelligence
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 h-2 w-2 shrink-0 bg-anika-green" />
              A collective voice for African arts
            </li>
          </ul>
          <button
            type="button"
            onClick={onAirItOut}
            className="mt-8 inline-flex items-center gap-2 bg-coral px-6 py-3 font-body text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-ink"
          >
            Apply for Membership <span aria-hidden>→</span>
          </button>
        </div>

        {/* membership application teaser */}
        <div className="border-2 border-black bg-ink p-8 text-white">
          <p className="font-body text-base font-semibold uppercase tracking-[0.25em] text-gold">Membership Application</p>
          <h3 className="mt-3 font-display text-2xl uppercase leading-tight">
            Via WhatsApp, in under 2 minutes
          </h3>
          <p className="mt-3 font-body text-base leading-relaxed text-white/80">
            Message our ANIKA assistant with the word{' '}
            <span className="font-extrabold text-gold">ALLIANCE</span> to begin your application —
            or fill in your details here and we’ll reach out.
          </p>
          <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <input className="w-full border border-white/30 bg-white px-4 py-3 font-body text-sm text-ink outline-none placeholder:text-ink/50 focus:border-gold focus:ring-2 focus:ring-gold/30" placeholder="Full name" aria-label="Full name" />
            <input className="w-full border border-white/30 bg-white px-4 py-3 font-body text-sm text-ink outline-none placeholder:text-ink/50 focus:border-gold focus:ring-2 focus:ring-gold/30" placeholder="Country" aria-label="Country" />
            <button type="submit" className="w-full border border-gold bg-gold px-5 py-3 font-body text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-cream">
              Request Membership Info
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
