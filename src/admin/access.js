export const ROLES = {
  LEADERSHIP: 'leadership',
  COMMS: 'comms',
  PROGRAMS: 'programs',
  MEL: 'mel',
}

const { LEADERSHIP, COMMS, PROGRAMS, MEL } = ROLES

export const PAGE_ACCESS = {
  dashboard: [LEADERSHIP, COMMS, PROGRAMS, MEL],
  contacts: [LEADERSHIP, COMMS, PROGRAMS],
  events: [LEADERSHIP, PROGRAMS],
  registrations: [LEADERSHIP, PROGRAMS],
  applications: [LEADERSHIP, PROGRAMS],
  partners: [LEADERSHIP, PROGRAMS],
  stories: [LEADERSHIP, COMMS],
  gallery: [LEADERSHIP, COMMS],
  whatsappBroadcast: [LEADERSHIP, COMMS],
  whatsappInbox: [LEADERSHIP, COMMS],
  messages: [LEADERSHIP, COMMS, PROGRAMS],
  donations: [LEADERSHIP, MEL],
  impact: [LEADERSHIP, COMMS, MEL],
  reports: [LEADERSHIP, MEL],
  team: [LEADERSHIP],
  settings: [LEADERSHIP],
  roles: [LEADERSHIP],
}

export const canAccessPage = (role, pageKey) => Boolean(PAGE_ACCESS[pageKey]?.includes(role))