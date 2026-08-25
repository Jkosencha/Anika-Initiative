import { useEffect, useRef, useState } from 'react'
import { partnersIntro, partners } from '../data/partners'

const CARDS_PER_PAGE = 4
const AUTOPLAY_MS = 4000

function chunk(list, size) {
  const pages = []
  for (let i = 0; i < list.length; i += size) {
    pages.push(list.slice(i, i + size))
  }
  return pages
}

function PartnerCard({ partner }) {
  return (
    <div className="group flex h-32 items-center justify-center rounded-lg border border-ink/10 bg-white/40 px-6">
      {partner.logo ? (
        <img
          src={partner.logo}
          alt={partner.name}
          className="max-h-10 w-auto object-contain grayscale opacity-70 transition duration-200 group-hover:grayscale-0 group-hover:opacity-100"
        />
      ) : (
        // Neutral text logotype fallback — matches brand guide guidance to keep
        // multi-partner strips plain rather than placing marks over paint/photography.
        <span className="font-display text-lg uppercase tracking-wide text-ink/60 transition duration-200 group-hover:text-ink">
          {partner.name}
        </span>
      )}
    </div>
  )
}

export default function Partners() {
  const pages = chunk(partners, CARDS_PER_PAGE)
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef(null)

  const goTo = (i) => setIndex((i + pages.length) % pages.length)
  const next = () => goTo(index + 1)
  const prev = () => goTo(index - 1)

  useEffect(() => {
    if (pages.length <= 1 || isPaused) return
    timerRef.current = setInterval(next, AUTOPLAY_MS)
    return () => clearInterval(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, isPaused, pages.length])

  return (
    <section className="bg-cream px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-body text-base font-semibold uppercase tracking-[0.25em] text-coral">
          {partnersIntro.eyebrow}
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight text-ink sm:text-4xl">
          {partnersIntro.heading}
        </h2>
        <p className="mt-4 max-w-xl font-body text-base leading-relaxed text-ink/70">
          {partnersIntro.body}
        </p>

        <div
          className="mt-12 border-t border-ink/10 pt-10"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {pages.map((page, pageIndex) => (
                <div
                  key={pageIndex}
                  className="grid w-full shrink-0 grid-cols-2 gap-6 sm:grid-cols-4"
                >
                  {page.map((partner) => (
                    <PartnerCard key={partner.name} partner={partner} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {pages.length > 1 && (
            <div className="mt-8 flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous partners"
                className="font-body text-sm text-ink/50 transition-colors hover:text-ink"
              >
                ←
              </button>

              <div className="flex items-center gap-2">
                {pages.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Show partner set ${i + 1}`}
                    aria-current={i === index}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      i === index ? 'bg-coral' : 'bg-ink/15 hover:bg-ink/30'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={next}
                aria-label="Next partners"
                className="font-body text-sm text-ink/50 transition-colors hover:text-ink"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}