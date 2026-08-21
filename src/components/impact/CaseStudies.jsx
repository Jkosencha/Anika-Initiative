import React from 'react'

export default function CaseStudies({ caseStudies}) {
  return (
        <section className='bg-cream py-8 pb-24'>
            <div className='mx-auto max-w-6xl px-6'>
                <p className='mb-3 text-coral text-xs uppercase tracking-wide font-semibold'>
            Case Studies
        </p>
        <h2 className='font-display text-4xl md:text-5xl text-ink mb-10'>
            WHERE THE CHANGE LIVES.
        </h2>

        <div className='grid gap-8 md:grid-cols-3'>
            {caseStudies.map((study) => (
                <div key={study.id}>
                    <img 
                        src={study.image} 
                        alt={study.title}
                        className='w-full h-56 object-cover mb-4' 
                    />
                    <h3 className='font-display text-lg text-ink mb-2'>
                        {study.title}
                    </h3>
                    <p className='text-sm text-ink/70'>
                        {study.description}
                    </p>
                </div>
            ))}
                </div>
            </div>
    </section>
  )
}
