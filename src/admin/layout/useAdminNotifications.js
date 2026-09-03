import { useCallback, useEffect, useState } from 'react'
import {
  fetchRegistrations,
  fetchApplications,
  fetchDonations,
  fetchWhatsAppInbox,
  normalizeDonation,
} from '../../lib/api'

// Adjust this import path if this file doesn't end up next to Sidebar.jsx /
// Topbar.jsx (it mirrors Sidebar's existing '../../lib/api' import).

const READ_KEY = 'anika_admin_notifications_read'
const POLL_MS = 45000
const MAX_NOTIFICATIONS = 20

function readReadSet() {
  try {
    const raw = localStorage.getItem(READ_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

function persistReadSet(set) {
  try {
    // Cap so this never grows unbounded over a long admin session.
    localStorage.setItem(READ_KEY, JSON.stringify([...set].slice(-500)))
  } catch {
    // ignore quota errors — read state just won't survive a refresh
  }
}

function getTimestamp(row) {
  const raw = row?.updated_at ?? row?.updatedAt ?? row?.created_at ?? row?.createdAt ?? row?.created ?? row?.date ?? null
  const t = raw ? new Date(raw).getTime() : NaN
  return Number.isNaN(t) ? 0 : t
}

export function timeAgo(timestamp) {
  if (!timestamp) return ''
  const diffMs = Date.now() - timestamp
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return new Date(timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function donationText(row) {
  const d = normalizeDonation(row)
  const method = d.method === 'mpesa' ? 'M-Pesa' : d.method.charAt(0).toUpperCase() + d.method.slice(1)
  return `${method} donation of ${d.currency} ${d.amount.toLocaleString()} received`
}

// NOTE: registration/application record shapes weren't available to check,
// so these two assume `eventTitle`/`title` and `applicantName`/`name`.
// Swap in the real field names if they differ.
function registrationText(r) {
  return `New registration for "${r.eventTitle ?? r.title ?? r.event ?? 'an event'}"`
}
function applicationText(a) {
  return `New application from ${a.applicantName ?? a.name ?? 'a new applicant'}`
}

// --- Module-level shared store -------------------------------------------
// Sidebar (badges) and Topbar (notification bell) both call this hook.
// Without a shared store, each component instance would run its own fetch
// + 45s interval — two timers hitting the API for the same data. This
// keeps exactly one poll running regardless of how many components use it.
let state = { badges: {}, notifications: [] }
let listeners = new Set()
let intervalId = null
let started = false
let readSet = readReadSet()

function notifyListeners() {
  listeners.forEach((l) => l(state))
}

async function loadOnce() {
  try {
    const [registrationsRes, applicationsRes, donationsRes, inboxRes] = await Promise.all([
      fetchRegistrations(),
      fetchApplications(),
      fetchDonations(),
      fetchWhatsAppInbox(),
    ])

    const registrations = registrationsRes.rows || []
    const applications = applicationsRes.rows || []
    const donations = donationsRes.rows || []
    const inbox = inboxRes.rows || []
    const unreadTotal = inbox.reduce((sum, c) => sum + (c.unread || 0), 0)

    const badges = {
      registrations: registrations.length,
      applications: applications.length,
      donations: donations.length,
      whatsappInboxUnread: unreadTotal,
    }

    const items = [
      ...registrations.map((r) => ({
        id: `registration-${r.id}`,
        text: registrationText(r),
        to: '/admin/registrations',
        ts: getTimestamp(r),
      })),
      ...applications.map((a) => ({
        id: `application-${a.id}`,
        text: applicationText(a),
        to: '/admin/applications',
        ts: getTimestamp(a),
      })),
      ...donations.map((d) => ({
        id: `donation-${d.id}`,
        text: donationText(d),
        to: '/admin/donations',
        ts: getTimestamp(d),
      })),
      ...inbox
        .filter((c) => (c.unread || 0) > 0)
        .map((c) => ({
          id: `whatsapp-${c.id}`,
          text: `${c.unread} unread WhatsApp ${c.unread === 1 ? 'message' : 'messages'} from ${c.name || 'a contact'}`,
          to: '/admin/whatsapp/inbox',
          ts: getTimestamp(c),
        })),
    ]
      .filter((n) => n.ts > 0)
      .sort((a, b) => b.ts - a.ts)
      .slice(0, MAX_NOTIFICATIONS)
      .map((n) => ({ ...n, time: timeAgo(n.ts), read: readSet.has(n.id) }))

    state = { badges, notifications: items }
    notifyListeners()
  } catch {
    // Network hiccup — keep showing the last good state, try again next tick.
  }
}

function ensureStarted() {
  if (started) return
  started = true
  loadOnce()
  intervalId = setInterval(loadOnce, POLL_MS)
}

function stopIfNoListeners() {
  if (listeners.size === 0 && intervalId) {
    clearInterval(intervalId)
    intervalId = null
    started = false
  }
}

export function useAdminNotifications() {
  const [local, setLocal] = useState(state)

  useEffect(() => {
    listeners.add(setLocal)
    ensureStarted()
    setLocal(state) // pick up any data the store already has
    return () => {
      listeners.delete(setLocal)
      stopIfNoListeners()
    }
  }, [])

  const markRead = useCallback((id) => {
    readSet.add(id)
    persistReadSet(readSet)
    state = { ...state, notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) }
    notifyListeners()
  }, [])

  const markAllRead = useCallback(() => {
    state.notifications.forEach((n) => readSet.add(n.id))
    persistReadSet(readSet)
    state = { ...state, notifications: state.notifications.map((n) => ({ ...n, read: true })) }
    notifyListeners()
  }, [])

  const unreadCount = local.notifications.filter((n) => !n.read).length

  return { badges: local.badges, notifications: local.notifications, unreadCount, markRead, markAllRead }
}