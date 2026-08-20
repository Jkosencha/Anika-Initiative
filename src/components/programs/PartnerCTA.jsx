import React from 'react'
import { Link } from 'react-router-dom'

export default function PartnerCTA() {
  return (
    <section className='bg-cream text-center px-6 py-20'>
        <h2 className='font-editorial italic text-3xl md:text-4xl mb-4 text-ink'>
            Want to Partner or Participate?
        </h2>
        <p className='text-ink/70 mb-8'>
            ANIKA works with artists, communities, civil societies and institutions.
        </p>
        <Link
            to='/get-involved'
            className='inline-block bg-ink text-cream px-6 py-3 uppercase text-sm font-semibold tracking-wide transition-colors duration-200 hover:bg-coral cursor-pointer'
        >
            Get Involved
        </Link>
    </section>
  )
}
