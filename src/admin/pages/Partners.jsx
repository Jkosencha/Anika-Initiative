import React, { useState } from "react";
import { X, Plus, Pencil, Trash2 } from "lucide-react";
import { useOutletContext } from "react-router-dom";

// Same light/dark palette shape as Donations.jsx, so the two pages feel
// like one product instead of two different admin panels.
const lightColors = {
  bg: "#fafaf8",
  border: "#e8e5df",
  text: "#1c1a17",
  muted: "#8c8579",
  panel: "#ffffff",
  panelAlt: "#faf8f2",
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
  panelAlt: "#242424",
  buttonBg: "#f0f0f0",
  buttonText: "#1a1a1a",
  inputBg: "#2a2a2a",
  inputPlaceholder: "#aaaaaa",
};

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Same hashing approach as Donations.jsx's avatarColor, so donor avatars
// and partner logos land on the same palette across the admin.
const LOGO_COLORS = ["#c0392b", "#2f4a6b", "#b3760c", "#2d7a43", "#6b4a8a"];
function logoColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return LOGO_COLORS[Math.abs(hash) % LOGO_COLORS.length];
}

const SEED = [
  { id: 1, name: "SEMA", category: "Civic technology" },
  { id: 2, name: "Strategic Applications", category: "International" },
  { id: 3, name: "Creatives Garage", category: "Creative hub" },
  { id: 4, name: "YWCA", category: "Community" },
];

function PartnerModal({ onClose, onSave, colors, initial }) {
  const [name, setName] = useState(initial?.name || "");
  const [category, setCategory] = useState(initial?.category || "");

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: initial?.id ?? Date.now(),
      name: name.trim(),
      category: category.trim() || "Partner",
    });
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
        style={{ background: colors.panel, border: `1px solid ${colors.border}` }}
        className="w-full max-w-sm rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: colors.border }}>
          <h2 className="font-bold text-lg" style={{ color: colors.text }}>
            {initial ? "Edit partner" : "Add partner"}
          </h2>
          <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-black/5">
            <X size={18} color={colors.muted} />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: colors.muted }}>
              Partner name
            </label>
            <input
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="partner-input px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                border: `1px solid ${colors.border}`,
                background: colors.inputBg,
                color: colors.text,
              }}
              placeholder="e.g. Creatives Garage"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: colors.muted }}>
              Type / focus area
            </label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="partner-input px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                border: `1px solid ${colors.border}`,
                background: colors.inputBg,
                color: colors.text,
              }}
              placeholder="e.g. Creative hub"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t" style={{ borderColor: colors.border }}>
          <button type="button" onClick={onClose} className="text-sm font-semibold px-3 py-2" style={{ color: colors.muted }}>
            Cancel
          </button>
          <button
            type="submit"
            style={{ background: colors.buttonBg, color: colors.buttonText }}
            className="text-sm font-semibold px-4 py-2 rounded-full"
          >
            {initial ? "Save changes" : "Add partner"}
          </button>
        </div>
      </form>
    </div>
  );
}

function PartnerCard({ partner, colors, onEdit, onDelete }) {
  return (
    <div
      style={{ background: colors.panel, border: `1px solid ${colors.border}` }}
      className="group relative rounded-xl p-4 text-center"
    >
      <div
        style={{ background: colors.panelAlt, color: logoColor(partner.name) }}
        className="mb-3 flex h-20 items-center justify-center rounded-lg text-2xl font-extrabold"
      >
        {initials(partner.name)}
      </div>
      <h4 className="text-sm font-bold" style={{ color: colors.text }}>
        {partner.name}
      </h4>
      <p className="mt-0.5 text-xs" style={{ color: colors.muted }}>
        {partner.category}
      </p>

      <div className="mt-3 flex justify-center gap-2">
        <button
          onClick={() => onEdit(partner)}
          style={{ border: `1px solid ${colors.border}`, background: colors.panel, color: colors.text }}
          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold hover:border-current"
        >
          <Pencil size={12} /> Edit
        </button>
        <button
          onClick={() => onDelete(partner.id)}
          style={{ border: `1px solid ${colors.border}`, background: colors.panel, color: colors.text }}
          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold hover:border-red-400 hover:text-red-500"
        >
          <Trash2 size={12} /> Delete
        </button>
      </div>
    </div>
  );
}

export default function Partners() {
  // Pull theme from AdminLayout via Outlet context, same as Donations.jsx.
  const { theme } = useOutletContext();
  const COLORS = theme === "dark" ? darkColors : lightColors;

  const [partners, setPartners] = useState(SEED);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  function savePartner(partner) {
    setPartners((prev) => {
      const exists = prev.some((p) => p.id === partner.id);
      return exists ? prev.map((p) => (p.id === partner.id ? partner : p)) : [partner, ...prev];
    });
  }

  function deletePartner(id) {
    setPartners((prev) => prev.filter((p) => p.id !== id));
  }

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(partner) {
    setEditing(partner);
    setModalOpen(true);
  }

  return (
    <div style={{ background: COLORS.bg, minHeight: "100%" }} className="p-6 font-sans rounded-lg">
      <style>{`
        .partner-input::placeholder {
          color: ${COLORS.inputPlaceholder};
          opacity: 1;
        }
      `}</style>

      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>
            Partners
          </h1>
          <p className="text-sm mt-1" style={{ color: COLORS.muted }}>
            Organisations ANIKA works with.
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{ background: COLORS.buttonBg, color: COLORS.buttonText }}
          className="text-xs font-bold tracking-wide px-4 py-2.5 rounded-lg flex items-center gap-1.5"
        >
          <Plus size={14} /> ADD PARTNER
        </button>
      </div>

      {partners.length === 0 ? (
        <div
          style={{ background: COLORS.panel, border: `1px dashed ${COLORS.border}`, color: COLORS.muted }}
          className="rounded-xl p-10 text-center text-sm"
        >
          No partners yet. Add your first one to get started.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {partners.map((p) => (
            <PartnerCard key={p.id} partner={p} colors={COLORS} onEdit={openEdit} onDelete={deletePartner} />
          ))}
        </div>
      )}

      {modalOpen && (
        <PartnerModal
          onClose={() => setModalOpen(false)}
          onSave={savePartner}
          colors={COLORS}
          initial={editing}
        />
      )}
    </div>
  );
}