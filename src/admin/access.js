export const ROLES = {
  LEADERSHIP: 'leadership',
  COMMS: 'comms',
  PROGRAMS: 'programs',
  MEL: 'mel',
}

const { LEADERSHIP, COMMS, PROGRAMS, MEL } = ROLES
const ALL_ROLES = [LEADERSHIP, COMMS, PROGRAMS, MEL]

// Pages with their own fixed rule, outside the backend's role_permissions
// table -- Dashboard is meant to be open to every signed-in role, Team/
// Settings/Roles are leadership-only (enforced server-side via
// @require_role("leadership")), and Partners has no backend endpoint yet to
// gate at all. None of these are editable from the Roles & Access screen.
const FIXED_PAGE_ACCESS = {
  dashboard: [LEADERSHIP, COMMS, PROGRAMS, MEL],
  partners: [LEADERSHIP, PROGRAMS],
  team: [LEADERSHIP],
  settings: [LEADERSHIP],
  roles: [LEADERSHIP],
}

// Frontend "page" key (used by nav.js / AdminRoutes.jsx) -> backend resource
// key (used by @require_permission(...) and the role_permissions table).
// Listed explicitly rather than assumed identical, since a few differ.
export const PAGE_TO_RESOURCE = {
  contacts: 'contacts',
  events: 'events',
  registrations: 'registrations',
  applications: 'applications',
  stories: 'stories',
  gallery: 'gallery',
  whatsappBroadcast: 'whatsapp_broadcast',
  whatsappInbox: 'whatsapp_inbox',
  whatsappAssistant: 'whatsapp_assistant',
  donations: 'donations',
  impact: 'impact',
  reports: 'reports',
  newsletter: 'newsletter',
}

// Used only until the real map has loaded from the backend, so nav/routes
// have something sensible to render on first paint -- matches the seed
// values in backend/migrations (Add role_permissions table).
export const DEFAULT_PAGE_ACCESS = {
  ...FIXED_PAGE_ACCESS,
  contacts: [LEADERSHIP, COMMS, PROGRAMS],
  events: [LEADERSHIP, PROGRAMS],
  registrations: [LEADERSHIP, PROGRAMS],
  applications: [LEADERSHIP, PROGRAMS],
  stories: [LEADERSHIP, COMMS],
  gallery: [LEADERSHIP, COMMS],
  whatsappBroadcast: [LEADERSHIP, COMMS],
  whatsappInbox: [LEADERSHIP, COMMS],
  whatsappAssistant: [LEADERSHIP, COMMS],
  donations: [LEADERSHIP, MEL],
  impact: [LEADERSHIP, COMMS, MEL],
  reports: [LEADERSHIP, MEL],
  newsletter: [LEADERSHIP, COMMS],
}

/**
 * Turns the backend's { role: [resource, ...] } map (from GET
 * /api/roles-access) into the page-keyed { pageKey: [role, ...] } shape
 * nav.js and AdminRoutes.jsx render from -- the single place that shape
 * conversion happens.
 */
export function buildPageAccess(roleResourceMap) {
  const result = { ...FIXED_PAGE_ACCESS }
  for (const [pageKey, resource] of Object.entries(PAGE_TO_RESOURCE)) {
    result[pageKey] = ALL_ROLES.filter(
      (role) => role === LEADERSHIP || (roleResourceMap?.[role] || []).includes(resource)
    )
  }
  return result
}

export const canAccessPage = (pageAccess, role, pageKey) =>
  Boolean(pageAccess[pageKey]?.includes(role))
