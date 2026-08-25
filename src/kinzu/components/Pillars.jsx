import { Link } from 'react-router-dom';
import { pillars } from '../data/site';
import SectionHeading from './SectionHeading';

const accentBar = {
  gold: 'bg-gold',
  green: 'bg-anika-green',
  coral: 'bg-coral',
  blue: 'bg-anika-blue',
  ink: 'bg-ink',
};

export default function Pillars({ onAirItOut }) {
  return (
    <section id="programs" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          kicker="Thematic Pillars"
          title="Five ways art changes the world"
          accent="coral"
        />
        <p className="mt-4 max-w-2xl font-body text-gray-700">
          Our work is structured across five primary thematic pillars. Each converts lived
          reality into creative expression, dialogue, and measurable action.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p) => (
            <article
              key={p.slug}
              className="group flex flex-col border-2 border-black bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000000]"
            >
              <div className={`h-1.5 w-12 ${accentBar[p.accent]}`} />
              <h3 className="mt-5 font-display text-2xl uppercase leading-tight tracking-wide">
                {p.title}
              </h3>
              <p className="mt-3 flex-1 font-body text-base leading-relaxed text-gray-700">
                {p.description}
              </p>
              <Link
                to={`/programs/${p.slug}`}
                className="mt-6 inline-flex items-center gap-2 font-body text-xs font-extrabold uppercase tracking-widest text-ink transition-colors group-hover:text-coral"
              >
                Learn More &amp; Register <span aria-hidden>→</span>
              </Link>
            </article>
          ))}

          {/* CTA tile */}
          <article className="flex flex-col justify-between border-2 border-black bg-ink p-7 text-white">
            <div>
              <div className="h-1.5 w-12 bg-coral" />
              <h3 className="mt-5 font-display text-2xl uppercase leading-tight tracking-wide">
                Not sure where to start?
              </h3>
              <p className="mt-3 font-body text-base leading-relaxed text-white/80">
                Tell us what moves you. We’ll help you find the pillar — and the people — that
                fit.
              </p>
            </div>
            <button
              type="button"
              onClick={onAirItOut}
              className="mt-6 w-fit border border-gold bg-gold px-5 py-3 font-body text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-cream"
            >
              Air It Out
            </button>
          </article>
        </div>
      </div>
    </section>
  );
}
