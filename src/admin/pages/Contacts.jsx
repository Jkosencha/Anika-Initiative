import React, { useMemo, useState } from "react";
import { X, Search, Trash2, Pencil } from "lucide-react";

const COLORS = {
  bg: "#fafaf8",
  border: "#e8e5df",
  text: "#1c1a17",
  muted: "#8c8579",
  panel: "#ffffff",
};

const AVATAR_COLORS = ["#c0392b", "#2f4a6b", "#b3760c", "#2d7a43", "#6b4a8a"];

const TYPE_STYLE = {
  Artist: { bg: "#f6d9d9", text: "#b23b3b" },
  Donor: { bg: "#dcefe0", text: "#2d7a43" },
  Partner: { bg: "#dbe6f5", text: "#2f4a6b" },
  Youth: { bg: "#fbe6c8", text: "#b3760c" },
  Volunteer: { bg: "#e3dcf0", text: "#6b4a8a" },
};

//things that will get captured automatically
const MANUAL_SOURCES = ["Website form", "M-Pesa", "Referral", "Email", "Phone call"];

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
//dummy data seeed
const SEED = [
  { id: 1, name: "Daniel Muthui", type: "Artist", interest: "Arts & Culture", country: "Kenya", lastEngagement: "Registered · today", source: "Website form" },
  { id: 2, name: "Brian Edward", type: "Donor", interest: "General", country: "Kenya", lastEngagement: "Donated · 2 days ago", source: "M-Pesa" },
  { id: 3, name: "Jennifer Kosencha", type: "Partner", interest: "Arts & Culture", country: "Kenya", lastEngagement: "Enquiry · 3 hours ago", source: "Website form" },
  { id: 4, name: "Lynette Murathimi", type: "Youth", interest: "Youth & Migration", country: "Uganda", lastEngagement: "Registered · today", source: "WhatsApp" },
  { id: 6, name: "James Nzuki", type: "Volunteer", interest: "Governance", country: "Kenya", lastEngagement: "Enquiry · 2 days ago", source: "Website form" },
];

//csv int bttn
function toCSV(rows) {
  const header = ["Name", "Type", "Interest", "Country", "Last engagement", "Source"];
  const lines = rows.map((r) =>
    [r.name, r.type, r.interest, r.country, r.lastEngagement, r.source]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  return [header.join(","), ...lines].join("\n");
}

function Pill({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? COLORS.text : "#fff",
        color: active ? "#fff" : COLORS.text,
        border: `1px solid ${active ? COLORS.text : COLORS.border}`,
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
      <span style={{ background: s.text }} className="w-1.5 h-1.5 rounded-full" />
      {type}
    </span>
  );
}

