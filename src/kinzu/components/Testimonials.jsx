import { testimonials } from '../data/site';
import SectionHeading from './SectionHeading';

export default function Testimonials() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading kicker="Voices" title="Heard, held, & acted upon" accent="gold" />
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {testimonials.map((t) => (
            <figure key={t.attribution} className="border-l-4 border-coral pl-6">
              <blockquote className="font-editorial text-3xl italic leading-snug text-ink">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="font-body text-xs font-extrabold uppercase tracking-widest text-gray-600">
                  {t.attribution}
                </span>
                <span className="bg-anika-green px-2 py-0.5 font-body text-[10px] font-extrabold uppercase tracking-widest text-white">
                  Consent Verified
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
