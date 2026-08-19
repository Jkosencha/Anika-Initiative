import { NavLink } from 'react-router-dom'

function Footer() {
  return (
    <footer className="border-t border-cream/10 bg-ink text-cream">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-display text-lg uppercase tracking-wide">Anika Initiative</p>
            <p className="mt-2 font-editorial text-cream/70">
              Open, never expose.
            </p>
          </div>

          <div>
            <p className="font-body text-sm uppercase tracking-wide text-cream/60">Contact</p>
            <p className="mt-2 font-body text-sm text-cream/80">
              info@anikainitiative.com
              <br />
              +254 702 839 983
              <br />
              Nairobi, Kenya
            </p>
          </div>

          <div>
            <p className="font-body text-sm uppercase tracking-wide text-cream/60">Follow</p>
            <ul className="mt-2 space-y-1 font-body text-sm text-cream/80">
              <li>
                <a href="https://instagram.com/Anikainitiative_" target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://x.com" target="_blank" rel="noreferrer">
                  X
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-cream/10 pt-6 text-xs text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Anika Creatives Association.</p>
          <NavLink to="/get-involved" className="hover:text-coral">
            Get Involved
          </NavLink>
        </div>
      </div>
    </footer>
  )
}

export default Footer
