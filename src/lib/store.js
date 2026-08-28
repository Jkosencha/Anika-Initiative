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
    events: [
      {
        id: uid(),
        title: 'Sema-Anika Community Dialogue Forum',
        date: 'Sat, 12 Sep 2026',
        time: '14:00 EAT',
        location: 'Nairobi Cultural Centre',
        pillar: 'Arts & Culture',
        capacity: 120,
        registered: 98,
        status: 'Live',
        createdAt: new Date(now - 86400000 * 8).toISOString(),
      },
      {
        id: uid(),
        title: 'Try My Shoe — Youth Storytelling Lab',
        date: 'Thu, 24 Sep 2026',
        time: '10:00 EAT',
        location: 'Kilimani Creative Space, Nairobi',
        pillar: 'Youth & Migration',
        capacity: 40,
        registered: 40,
        status: 'Full',
        createdAt: new Date(now - 86400000 * 7).toISOString(),
      },
      {
        id: uid(),
        title: 'Griphon x ANIKA — Poetry & Beat Night',
        date: 'Sat, 03 Oct 2026',
        time: '19:00 EAT',
        location: 'The GoDown Arts Centre, Nairobi',
        pillar: 'Expressions',
        capacity: 200,
        registered: 152,
        status: 'Live',
        createdAt: new Date(now - 86400000 * 5).toISOString(),
      },
      {
        id: uid(),
        title: 'Gaining Grip — Creative Expression & Healing Lab',
        date: 'Sat, 17 Oct 2026',
        time: '09:00 EAT',
        location: 'Karura Creative Space, Nairobi',
        pillar: 'Expressions',
        capacity: 60,
        registered: 21,
        status: 'Live',
        createdAt: new Date(now - 86400000 * 4).toISOString(),
      },
      {
        id: uid(),
        title: 'Y-Talks — Citizens Civic Art Forum',
        date: 'Sat, 07 Nov 2026',
        time: '14:00 EAT',
        location: 'Nairobi City Hall Amphitheatre',
        pillar: 'Governance',
        capacity: 300,
        registered: 88,
        status: 'Live',
        createdAt: new Date(now - 86400000 * 3).toISOString(),
      },
      {
        id: uid(),
        title: 'Her Story — Open Mic & Healing Forum',
        date: 'Sat, 21 Nov 2026',
        time: '16:00 EAT',
        location: 'Kenya National Theatre, Nairobi',
        pillar: 'Gender & Development',
        capacity: 150,
        registered: 64,
        status: 'Live',
        createdAt: new Date(now - 86400000 * 2).toISOString(),
      },
    ],
    whatsAppInbox: [
      {
        id: uid(),
        name: 'Alex Kwame',
        phone: '+254 711 000 111',
        intent: 'escalation',
        unread: 2,
        time: '08:12',
        preview: 'HELP — I registered for the forum but haven’t received a confirmation yet.',
        resolved: false,
        messages: [
          { from: 'them', text: 'HELP — I registered for the Sema-Anika forum but haven’t received a confirmation yet.', time: '08:10' },
          { from: 'me', text: 'Hi Alex, sorry about that — let me check your registration now.', time: '08:30' },
          { from: 'them', text: 'Thanks! I used +233 711 000 111.', time: '09:02' },
        ],
        createdAt: new Date(now - 3600000 * 3).toISOString(),
      },
      {
        id: uid(),
        name: 'Sarah Ochieng',
        phone: '+254 722 222 333',
        intent: 'faq',
        unread: 1,
        time: '09:41',
        preview: 'What events are coming up for artists this month?',
        resolved: false,
        messages: [
          { from: 'them', text: 'What events are coming up for artists this month?', time: '09:40' },
        ],
        createdAt: new Date(now - 3600000 * 2).toISOString(),
      },
      {
        id: uid(),
        name: 'David Mensah',
        phone: '+233 24 555 666',
        intent: 'alliance',
        unread: 1,
        time: 'Yesterday',
        preview: 'How do I apply for Alliance membership from Ghana?',
        resolved: false,
        messages: [
          { from: 'them', text: 'How do I apply for Alliance membership from Ghana?', time: 'Yesterday 18:30' },
          { from: 'me', text: 'Hi David! You can apply via the Alliance page or by sending your details here.', time: 'Yesterday 19:05' },
          { from: 'them', text: 'Great, I will fill the form and send it across.', time: 'Yesterday 19:20' },
        ],
        createdAt: new Date(now - 86400000).toISOString(),
      },
      {
        id: uid(),
        name: 'Amina Yusuf',
        phone: '+255 744 333 444',
        intent: 'donation',
        unread: 0,
        time: 'Yesterday',
        preview: 'Can I make a one-time donation via M-Pesa?',
        resolved: true,
        messages: [
          { from: 'them', text: 'Can I make a one-time donation via M-Pesa?', time: 'Yesterday 18:00' },
          { from: 'me', text: 'Yes! Tap Donate on the site and choose M-Pesa — you will get an instant receipt.', time: 'Yesterday 18:20' },
        ],
        createdAt: new Date(now - 86400000).toISOString(),
      },
    ],
    whatsAppBroadcasts: [
      {
        id: uid(),
        title: 'Event reminder — Sema-Anika Forum',
        audience: 'Opted-in registrants',
        channel: 'Web + WhatsApp',
        recipients: 98,
        date: 'Today 09:00',
        status: 'Sent',
        createdAt: new Date().toISOString(),
      },
      {
        id: uid(),
        title: 'Pan-African Arts Alliance — member call',
        audience: 'Alliance contacts',
        channel: 'WhatsApp',
        recipients: 214,
        date: 'Yesterday 18:00',
        status: 'Delivered',
        createdAt: new Date(now - 86400000).toISOString(),
      },
      {
        id: uid(),
        title: 'Community broadcast — campaign dispatch',
        audience: 'All opted-in',
        channel: 'WhatsApp',
        recipients: 321,
        date: '2 days ago',
        status: 'Sent',
        createdAt: new Date(now - 86400000 * 2).toISOString(),
      },
    ],
  };
}

export function loadDB() {
  const fresh = seed();
  const restored = (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      /* corrupted storage — fall through to fresh seed */
    }
    return null;
  })();
  // Migrate: merge fresh seed collections so older stored DBs gain new
  // collections (events, whatsAppInbox, whatsAppBroadcasts) without
  // discarding existing saved records.
  const db = restored || {};
  Object.keys(fresh).forEach((key) => {
    if (!(key in db)) db[key] = fresh[key];
  });
  if (!restored) saveDB(db);
  return db;
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

export function updateRecord(type, id, patch) {
  const db = loadDB();
  const list = db[type] || [];
  db[type] = list.map((r) => (r.id === id ? { ...r, ...patch } : r));
  saveDB(db);
  return db[type].find((r) => r.id === id);
}

export function deleteRecord(type, id) {
  const db = loadDB();
  db[type] = (db[type] || []).filter((r) => r.id !== id);
  saveDB(db);
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
    events: (db.events || []).length,
    whatsAppInbox: (db.whatsAppInbox || []).length,
    whatsAppBroadcasts: (db.whatsAppBroadcasts || []).length,
    totalDonated: Math.round(totalDonated * 100) / 100,
    waOptIns: (db.registrations || []).filter((r) => r.consent).length,
  };
}
