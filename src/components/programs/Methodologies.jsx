import React from 'react'
import { accentBorder } from '../../utils/accentClasses';

export default function Methodologies({ methodologies, quote}) {
  return (
    <section className='bg-charcoal text-cream px-6 md:px-16 py-16'>
        <h2 className='font-editorial italic text-5xl mb-10'>
            Methodologies
        </h2>

        <div className='grid md:grid-cols-3 gap-4'>
            {methodologies.map((m) => (
                <div
                    key={m.id}
                    className={`border-t-2 pt-3 pb-4 px-4 bg-white/5 ${accentBorder[m.accentClass]}`}
                    >
                        <h3 className='font-display mb-2 text-lg'>
                            {m.title}
                        </h3>
                        <p className='text-sm text-cream/70'>
                            {m.description}
                        </p>
                </div>
            ))}

            <div className='bg-coral flex items-center justify-center p-4'>
                <p className='font-editorial italic uppercase text-lg text-white'>
                    {quote}
                </p>
            </div>
        </div>
    </section>
  );
}
