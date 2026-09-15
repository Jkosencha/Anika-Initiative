import { useEffect, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { useAdminColors } from '../theme'
import { useRoleAccess } from '../access/RoleAccessContext'
import { fetchRoleResourceMap, saveRoleResources } from '../utils/rolesAccessApi'

const roles = ['leadership', 'comms', 'programs', 'mel']

const roleLabels = {
  leadership: 'Leadership',
  comms: 'Comms',
  programs: 'Programs',
  mel: 'M&E',
}

// Every row shown on the page. "resource" rows are backed by the real
// backend permission table and can be toggled here. "fixed" rows have their
// own separate, hardcoded rule (see access.js) and are shown read-only so
// the page stays an honest picture of the whole nav, not just the editable
// slice of it.
const ROWS = [
  { label: 'Dashboard', kind: 'fixed', roles: ['leadership', 'comms', 'programs', 'mel'] },
  { label: 'Contacts', kind: 'resource', resource: 'contacts' },
  { label: 'Events', kind: 'resource', resource: 'events' },
  { label: 'Registrations', kind: 'resource', resource: 'registrations' },
  { label: 'Applications', kind: 'resource', resource: 'applications' },
  { label: 'Partners', kind: 'fixed', roles: ['leadership', 'programs'] },
  { label: 'Stories', kind: 'resource', resource: 'stories' },
  { label: 'Gallery', kind: 'resource', resource: 'gallery' },
  { label: 'Newsletter', kind: 'resource', resource: 'newsletter' },
  { label: 'WhatsApp assistant', kind: 'resource', resource: 'whatsapp_assistant' },
  { label: 'WhatsApp broadcast', kind: 'resource', resource: 'whatsapp_broadcast' },
  { label: 'WhatsApp inbox', kind: 'resource', resource: 'whatsapp_inbox' },
  { label: 'Contributions', kind: 'resource', resource: 'donations' },
  { label: 'Impact', kind: 'resource', resource: 'impact' },
  { label: 'Reports', kind: 'resource', resource: 'reports' },
  { label: 'Team', kind: 'fixed', roles: ['leadership'] },
  { label: 'Settings', kind: 'fixed', roles: ['leadership'] },
  { label: 'Roles & access', kind: 'fixed', roles: ['leadership'] },
]

function RoleCheckbox({ checked, disabled, onChange, colors }) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      style={{
        background: checked ? (disabled ? `${colors.red}40` : colors.red) : colors.panel,
        borderColor: checked ? 'transparent' : colors.border,
      }}
      className={`flex h-6 w-6 items-center justify-center rounded-md border transition-colors ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-80'
      }`}
    >
      {checked && <Check size={14} color="#fff" strokeWidth={3} />}
    </button>
  )
}

function RolesAccess() {
  const COLORS = useAdminColors()
  const { refresh: refreshNav } = useRoleAccess()

  // Raw { role: [resource, ...] } from the backend -- the shape needed to
  // send a PUT, unlike the page-keyed shape the rest of the app renders
  // nav/routes from.
  const [resourceMap, setResourceMap] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [savingRole, setSavingRole] = useState(null)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    fetchRoleResourceMap()
      .then((map) => setResourceMap(map))
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false))
  }, [])

  function isChecked(row, role) {
    if (row.kind === 'fixed') return row.roles.includes(role)
    if (role === 'leadership') return true
    return Boolean(resourceMap?.[role]?.includes(row.resource))
  }

  async function toggle(row, role) {
    if (row.kind !== 'resource' || role === 'leadership') return

    const current = resourceMap?.[role] || []
    const nextChecked = !isChecked(row, role)
    const nextResources = nextChecked
      ? [...current, row.resource]
      : current.filter((r) => r !== row.resource)

    const previousMap = resourceMap
    setResourceMap((prev) => ({ ...prev, [role]: nextResources }))
    setSaveError(null)
    setSavingRole(role)
    try {
      await saveRoleResources(role, nextResources)
      // The sidebar and every protected route read from this same map --
      // refresh it now so the change is live everywhere immediately,
      // not just after a manual reload.
      await refreshNav()
    } catch (err) {
      setResourceMap(previousMap)
      setSaveError(`Couldn't save that change: ${err.message}`)
    } finally {
      setSavingRole(null)
    }
  }

  return (
    <div style={{ background: COLORS.bg, minHeight: '100%' }} className="rounded-lg p-6 font-sans">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>
          Roles & access
        </h1>
        <p className="mt-1 text-sm" style={{ color: COLORS.muted }}>
          Control what each role can see and do. Leadership always has full access. Changes take
          effect immediately, everywhere, for everyone with that role -- these switches are saved
          on the server, not just this browser.
        </p>
        {saveError && (
          <p className="mt-2 text-sm font-semibold" style={{ color: COLORS.red }}>
            {saveError}
          </p>
        )}
      </div>

      <div
        style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }}
        className="overflow-x-auto rounded-xl"
      >
        {loading ? (
          <p className="p-5 text-sm" style={{ color: COLORS.muted }}>
            Loading roles & access…
          </p>
        ) : loadError ? (
          <p className="p-5 text-sm" style={{ color: COLORS.red }}>
            Couldn't load roles & access: {loadError}
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-xs font-bold tracking-wide" style={{ borderColor: COLORS.border, color: COLORS.muted }}>
                <th className="px-5 py-3">SECTION</th>
                {roles.map((role) => (
                  <th key={role} className="px-5 py-3">
                    {roleLabels[role].toUpperCase()}
                    {savingRole === role && <Loader2 size={12} className="ml-1.5 inline animate-spin" />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label} className="border-t" style={{ borderColor: COLORS.border }}>
                  <td className="px-5 py-3 font-semibold" style={{ color: COLORS.text }}>
                    {row.label}
                    {row.kind === 'fixed' && (
                      <span className="ml-2 text-xs font-normal" style={{ color: COLORS.muted }}>
                        fixed
                      </span>
                    )}
                  </td>
                  {roles.map((role) => (
                    <td key={role} className="px-5 py-3">
                      <RoleCheckbox
                        checked={isChecked(row, role)}
                        disabled={row.kind === 'fixed' || role === 'leadership' || savingRole === role}
                        onChange={() => toggle(row, role)}
                        colors={COLORS}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default RolesAccess
