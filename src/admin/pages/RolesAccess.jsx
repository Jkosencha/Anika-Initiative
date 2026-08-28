import { useState } from 'react'
import { Check } from 'lucide-react'
import { useAdminColors } from '../theme'
import { navSections } from '../nav'

const roles = ['leadership', 'comms', 'programs', 'mel']

const roleLabels = {
  leadership: 'Leadership',
  comms: 'Comms',
  programs: 'Programs',
  mel: 'M&E',
}

const sections = navSections.flatMap((section) => section.items.map((item) => item.label))

// Leadership is always true and locked — seeded here for completeness but never read.
const defaultAccess = {
  Dashboard: { leadership: true, comms: true, programs: true, mel: true },
  Contacts: { leadership: true, comms: true, programs: true, mel: false },
  Events: { leadership: true, comms: false, programs: true, mel: false },
  Registrations: { leadership: true, comms: false, programs: true, mel: false },
  Applications: { leadership: true, comms: false, programs: true, mel: false },
  Partners: { leadership: true, comms: false, programs: true, mel: false },
  Stories: { leadership: true, comms: true, programs: false, mel: false },
  Gallery: { leadership: true, comms: true, programs: false, mel: false },
  'WhatsApp broadcast': { leadership: true, comms: true, programs: false, mel: false },
  'WhatsApp inbox': { leadership: true, comms: true, programs: false, mel: false },
  Messages: { leadership: true, comms: true, programs: false, mel: false },
  Contributions: { leadership: true, comms: false, programs: false, mel: true },
  Impact: { leadership: true, comms: false, programs: true, mel: true },
  Reports: { leadership: true, comms: false, programs: false, mel: true },
  Team: { leadership: true, comms: false, programs: false, mel: false },
  Settings: { leadership: true, comms: false, programs: false, mel: false },
  'Roles & access': { leadership: true, comms: false, programs: false, mel: false },
}

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
  const [access, setAccess] = useState(defaultAccess)

  function toggle(section, role) {
    setAccess((prev) => ({
      ...prev,
      [section]: { ...prev[section], [role]: !prev[section][role] },
    }))
  }

  return (
    <div style={{ background: COLORS.bg, minHeight: '100%' }} className="rounded-lg p-6 font-sans">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>
          Roles & access
        </h1>
        <p className="mt-1 text-sm" style={{ color: COLORS.muted }}>
          Control what each role can see. Leadership always has full access. Changes apply on next sign-in.
        </p>
      </div>

      <div
        style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }}
        className="overflow-x-auto rounded-xl"
      >
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-xs font-bold tracking-wide" style={{ borderColor: COLORS.border, color: COLORS.muted }}>
              <th className="px-5 py-3">SECTION</th>
              {roles.map((role) => (
                <th key={role} className="px-5 py-3">
                  {roleLabels[role].toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              <tr key={section} className="border-t" style={{ borderColor: COLORS.border }}>
                <td className="px-5 py-3 font-semibold" style={{ color: COLORS.text }}>
                  {section}
                </td>
                {roles.map((role) =>
                  role === 'leadership' ? (
                    <td key={role} className="px-5 py-3">
                      <RoleCheckbox checked disabled onChange={() => {}} colors={COLORS} />
                    </td>
                  ) : (
                    <td key={role} className="px-5 py-3">
                      <RoleCheckbox
                        checked={access[section][role]}
                        onChange={() => toggle(section, role)}
                        colors={COLORS}
                      />
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RolesAccess
