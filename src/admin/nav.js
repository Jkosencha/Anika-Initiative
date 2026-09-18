import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ClipboardList,
  FileText,
  Handshake,
  BookOpen,
  Image,
  Megaphone,
  Inbox,
  Bot,
  DollarSign,
  BarChart3,
  FileBarChart,
  UserCog,
  Settings,
  ShieldCheck,
  Mail,
} from 'lucide-react'

// Builds the sidebar structure from the current role -> page access map
// (from useRoleAccess()), rather than a value computed once at import time --
// so it reflects live Roles & Access changes, not just what was true on
// first page load.
export function buildNavSections(pageAccess) {
  return [
    {
      label: 'Overview',
      items: [{ label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true, allowedRoles: pageAccess.dashboard }],
    },
    {
      label: 'People',
      items: [{ label: 'Contacts', to: '/admin/contacts', icon: Users, allowedRoles: pageAccess.contacts }],
    },
    {
      label: 'Programs',
      items: [
        { label: 'Events', to: '/admin/events', icon: CalendarDays, allowedRoles: pageAccess.events },
        { label: 'Registrations', to: '/admin/registrations', icon: ClipboardList, badgeKey: 'registrations', allowedRoles: pageAccess.registrations },
        { label: 'Applications', to: '/admin/applications', icon: FileText, badgeKey: 'applications', allowedRoles: pageAccess.applications },
        { label: 'Partners', to: '/admin/partners', icon: Handshake, allowedRoles: pageAccess.partners },
      ],
    },
    {
      label: 'Comms',
      items: [
        { label: 'Stories', to: '/admin/stories', icon: BookOpen, allowedRoles: pageAccess.stories },
        { label: 'Gallery', to: '/admin/gallery', icon: Image, allowedRoles: pageAccess.gallery },
        { label: 'Newsletter', to: '/admin/newsletter', icon: Mail, allowedRoles: pageAccess.newsletter },
        { label: 'WhatsApp assistant', to: '/admin/whatsapp/assistant', icon: Bot, allowedRoles: pageAccess.whatsappAssistant },
        { label: 'WhatsApp broadcast', to: '/admin/whatsapp/broadcast', icon: Megaphone, allowedRoles: pageAccess.whatsappBroadcast },
        { label: 'WhatsApp inbox', to: '/admin/whatsapp/inbox', icon: Inbox, badgeKey: 'whatsappInboxUnread', badgeAccent: true, allowedRoles: pageAccess.whatsappInbox },
      ],
    },
    {
      label: 'Insight',
      items: [
        { label: 'Contributions', to: '/admin/donations', icon: DollarSign, badgeKey: 'donations', allowedRoles: pageAccess.donations },
        { label: 'Impact', to: '/admin/impact', icon: BarChart3, allowedRoles: pageAccess.impact },
        { label: 'Reports', to: '/admin/reports', icon: FileBarChart, allowedRoles: pageAccess.reports },
      ],
    },
    {
      label: 'Org',
      items: [
        { label: 'Team', to: '/admin/team', icon: UserCog, allowedRoles: pageAccess.team },
        { label: 'Settings', to: '/admin/settings', icon: Settings, allowedRoles: pageAccess.settings },
        { label: 'Roles & access', to: '/admin/roles', icon: ShieldCheck, allowedRoles: pageAccess.roles },
      ],
    },
  ]
}
