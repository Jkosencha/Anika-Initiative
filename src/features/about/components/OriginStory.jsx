import { origin } from '../data/aboutContent'

export default function OriginStory() {
  return (
    <section className="bg-cream px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-body text-base font-semibold uppercase tracking-[0.25em] text-anika-green">
          {origin.eyebrow}
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight text-ink sm:text-4xl">
          {origin.heading}
        </h2>

        <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:items-center sm:gap-12">
          <p className="font-body text-lg leading-relaxed text-ink/80">
            {origin.summary}
          </p>

          <figure>
            <img
              src="/PHYL.jpg"
              alt="An artist performing spoken word at an ANIKA Initiative event"
              className="w-full rounded-2xl object-cover"
            />
            <figcaption className="mt-3 font-body text-sm italic text-ink/60">
              An artist performing at an ANIKA Initiative event.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}