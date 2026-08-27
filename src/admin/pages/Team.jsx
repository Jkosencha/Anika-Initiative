import { UserPlus } from 'lucide-react'

const roleStyles = {
  leadership: 'bg-coral/15 text-coral',
  comms: 'bg-anika-blue/15 text-anika-blue',
  programs: 'bg-anika-green/15 text-anika-green',
  mel: 'bg-gold/15 text-gold',
}

const roleLabels = {
  leadership: 'Leadership',
  comms: 'Comms',
  programs: 'Programs',
  mel: 'M&E',
}

const team = [
  { name: 'Jennifer Kosencha', email: 'jennifer@anikainitiative.org', role: 'leadership', active: true },
  { name: 'Brian', email: 'brian@anikainitiative.org', role: 'comms', active: true },
  { name: 'Lynn', email: 'lynn@anikainitiative.org', role: 'programs', active: true },
  { name: 'James', email: 'james@anikainitiative.org', role: 'programs', active: true },
  { name: 'Daniel', email: 'daniel@anikainitiative.org', role: 'comms', active: true },
]

function initials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function Team() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl tracking-wide">Team</h1>
          <p className="mt-1 text-sm text-ink/60 dark:text-cream/60">
            People with access to the ANIKA dashboard.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-coral px-4 py-2 text-sm font-medium text-white hover:bg-coral/90">
          <UserPlus size={16} />
          Invite member
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white dark:border-white/10 dark:bg-white/5">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-xs uppercase tracking-wider text-ink/40 dark:border-white/10 dark:text-cream/40">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10 dark:divide-white/10">
            {team.map((member) => (
              <tr key={member.email}>
                <td className="flex items-center gap-3 px-5 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/10 text-xs font-semibold dark:bg-white/10">
                    {initials(member.name)}
                  </div>
                  {member.name}
                </td>
                <td className="px-5 py-3 text-ink/70 dark:text-cream/70">{member.email}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${roleStyles[member.role]}`}>
                    {roleLabels[member.role]}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className="flex items-center gap-1.5 text-xs text-ink/60 dark:text-cream/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-anika-green" />
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Team
