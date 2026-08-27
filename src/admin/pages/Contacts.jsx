// src/admin/pages/Contacts.jsx
import React, { useMemo, useState } from "react";
import { X, Search, Trash2, Pencil } from "lucide-react";
import { useOutletContext } from "react-router-dom";

// ----- Light & Dark color sets (extended) -----
const lightColors = {
  bg: "#fafaf8",
  border: "#e8e5df",
  text: "#1c1a17",
  muted: "#8c8579",
  panel: "#ffffff",
  buttonBg: "#1c1a17",      // dark bg, white text
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
  buttonBg: "#f0f0f0",      // light bg, dark text
  buttonText: "#1a1a1a",
  inputBg: "#2a2a2a",
  inputPlaceholder: "#aaaaaa",
};
// --------------------------------------------

const AVATAR_COLORS = ["#c0392b", "#2f4a6b", "#b3760c", "#2d7a43", "#6b4a8a"];

const TYPE_STYLE = {
  Artist: { bg: "#f6d9d9", text: "#b23b3b" },
  Donor: { bg: "#dcefe0", text: "#2d7a43" },
  Partner: { bg: "#dbe6f5", text: "#2f4a6b" },
  Youth: { bg: "#fbe6c8", text: "#b3760c" },
  Volunteer: { bg: "#e3dcf0", text: "#6b4a8a" },
};

//things that will get captured automatically
const MANUAL_SOURCES = [
  "Website form",
  "M-Pesa",
  "Referral",
  "Email",
  "Phone call",
];

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
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

//dummy data seeed
const SEED = [
  {
    id: 1,
    name: "Daniel Muthui",
    type: "Artist",
    interest: "Arts & Culture",
    country: "Kenya",
    lastEngagement: "Registered · today",
    source: "Website form",
  },
  {
    id: 2,
    name: "Brian Edward",
    type: "Donor",
    interest: "General",
    country: "Kenya",
    lastEngagement: "Donated · 2 days ago",
    source: "M-Pesa",
  },
  {
    id: 3,
    name: "Jennifer Kosencha",
    type: "Partner",
    interest: "Arts & Culture",
    country: "Kenya",
    lastEngagement: "Enquiry · 3 hours ago",
    source: "Website form",
  },
  {
    id: 4,
    name: "Lynette Murathimi",
    type: "Youth",
    interest: "Youth & Migration",
    country: "Uganda",
    lastEngagement: "Registered · today",
    source: "WhatsApp",
  },
  {
    id: 6,
    name: "James Nzuki",
    type: "Volunteer",
    interest: "Governance",
    country: "Kenya",
    lastEngagement: "Enquiry · 2 days ago",
    source: "Website form",
  },
];

//csv int bttn
function toCSV(rows) {
  const header = [
    "Name",
    "Type",
    "Interest",
    "Country",
    "Last engagement",
    "Source",
  ];
  const lines = rows.map((r) =>
    [r.name, r.type, r.interest, r.country, r.lastEngagement, r.source]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(","),
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

// Pill now receives colors as a prop
function Pill({ active, children, onClick, colors }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? colors.text : colors.panel,
        color: active ? colors.panel : colors.text,
        border: `1px solid ${active ? colors.text : colors.border}`,
      }}
      className="px-4 py-1.5 rounded-full text-sm font-semibold transition-colors whitespace-nowrap"
    >
      {children}
    </button>
  );
}

function TypeBadge({ type }) {
  const s = TYPE_STYLE[type] || TYPE_STYLE.Volunteer;
  return (
    <span
      style={{ background: s.bg, color: s.text }}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
    >
      <span
        style={{ background: s.text }}
        className="w-1.5 h-1.5 rounded-full"
      />
      {type}
    </span>
  );
}

const emptyForm = {
  name: "",
  type: "Artist",
  interest: "",
  country: "",
  source: MANUAL_SOURCES[0],
};

// form for adding evvent
function ContactModal({ initialValue, onClose, onSave, colors }) {
  const [form, setForm] = useState(initialValue || emptyForm);
  const isEdit = Boolean(initialValue);

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({ ...form, id: initialValue ? initialValue.id : Date.now() });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ background: "rgba(20,18,15,0.45)" }}
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: colors.panel,
          border: `1px solid ${colors.border}`,
        }}
        className="w-full max-w-md rounded-2xl shadow-xl overflow-hidden"
      >
        <div
          className="flex items-center justify-between p-5 border-b"
          style={{ borderColor: colors.border }}
        >
          <h2 className="font-bold text-lg" style={{ color: colors.text }}>
            {isEdit ? "Edit contact" : "Add contact"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/5"
          >
            <X size={18} color={colors.muted} />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <div className="flex flex-col gap-1">
            <label
              className="text-xs font-semibold"
              style={{ color: colors.muted }}
            >
              Name
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                border: `1px solid ${colors.border}`,
                background: colors.inputBg,
                color: colors.text,
              }}
              placeholder="Full name or organisation"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label
                className="text-xs font-semibold"
                style={{ color: colors.muted }}
              >
                Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  border: `1px solid ${colors.border}`,
                  background: colors.inputBg,
                  color: colors.text,
                }}
              >
                {Object.keys(TYPE_STYLE).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label
                className="text-xs font-semibold"
                style={{ color: colors.muted }}
              >
                Country
              </label>
              <input
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  border: `1px solid ${colors.border}`,
                  background: colors.inputBg,
                  color: colors.text,
                }}
                placeholder="Kenya"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-xs font-semibold"
              style={{ color: colors.muted }}
            >
              Interest
            </label>
            <input
              value={form.interest}
              onChange={(e) => setForm({ ...form, interest: e.target.value })}
              className="px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                border: `1px solid ${colors.border}`,
                background: colors.inputBg,
                color: colors.text,
              }}
              placeholder="Arts & Culture"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-xs font-semibold"
              style={{ color: colors.muted }}
            >
              Source
            </label>
            <select
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              className="px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                border: `1px solid ${colors.border}`,
                background: colors.inputBg,
                color: colors.text,
              }}
            >
              {MANUAL_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <span className="text-xs mt-0.5" style={{ color: colors.muted }}>
              Event and WhatsApp contacts are captured automatically and aren't
              logged here.
            </span>
          </div>
        </div>

        <div
          className="flex justify-end gap-2 p-4 border-t"
          style={{ borderColor: colors.border }}
        >
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold px-3 py-2"
            style={{ color: colors.muted }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              background: colors.buttonBg,
              color: colors.buttonText,
            }}
            className="text-sm font-semibold px-4 py-2 rounded-full"
          >
            {isEdit ? "Save changes" : "Add contact"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Contacts() {
  // Get the current theme from AdminLayout via Outlet context
  const { theme } = useOutletContext();
  const COLORS = theme === 'dark' ? darkColors : lightColors;

  const [contacts, setContacts] = useState(SEED);
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const tabs = ["All", "Artists", "Youth", "Donors", "Partners", "Volunteers"];
  const tabToType = {
    Artists: "Artist",
    Youth: "Youth",
    Donors: "Donor",
    Partners: "Partner",
    Volunteers: "Volunteer",
  };

  const filtered = useMemo(() => {
    let rows = contacts;
    if (tab !== "All") rows = rows.filter((c) => c.type === tabToType[tab]);
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.interest.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q),
      );
    }
    return rows;
  }, [contacts, tab, query]);

  function saveContact(contact) {
    setContacts((prev) => {
      const exists = prev.some((c) => c.id === contact.id);
      if (exists)
        return prev.map((c) =>
          c.id === contact.id ? { ...c, ...contact } : c,
        );
      return [{ ...contact, lastEngagement: "Added · today" }, ...prev];
    });
  }

  function deleteContact(id) {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div
      style={{ background: COLORS.bg, minHeight: "100%" }}
      className="p-6 font-sans rounded-lg"
    >
      {/* Dynamic placeholder color for search input */}
      <style>{`
        .search-input::placeholder {
          color: ${COLORS.inputPlaceholder};
          opacity: 1;
        }
      `}</style>

      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>
            Contacts
          </h1>
          <p className="text-sm mt-1" style={{ color: COLORS.muted }}>
            Everyone who registered, donated, applied or messaged ANIKA.
            Searchable, filterable, exportable.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            style={{
              background: COLORS.buttonBg,
              color: COLORS.buttonText,
            }}
            className="text-xs font-bold tracking-wide px-4 py-2.5 rounded-lg"
          >
            + ADD CONTACT
          </button>
          <button
            onClick={() => downloadCSV(filtered, "contacts.csv")}
            style={{
              border: `1px solid ${COLORS.border}`,
              background: COLORS.panel,
              color: COLORS.text,
            }}
            className="text-xs font-bold tracking-wide px-4 py-2.5 rounded-lg"
          >
            EXPORT
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {tabs.map((t) => (
            <Pill key={t} active={tab === t} onClick={() => setTab(t)} colors={COLORS}>
              {t}
            </Pill>
          ))}
        </div>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{
            background: COLORS.panel,
            border: `1px solid ${COLORS.border}`,
            minWidth: 220,
          }}
        >
          <Search size={15} color={COLORS.muted} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search contacts..."
            className="search-input text-sm outline-none flex-1 bg-transparent"
            style={{ color: COLORS.text }}
          />
        </div>
      </div>

      <div
        style={{
          background: COLORS.panel,
          border: `1px solid ${COLORS.border}`,
        }}
        className="rounded-xl overflow-hidden overflow-x-auto"
      >
        <div
          className="grid text-xs font-bold tracking-wide px-5 py-3 border-b min-w-[820px]"
          style={{
            color: COLORS.muted,
            borderColor: COLORS.border,
            gridTemplateColumns: "1.6fr 1fr 1.3fr 1fr 1.5fr 1fr 0.9fr",
          }}
        >
          <div>NAME</div>
          <div>TYPE</div>
          <div>INTEREST</div>
          <div>COUNTRY</div>
          <div>LAST ENGAGEMENT</div>
          <div>SOURCE</div>
          <div></div>
        </div>

        {filtered.length === 0 && (
          <div
            className="px-5 py-10 text-center text-sm"
            style={{ color: COLORS.muted }}
          >
            No contacts match this view.
          </div>
        )}

        {filtered.map((c) => (
          <div
            key={c.id}
            className="grid items-center px-5 py-4 border-b last:border-b-0 min-w-[820px]"
            style={{
              borderColor: COLORS.border,
              gridTemplateColumns: "1.6fr 1fr 1.3fr 1fr 1.5fr 1fr 0.9fr",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                style={{ background: avatarColor(c.name) }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0"
              >
                {initials(c.name)}
              </div>
              <span
                className="font-semibold text-sm"
                style={{ color: COLORS.text }}
              >
                {c.name}
              </span>
            </div>
            <div>
              <TypeBadge type={c.type} />
            </div>
            <div className="text-sm" style={{ color: COLORS.text }}>
              {c.interest}
            </div>
            <div className="text-sm" style={{ color: COLORS.text }}>
              {c.country}
            </div>
            <div className="text-sm" style={{ color: "#2f4a6b" }}>
              {c.lastEngagement}
            </div>
            <div className="text-sm" style={{ color: COLORS.text }}>
              {c.source}
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setEditing(c);
                  setModalOpen(true);
                }}
                className="p-1.5 rounded-lg hover:bg-black/5"
                title="Edit"
              >
                <Pencil size={14} color={COLORS.muted} />
              </button>
              <button
                onClick={() => deleteContact(c.id)}
                className="p-1.5 rounded-lg hover:bg-black/5"
                title="Delete"
              >
                <Trash2 size={14} color="#b23b3b" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <ContactModal
          initialValue={editing}
          onClose={() => setModalOpen(false)}
          onSave={saveContact}
          colors={COLORS}
        />
      )}
    </div>
  );
}