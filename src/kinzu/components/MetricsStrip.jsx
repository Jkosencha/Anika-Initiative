import { metrics } from '../data/site';

const numberColor = {
  green: 'text-green',
  gold: 'text-gold',
  blue: 'text-blue',
  coral: 'text-coral',
};

export default function MetricsStrip() {
  return (
    <section className="border-b-2 border-black bg-black py-12 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label}>
              <div className={`font-display text-4xl md:text-5xl ${numberColor[m.accent]}`}>
                {m.value}
              </div>
              <div className="mt-2 font-body text-[11px] font-bold uppercase tracking-[0.15em] text-white/80">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
