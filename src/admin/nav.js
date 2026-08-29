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
  MessagesSquare,
  DollarSign,
  BarChart3,
  FileBarChart,
  UserCog,
  Settings,
  ShieldCheck,
} from 'lucide-react'

export const navSections = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'People',
    items: [{ label: 'Contacts', to: '/admin/contacts', icon: Users }],
  },
  {
    label: 'Programs',
    items: [
      { label: 'Events', to: '/admin/events', icon: CalendarDays },
      { label: 'Registrations', to: '/admin/registrations', icon: ClipboardList, badge: 37 },
      { label: 'Applications', to: '/admin/applications', icon: FileText, badge: 6 },
      { label: 'Partners', to: '/admin/partners', icon: Handshake },
    ],
  },
  {
    label: 'Comms',
    items: [
      { label: 'Stories', to: '/admin/stories', icon: BookOpen },
      { label: 'Gallery', to: '/admin/gallery', icon: Image },
      { label: 'WhatsApp broadcast', to: '/admin/whatsapp/broadcast', icon: Megaphone },
      { label: 'WhatsApp inbox', to: '/admin/whatsapp/inbox', icon: Inbox, badge: 3, badgeAccent: true },
      { label: 'WhatsApp Assistant', to: '/admin/whatsapp/assistant', icon: Bot },
      { label: 'Messages', to: '/admin/messages', icon: MessagesSquare, badge: 5, badgeAccent: true },
    ],
  },
  {
    label: 'Insight',
    items: [
      { label: 'Contributions', to: '/admin/donations', icon: DollarSign },
      { label: 'Impact', to: '/admin/impact', icon: BarChart3 },
      { label: 'Reports', to: '/admin/reports', icon: FileBarChart },
    ],
  },
  {
    label: 'Org',
    items: [
      { label: 'Team', to: '/admin/team', icon: UserCog },
      { label: 'Settings', to: '/admin/settings', icon: Settings },
      { label: 'Roles & access', to: '/admin/roles', icon: ShieldCheck },
    ],
  },
]
