import { hero } from '../data/aboutContent'

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-ink py-16 text-cream">
      <img
        src="/anika-gold-blob.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 object-contain opacity-80 md:h-80 md:w-80"
      />
      <div className="mx-auto max-w-6xl px-6">
        <h1 className="font-display text-5xl uppercase leading-[0.95] md:text-6xl">
          {hero.headingLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <p className="mt-4 max-w-md font-editorial text-lg italic text-gold">
          {hero.intro}
        </p>
      </div>
    </section>
  )
}