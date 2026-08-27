import { Users, CalendarDays, HeartHandshake, FileText } from 'lucide-react'

const stats = [
  { label: 'Total Contacts', value: '1,284', icon: Users, color: 'text-anika-blue' },
  { label: 'Upcoming Events', value: '6', icon: CalendarDays, color: 'text-anika-green' },
  { label: 'Pending Applications', value: '14', icon: FileText, color: 'text-gold' },
  { label: 'Donations This Month', value: '$3,420', icon: HeartHandshake, color: 'text-coral' },
]

const recentActivity = [
  { text: 'New volunteer application from Amara K.', time: '2h ago' },
  { text: '"SEMA Anika Forum" event registration opened', time: '5h ago' },
  { text: 'New story submitted for review — "Air It Out"', time: '1d ago' },
  { text: 'Partner inquiry received from Zawadi Trust', time: '2d ago' },
]

function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide">Dashboard</h1>
        <p className="mt-1 text-sm text-ink/60 dark:text-cream/60">
          A quick overview of what's happening across ANIKA.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl border border-ink/10 bg-white p-5 dark:border-white/10 dark:bg-white/5"
          >
            <Icon size={20} className={color} />
            <p className="mt-3 font-display text-2xl">{value}</p>
            <p className="mt-1 text-sm text-ink/60 dark:text-cream/60">{label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
        <h2 className="font-display text-lg tracking-wide">Recent Activity</h2>
        <ul className="mt-4 divide-y divide-ink/10 dark:divide-white/10">
          {recentActivity.map((item) => (
            <li key={item.text} className="flex items-center justify-between py-3 text-sm">
              <span>{item.text}</span>
              <span className="shrink-0 pl-4 text-ink/40 dark:text-cream/40">{item.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Dashboard
