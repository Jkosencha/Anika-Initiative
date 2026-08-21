/* ============================================================
   ANIKA — local persistence store (demo mode)
   When the backend API is unavailable, submissions are stored
   here in the browser so the full flow still works end-to-end.
   ============================================================ */

const STORAGE_KEY = 'anika_db_v1';

function uid() {
  return `rec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function seed() {
  const now = Date.now();
  return {
    registrations: [
      {
        id: uid(),
        name: 'Jane Wanjiku',
        phone: '+254 712 345 678',
        eventTitle: 'Sema-Anika Community Dialogue Forum',
        consent: true,
        source: 'web',
        createdAt: new Date(now - 86400000 * 3).toISOString(),
      },
      {
        id: uid(),
        name: 'Kofi Mensah',
        phone: '+233 24 556 778',
        eventTitle: 'Griphon x ANIKA — Poetry & Beat Night',
        consent: true,
        source: 'whatsapp',
        createdAt: new Date(now - 86400000).toISOString(),
      },
      {
        id: uid(),
        name: 'Amina Hassan',
        phone: '+255 744 123 456',
        eventTitle: 'Her Story — Open Mic & Development Forum',
        consent: false,
        source: 'web',
        createdAt: new Date(now - 3600000 * 5).toISOString(),
      },
    ],
    applications: [
      {
        id: uid(),
        name: 'Brian Otieno',
        phone: '+254 701 222 333',
        type: 'alliance',
        org: 'Lake Arts Collective',
        note: 'Interested in cross-border residencies.',
        consent: true,
        status: 'PENDING',
        createdAt: new Date(now - 86400000 * 2).toISOString(),
      },
    ],
    donations: [
      {
        id: uid(),
        name: 'Mariam K.',
        phone: '+254 733 555 777',
        amount: 5000,
        currency: 'KES',
        isRecurring: true,
        method: 'M-Pesa',
        consent: true,
        createdAt: new Date(now - 86400000 * 4).toISOString(),
      },
      {
        id: uid(),
        name: 'Priya S.',
        phone: '+44 7700 900123',
        amount: 50,
        currency: 'USD',
        isRecurring: false,
        method: 'Card',
        consent: true,
        createdAt: new Date(now - 3600000 * 20).toISOString(),
      },
    ],
    inquiries: [
      {
        id: uid(),
        name: 'Sarah Ochieng',
        phone: '+254 722 222 333',
        action: 'register',
        note: 'Tell me when the next youth lab opens.',
        consent: true,
        createdAt: new Date(now - 3600000 * 2).toISOString(),
      },
    ],
  };
}

export function loadDB() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* corrupted storage — fall through to fresh seed */
  }
  const fresh = seed();
  saveDB(fresh);
  return fresh;
}

export function saveDB(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function addRecord(type, payload) {
  const db = loadDB();
  const record = { id: uid(), createdAt: new Date().toISOString(), ...payload };
  db[type] = [record, ...(db[type] || [])];
  saveDB(db);
  return record;
}

export function getRecords(type) {
  return loadDB()[type] || [];
}

export function getMetrics() {
  const db = loadDB();
  const donations = db.donations || [];
  const totalDonated = donations.reduce(
    (sum, d) => sum + (d.currency === 'KES' ? d.amount / 130 : d.amount),
    0,
  );
  return {
    registrations: (db.registrations || []).length,
    applications: (db.applications || []).length,
    donations: donations.length,
    inquiries: (db.inquiries || []).length,
    totalDonated: Math.round(totalDonated * 100) / 100,
    waOptIns: (db.registrations || []).filter((r) => r.consent).length,
  };
}
