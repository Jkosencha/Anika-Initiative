// src/features/about/components/PoemSpotlight.jsx
import { poem } from '../data/poem'

export default function PoemSpotlight() {
  return (
    <section className="bg-ink px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        {/* Pull-quote — the line that earns the section its place */}
        <blockquote className="border-l-4 border-coral pl-6 font-editorial text-3xl italic leading-snug text-cream sm:text-4xl">
          &ldquo;{poem.pullQuote}&rdquo;
        </blockquote>

        <div className="mt-6 flex items-baseline gap-3 pl-6">
          <span className="font-body text-sm font-semibold uppercase tracking-[0.25em] text-gold">
            {poem.author}
          </span>
          <span className="font-editorial text-lg italic text-cream/60">
            {poem.title}
          </span>
        </div>

        {/* Full poem */}
        <div className="mt-16 space-y-8 font-editorial text-xl leading-relaxed text-cream/90 sm:text-2xl">
          {poem.stanzas.map((stanza, i) => (
            <p key={i}>
              {stanza.map((line, j) => (
                <span key={j} className="block">
                  {line}
                </span>
              ))}
            </p>
          ))}
        </div>

        {/* Closing refrain, set apart in colour */}
        <p className="mt-16 border-t border-cream/15 pt-10 font-editorial text-2xl italic leading-relaxed text-coral sm:text-3xl">
          {poem.refrain.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
