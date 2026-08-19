import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/programs', label: 'Programs' },
  { to: '/events', label: 'Events' },
  { to: '/impact', label: 'Impact' },
  { to: '/stories', label: 'Stories' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/get-involved', label: 'Get Involved' },
]

function Navbar() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `font-body text-sm uppercase tracking-wide transition-colors hover:text-coral ${
      isActive ? 'text-coral' : 'text-ink'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="font-display text-lg uppercase tracking-wide text-ink">
          Anika
        </NavLink>

        <ul className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} className={linkClass} end={link.to === '/'}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <NavLink
            to="/donate"
            className="rounded-full bg-coral px-5 py-2 font-body text-sm font-semibold uppercase tracking-wide text-cream transition-opacity hover:opacity-90"
          >
            Donate
          </NavLink>
        </div>

        <button
          type="button"
          className="text-ink md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="block h-0.5 w-6 bg-ink" />
          <span className="mt-1.5 block h-0.5 w-6 bg-ink" />
          <span className="mt-1.5 block h-0.5 w-6 bg-ink" />
        </button>
      </nav>

      {open && (
        <ul className="flex flex-col gap-4 border-t border-ink/10 px-6 py-4 md:hidden">
          {[...links, { to: '/donate', label: 'Donate' }].map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={linkClass}
                end={link.to === '/'}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}

export default Navbar
