import React from 'react'
import { accentText } from '../../utils/accentClasses'

export default function ImpactStats({ stats }) {
  return (
    <section className='bg-cream py-16'>
      <div className='mx-auto grid max-w-6xl grid-cols-2 border-l border-t border-ink/20 px-6 md:grid-cols-4'>
        {stats.map((stat, i) => (
          <div
            key={i}
            className='border-r border-b border-ink/20 px-6 py-10'
          >
            <p className={`font-display text-4xl md:text-5xl mb-2 ${accentText[stat.accentClass]}`}>
              {stat.value}
            </p>
            <p className='text-xs uppercase tracking-wide text-ink/70'>
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
