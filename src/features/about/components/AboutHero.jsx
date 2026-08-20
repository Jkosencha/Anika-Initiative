// src/features/about/components/AboutHero.jsx
import { hero } from '../data/aboutContent'

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-cream px-6 pt-20 pb-16 sm:pt-28 sm:pb-24">
      <div className="mx-auto max-w-4xl">
        <p className="font-body text-sm font-semibold uppercase tracking-[0.25em] text-coral">
          {hero.eyebrow}
        </p>

        <h1 className="mt-6 font-display text-5xl uppercase leading-[0.95] text-ink sm:text-7xl">
          {hero.headingLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        {/* A drip of colour beneath the headline — a nod to "our logo drips" */}
        <svg
          viewBox="0 0 220 20"
          aria-hidden="true"
          className="mt-6 h-4 w-40 text-coral"
        >
          <path
            d="M0 4 C 40 4, 40 14, 80 14 S 120 4, 160 4 S 200 14, 220 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>

        <p className="mt-8 max-w-2xl font-body text-lg leading-relaxed text-ink/80 sm:text-xl">
          {hero.intro}
        </p>
      </div>
    </section>
  )
}
