import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Moon, Sun, Bell, Check } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { fetchDonations, fetchRegistrations, normalizeDonation } from '../../lib/api'
import { storiesStore } from '../../data/storiesStore'
import { buildActivityFeed } from '../utils/activityFeed'

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

const READ_KEY_PREFIX = 'anika_read_notifications_'

function getReadIds(userId) {
  try {
    const raw = localStorage.getItem(READ_KEY_PREFIX + userId)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveReadIds(userId, ids) {
  localStorage.setItem(READ_KEY_PREFIX + userId, JSON.stringify([...ids]))
}

function Topbar({ onMenuClick, theme, onToggleTheme }) {
  const { user } = useAuth()
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    if (!user?.id) return
    let cancelled = false
    Promise.all([fetchDonations(), fetchRegistrations(), storiesStore.getAll().catch(() => [])]).then(
      ([donationsRes, registrationsRes, storiesRows]) => {
        if (cancelled) return
        const feed = buildActivityFeed(
          registrationsRes.rows,
          donationsRes.rows.map(normalizeDonation),
          storiesRows ?? [],
          6
        )
        const readIds = getReadIds(user.id)
        setNotifications(feed.map((item) => ({ ...item, read: readIds.has(item.id) })))
      }
    )
    return () => {
      cancelled = true
    }
  }, [user?.id])

  function markAllRead() {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }))
      saveReadIds(user.id, new Set(next.map((n) => n.id)))
      return next
    })
  }

  function markRead(id) {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      const readIds = getReadIds(user.id)
      readIds.add(id)
      saveReadIds(user.id, readIds)
      return next
    })
  }

  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-ink/10 bg-cream/70 px-6 py-4 backdrop-blur-md dark:border-white/10 dark:bg-charcoal/70">
      <button onClick={onMenuClick} className="text-ink/70 hover:text-ink dark:text-cream/70 dark:hover:text-cream lg:hidden">
        <Menu size={22} />
      </button>

      <div>
        <h1 className="font-display text-xl tracking-wide">{greeting()}, {user?.name ?? 'Admin'}</h1>
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

        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
            className="relative rounded-lg p-2 text-ink/70 hover:bg-ink/5 hover:text-ink dark:text-cream/70 dark:hover:bg-white/5 dark:hover:text-cream"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-coral" />
            )}
          </button>

          {notifOpen && (
            <>
              <button
                aria-label="Close notifications"
                onClick={() => setNotifOpen(false)}
                className="fixed inset-0 z-20"
              />
              <div className="absolute right-0 top-full z-30 mt-2 w-80 overflow-hidden rounded-xl border border-ink/10 bg-white shadow-xl dark:border-white/10 dark:bg-charcoal">
                <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3 dark:border-white/10">
                  <span className="text-sm font-bold">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-xs font-medium text-coral hover:underline"
                    >
                      <Check size={12} /> Mark all read
                    </button>
                  )}
                </div>
                <ul className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <li className="px-4 py-6 text-center text-sm text-ink/40 dark:text-cream/40">
                      Nothing new.
                    </li>
                  ) : (
                    notifications.map((n) => (
                      <li key={n.id}>
                        <Link
                          to={n.to}
                          onClick={() => {
                            markRead(n.id)
                            setNotifOpen(false)
                          }}
                          className="flex w-full items-start gap-2.5 border-b border-ink/5 px-4 py-3 text-left last:border-b-0 hover:bg-ink/5 dark:border-white/5 dark:hover:bg-white/5"
                        >
                          <span
                            className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                              n.read ? 'bg-transparent' : 'bg-coral'
                            }`}
                          />
                          <span>
                            <p className={`text-sm ${n.read ? 'text-ink/60 dark:text-cream/60' : 'font-semibold text-ink dark:text-cream'}`}>
                              {n.text}
                            </p>
                            <p className="mt-0.5 text-xs text-ink/40 dark:text-cream/40">{n.time}</p>
                          </span>
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Topbar
