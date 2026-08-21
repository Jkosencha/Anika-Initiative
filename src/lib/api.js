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

import { addRecord, getMetrics } from './store';

export const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function post(path, body, timeoutMs = 4000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`API ${path} responded ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function submit(kind, payload) {
  const endpoint = { registration: '/registrations', application: '/applications', donation: '/donations', inquiry: '/inquiries' }[kind];
  try {
    const data = await post(endpoint, payload);
    return { ok: true, source: 'api', record: data };
  } catch {
    const record = addRecord(
      { registration: 'registrations', application: 'applications', donation: 'donations', inquiry: 'inquiries' }[kind],
      payload,
    );
    return { ok: true, source: 'local', record };
  }
}

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

export async function fetchMetrics() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${API_BASE}/metrics`, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error('metrics unavailable');
    return await res.json();
  } catch {
    return getMetrics();
  }
}
