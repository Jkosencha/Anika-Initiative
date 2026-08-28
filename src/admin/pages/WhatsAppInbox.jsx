import { useEffect, useMemo, useState } from "react";
import { Send, Search, Check } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { fetchWhatsAppInbox, updateWhatsAppMessage } from "../../lib/api";

const lightColors = {
  bg: "#fafaf8", border: "#e8e5df", text: "#1c1a17", muted: "#8c8579",
  panel: "#ffffff", green: "#25D366", red: "#d24a42", orange: "#e2a63f", blue: "#2f4a6b",
  buttonBg: "#1c1a17", buttonText: "#ffffff", inputBg: "#ffffff", inputPlaceholder: "#8c8579",
};

const darkColors = {
  bg: "#1a1a1a", panel: "#232323", text: "#f0f0f0", muted: "#aaaaaa",
  border: "#3a3a3a", green: "#25D366", red: "#d24a42", orange: "#e2a63f", blue: "#7c9ac4",
  buttonBg: "#f0f0f0", buttonText: "#1a1a1a", inputBg: "#2a2a2a", inputPlaceholder: "#aaaaaa",
};

function initials(name) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}
const AVATAR_COLORS = ["#c0392b", "#2f4a6b", "#b3760c", "#2d7a43", "#6b4a8a", "#8a3a52"];
function avatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const INTENT_META = {
  escalation: { label: "Escalation", bg: "#f6d9d9", text: "#b23b3b" },
  faq: { label: "FAQ", bg: "#dbe6f5", text: "#2f4a6b" },
  alliance: { label: "Alliance", bg: "#dcefe0", text: "#2d7a43" },
  donation: { label: "Donation", bg: "#fdecd2", text: "#8a5c10" },
  registration: { label: "Registration", bg: "#e9e2f5", text: "#5b3a8a" },
  general: { label: "General", bg: "#ececec", text: "#555555" },
};

const SEED = [
  { id: 1, name: "Alex Kwame", phone: "+254 711 000 111", intent: "escalation", unread: 2, time: "08:12", preview: "HELP — I registered for the forum but haven’t received a confirmation yet.", messages: [
    { from: "them", text: "HELP — I registered for the Sema-Anika forum but haven’t received a confirmation yet.", time: "08:10" },
    { from: "me", text: "Hi Alex, sorry about that — let me check your registration now.", time: "08:30" },
    { from: "them", text: "Thanks! I used +233 711 000 111.", time: "09:02" },
  ]},
  { id: 2, name: "Sarah Ochieng", phone: "+254 722 222 333", intent: "faq", unread: 1, time: "09:41", last: "What events are coming up for artists this month?", messages: [
    { from: "them", text: "What events are coming up for artists this month?", time: "09:40" },
  ]},
  { id: 3, name: "David Mensah", phone: "+233 24 555 666", intent: "alliance", unread: 1, time: "Yesterday", last: "How do I apply for Alliance membership from Ghana?", messages: [
    { from: "them", text: "How do I apply for Alliance membership from Ghana?", time: "Yesterday 18:30" },
    { from: "me", text: "Hi David! You can apply via the Alliance page or by sending your details here.", time: "Yesterday 19:05" },
    { from: "them", text: "Great, I'll fill the form and send it across.", time: "Yesterday 19:20" },
  ], resolved: true },
  { id: 4, name: "Amina Yusuf", phone: "+255 744 333 444", intent: "donation", unread: 0, time: "Yesterday", last: "Can I make a one-time donation via M-Pesa?", messages: [
    { from: "them", text: "Can I make a one-time donation via M-Pesa?", time: "Yesterday 18:00" },
    { from: "me", text: "Yes! Tap Donate on the site and choose M-Pesa — you'll get an instant receipt.", time: "Yesterday 18:20" },
  ], resolved: true },
  { id: 5, name: "Lynette Muthoni", phone: "+254 112 544 427", intent: "registration", unread: 1, time: "2 hours ago", last: "Please add me to the Poetry & Beat Night waitlist.", messages: [
    { from: "them", text: "Please add me to the Griphon Poetry & Beat Night waitlist.", time: "2 hours ago" },
  ]},
  { id: 6, name: "Brian E.", phone: "+254 797 063 573", intent: "general", unread: 0, time: "3 days ago", last: "Hello, how can I partner with ANIKA?", messages: [
    { from: "them", text: "Hello, how can I partner with ANIKA?", time: "3 days ago" },
    { from: "me", text: "Thanks for reaching out! I've looped in our partnerships team.", time: "3 days ago" },
  ], resolved: true },
];


function StatBox({ label, value, dotColor, colors }) {
  return (
    <div style={{ background: colors.panel, border: `1px solid ${colors.border}` }} className="rounded-xl p-5">
      <div className="flex items-center gap-2 text-xs font-bold tracking-wide" style={{ color: colors.muted }}>
        {dotColor && <span className="w-2 h-2 rounded-full" style={{ background: dotColor }} />}
        {label}
      </div>
      <div className="mt-1 text-3xl font-extrabold" style={{ color: colors.text }}>{value}</div>
    </div>
  );
}
export default function WhatsAppInbox() {
  const { theme } = useOutletContext();
  const COLORS = theme === "dark" ? darkColors : lightColors;

  const [conversations, setConversations] = useState(SEED);
  const [activeId, setActiveId] = useState(SEED[0].id);
  const [q, setQ] = useState("");
  const [intent, setIntent] = useState("All");
  const [draft, setDraft] = useState("");

  useEffect(() => {
    fetchWhatsAppInbox().then(({ rows }) => {
      if (rows && rows.length) {
        setConversations(rows);
        setActiveId((cur) => rows.some((c) => c.id === cur) ? cur : rows[0].id);
      }
    });
  }, []);

  const unreadTotal = conversations.reduce((s, c) => s + c.unread, 0);
  const openCount = conversations.filter((c) => !c.resolved).length;

  const filtered = useMemo(() => {
    let result = conversations;
    if (intent !== "All") result = result.filter((c) => c.intent === intent);
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(s) || c.phone.includes(s));
    }
    return result;
  }, [conversations, intent, q]);

  const active = conversations.find((c) => c.id === activeId) || conversations[0];

  function markRead(id) {
    setConversations((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c));
      updateWhatsAppMessage(id, { unread: 0 });
      return next;
    });
  }

  function sendReply(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    const text = draft.trim();
    setConversations((prev) => {
      const msg = { from: "me", text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
      const updated = prev.map((c) =>
        c.id === activeId ? { ...c, unread: 0, messages: [...c.messages, msg] } : c
      );
      const target = updated.find((c) => c.id === activeId);
      if (target) updateWhatsAppMessage(activeId, { unread: 0, messages: target.messages });
      return updated;
    });
    setDraft("");
  }

  function toggleResolved() {
    setConversations((prev) => {
      const next = prev.map((c) => (c.id === activeId ? { ...c, resolved: !c.resolved } : c));
      updateWhatsAppMessage(activeId, { resolved: !prev.find((c) => c.id === activeId).resolved });
      return next;
    });
  }

  function intentMeta(int) {
    return INTENT_META[int] || INTENT_META.general;
  }

  const intents = ["All", "escalation", "faq", "alliance", "donation", "registration", "general"];

  return (
    <div style={{ background: COLORS.bg, minHeight: "100%" }} className="p-6 font-sans rounded-lg">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>WhatsApp Inbox</h1>
          <p className="text-sm mt-1" style={{ color: COLORS.muted }}>Conversations routed from wa.me, registrations and opt-ins.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatBox colors={COLORS} label="UNRESOLVED" value={openCount} dotColor="#d24a42" />
        <StatBox colors={COLORS} label="UNREAD" value={unreadTotal} dotColor="#e2a63f" />
        <StatBox colors={COLORS} label="TOTAL THREADS" value={conversations.length} dotColor={COLORS.blue} />
        <StatBox colors={COLORS} label="RESOLVED" value={conversations.filter((c) => c.resolved).length} dotColor="#3c8a4c" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,0.8fr)_1.6fr] gap-4" style={{ minHeight: "60vh" }}>
        {/* LEFT: conversation list */}
        <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }} className="rounded-xl overflow-hidden flex flex-col">
          <div className="p-3 border-b" style={{ borderColor: COLORS.border }}>
            <div className="relative mb-2">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLORS.muted }} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or number…" className="pl-9 pr-3 py-2 rounded-lg text-sm outline-none w-full" style={{ border: `1px solid ${COLORS.border}`, background: COLORS.inputBg, color: COLORS.text }} />
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {intents.map((i) => (
                <button key={i} onClick={() => setIntent(i)} className="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap" style={{ background: intent === i ? COLORS.text : "transparent", color: intent === i ? COLORS.panel : COLORS.muted, border: `1px solid ${intent === i ? COLORS.text : COLORS.border}` }}>
                  {i === "All" ? "All" : INTENT_META[i].label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map((c) => {
              const meta = intentMeta(c.intent);
              const isActive = c.id === activeId;
              return (
                <button key={c.id} onClick={() => { setActiveId(c.id); markRead(c.id); }} className="w-full text-left px-3 py-3 border-b flex items-start gap-3" style={{ borderColor: COLORS.border, background: isActive ? `${COLORS.blue}14` : "transparent" }}>
                  <div style={{ background: avatarColor(c.name) }} className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0">{initials(c.name)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm truncate" style={{ color: COLORS.text }}>{c.name}</span>
                      {c.unread > 0 ? <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: "#d24a42" }}>{c.unread}</span> : <span className="text-[11px] shrink-0" style={{ color: COLORS.muted }}>{c.time}</span>}
                    </div>
                    <div className="text-xs truncate mt-0.5" style={{ color: COLORS.muted }}>{c.last || c.preview}</div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: meta.bg, color: meta.text }}>{meta.label}</span>
                      {c.resolved ? <span className="text-[10px] font-semibold flex items-center gap-0.5" style={{ color: "#2d7a43" }}><Check size={11} /> Resolved</span> : null}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: active thread */}
        <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }} className="rounded-xl overflow-hidden flex flex-col">
          {active ? (
            <>
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: COLORS.border }}>
                <div className="flex items-center gap-3">
                  <div style={{ background: avatarColor(active.name) }} className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold">{initials(active.name)}</div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: COLORS.text }}>{active.name}</div>
                    <div className="text-xs" style={{ color: COLORS.muted }}>{active.phone}</div>
                  </div>
                </div>
                <button onClick={toggleResolved} className="text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5" style={{ background: active.resolved ? "#dcefe0" : "#fdecd2", color: active.resolved ? "#2d7a43" : "#8a5c10" }}>
                  {active.resolved && <Check size={12} />} {active.resolved ? "Resolved" : "Mark resolved"}
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: "280px" }}>
                {active.messages.map((m, i) => (
                  <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                    <div
                      className="max-w-[80%] px-3.5 py-2 rounded-2xl text-sm"
                      style={{
                        background: m.from === "me" ? "#2d7a43" : COLORS.bg,
                        color: COLORS.text,
                        border: m.from === "me" ? "none" : `1px solid ${COLORS.border}`,
                        borderTopRightRadius: m.from === "me" ? 4 : undefined,
                        borderTopLeftRadius: m.from === "them" ? 4 : undefined,
                      }}
                    >
                      <div>{m.text}</div>
                      <div className="text-[10px] mt-1 text-right" style={{ color: COLORS.muted }}>{m.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={sendReply} className="flex items-center gap-2 p-3 border-t" style={{ borderColor: COLORS.border }}>
                <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a reply…" className="flex-1 px-3 py-2 rounded-full text-sm outline-none" style={{ border: `1px solid ${COLORS.border}`, background: COLORS.inputBg, color: COLORS.text }} />
                <button type="submit" disabled={!draft.trim()} className="h-10 w-10 rounded-full flex items-center justify-center text-white" style={{ background: "#25D366", opacity: draft.trim() ? 1 : 0.5 }} title="Send reply">
                  <Send size={16} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center p-10 text-sm" style={{ color: COLORS.muted }}>Select a conversation</div>
          )}
        </div>
      </div>
    </div>
  );
}
