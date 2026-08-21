import { accentText, accentBg } from '../../utils/accentClasses';

export default function ImpactStats({ stats }) {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-16 pb-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
        {stats.map((stat, i) => (
          <div key={i}>
            <p className={`font-display text-4xl md:text-5xl mb-3 ${accentText[stat.accentClass]}`}>
              {stat.value}
            </p>
            <div className={`w-10 h-1 mb-3 ${accentBg[stat.accentClass]}`} />
            <p className="text-xs uppercase tracking-wide text-ink/70">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}