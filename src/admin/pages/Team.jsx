import { useState } from 'react'
import { UserPlus, X } from 'lucide-react'
import { useAdminColors, initials, avatarColor } from '../theme'

const ROLE_STYLE = {
  leadership: { bg: '#f6d9d9', text: '#b23b3b' },
  comms: { bg: '#dbe6f5', text: '#2f4a6b' },
  programs: { bg: '#dcefe0', text: '#2d7a43' },
  mel: { bg: '#fbe6c8', text: '#b3760c' },
}

const roleLabels = {
  leadership: 'Leadership',
  comms: 'Comms',
  programs: 'Programs',
  mel: 'M&E',
}

const SEED = [
  { name: 'Jennifer Kosencha', email: 'jennifer@anikainitiative.org', role: 'leadership', status: 'Active' },
  { name: 'Brian', email: 'brian@anikainitiative.org', role: 'comms', status: 'Active' },
  { name: 'Lynn', email: 'lynn@anikainitiative.org', role: 'programs', status: 'Active' },
  { name: 'James', email: 'james@anikainitiative.org', role: 'programs', status: 'Active' },
  { name: 'Daniel', email: 'daniel@anikainitiative.org', role: 'comms', status: 'Active' },
]

function InviteMemberModal({ onClose, onInvite, colors }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('comms')

  function submit(e) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    onInvite({ name: name.trim(), email: email.trim(), role, status: 'Pending' })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(20,18,15,0.45)' }}
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        style={{ background: colors.panel, border: `1px solid ${colors.border}` }}
        className="w-full max-w-sm overflow-hidden rounded-2xl shadow-xl"
      >
        <div className="flex items-center justify-between border-b p-5" style={{ borderColor: colors.border }}>
          <h2 className="text-lg font-bold" style={{ color: colors.text }}>
            Invite team member
          </h2>
          <button type="button" onClick={onClose} className="rounded-full p-1 hover:bg-black/5">
            <X size={18} color={colors.muted} />
          </button>
        </div>

        <div className="space-y-3 p-5">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: colors.muted }}>
              Full name
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text }}
              placeholder="e.g. Amara K."
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: colors.muted }}>
              Email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text }}
              placeholder="you@anikainitiative.org"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: colors.muted }}>
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text }}
            >
              {Object.entries(roleLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t p-4" style={{ borderColor: colors.border }}>
          <button type="button" onClick={onClose} className="px-3 py-2 text-sm font-semibold" style={{ color: colors.muted }}>
            Cancel
          </button>
          <button
            type="submit"
            style={{ background: colors.buttonBg, color: colors.buttonText }}
            className="rounded-full px-4 py-2 text-sm font-semibold"
          >
            Send invite
          </button>
        </div>
      </form>
    </div>
  )
}

function Team() {
  const COLORS = useAdminColors()
  const [team, setTeam] = useState(SEED)
  const [modalOpen, setModalOpen] = useState(false)

  function addMember(member) {
    setTeam((prev) => [...prev, member])
  }

  return (
    <div style={{ background: COLORS.bg, minHeight: '100%' }} className="rounded-lg p-6 font-sans">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>
            Team
          </h1>
          <p className="mt-1 text-sm" style={{ color: COLORS.muted }}>
            People with access to the ANIKA dashboard.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          style={{ background: COLORS.buttonBg, color: COLORS.buttonText }}
          className="flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-bold tracking-wide"
        >
          <UserPlus size={14} />
          INVITE MEMBER
        </button>
      </div>

      <div
        style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }}
        className="overflow-x-auto rounded-xl"
      >
        <table className="w-full text-left text-sm">
          <thead>
            <tr
              className="border-b text-xs font-bold tracking-wide"
              style={{ borderColor: COLORS.border, color: COLORS.muted }}
            >
              <th className="px-5 py-3">NAME</th>
              <th className="px-5 py-3">EMAIL</th>
              <th className="px-5 py-3">ROLE</th>
              <th className="px-5 py-3">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {team.map((member) => (
              <tr key={member.email} className="border-t" style={{ borderColor: COLORS.border }}>
                <td className="flex items-center gap-3 px-5 py-3" style={{ color: COLORS.text }}>
                  <div
                    style={{ background: avatarColor(member.name) }}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
                  >
                    {initials(member.name)}
                  </div>
                  <span className="font-semibold">{member.name}</span>
                </td>
                <td className="px-5 py-3" style={{ color: COLORS.muted }}>
                  {member.email}
                </td>
                <td className="px-5 py-3">
                  <span
                    style={{ background: ROLE_STYLE[member.role].bg, color: ROLE_STYLE[member.role].text }}
                    className="rounded-full px-2.5 py-1 text-xs font-bold"
                  >
                    {roleLabels[member.role]}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className="flex items-center gap-1.5 text-xs" style={{ color: COLORS.muted }}>
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: member.status === 'Active' ? COLORS.green : COLORS.orange }}
                    />
                    {member.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <InviteMemberModal onClose={() => setModalOpen(false)} onInvite={addMember} colors={COLORS} />
      )}
    </div>
  )
}

export default Team
