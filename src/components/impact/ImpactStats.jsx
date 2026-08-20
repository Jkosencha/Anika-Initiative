import React from 'react'
import { accentText } from '../../utils/accentClasses'

export default function ImpactStats({ stats }) {
  return (
    <section className='bg-cream px-6 md:px-16 py-16'>
      <div className='grid grid-cols-2 md:grid-cols-4 border-t border-l border-ink/20'>
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
