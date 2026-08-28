import { Menu, Moon, Sun, Bell } from 'lucide-react'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function today() {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function Topbar({ onMenuClick, theme, onToggleTheme }) {
  return (
    <header className="flex items-center gap-4 bg-cream px-6 py-4 dark:bg-charcoal">
      <button onClick={onMenuClick} className="text-ink/70 hover:text-ink dark:text-cream/70 dark:hover:text-cream lg:hidden">
        <Menu size={22} />
      </button>

      <div>
        <h1 className="font-display text-xl tracking-wide">{greeting()}, Admin</h1>
        <p className="text-sm text-ink/50 dark:text-cream/50">{today()}</p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="rounded-lg p-2 text-ink/70 hover:bg-ink/5 hover:text-ink dark:text-cream/70 dark:hover:bg-white/5 dark:hover:text-cream"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-ink/70 hover:bg-ink/5 hover:text-ink dark:text-cream/70 dark:hover:bg-white/5 dark:hover:text-cream"
        >
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-coral" />
        </button>
      </div>
    </header>
  )
}

export default Topbar
