// src/features/about/components/GovernanceCallout.jsx
import { Link } from 'react-router-dom'
import { governance } from '../data/aboutContent'

export default function GovernanceCallout() {
  return (
    <section className="bg-cream px-6 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-6 rounded-2xl border border-anika-blue/20 bg-anika-blue/5 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <p className="font-body text-sm font-semibold uppercase tracking-[0.25em] text-anika-blue">
              {governance.eyebrow}
            </p>
            <h3 className="mt-2 font-display text-2xl uppercase text-ink sm:text-3xl">
              {governance.heading}
            </h3>
            <p className="mt-2 max-w-md font-body text-sm leading-relaxed text-ink/70">
              {governance.body}
            </p>
          </div>

          <Link
            to={governance.ctaHref}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-anika-blue px-6 py-3 font-body text-sm font-semibold uppercase tracking-wide text-cream transition hover:bg-anika-blue/90"
          >
            {governance.ctaLabel}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
