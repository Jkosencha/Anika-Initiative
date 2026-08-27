import { useEffect, useRef, useState } from 'react'
import { partnersIntro } from '../data/partners'
import { usePartners } from '../context/PartnerContext'

const CARDS_PER_PAGE_DESKTOP = 4
const AUTOPLAY_MS = 3000
const MOBILE_QUERY = '(max-width: 639px)'
const MARQUEE_SECONDS = 20

function chunk(list, size) {
  const pages = []
  for (let i = 0; i < list.length; i += size) {
    pages.push(list.slice(i, i + size))
  }
  return pages
}

function PartnerCard({ partner, compact = false }) {
  // State to track if logo failed to load
  const [logoError, setLogoError] = useState(false)
  
  // Map partner names to logo files if they exist
  const getLogoPath = (name) => {
    const logoMap = {
      'SEMA': '/partners/sema.png',
      'Strategic Applications': '/partners/strategic-applications.png',
      'Creatives Garage': '/partners/creatives-garage.png',
      'YWCA': '/partners/ywca.png',
    }
    return logoMap[name]
  }

  const logoPath = getLogoPath(partner.name)

  return (
    <div
      className={`group flex items-center justify-center rounded-lg border border-ink/10 bg-white/40 px-4 ${
        compact ? 'h-24 w-28 shrink-0' : 'h-32 w-full'
      }`}
    >
      {logoPath && !logoError ? (
        <img
          src={logoPath}
          alt={partner.name}
          className="max-h-8 w-auto object-contain grayscale opacity-70 transition duration-200 group-hover:grayscale-0 group-hover:opacity-100"
          onError={() => setLogoError(true)} // Handle image load error
        />
      ) : (
        // Fallback text logotype — displays when logo is missing or fails to load
        <span className="font-display text-sm uppercase tracking-wide text-ink/60 transition duration-200 group-hover:text-ink">
          {partner.name}
        </span>
      )}
    </div>
  )
}

export default function Partners() {
  // Use the shared partner context
  const { partners } = usePartners()
  
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
  )
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY)
    const handleChange = (e) => setIsMobile(e.matches)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  // If no partners, don't render the section
  if (!partners || partners.length === 0) {
    return null
  }

  const pages = chunk(partners, CARDS_PER_PAGE_DESKTOP)
  const [index, setIndex] = useState(0)
  const timerRef = useRef(null)

  const goTo = (i) => setIndex((i + pages.length) % pages.length)
  const next = () => goTo(index + 1)
  const prev = () => goTo(index - 1)

  useEffect(() => {
    if (isMobile || pages.length <= 1 || isPaused) return
    timerRef.current = setInterval(next, AUTOPLAY_MS)
    return () => clearInterval(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, isPaused, pages.length, isMobile])

  // Mobile: every partner shown at once in a continuous, looping marquee.
  const marqueeItems = [...partners, ...partners]

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
          {isMobile ? (
            <div className="-mx-6 overflow-hidden px-6">
              <div
                className="flex w-max gap-4"
                style={{
                  animation: `partners-marquee ${MARQUEE_SECONDS}s linear infinite`,
                  animationPlayState: isPaused ? 'paused' : 'running',
                }}
              >
                {marqueeItems.map((partner, i) => (
                  <PartnerCard key={`${partner.name}-${i}`} partner={partner} compact />
                ))}
              </div>
              <style>{`
                @keyframes partners-marquee {
                  from { transform: translateX(0); }
                  to { transform: translateX(-50%); }
                }
              `}</style>
            </div>
          ) : (
            <>
              <div className="relative overflow-hidden">
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${index * 100}%)` }}
                >
                  {pages.map((page, pageIndex) => (
                    <div
                      key={pageIndex}
                      className="grid w-full shrink-0 grid-cols-4 gap-6"
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
            </>
          )}
        </div>
      </div>
    </section>
  )
}