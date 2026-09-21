import { changePathwayIntro, changePathwaySteps } from '../data/changePathway'

// Same accent cycle CoreValues.jsx uses for its big letters, applied to the
// step numbers here -- same card language as "Who we are while doing the
// work", just in the light palette instead of dark.
const swatches = ['text-coral', 'text-anika-green', 'text-anika-blue', 'text-gold', 'text-coral']

export default function ChangePathway() {
  return (
    <section className="bg-cream px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-body text-base font-semibold uppercase tracking-[0.25em] text-coral">
          {changePathwayIntro.eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">
          {changePathwayIntro.heading}
        </h2>

        <ul className="mt-12 grid gap-8 border-t border-ink/10 pt-10 sm:grid-cols-5">
          {changePathwaySteps.map((item, i) => (
            <li key={item.step}>
              <span className={`font-display text-5xl ${swatches[i % swatches.length]}`}>
                {item.step}
              </span>
              <h3 className="mt-3 font-body text-base font-semibold uppercase tracking-wide text-ink">
                {item.title}
              </h3>
              <p className="mt-2 font-body text-base leading-relaxed text-ink/60">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
