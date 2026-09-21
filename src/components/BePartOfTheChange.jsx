import { NavLink } from 'react-router-dom'
import { Handshake, Users, Smile, Heart, ArrowRight } from 'lucide-react'

const cards = [
  {
    icon: Handshake,
    title: 'Partner With Us',
    description: 'Organisations can fund or co-design community-advocacy pipelines.',
    to: '/get-involved',
  },
  {
    icon: Users,
    title: 'Join Our Community',
    description: 'Sign up to our Pan-African artist and volunteer database.',
    to: '/alliance',
  },
  {
    icon: Smile,
    title: 'Volunteer',
    description: 'Support local events, exhibitions, and workshops with your time.',
    to: '/get-involved',
  },
  {
    icon: Heart,
    title: 'Support / Donate',
    description: 'Empower civic-art grants directly hitting local communities.',
    to: '/donate',
  },
]

export default function BePartOfTheChange() {
  return (
    <section className="bg-cream px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl text-center">
        <p className="font-body text-base font-semibold uppercase tracking-[0.25em] text-coral">
          Join the Movement
        </p>
        <h2 className="mt-3 font-display text-3xl uppercase text-ink sm:text-4xl">
          Be Part of the Change
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon: Icon, title, description, to }) => (
            <div
              key={title}
              className="flex flex-col items-start rounded-xl border border-ink/10 bg-white p-6 text-left"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-coral/10 text-coral">
                <Icon size={20} />
              </span>
              <h3 className="mt-4 font-body text-base font-bold text-ink">{title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-ink/60">{description}</p>
              <NavLink
                to={to}
                className="mt-4 inline-flex items-center gap-1.5 font-body text-sm font-bold uppercase tracking-wide text-coral hover:opacity-80"
              >
                Get Details <ArrowRight size={14} />
              </NavLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
