import { NavLink } from 'react-router-dom'
import { X } from 'lucide-react'
import { navSections } from '../nav'

function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <button
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-80 flex-col bg-charcoal text-cream
          transition-transform duration-200 lg:static lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="relative flex items-center justify-center px-5 pt-5">
          <img src="/anika-logo.png" alt="Anika Initiative" className="h-32 w-auto object-contain" />
          <button
            onClick={onClose}
            className="absolute right-5 top-5 text-cream/70 hover:text-cream lg:hidden"
          >
            <X size={20} />
          </button>
        </div>
        <p className="px-5 pb-4 pt-1 text-center text-xs font-semibold uppercase tracking-widest text-cream/40">
          Admin Desk
        </p>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-cream/40">
                {section.label}
              </p>
              <ul className="space-y-1">
                {section.items.map(({ label, to, icon: Icon, end, badge, badgeAccent }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={end}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? 'bg-coral text-white'
                            : 'text-cream/70 hover:bg-white/5 hover:text-cream'
                        }`
                      }
                    >
                      <Icon size={18} strokeWidth={2} />
                      <span className="flex-1">{label}</span>
                      {badge != null && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            badgeAccent ? 'bg-coral text-white' : 'bg-white/10 text-cream/70'
                          }`}
                        >
                          {badge}
                        </span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-3 border-t border-white/10 px-4 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-coral text-sm font-semibold text-white">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-cream">Admin</p>
            <p className="truncate text-xs text-cream/50">Leadership</p>
          </div>
          <button className="text-xs font-medium text-cream/50 hover:text-cream">Exit</button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
