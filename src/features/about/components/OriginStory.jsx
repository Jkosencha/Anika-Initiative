// src/features/about/components/OriginStory.jsx
import { origin } from '../data/aboutContent'

const facts = [
  {
    value: origin.founded.year,
    label: 'Founded',
    detail: origin.founded.description,
  },
  {
    value: origin.registered.year,
    label: 'Registered',
    detail: origin.registered.description,
  },
  {
    value: origin.founders.label,
    label: 'Founding team',
    detail: origin.founders.description,
  },
  {
    value: `${origin.countries.count} countries`,
    label: origin.countries.list.join(' · '),
    detail: origin.countries.description,
  },
]

export default function OriginStory() {
  return (
    <section className="bg-cream px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <p className="font-body text-sm font-semibold uppercase tracking-[0.25em] text-anika-green">
          {origin.eyebrow}
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl uppercase leading-tight text-ink sm:text-4xl">
          {origin.heading}
        </h2>

        <p className="mt-6 max-w-3xl font-body text-base leading-relaxed text-ink/80 sm:text-lg">
          {origin.summary}
        </p>

        <figure className="mt-10">
          <img
            src="/PHYL.jpg"
            alt="An artist performing spoken word at an ANIKA Initiative event"
            className="w-full rounded-2xl object-cover"
          />
          <figcaption className="mt-3 font-body text-sm italic text-ink/60">
            An artist performing at an ANIKA Initiative event.
          </figcaption>
        </figure>

        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-ink/10 pt-10 sm:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="font-display text-3xl text-coral sm:text-4xl">
                {fact.value}
              </dt>
              <dd className="mt-2 font-body text-xs font-semibold uppercase tracking-wide text-ink/60">
                {fact.label}
              </dd>
              <dd className="mt-1 font-body text-sm leading-snug text-ink/70">
                {fact.detail}
              </dd>
            </div>
          ))}
        </dl>

        <ul className="mt-10 flex flex-wrap gap-2">
          {origin.pillars.map((pillar) => (
            <li
              key={pillar}
              className="rounded-full border border-ink/15 px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-wide text-ink/70"
            >
              {pillar}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}