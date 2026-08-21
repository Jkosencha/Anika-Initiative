import { missionVision } from '../data/aboutContent'

export default function MissionVision() {
  const { mission, vision } = missionVision

  return (
    <section className="bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-body text-sm font-semibold uppercase tracking-[0.25em] text-anika-blue">
          {missionVision.eyebrow}
        </p>
        <h2 className="mt-3 font-display text-3xl uppercase text-ink sm:text-4xl">
          {missionVision.heading}
        </h2>

        <div className="mt-10 grid gap-10 border-t border-ink/10 pt-10 sm:grid-cols-2 sm:gap-16">
          <div>
            <h3 className="font-display text-2xl uppercase text-coral">
              {mission.label}
            </h3>
            <p className="mt-3 font-editorial text-xl italic leading-snug text-ink">
              {mission.tagline}
            </p>
            <p className="mt-4 font-body text-base leading-relaxed text-ink/80">
              {mission.body}
            </p>
          </div>

          <div>
            <h3 className="font-display text-2xl uppercase text-anika-green">
              {vision.label}
            </h3>
            <p className="mt-3 font-editorial text-xl italic leading-snug text-ink">
              {vision.tagline}
            </p>
            <p className="mt-4 font-body text-base leading-relaxed text-ink/80">
              {vision.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}