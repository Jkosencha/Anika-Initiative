import { useEffect, useMemo, useState } from "react";
import { X, Plus, Search } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import {
  fetchRegistrations,
  submitRegistration,
  updateRegistration,
} from "../../lib/api";

const lightColors = {
  bg: "#fafaf8", border: "#e8e5df", text: "#1c1a17", muted: "#8c8579",
  panel: "#ffffff", green: "#3c8a4c", red: "#d24a42", orange: "#e2a63f", blue: "#2f4a6b",
  buttonBg: "#1c1a17", buttonText: "#ffffff", inputBg: "#ffffff", inputPlaceholder: "#8c8579",
};

const darkColors = {
  bg: "#1a1a1a", border: "#3a3a3a", text: "#f0f0f0", muted: "#aaaaaa",
  panel: "#2a2a2a", green: "#4c9a5c", red: "#d24a42", orange: "#e2a63f", blue: "#7c9ac4",
  buttonBg: "#f0f0f0", buttonText: "#1a1a1a", inputBg: "#2a2a2a", inputPlaceholder: "#aaaaaa",
};

const STATUS_STYLE = {
  Confirmed: { bg: "#dcefe0", text: "#2d7a43", dot: "#2d7a43" },
  Pending: { bg: "#fdecd2", text: "#8a5c10", dot: "#c98a1f" },
  Waitlist: { bg: "#dbe6f5", text: "#2f4a6b", dot: "#2f4a6b" },
  Canceled: { bg: "#f6d9d9", text: "#b23b3b", dot: "#b23b3b" },
};

function initials(name) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = ["#c0392b", "#2f4a6b", "#b3760c", "#2d7a43", "#6b4a8a"];
function avatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const SEED = [
  { id: 1, name: "Jane Wanjiku", event: "Sema-Anika Community Dialogue Forum", phone: "+254 712 345 678", date: "Today 09:14", source: "Web", consent: true, status: "Confirmed" },
  { id: 2, name: "Kofi Mensah", event: "Griphon x ANIKA — Poetry & Beat Night", phone: "+233 24 556 778", date: "Today 08:02", source: "WhatsApp", consent: true, status: "Confirmed" },
  { id: 3, name: "Amina Hassan", event: "Her Story — Open Mic & Development Forum", phone: "+255 744 123 456", date: "Yesterday", source: "Web", consent: false, status: "Pending" },
  { id: 4, name: "Brian Otieno", event: "Try My Shoe — Youth Storytelling Lab", phone: "+254 701 222 333", date: "Yesterday", source: "WhatsApp", consent: true, status: "Confirmed" },
  { id: 5, name: "Sarah Ochieng", event: "Sema-Anika Community Dialogue Forum", phone: "+254 722 222 333", date: "2 days ago", source: "Web", consent: true, status: "Confirmed" },
  { id: 6, name: "David Mensah", event: "Y-Talks — Citizens' Civic Art Forum", phone: "+233 24 555 666", date: "2 days ago", source: "WhatsApp", consent: true, status: "Waitlist" },
  { id: 7, name: "Mariam Kiprop", event: "Gaining Grip — Healing Lab", phone: "+254 733 555 777", date: "3 days ago", source: "Web", consent: false, status: "Canceled" },
  { id: 8, name: "Priya Shah", event: "Her Story — Open Mic & Development Forum", phone: "+44 7700 900123", date: "3 days ago", source: "Web", consent: true, status: "Pending" },
];

function toCSV(rows) {
  const header = ["Attendee", "Event", "Phone", "Date", "Source", "WhatsApp Opt-in", "Status"];
  const lines = rows.map((r) =>
    [r.name, r.event, r.phone, r.date, r.source, r.consent ? "Yes" : "No", r.status]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  return [header.join(","), ...lines].join("\n");
}

function downloadCSV(rows, filename) {
  const csv = toCSV(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function StatCard({ label, value, sub, bg, textColor = "#fff" }) {
  return (
    <div style={{ background: bg }} className="rounded-xl p-5 flex flex-col justify-between min-h-[120px]">
      <div style={{ color: textColor, opacity: 0.85 }} className="text-xs font-bold tracking-wide">{label}</div>
      <div>
        <div style={{ color: textColor }} className="text-3xl font-extrabold leading-tight">{value}</div>
        {sub && <div style={{ color: textColor, opacity: 0.85 }} className="text-xs font-semibold mt-1">{sub}</div>}
      </div>
    </div>
  );
}

function AddRegistrationModal({ onClose, onAdd, colors }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [event, setEvent] = useState("Sema-Anika Community Dialogue Forum");
  const [consent, setConsent] = useState(true);

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      id: Date.now(),
      name: name.trim(),
      event,
      phone: phone.trim() ? phone : "+254 7•• ••• 000",
      date: "Today " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      source: "Manual",
      consent,
      status: "Confirmed",
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ background: "rgba(20,18,15,0.45)" }} onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} style={{ background: colors.panel, border: `1px solid ${colors.border}` }} className="w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: colors.border }}>
          <h2 className="font-bold text-lg" style={{ color: colors.text }}>Add registration</h2>
          <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-black/5"><X size={18} color={colors.muted} /></button>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: colors.muted }}>Full name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Grace Njeri" className="px-3 py-2 rounded-lg text-sm outline-none" style={{ border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text }} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: colors.muted }}>WhatsApp number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254 712 000 000" className="px-3 py-2 rounded-lg text-sm outline-none" style={{ border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text }} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: colors.muted }}>Event</label>
            <select value={event} onChange={(e) => setEvent(e.target.value)} className="px-3 py-2 rounded-lg text-sm outline-none" style={{ border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, appearance: "auto" }}>
              {SEED.map((r) => r.event).filter((v, i, a) => a.indexOf(v) === i).map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm" style={{ color: colors.text }}>
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="h-4 w-4 rounded" />
            WhatsApp opt-in for updates
          </label>
        </div>
        <div className="flex items-center justify-between p-4 border-t" style={{ borderColor: colors.border }}>
          <button type="button" onClick={onClose} className="text-sm font-semibold px-3 py-2" style={{ color: colors.muted }}>Cancel</button>
          <button type="submit" style={{ background: colors.buttonBg, color: colors.buttonText }} className="text-sm font-semibold px-4 py-2 rounded-lg">Add registration</button>
        </div>
      </form>
    </div>
  );
}

export default function AdminRegistrations() {
  const { theme } = useOutletContext();
  const COLORS = theme === "dark" ? darkColors : lightColors;

  const [rows, setRows] = useState(SEED);
  const [tab, setTab] = useState("All");
  const [q, setQ] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchRegistrations().then(({ rows: stored }) => {
      if (stored && stored.length) {
        // Normalise store records (which use eventTitle) to the page's shape.
        setRows(stored.map((r) => ({ ...r, event: r.event || r.eventTitle || "" })));
      }
    });
  }, []);

  const tabs = ["All", "Confirmed", "Pending", "Waitlist", "Canceled"];

  const filtered = useMemo(() => {
    let result = rows;
    if (tab !== "All") result = result.filter((r) => r.status === tab);
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      result = result.filter((r) => r.name.toLowerCase().includes(s) || r.event.toLowerCase().includes(s) || r.phone.includes(s));
    }
    return result;
  }, [rows, tab, q]);

  const stats = useMemo(() => {
    return {
      total: rows.length,
      opted: rows.filter((r) => r.consent).length,
      confirmed: rows.filter((r) => r.status === "Confirmed").length,
      events: rows.map((r) => r.event).filter((v, i, a) => a.indexOf(v) === i).length,
    };
  }, [rows]);

  function addRow(row) {
    submitRegistration({ ...row, eventTitle: row.event });
    setRows((prev) => [row, ...prev]);
  }
  function cycleStatus(id) {
    setRows((prev) => prev.map((r) => {
      if (r.id !== id) return r;
      const order = ["Confirmed", "Pending", "Waitlist", "Canceled"];
      const status = order[(order.indexOf(r.status) + 1) % order.length];
      updateRegistration(id, { status });
      return { ...r, status };
    }));
  }

  return (
    <div style={{ background: COLORS.bg, minHeight: "100%" }} className="p-6 font-sans rounded-lg">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>Registrations</h1>
          <p className="text-sm mt-1" style={{ color: COLORS.muted }}>Everyone signed up for ANIKA events.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setModalOpen(true)} style={{ background: COLORS.buttonBg, color: COLORS.buttonText }} className="text-xs font-bold tracking-wide px-4 py-2.5 rounded-lg flex items-center gap-1.5">
            <Plus size={14} /> ADD REGISTRATION
          </button>
          <button onClick={() => downloadCSV(filtered, "registrations.csv")} style={{ border: `1px solid ${COLORS.border}`, background: COLORS.panel, color: COLORS.text }} className="text-xs font-bold tracking-wide px-4 py-2.5 rounded-lg">
            EXPORT CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="TOTAL" value={stats.total} sub="All registrations" bg={COLORS.blue} textColor="#fff" />
        <StatCard label="CONFIRMED" value={stats.confirmed} sub="Going ahead" bg={COLORS.green} textColor="#fff" />
        <StatCard label="WHATSAPP OPT-INS" value={stats.opted} sub="Consented to updates" bg={COLORS.red} textColor="#fff" />
        <StatCard label="EVENTS WITH TAKEOUT" value={stats.events} sub="Distinct events" bg={COLORS.orange} textColor="#1c1a17" />
      </div>

      <div className="flex gap-2 mb-5 flex-wrap items-center">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? COLORS.text : COLORS.panel, color: tab === t ? COLORS.panel : COLORS.text, border: `1px solid ${tab === t ? COLORS.text : COLORS.border}` }} className="px-4 py-1.5 rounded-full text-sm font-semibold transition-colors">
            {t}
          </button>
        ))}
        <div className="relative ml-auto">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLORS.muted }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search attendee, event, phone…" className="pl-9 pr-3 py-2 rounded-lg text-sm outline-none w-64 max-w-full" style={{ border: `1px solid ${COLORS.border}`, background: COLORS.panel, color: COLORS.text }} />
        </div>
      </div>

      <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }} className="rounded-xl overflow-hidden overflow-x-auto">
        <div className="grid text-xs font-bold tracking-wide px-5 py-3 border-b min-w-[980px]" style={{ color: COLORS.muted, borderColor: COLORS.border, gridTemplateColumns: "1.6fr 2fr 1.2fr 1fr 0.8fr 0.9fr 1fr" }}>
          <div>ATTENDEE</div><div>EVENT</div><div>PHONE</div><div>DATE</div><div>SOURCE</div><div>WHATSAPP</div><div>STATUS</div>
        </div>
        {filtered.length === 0 && (
          <div className="px-5 py-10 text-center text-sm" style={{ color: COLORS.muted }}>No registrations match the current filter.</div>
        )}
        {filtered.map((r) => {
          const s = STATUS_STYLE[r.status] || STATUS_STYLE.Pending;
          return (
            <div key={r.id} className="grid items-center px-5 py-4 border-b last:border-b-0 min-w-[980px]" style={{ borderColor: COLORS.border, gridTemplateColumns: "1.6fr 2fr 1.2fr 1fr 0.8fr 0.9fr 1fr" }}>
              <div className="flex items-center gap-3">
                <div style={{ background: avatarColor(r.name) }} className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0">{initials(r.name)}</div>
                <span className="font-semibold text-sm" style={{ color: COLORS.text }}>{r.name}</span>
              </div>
              <div className="text-sm" style={{ color: "#2f4a6b" }}>{r.event}</div>
              <div className="text-sm" style={{ color: COLORS.text }}>{r.phone}</div>
              <div className="text-sm" style={{ color: COLORS.text }}>{r.date}</div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: r.source === "WhatsApp" ? "#dcf4e0" : "#e8e5df", color: r.source === "WhatsApp" ? "#1f7a3a" : "#5c564c" }}>
                  {r.source}
                </span>
              </div>
              <div>
                {r.consent ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: "#2d7a43" }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#2d7a43" }} /> Opted in
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: COLORS.muted }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: COLORS.muted }} /> No
                  </span>
                )}
              </div>
              <button onClick={() => cycleStatus(r.id)} title="Click to change status" style={{ background: s.bg, color: s.text }} className="inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold">
                <span style={{ background: s.dot }} className="w-1.5 h-1.5 rounded-full" />{r.status}
              </button>
            </div>
          );
        })}
      </div>
      {modalOpen && <AddRegistrationModal onClose={() => setModalOpen(false)} onAdd={addRow} colors={COLORS} />}
    </div>
  );
}
