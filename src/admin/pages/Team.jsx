import { useState } from 'react'
import { UserPlus, X, Pencil, Trash2, AlertTriangle } from 'lucide-react'
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
  { id: 1, name: 'Jennifer Kosencha', email: 'jennifer@anikainitiative.org', role: 'leadership', status: 'Active' },
  { id: 2, name: 'Brian', email: 'brian@anikainitiative.org', role: 'comms', status: 'Active' },
  { id: 3, name: 'Lynn', email: 'lynn@anikainitiative.org', role: 'programs', status: 'Active' },
  { id: 4, name: 'James', email: 'james@anikainitiative.org', role: 'programs', status: 'Active' },
  { id: 5, name: 'Daniel', email: 'daniel@anikainitiative.org', role: 'comms', status: 'Active' },
]

function MemberFormModal({ member, onClose, onSave, colors }) {
  const isEdit = Boolean(member)
  const [name, setName] = useState(member?.name ?? '')
  const [email, setEmail] = useState(member?.email ?? '')
  const [role, setRole] = useState(member?.role ?? 'comms')

  function submit(e) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    onSave({ name: name.trim(), email: email.trim(), role })
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
            {isEdit ? 'Edit team member' : 'Invite team member'}
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
            {isEdit ? 'Save changes' : 'Send invite'}
          </button>
        </div>
      </form>
    </div>
  )
}

function ConfirmDeleteModal({ member, onClose, onConfirm, colors }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(20,18,15,0.45)' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: colors.panel, border: `1px solid ${colors.red}` }}
        className="w-full max-w-sm overflow-hidden rounded-2xl shadow-xl"
      >
        <div className="p-5">
          <div className="flex items-center gap-2.5">
            <AlertTriangle size={18} color={colors.red} />
            <h2 className="text-lg font-bold" style={{ color: colors.text }}>
              Remove team member?
            </h2>
          </div>
          <p className="mt-2 text-sm" style={{ color: colors.muted }}>
            This revokes <strong style={{ color: colors.text }}>{member.name}</strong>'s access to the ANIKA
            dashboard. They'll need a new invite to get back in.
          </p>
        </div>
        <div className="flex justify-end gap-2 border-t p-4" style={{ borderColor: colors.border }}>
          <button type="button" onClick={onClose} className="px-3 py-2 text-sm font-semibold" style={{ color: colors.muted }}>
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{ background: colors.red, color: '#fff' }}
            className="rounded-full px-4 py-2 text-sm font-semibold"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

function Team() {
  const COLORS = useAdminColors()
  const [team, setTeam] = useState(SEED)
  const [formModal, setFormModal] = useState(null) // null | { member: null | member }
  const [deleteTarget, setDeleteTarget] = useState(null)

  function saveMember(data) {
    if (formModal?.member) {
      setTeam((prev) => prev.map((m) => (m.id === formModal.member.id ? { ...m, ...data } : m)))
    } else {
      setTeam((prev) => [...prev, { ...data, id: Date.now(), status: 'Pending' }])
    }
  }

  function confirmDelete() {
    setTeam((prev) => prev.filter((m) => m.id !== deleteTarget.id))
    setDeleteTarget(null)
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
          onClick={() => setFormModal({ member: null })}
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
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {team.map((member) => (
              <tr key={member.id} className="border-t" style={{ borderColor: COLORS.border }}>
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
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => setFormModal({ member })}
                      aria-label={`Edit ${member.name}`}
                      className="rounded-lg p-1.5 hover:bg-black/5"
                      style={{ color: COLORS.muted }}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(member)}
                      aria-label={`Remove ${member.name}`}
                      className="rounded-lg p-1.5 hover:bg-black/5"
                      style={{ color: COLORS.red }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {formModal && (
        <MemberFormModal
          member={formModal.member}
          onClose={() => setFormModal(null)}
          onSave={saveMember}
          colors={COLORS}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          member={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
          colors={COLORS}
        />
      )}
    </div>
  )
}

export default Team
