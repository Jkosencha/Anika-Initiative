/* ============================================================
   ANIKA — API client
   Talks to the backend (Server) when it is running. If the API
   is unreachable, submissions transparently fall back to the
   local store so the product works end-to-end in demo mode.

   Expected backend contract (REST):
     POST /api/registrations
     POST /api/applications
     POST /api/donations
     POST /api/inquiries
     GET  /api/metrics
   ============================================================ */

import { addRecord, getRecords, updateRecord, deleteRecord, getMetrics } from './store';

export const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Maps logical kinds to their REST collection path (plural).
const KIND_COLLECTION = {
  registration: 'registrations',
  application: 'applications',
  donation: 'donations',
  inquiry: 'inquiries',
  event: 'events',
  whatsappInbox: 'whatsapp-inbox',
  whatsappBroadcast: 'whatsapp-broadcasts',
  whatsappSettings: 'whatsapp-settings',
};
const COLLECTION_KIND = Object.fromEntries(
  Object.entries(KIND_COLLECTION).map(([k, v]) => [v, k])
);

async function request(method, path, body, timeoutMs = 4000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`API ${path} responded ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

// Kind -> local store collection name mapping for fallbacks.
const STORE_COLLECTION = {
  registration: 'registrations',
  application: 'applications',
  donation: 'donations',
  inquiry: 'inquiries',
  event: 'events',
  whatsappInbox: 'whatsAppInbox',
  whatsappBroadcast: 'whatsAppBroadcasts',
  whatsappSettings: 'whatsAppSettings',
};

/** Fetch a collection from the API; fall back to the local store. */
export async function fetchCollection(kind) {
  try {
    const rows = await request('GET', `/${KIND_COLLECTION[kind]}`);
    return { ok: true, source: 'api', rows };
  } catch {
    return { ok: true, source: 'local', rows: getRecords(STORE_COLLECTION[kind]) };
  }
}

/** Create a record. API-first; falls back to the local store. */
async function submit(kind, payload) {
  try {
    const data = await request('POST', `/${KIND_COLLECTION[kind]}`, payload);
    return { ok: true, source: 'api', record: data };
  } catch {
    const record = addRecord(STORE_COLLECTION[kind], payload);
    return { ok: true, source: 'local', record };
  }
}

/** Update an existing record. API-first; falls back to the local store. */
export async function patchRecord(kind, id, patch) {
  try {
    const data = await request('PATCH', `/${KIND_COLLECTION[kind]}/${id}`, patch);
    return { ok: true, source: 'api', record: data };
  } catch {
    const record = updateRecord(STORE_COLLECTION[kind], id, patch);
    return { ok: true, source: 'local', record };
  }
}

/** Delete a record. API-first; falls back to the local store. */
export async function removeRecord(kind, id) {
  try {
    await request('DELETE', `/${KIND_COLLECTION[kind]}/${id}`);
    return { ok: true, source: 'api' };
  } catch {
    deleteRecord(STORE_COLLECTION[kind], id);
    return { ok: true, source: 'local' };
  }
}

// --- Named creation helpers (back-compatible) -------------------------------
export function submitRegistration(payload) {
  return submit('registration', payload);
}
export function submitApplication(payload) {
  return submit('application', payload);
}
export function submitDonation(payload) {
  return submit('donation', payload);
}
export function submitInquiry(payload) {
  return submit('inquiry', payload);
}

// --- Generic collection helpers ---------------------------------------------
export function fetchEvents() {
  return fetchCollection('event');
}
export function fetchWhatsAppInbox() {
  return fetchCollection('whatsappInbox');
}
export function fetchWhatsAppBroadcasts() {
  return fetchCollection('whatsappBroadcast');
}
export function addEvent(payload) {
  return submit('event', payload);
}
export function addWhatsAppBroadcast(payload) {
  return submit('whatsappBroadcast', payload);
}
export function updateEvent(id, patch) {
  return patchRecord('event', id, patch);
}
export function deleteEvent(id) {
  return removeRecord('event', id);
}
export function updateWhatsAppMessage(id, patch) {
  return patchRecord('whatsappInbox', id, patch);
}

export function fetchWhatsAppSettings() {
  return fetchCollection('whatsappSettings');
}
export function addWhatsAppSettings(payload) {
  return submit('whatsappSettings', payload);
}
export function updateWhatsAppSettings(id, patch) {
  return patchRecord('whatsappSettings', id, patch);
}

/** Aggregate WhatsApp live-state (shared across Assistant / Inbox / Broadcast). */
export async function fetchWhatsAppStats() {
  const { rows } = await fetchCollection('whatsappInbox');
  const list = Array.isArray(rows) ? rows : [];
  return {
    threads: list.length,
    optedOut: list.filter((c) => c.optedOut).length,
    escalated: list.filter((c) => c.intent === 'escalation' && !c.resolved).length,
    unread: list.reduce((sum, c) => sum + (c.unread || 0), 0),
  };
}

export function fetchRegistrations() {
  return fetchCollection('registration');
}
export function updateRegistration(id, patch) {
  return patchRecord('registration', id, patch);
}
export function deleteRegistration(id) {
  return removeRecord('registration', id);
}

export function fetchApplications() {
  return fetchCollection('application');
}
export function updateApplication(id, patch) {
  return patchRecord('application', id, patch);
}
export function deleteApplication(id) {
  return removeRecord('application', id);
}

export function fetchDonations() {
  return fetchCollection('donation');
}
export function updateDonation(id, patch) {
  return patchRecord('donation', id, patch);
}
export function deleteDonation(id) {
  return removeRecord('donation', id);
}

export async function fetchMetrics() {
  try {
    return await request('GET', '/metrics');
  } catch {
    return getMetrics();
  }
}

// expose the identifier map for utilities (kept small, no unused API surface)
export { COLLECTION_KIND };
