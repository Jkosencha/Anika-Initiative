import { Menu, Search, Moon, Sun, Bell } from 'lucide-react'

function Topbar({ onMenuClick, theme, onToggleTheme }) {
  return (
    <header className="flex items-center gap-4 border-b border-ink/10 bg-cream px-4 py-3 dark:border-white/10 dark:bg-charcoal">
      <button onClick={onMenuClick} className="text-ink/70 hover:text-ink dark:text-cream/70 dark:hover:text-cream lg:hidden">
        <Menu size={22} />
      </button>

      <label className="relative hidden max-w-sm flex-1 sm:block">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 dark:text-cream/40" />
        <input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg border border-ink/10 bg-white py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink/40 focus:border-anika-blue focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-cream dark:placeholder:text-cream/40"
        />
      </label>

      <div className="ml-auto flex items-center gap-3">
        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="rounded-lg p-2 text-ink/70 hover:bg-ink/5 hover:text-ink dark:text-cream/70 dark:hover:bg-white/5 dark:hover:text-cream"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          aria-label="Notifications"
          className="rounded-lg p-2 text-ink/70 hover:bg-ink/5 hover:text-ink dark:text-cream/70 dark:hover:bg-white/5 dark:hover:text-cream"
        >
          <Bell size={18} />
        </button>

        <div className="flex items-center gap-2 pl-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-coral text-sm font-semibold text-white">
            A
          </div>
          <span className="hidden text-sm font-medium text-ink dark:text-cream sm:block">Admin</span>
        </div>
      </div>
    </header>
  )
}

export default Topbar
