import { NavLink } from 'react-router-dom'

const programs = [
  'Arts & Culture',
  'Youth & Migration',
  'Expressions',
  'Gender Equality',
  'Governance',
]

const navigate = [
  { to: '/events', label: 'Events' },
  { to: '/impact', label: 'Impact' },
  { to: '/stories', label: 'Stories' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
]

function Footer() {
  return (
    <footer className="bg-charcoal text-cream">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-x-16">
          <div>
            <NavLink to="/" className="flex items-center gap-2">
              <img src="/anika-logo.png" alt="Anika Initiative" className="h-18 w-auto object-contain" />
              <span className="font-display text-lg uppercase tracking-wide">Anika</span>
            </NavLink>
            <p className="mt-4 font-body text-sm text-cream/80">Changing the world, Art at a time.</p>
            <p className="mt-1 font-editorial italic text-cream/50">Open, never expose.</p>
            <ul className="mt-4 flex gap-4 font-body text-xs uppercase tracking-wide text-cream/70">
              <li>
                <a href="https://instagram.com/Anikainitiative_" target="_blank" rel="noreferrer" className="hover:text-coral">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-coral">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-coral">
                  Twitter
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-body text-sm font-semibold uppercase tracking-wide text-cream/60">Programs</p>
            <ul className="mt-4 space-y-2 font-body text-sm text-cream/80">
              {programs.map((program) => (
                <li key={program}>
                  <NavLink to="/programs" className="hover:text-coral">
                    {program}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-body text-sm font-semibold uppercase tracking-wide text-cream/60">Navigate</p>
            <ul className="mt-4 space-y-2 font-body text-sm text-cream/80">
              {navigate.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className="hover:text-coral">
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-body text-sm font-semibold uppercase tracking-wide text-cream/60">Contact</p>
            <ul className="mt-4 space-y-2 font-body text-sm text-cream/80">
              <li>
                <a href="mailto:info@anikainitiative.com" className="hover:text-coral">
                  info@anikainitiative.com
                </a>
              </li>
              <li>
                <a href="mailto:anika.silencekills@gmail.com" className="hover:text-coral">
                  anika.silencekills@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+254702839983" className="hover:text-coral">
                  +254 702 839 983
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-cream/10 pt-6 text-xs text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Anika Creatives Association &middot; All rights reserved.</p>
          <p className="font-editorial italic">
            Silence kills. <span className="text-coral">Art airs.</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
