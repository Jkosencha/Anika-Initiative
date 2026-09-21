import { changePathwayIntro, changePathwaySteps } from '../data/changePathway'

export default function ChangePathway() {
  return (
    <section className="bg-cream px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <p className="font-body text-base font-semibold uppercase tracking-[0.25em] text-coral">
          {changePathwayIntro.eyebrow}
        </p>
        <h2 className="mt-3 font-display text-3xl uppercase text-ink sm:text-4xl">
          {changePathwayIntro.heading}
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {changePathwaySteps.map((item) => (
            <div
              key={item.step}
              className="rounded-xl border border-ink/10 bg-white p-6 text-left"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-coral/10 font-body text-sm font-bold text-coral">
                {item.step}
              </span>
              <h3 className="mt-4 font-body text-sm font-bold uppercase tracking-wide text-ink">
                {item.title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-ink/60">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
