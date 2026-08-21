import React from 'react'
import { accentBg } from '../../utils/accentClasses'

export default function ProgramCard({ program }) {
  return (
    <div className='mx-auto grid max-w-6xl gap-10 bg-cream px-6 py-12 md:grid-cols-2'>
      
      <div className='mx-auto max-w-6xl px-6'>

        <div className='flex items-center gap-4 mb-4'>

            <span className={`w-10 h-10 flex items-center justify-center text-white font-display ${accentBg[program.accentClass]}`}>
                {program.letter}
            </span>

            <div>
                <h2 className='font-display text-2xl uppercase text-ink'>
                    {program.title}
                </h2>
                <p className='text-xs uppercase tracking-wide text-ink/50'>
                    {program.subtitle}
                </p>
            </div>

        </div>

        <p className='text-ink/80 mb-6'>
            {program.description}
        </p>

        <h3 className='font-display text-s uppercase tracking-wide text-ink/70 mb-2'>
            How We Work
        </h3>

        <ul className='space-y-1'>
            {program.howWeWork.map((item, i) => (
                <li key={i}
                    className='flex items-center gap-2 text-sm text-ink'>
                        <span className={`w-2 h-2 inline-block ${accentBg[program.accentClass]}`} />
                        {item}
                </li>
            ))}
        </ul>

      </div>

      <div className='mx-auto max-w-6xl pl-6'>
        <img src={program.image} alt={program.title} className='w-full h-80 object-cover' />
        <p className='font-editorial italic bg-charcoal text-cream text-lg text-center py-3'>
            "{program.quote}"
        </p>
      </div>

    </div>
  );
}
