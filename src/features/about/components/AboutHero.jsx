import { hero } from '../data/aboutContent'

export default function AboutHero() {
  return (
    <section className="bg-charcoal text-cream py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h1 className="font-display text-5xl md:text-6xl uppercase leading-[0.95]">
          {hero.headingLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <p className="font-editorial italic text-gold mt-4 max-w-md text-lg">
          {hero.intro}
        </p>
      </div>
    </section>
  )
}