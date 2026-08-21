import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import Registration from '../../pages/Registration'

const links = [
  { to: '/', label: 'Home' },
  { to: '/programs', label: 'Programs' },
  { to: '/events', label: 'Events' },
  { to: '/impact', label: 'Impact Hub' },
  { to: '/get-involved', label: 'Get Involved' },
  { to: '/donate', label: 'Donate' },
  { to: '/alliance', label: 'Alliance' },
  { to: '/about', label: 'About' },
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const linkClass = ({ isActive }) =>
    `font-body text-sm uppercase tracking-wide transition-colors hover:text-coral ${
      isActive ? 'text-coral' : 'text-ink'
    }`

  const handleOpenModal = (e) => {
    e?.preventDefault()
    setShowModal(true)
    setOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
          <NavLink to="/" className="flex items-center gap-2">
            <img src="/anika-logo.png" alt="Anika Initiative" className="h-15 w-auto object-contain" />
            <span className="font-display text-lg uppercase tracking-wide text-ink">Anika</span>
          </NavLink>

          {/* Desktop Links */}
          <ul className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={linkClass} end={link.to === '/'}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop CTA Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={handleOpenModal}
              type="button"
              className="rounded bg-coral px-5 py-2 font-body text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-coral/90"
            >
              Air It Out
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
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

        {/* Mobile Dropdown */}
        {open && (
          <ul className="flex flex-col gap-4 border-t border-ink/10 px-6 py-4 md:hidden">
            {links.map((link) => (
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
            <li>
              <button
                onClick={handleOpenModal}
                type="button"
                className="w-full text-left font-body text-sm font-semibold uppercase tracking-wide text-ink hover:text-coral"
              >
                Air It Out
              </button>
            </li>
          </ul>
        )}
      </header>

      {/* Pop-up Modal Container */}
      <Registration isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}

export default Navbar