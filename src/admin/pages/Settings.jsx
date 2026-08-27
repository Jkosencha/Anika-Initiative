import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Building2,
  UserCircle,
  Bell,
  ShieldAlert,
  Check,
  Lock,
  Unlock,
} from "lucide-react";

// Same light/dark palette shape as Donations.jsx / Partners.jsx
const lightColors = {
  bg: "#fafaf8",
  border: "#e8e5df",
  text: "#1c1a17",
  muted: "#8c8579",
  panel: "#ffffff",
  panelAlt: "#faf8f2",
  green: "#3c8a4c",
  red: "#d24a42",
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
  green: "#4c9a5c",
  red: "#d24a42",
  buttonBg: "#f0f0f0",
  buttonText: "#1a1a1a",
  inputBg: "#2a2a2a",
  inputPlaceholder: "#aaaaaa",
};

function SectionCard({ icon: Icon, title, description, colors, children }) {
  return (
    <div
      style={{ background: colors.panel, border: `1px solid ${colors.border}` }}
      className="rounded-xl overflow-hidden"
    >
      <div className="flex items-start gap-3 px-5 py-4 border-b" style={{ borderColor: colors.border }}>
        <div
          style={{ background: colors.panelAlt, color: colors.text }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        >
          <Icon size={16} />
        </div>
        <div>
          <h2 className="text-sm font-bold" style={{ color: colors.text }}>
            {title}
          </h2>
          {description && (
            <p className="text-xs mt-0.5" style={{ color: colors.muted }}>
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, colors, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold" style={{ color: colors.muted }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function TextInput({ colors, ...props }) {
  return (
    <input
      {...props}
      className="settings-input px-3 py-2 rounded-lg text-sm outline-none"
      style={{
        border: `1px solid ${colors.border}`,
        background: colors.inputBg,
        color: colors.text,
      }}
    />
  );
}

function Toggle({ checked, onChange, colors }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{ background: checked ? colors.green : colors.border }}
      className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors"
    >
      <span
        style={{ transform: checked ? "translateX(20px)" : "translateX(2px)" }}
        className="inline-block h-5 w-5 rounded-full bg-white shadow transition-transform"
      />
    </button>
  );
}

function ToggleRow({ label, sub, checked, onChange, colors }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-sm font-semibold" style={{ color: colors.text }}>
          {label}
        </div>
        {sub && (
          <div className="text-xs mt-0.5" style={{ color: colors.muted }}>
            {sub}
          </div>
        )}
      </div>
      <Toggle checked={checked} onChange={onChange} colors={colors} />
    </div>
  );
}

export default function Settings() {
  const { theme } = useOutletContext();
  const COLORS = theme === "dark" ? darkColors : lightColors;

  const [org, setOrg] = useState({
    name: "ANIKA Initiative",
    email: "hello@anikainitiative.org",
    phone: "+254 700 000 000",
  });

  const [account, setAccount] = useState({
    name: "Admin",
    email: "admin@anikainitiative.org",
    password: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState({
    donationAlerts: true,
    applicationAlerts: true,
    weeklyDigest: false,
    whatsappAlerts: true,
  });

  const [saved, setSaved] = useState(false);
  const [zoneUnlocked, setZoneUnlocked] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const RESET_PHRASE = "RESET";

  function closeConfirm() {
    setConfirmReset(false);
    setConfirmText("");
  }

  function doReset() {
    // Placeholder for the real reset call once this is wired to a backend.
    closeConfirm();
    setZoneUnlocked(false);
  }

  function handleSave(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function updateOrg(key, value) {
    setOrg((prev) => ({ ...prev, [key]: value }));
  }

  function updateAccount(key, value) {
    setAccount((prev) => ({ ...prev, [key]: value }));
  }

  function toggleNotification(key, value) {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div style={{ background: COLORS.bg, minHeight: "100%" }} className="p-6 font-sans rounded-lg">
      <style>{`
        .settings-input::placeholder {
          color: ${COLORS.inputPlaceholder};
          opacity: 1;
        }
      `}</style>

      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>
            Settings
          </h1>
          <p className="text-sm mt-1" style={{ color: COLORS.muted }}>
            Manage organisation, account and notification preferences.
          </p>
        </div>
        <button
          onClick={handleSave}
          style={{ background: COLORS.buttonBg, color: COLORS.buttonText }}
          className="text-xs font-bold tracking-wide px-4 py-2.5 rounded-lg flex items-center gap-1.5"
        >
          {saved ? <Check size={14} /> : null}
          {saved ? "SAVED" : "SAVE CHANGES"}
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectionCard
          icon={Building2}
          title="Organisation profile"
          description="Public details shown across the site and receipts."
          colors={COLORS}
        >
          <Field label="Organisation name" colors={COLORS}>
            <TextInput
              colors={COLORS}
              value={org.name}
              onChange={(e) => updateOrg("name", e.target.value)}
              placeholder="e.g. ANIKA Initiative"
            />
          </Field>
          <Field label="Contact email" colors={COLORS}>
            <TextInput
              colors={COLORS}
              type="email"
              value={org.email}
              onChange={(e) => updateOrg("email", e.target.value)}
              placeholder="hello@organisation.org"
            />
          </Field>
          <Field label="Contact phone" colors={COLORS}>
            <TextInput
              colors={COLORS}
              value={org.phone}
              onChange={(e) => updateOrg("phone", e.target.value)}
              placeholder="+254 7•• ••• •••"
            />
          </Field>
        </SectionCard>

        <SectionCard
          icon={UserCircle}
          title="Admin account"
          description="Your login details for the admin desk."
          colors={COLORS}
        >
          <Field label="Full name" colors={COLORS}>
            <TextInput
              colors={COLORS}
              value={account.name}
              onChange={(e) => updateAccount("name", e.target.value)}
              placeholder="e.g. Jane W."
            />
          </Field>
          <Field label="Email" colors={COLORS}>
            <TextInput
              colors={COLORS}
              type="email"
              value={account.email}
              onChange={(e) => updateAccount("email", e.target.value)}
              placeholder="you@anikainitiative.org"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="New password" colors={COLORS}>
              <TextInput
                colors={COLORS}
                type="password"
                value={account.password}
                onChange={(e) => updateAccount("password", e.target.value)}
                placeholder="••••••••"
              />
            </Field>
            <Field label="Confirm password" colors={COLORS}>
              <TextInput
                colors={COLORS}
                type="password"
                value={account.confirm}
                onChange={(e) => updateAccount("confirm", e.target.value)}
                placeholder="••••••••"
              />
            </Field>
          </div>
        </SectionCard>

        <SectionCard
          icon={Bell}
          title="Notifications"
          description="Choose what the admin desk alerts you about."
          colors={COLORS}
        >
          <ToggleRow
            label="New donation alerts"
            sub="Ping when an M-Pesa donation comes in"
            checked={notifications.donationAlerts}
            onChange={(v) => toggleNotification("donationAlerts", v)}
            colors={COLORS}
          />
          <ToggleRow
            label="New application alerts"
            sub="Ping when someone applies to a programme"
            checked={notifications.applicationAlerts}
            onChange={(v) => toggleNotification("applicationAlerts", v)}
            colors={COLORS}
          />
          <ToggleRow
            label="WhatsApp alerts"
            sub="Forward key alerts to the admin WhatsApp line"
            checked={notifications.whatsappAlerts}
            onChange={(v) => toggleNotification("whatsappAlerts", v)}
            colors={COLORS}
          />
          <ToggleRow
            label="Weekly digest"
            sub="A Monday summary of the week's activity"
            checked={notifications.weeklyDigest}
            onChange={(v) => toggleNotification("weeklyDigest", v)}
            colors={COLORS}
          />
        </SectionCard>

        <SectionCard
          icon={ShieldAlert}
          title="Danger zone"
          description="These actions are hard to undo."
          colors={COLORS}
        >
          <div
            style={{ borderColor: COLORS.red }}
            className="rounded-lg border overflow-hidden"
          >
            <div
              className="flex items-center justify-between gap-4 p-4"
              style={{ borderBottom: zoneUnlocked ? `1px solid ${COLORS.red}` : "none" }}
            >
              <div className="flex items-center gap-2.5">
                {zoneUnlocked ? (
                  <Unlock size={15} color={COLORS.red} />
                ) : (
                  <Lock size={15} color={COLORS.muted} />
                )}
                <div>
                  <div className="text-sm font-semibold" style={{ color: COLORS.text }}>
                    {zoneUnlocked ? "Danger zone unlocked" : "Danger zone locked"}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: COLORS.muted }}>
                    {zoneUnlocked
                      ? "Destructive actions are now visible below."
                      : "Unlock to reveal destructive actions."}
                  </div>
                </div>
              </div>
              <Toggle checked={zoneUnlocked} onChange={setZoneUnlocked} colors={COLORS} />
            </div>

            {zoneUnlocked && (
              <div className="flex items-start justify-between gap-4 flex-wrap p-4">
                <div>
                  <div className="text-sm font-semibold" style={{ color: COLORS.text }}>
                    Reset admin data
                  </div>
                  <div className="text-xs mt-0.5 max-w-xs" style={{ color: COLORS.muted }}>
                    Clears partners, donations and applications from this admin desk. This cannot be undone.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  style={{ background: COLORS.red, color: "#fff" }}
                  className="text-xs font-bold tracking-wide px-4 py-2.5 rounded-lg shrink-0"
                >
                  RESET DATA
                </button>
              </div>
            )}
          </div>
        </SectionCard>
      </form>

      {confirmReset && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ background: "rgba(20,18,15,0.45)" }}
          onClick={closeConfirm}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: COLORS.panel, border: `1px solid ${COLORS.red}` }}
            className="w-full max-w-sm rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-5">
              <h2 className="font-bold text-lg" style={{ color: COLORS.text }}>
                Reset admin data?
              </h2>
              <p className="text-sm mt-2" style={{ color: COLORS.muted }}>
                This permanently clears partners, donations and applications from this admin desk. This
                cannot be undone.
              </p>
              <div className="mt-4 flex flex-col gap-1">
                <label className="text-xs font-semibold" style={{ color: COLORS.muted }}>
                  Type <span style={{ color: COLORS.red }}>{RESET_PHRASE}</span> to confirm
                </label>
                <TextInput
                  colors={COLORS}
                  autoFocus
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={RESET_PHRASE}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t" style={{ borderColor: COLORS.border }}>
              <button
                type="button"
                onClick={closeConfirm}
                className="text-sm font-semibold px-3 py-2"
                style={{ color: COLORS.muted }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={confirmText.trim() !== RESET_PHRASE}
                onClick={doReset}
                style={{
                  background: COLORS.red,
                  color: "#fff",
                  opacity: confirmText.trim() === RESET_PHRASE ? 1 : 0.4,
                  cursor: confirmText.trim() === RESET_PHRASE ? "pointer" : "not-allowed",
                }}
                className="text-sm font-semibold px-4 py-2 rounded-full"
              >
                Yes, reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}