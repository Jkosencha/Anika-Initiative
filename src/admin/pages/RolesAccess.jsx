import { Check, Minus } from 'lucide-react'

const roles = ['leadership', 'comms', 'programs', 'mel']

const roleLabels = {
  leadership: 'Leadership',
  comms: 'Comms',
  programs: 'Programs',
  mel: 'M&E',
}

// full = view + edit, view = read-only, none = no access
const matrix = [
  { section: 'Contacts & Partners', leadership: 'full', comms: 'view', programs: 'view', mel: 'view' },
  { section: 'Events & Registrations', leadership: 'full', comms: 'view', programs: 'full', mel: 'view' },
  { section: 'Applications', leadership: 'full', comms: 'none', programs: 'full', mel: 'view' },
  { section: 'Stories & Gallery', leadership: 'full', comms: 'full', programs: 'view', mel: 'none' },
  { section: 'WhatsApp & Messages', leadership: 'full', comms: 'full', programs: 'none', mel: 'none' },
  { section: 'Donations', leadership: 'full', comms: 'none', programs: 'none', mel: 'view' },
  { section: 'Impact Metrics', leadership: 'full', comms: 'view', programs: 'view', mel: 'full' },
  { section: 'Team & Roles', leadership: 'full', comms: 'none', programs: 'none', mel: 'none' },
]

function Cell({ level }) {
  if (level === 'full') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-anika-green/15 px-2.5 py-1 text-xs font-medium text-anika-green">
        <Check size={12} /> Full
      </span>
    )
  }
  if (level === 'view') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-2.5 py-1 text-xs font-medium text-gold">
        <Check size={12} /> View
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/5 px-2.5 py-1 text-xs font-medium text-ink/40 dark:bg-white/10 dark:text-cream/40">
      <Minus size={12} /> None
    </span>
  )
}

function RolesAccess() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide">Roles & Access</h1>
        <p className="mt-1 text-sm text-ink/60 dark:text-cream/60">
          What each role can see and manage across the dashboard.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white dark:border-white/10 dark:bg-white/5">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-xs uppercase tracking-wider text-ink/40 dark:border-white/10 dark:text-cream/40">
              <th className="px-5 py-3 font-medium">Section</th>
              {roles.map((role) => (
                <th key={role} className="px-5 py-3 font-medium">
                  {roleLabels[role]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10 dark:divide-white/10">
            {matrix.map((row) => (
              <tr key={row.section}>
                <td className="px-5 py-3 font-medium">{row.section}</td>
                {roles.map((role) => (
                  <td key={role} className="px-5 py-3">
                    <Cell level={row[role]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RolesAccess
