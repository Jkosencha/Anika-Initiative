import { BarChart2, CalendarDays, Clock, DollarSign, User, X } from "lucide-react"
import { useState } from "react"
import { useAdminColors } from "../theme"

const REPORT_CARDS = [
  {
    id: 'donor',
    icon: DollarSign,
    iconBg: 'red',
    title: 'Donor report',
    description: 'All contributions (M-Pesa, bank, card and more) with totals, gift sizes and donor segments for the selected period.',
    lastGenerated: '2 Aug 2026',
  },
  {
    id: 'event',
    icon: CalendarDays,
    iconBg: 'green',
    title: 'Event summary',
    description: 'Registrations, attendance, no-show rate and post-event survey results, per event.',
    lastGenerated: '14 Aug 2026',
  },
  {
    id: 'impact',
    icon: BarChart2,
    iconBg: 'orange',
    title: 'Annual impact report',
    description: 'Cumulative programme metrics aggregated from real data, mapped to the 2025-2030 Strategic Plan.',
    lastGenerated: '1 Jul 2026',
  },
  {
    id: 'contacts',
    icon: User,
    iconBg: 'blue',
    title: 'Contact export',
    description: 'Clean dataset of all contacts with tags and engagement history for evaluation or audit.',
    lastGenerated: 'today',
  },
]

const RECENT_EXPORTS = [
  { id: 1, report: 'Contact export', by: 'Admin', date: 'Today, 09:20', format: 'CSV', formatColor: 'blue' },
  { id: 2, report: 'Event summary - Sema-Anika', by: 'Programs Team', date: '14 Aug 2026', format: 'PDF', formatColor: 'red' },
  { id: 3, report: 'Donor report - Q2', by: 'MEL Officer', date: '2 Aug 2026', format: 'Excel', formatColor: 'green' },
]

const FREQUENCIES = ['Weekly', 'Monthly', 'Quarterly']

function StubNotice({ message, colors }) {
  return (
    <p className="mt-2 text-xs italic" style={{ color: colors.muted }}>
      {message}
    </p>
  )
}

function ScheduleReportModal({ onClose, onSave, colors }) {
  const [reportType, setReportType] = useState(REPORT_CARDS[0].id)
  const [frequency, setFrequency] = useState('Monthly')
  const [email, setEmail] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!email.trim()) return
    onSave({ reportType, frequency, email: email.trim() })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(20,18,15,0.45)' }}
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        style={{ background: colors.panel, border: `1px solid ${colors.border}` }}
        className="w-full max-w-sm overflow-hidden rounded-2xl shadow-xl"
      >
        <div className="flex items-center justify-between border-b p-5" style={{ borderColor: colors.border }}>
          <h2 className="font-display text-lg" style={{ color: colors.text }}>
            Schedule a report
          </h2>
          <button type="button" onClick={onClose} className="rounded-full p-1 hover:bg-black/5">
            <X size={18} color={colors.muted} />
          </button>
        </div>

        <div className="space-y-3 p-5">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: colors.muted }}>
              Report
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text }}
            >
              {REPORT_CARDS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: colors.muted }}>
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text }}
            >
              {FREQUENCIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: colors.muted }}>
              Send to
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text }}
              placeholder="you@anikainitiative.com"
            />
          </div>

          <StubNotice
            colors={colors}
            message="Scheduling isn't wired up yet."
          />
        </div>

        <div className="flex justify-end gap-2 border-t p-4" style={{ borderColor: colors.border }}>
          <button type="button" onClick={onClose} className="px-3 py-2 text-sm font-semibold" style={{ color: colors.muted }}>
            Cancel
          </button>
          <button
            type="submit"
            style={{ background: colors.buttonBg, color: colors.buttonText }}
            className="rounded-full px-4 py-2 text-sm font-semibold"
          >
            Save preference
          </button>
        </div>
      </form>
    </div>
  )
}

function ReportCard({ report, colors, onExport }) {
  const Icon = report.icon

  return (
    <div
      style={{ background: colors.panel, border: `1px solid ${colors.border}` }}
      className="rounded-xl p-6"
    >
      <div
        style={{ background: colors[report.iconBg] }}
        className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
      >
        <Icon size={20} color="#fff" />
      </div>

      <h3 className="font-display text-base" style={{ color: colors.text }}>
        {report.title}
      </h3>
      <p className="mt-1.5 text-sm" style={{ color: colors.muted }}>
        {report.description}
      </p>

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={() => onExport(report, 'PDF')}
          style={{ background: colors.buttonBg, color: colors.buttonText }}
          className="rounded-lg px-4 py-2 text-xs font-bold tracking-wide"
        >
          EXPORT PDF
        </button>
        <button
          onClick={() => onExport(report, 'Excel')}
          style={{ background: colors.panel, color: colors.text, border: `1px solid ${colors.border}` }}
          className="rounded-lg px-4 py-2 text-xs font-bold tracking-wide"
        >
          EXCEL
        </button>
      </div>

      <p className="mt-3 text-xs" style={{ color: colors.muted }}>
        Last generated: {report.lastGenerated}
      </p>
    </div>
  )
}

export default function Reports() {
    const COLORS = useAdminColors()
    const [scheduleOpen, setScheduleOpen] = useState(false)
    const [toast, setToast] = useState('')

    function handleExport(report, format) {
        setToast(`${report.title} (${format}) export isn't connected to real data yet`)
        setTimeout(() => setToast(''), 3200)
    }

    function saveSchedule(preference) {
        try {
            const existing = JSON.parse(localStorage.getItem('anika_admin_scheduled_reports') || '[]')
            existing.push({ ...preference, id: Date.now() })
            localStorage.setItem('anika_admin_scheduled_reports', JSON.stringify(existing))
        } catch {
            // storage unavailable — preference just won't persist this session
        }
        setToast('Schedule preference saved locally (not yet automated).')
        setTimeout(() => setToast(''), 3200)
    }

    return (
        <div style={{ background: COLORS.bg, minHeight: '100%' }} className="rounded-lg p-6 font-sans">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="font-display text-2xl" style={{ color: COLORS.text }}>
                        Reports & export
                    </h1>
                    <p className="mt-1 text-sm" style={{ color: COLORS.muted }}>
                        One-click exports for grant reporting, the board, and audits.
                    </p>
                </div>
                <button
                    onClick={() => setScheduleOpen(true)}
                    style={{ background: COLORS.panel, color: COLORS.text, border: `1px solid ${COLORS.border}` }}
                    className="flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-bold tracking-wide"
                >
                    <Clock size={14} />
                    SCHEDULE A REPORT
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {REPORT_CARDS.map((report) => (
                    <ReportCard key={report.id} report={report} colors={COLORS} onExport={handleExport} />
                ))}
            </div>

            <div
                style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }}
                className="mt-6 overflow-x-auto rounded-xl"
            >
                <div className="p-5 pb-0">
                    <h2 className="font-display text-base" style={{ color: COLORS.text }}>
                        Recent exports
                    </h2>
                </div>
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr
                            className="border-b text-xs font-bold tracking-wide"
                            style={{ borderColor: COLORS.border, color: COLORS.muted }}
                        >
                            <th className="px-5 py-3">REPORT</th>
                            <th className="px-5 py-3">GENERATED BY</th>
                            <th className="px-5 py-3">DATE</th>
                            <th className="px-5 py-3">FORMAT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {RECENT_EXPORTS.map((row) => (
                            <tr key={row.id} className="border-t" style={{ borderColor: COLORS.border }}>
                                <td className="px-5 py-3 font-semibold" style={{ color: COLORS.text }}>
                                    {row.report}
                                </td>
                                <td className="px-5 py-3" style={{ color: COLORS.muted }}>
                                    {row.by}
                                </td>
                                <td className="px-5 py-3" style={{ color: COLORS.muted }}>
                                    {row.date}
                                </td>
                                <td className="px-5 py-3">
                                    <span
                                            className="flex items-center gap-1.5 text-xs font-bold"
                                            style={{ color: COLORS[row.formatColor] }}
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: COLORS[row.formatColor] }} />
                                            {row.format}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {toast && (
                <div
                        className="fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 text-sm font-semibold shadow-lg"
                        style={{ background: COLORS.buttonBg, color: COLORS.buttonText }}
                >
                    {toast}
                </div>
            )}

            {scheduleOpen && (
                <ScheduleReportModal
                    onClose={() => setScheduleOpen(false)}
                    onSave={saveSchedule}
                    colors={COLORS}
                />
            )}
        </div>
    )
}
