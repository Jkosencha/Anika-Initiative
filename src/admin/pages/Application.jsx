import React, { useMemo, useState } from "react";
import { X, ChevronDown, Trash2 } from "lucide-react";
import { useOutletContext } from "react-router-dom";

// configuring light and dark theme
const lightColors = {
  bg: "#fafaf8",
  border: "#e8e5df",
  text: "#1c1a17",
  muted: "#8c8579",
  panel: "#ffffff",
  buttonBg: "#1c1a17",
  buttonText: "#ffffff",
  inputBg: "#ffffff",
  inputPlaceholder: "#8c8579",
};

const darkColors = {
  bg: "#1a1a1a",
  border: "#3a3a3a",
  text: "#f0f0f0",
  muted: "#aaaaaa",
  panel: "#2a2a2a",
  buttonBg: "#f0f0f0",
  buttonText: "#1a1a1a",
  inputBg: "#2a2a2a",
  inputPlaceholder: "#aaaaaa",
};

const AVATAR_COLORS = ["#2f4a6b", "#c0392b", "#2d7a43", "#b3760c", "#6b4a8a"];

const STATUS_STYLE = {
  New: { bg: "#fdecd2", dot: "#c98a1f", text: "#8a5c10" },
  Shortlisted: { bg: "#dbe6f5", dot: "#2f4a6b", text: "#2f4a6b" },
  Accepted: { bg: "#dcefe0", dot: "#2d7a43", text: "#2d7a43" },
  Rejected: { bg: "#f6d9d9", dot: "#b23b3b", text: "#b23b3b" },
};

const STATUSES = ["New", "Shortlisted", "Accepted", "Rejected"];

function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function avatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const SEED = [
  {
    id: 1,
    name: "Joan Mueni",
    programme: "Gaining Grip (Enterprise)",
    submitted: "Today",
    status: "New",
    email: "joan.mueni@example.com",
    phone: "+254 7•• ••• 214",
    summary:
      "Requesting enterprise support to scale a handmade leather-goods workshop that currently employs three young women in Kayole.",
    experience: "3 years running an informal shoe-repair and leatherwork stall.",
  },
  {
    id: 2,
    name: "Sam Kariuki",
    programme: "Try My Shoe (Scripts)",
    submitted: "Yesterday",
    status: "Shortlisted",
    email: "sam.kariuki@example.com",
    phone: "+254 7•• ••• 887",
    summary:
      "Submitted a short film script exploring youth unemployment in Mathare, seeking script development support.",
    experience: "Wrote and directed two short films screened at local festivals.",
  },
  {
    id: 3,
    name: "Amina Wanjiru",
    programme: "Art Therapy Facilitation",
    submitted: "3 days ago",
    status: "Accepted",
    email: "amina.wanjiru@example.com",
    phone: "+254 7•• ••• 043",
    summary:
      "Trained facilitator applying to run weekly art-therapy sessions for displaced youth across two counties.",
    experience: "Certified art therapist, 5 years facilitating community workshops.",
  },
];

function toCSV(rows) {
  const header = ["Applicant", "Programme", "Submitted", "Status", "Email", "Phone"];
  const lines = rows.map((r) =>
    [r.name, r.programme, r.submitted, r.status, r.email, r.phone]
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
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function Pill({ active, children, onClick, colors }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? colors.text : colors.panel,
        color: active ? colors.panel : colors.text,
        border: `1px solid ${active ? colors.text : colors.border}`,
      }}
      className="px-4 py-1.5 rounded-full text-sm font-semibold transition-colors"
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.New;
  return (
    <span
      style={{ background: s.bg, color: s.text }}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
    >
      <span style={{ background: s.dot }} className="w-1.5 h-1.5 rounded-full" />
      {status}
    </span>
  );
}

function ReviewModal({ app, onClose, onUpdateStatus, onDelete, colors }) {
  if (!app) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ background: "rgba(20,18,15,0.45)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: colors.panel, border: `1px solid ${colors.border}` }}
        className="w-full max-w-lg rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="flex items-start justify-between p-5 border-b" style={{ borderColor: colors.border }}>
          <div className="flex items-center gap-3">
            <div
              style={{ background: avatarColor(app.name) }}
              className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold"
            >
              {initials(app.name)}
            </div>
            <div>
              <div className="font-bold text-lg" style={{ color: colors.text }}>
                {app.name}
              </div>
              <div className="text-sm" style={{ color: colors.muted }}>
                {app.programme}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5">
            <X size={18} color={colors.muted} />
          </button>
        </div>

        <div className="p-5 space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs uppercase tracking-wide" style={{ color: colors.muted }}>
                Submitted
              </div>
              <div style={{ color: colors.text }}>{app.submitted}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide" style={{ color: colors.muted }}>
                Contact
              </div>
              <div style={{ color: colors.text }}>{app.email}</div>
              <div style={{ color: colors.text }}>{app.phone}</div>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wide mb-1" style={{ color: colors.muted }}>
              Application summary
            </div>
            <p style={{ color: colors.text }}>{app.summary}</p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wide mb-1" style={{ color: colors.muted }}>
              Relevant experience
            </div>
            <p style={{ color: colors.text }}>{app.experience}</p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wide mb-2" style={{ color: colors.muted }}>
              Update status
            </div>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => onUpdateStatus(app.id, s)}
                  style={{
                    background: app.status === s ? colors.text : colors.panel,
                    color: app.status === s ? colors.panel : colors.text,
                    border: `1px solid ${app.status === s ? colors.text : colors.border}`,
                  }}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="flex items-center justify-between p-4 border-t"
          style={{ borderColor: colors.border }}
        >
          <button
            onClick={() => {
              onDelete(app.id);
              onClose();
            }}
            className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full"
            style={{ color: "#b23b3b" }}
          >
            <Trash2 size={14} /> Withdraw application
          </button>
          <button
            onClick={onClose}
            style={{ background: colors.buttonBg, color: colors.buttonText }}
            className="text-sm font-semibold px-4 py-2 rounded-full"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Applications() {
  // taking theme and searchquery from outlet context
  const { theme, searchQuery } = useOutletContext();
  const COLORS = theme === 'dark' ? darkColors : lightColors;

  const [applications, setApplications] = useState(SEED);
  const [tab, setTab] = useState("All");
  const [reviewing, setReviewing] = useState(null);
  // const [showNewForm, setShowNewForm] = useState(false);   // <-- commented out
  // const [form, setForm] = useState({ name: "", programme: "" }); // <-- commented out

  const tabs = ["All", "New", "Shortlisted", "Accepted"];

  // filter ya search
  const filtered = useMemo(() => {
    let result = applications;

    // filter by tab
    if (tab !== "All") {
      result = result.filter((a) => a.status === tab);
    }

    // filter by searcg
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.programme.toLowerCase().includes(q)
      );
    }

    return result;
  }, [applications, tab, searchQuery]);

  function updateStatus(id, status) {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    setReviewing((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
  }

  function deleteApp(id) {
    setApplications((prev) => prev.filter((a) => a.id !== id));
  }

  // function addApplication(e) {  
  //   e.preventDefault();
  //   if (!form.name.trim() || !form.programme.trim()) return;
  //   const newApp = {
  //     id: Date.now(),
  //     name: form.name.trim(),
  //     programme: form.programme.trim(),
  //     submitted: "Today",
  //     status: "New",
  //     email: "-",
  //     phone: "-",
  //     summary: "No summary submitted yet.",
  //     experience: "-",
  //   };
  //   setApplications((prev) => [newApp, ...prev]);
  //   setForm({ name: "", programme: "" });
  //   setShowNewForm(false);
  // }

  return (
    <div style={{ background: COLORS.bg, minHeight: "100%" }} className="p-6 font-sans rounded-lg">
      <style>{`
        .app-input::placeholder {
          color: ${COLORS.inputPlaceholder};
          opacity: 1;
        }
      `}</style>

      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>
            Applications
          </h1>
          <p className="text-sm mt-1" style={{ color: COLORS.muted }}>
            Artist, workshop and fellowship applications to review.
          </p>
        </div>
        <div className="flex gap-2">
          {/* application button removed
          <button
            onClick={() => setShowNewForm((v) => !v)}
            style={{
              background: COLORS.buttonBg,
              color: COLORS.buttonText,
            }}
            className="text-xs font-bold tracking-wide px-4 py-2.5 rounded-lg"
          >
            + NEW APPLICATION
          </button>
          */}
          <button
            onClick={() => downloadCSV(filtered, "applications.csv")}
            style={{
              border: `1px solid ${COLORS.border}`,
              background: COLORS.panel,
              color: COLORS.text,
            }}
            className="text-xs font-bold tracking-wide px-4 py-2.5 rounded-lg"
          >
            EXPORT CSV
          </button>
        </div>
      </div>

      {/* commenting out applicationn form
      {showNewForm && (
        <form
          onSubmit={addApplication}
          style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }}
          className="rounded-xl p-4 mb-5 flex flex-wrap gap-3 items-end"
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: COLORS.muted }}>
              Applicant name
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="app-input px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                border: `1px solid ${COLORS.border}`,
                background: COLORS.inputBg,
                color: COLORS.text,
              }}
              placeholder="e.g. Peter Otieno"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: COLORS.muted }}>
              Programme
            </label>
            <input
              value={form.programme}
              onChange={(e) => setForm({ ...form, programme: e.target.value })}
              className="app-input px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                border: `1px solid ${COLORS.border}`,
                background: COLORS.inputBg,
                color: COLORS.text,
              }}
              placeholder="e.g. Gaining Grip (Enterprise)"
            />
          </div>
          <button
            type="submit"
            style={{
              background: COLORS.buttonBg,
              color: COLORS.buttonText,
            }}
            className="text-sm font-semibold px-4 py-2 rounded-lg"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setShowNewForm(false)}
            className="text-sm font-semibold px-3 py-2"
            style={{ color: COLORS.muted }}
          >
            Cancel
          </button>
        </form>
      )}
      */}

      <div className="flex gap-2 mb-5 flex-wrap">
        {tabs.map((t) => (
          <Pill key={t} active={tab === t} onClick={() => setTab(t)} colors={COLORS}>
            {t}
          </Pill>
        ))}
      </div>

      <div
        style={{
          background: COLORS.panel,
          border: `1px solid ${COLORS.border}`,
        }}
        className="rounded-xl overflow-hidden"
      >
        <div
          className="grid text-xs font-bold tracking-wide px-5 py-3 border-b"
          style={{
            color: COLORS.muted,
            borderColor: COLORS.border,
            gridTemplateColumns: "2fr 2fr 1fr 1fr 0.8fr",
          }}
        >
          <div>APPLICANT</div>
          <div>PROGRAMME</div>
          <div>SUBMITTED</div>
          <div>STATUS</div>
          <div></div>
        </div>

        {filtered.length === 0 && (
          <div className="px-5 py-10 text-center text-sm" style={{ color: COLORS.muted }}>
            No applications match the current filter.
          </div>
        )}

        {filtered.map((app) => (
          <div
            key={app.id}
            className="grid items-center px-5 py-4 border-b last:border-b-0"
            style={{ borderColor: COLORS.border, gridTemplateColumns: "2fr 2fr 1fr 1fr 0.8fr" }}
          >
            <div className="flex items-center gap-3">
              <div
                style={{ background: avatarColor(app.name) }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0"
              >
                {initials(app.name)}
              </div>
              <span className="font-semibold text-sm" style={{ color: COLORS.text }}>
                {app.name}
              </span>
            </div>
            <div className="text-sm" style={{ color: "#2f4a6b" }}>
              {app.programme}
            </div>
            <div className="text-sm" style={{ color: COLORS.text }}>
              {app.submitted}
            </div>
            <div>
              <StatusBadge status={app.status} />
            </div>
            <div className="text-right">
              <button
                onClick={() => setReviewing(app)}
                style={{
                  border: `1px solid ${COLORS.border}`,
                  background: COLORS.panel,
                  color: COLORS.text,
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg"
              >
                Review
              </button>
            </div>
          </div>
        ))}
      </div>

      <ReviewModal
        app={reviewing}
        onClose={() => setReviewing(null)}
        onUpdateStatus={updateStatus}
        onDelete={deleteApp}
        colors={COLORS}
      />
    </div>
  );
}