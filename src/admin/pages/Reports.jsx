import { useEffect, useState } from 'react'
import {
  X, Pencil, Trash2, Upload, FileText, AlertTriangle,
} from 'lucide-react'
import { useAdminColors } from '../theme'
import { useAuth } from '../auth/AuthContext'

// TODO(backend): replace with a real fetch of what's actually been
// generated (donations/contacts/events/impact export history), same data
// source the per-page export buttons already write to.
const RECENT_EXPORTS = [
  { id: 1, report: 'Contact export', by: 'Admin', date: 'Today, 09:20', format: 'CSV', formatColor: 'blue' },
  { id: 2, report: 'Event summary - Sema-Anika', by: 'Programs Team', date: '14 Aug 2026', format: 'PDF', formatColor: 'red' },
  { id: 3, report: 'Donor report - Q2', by: 'MEL Officer', date: '2 Aug 2026', format: 'Excel', formatColor: 'green' },
]

const REPORT_TYPES = [
  { id: 'donor', label: 'Donor report' },
  { id: 'event', label: 'Event summary' },
  { id: 'impact', label: 'Impact report' },
  { id: 'contacts', label: 'Contact export' },
]

const FREQUENCIES = ['Weekly', 'Monthly', 'Quarterly', 'Annually']

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const FORMATS = ['PDF', 'Excel', 'CSV']

const SCHEDULES_KEY = 'anika_admin_scheduled_reports'
const ANNUAL_REPORT_KEY = 'anika_admin_annual_report'

function emptyFormState() {
  return {
    id: null,
    reportTypes: [],
    frequency: 'Monthly',
    weekday: WEEKDAYS[0],
    dayOfMonth: 1,
    specificDate: '',
    sendTo: '',
    format: '',
  }
}

function describeFrequency(schedule) {
  switch (schedule.frequency) {
    case 'Weekly':
      return `Weekly, every ${schedule.weekday}`
    case 'Monthly':
      return `Monthly, on the ${schedule.dayOfMonth}th`
    case 'Quarterly':
      return `Quarterly, ${schedule.dayOfMonth}th day of first month`
    case 'Annually':
      return `Annually, ${schedule.specificDate || '—'}`
    default:
      return schedule.frequency
  }
}

function canManageSchedule(schedule, user) {
  if (!user) return false
  if (user.role === 'leadership') return true
  if (user.role === 'mel') return schedule.createdByEmail === user.email
  return false
}

function ScheduleForm({ form, setForm, onSubmit, onCancelEdit, isEditing, colors }) {
  function toggleType(id) {
    setForm((f) => ({
      ...f,
      reportTypes: f.reportTypes.includes(id)
        ? f.reportTypes.filter((t) => t !== id)
        : [...f.reportTypes, id],
    }))
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{ background: colors.panel, border: `1px solid ${colors.border}` }}
      className="rounded-xl p-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-body font-bold text-base" style={{ color: colors.text }}>
          {isEditing ? 'Edit schedule' : 'Schedule a report'}
        </h2>
        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="flex items-center gap-1 text-xs font-semibold"
            style={{ color: colors.muted }}
          >
            <X size={14} /> Cancel edit
          </button>
        )}
      </div>

      {/* Report types — multi-select checklist */}
      <div className="mt-4">
        <label className="text-xs font-semibold" style={{ color: colors.muted }}>
          Report contents
        </label>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {REPORT_TYPES.map((type) => (
            <label
              key={type.id}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-body"
              style={{
                border: `1px solid ${colors.border}`,
                background: form.reportTypes.includes(type.id) ? colors.buttonBg : colors.inputBg,
                color: form.reportTypes.includes(type.id) ? colors.buttonText : colors.text,
              }}
            >
              <input
                type="checkbox"
                checked={form.reportTypes.includes(type.id)}
                onChange={() => toggleType(type.id)}
                className="accent-current"
              />
              {type.label}
            </label>
          ))}
        </div>
        {form.reportTypes.length === 0 && (
          <p className="mt-1.5 text-xs" style={{ color: colors.red }}>
            Select at least one report to include.
          </p>
        )}
      </div>

      {/* Frequency */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold" style={{ color: colors.muted }}>
            Frequency
          </label>
          <select
            value={form.frequency}
            onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value }))}
            className="rounded-lg px-3 py-2 text-sm outline-none font-body"
            style={{ border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text }}
          >
            {FREQUENCIES.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        {/* Frequency-dependent second input */}
        {form.frequency === 'Weekly' && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: colors.muted }}>
              Day of week
            </label>
            <select
              value={form.weekday}
              onChange={(e) => setForm((f) => ({ ...f, weekday: e.target.value }))}
              className="rounded-lg px-3 py-2 text-sm outline-none font-body"
              style={{ border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text }}
            >
              {WEEKDAYS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        )}

        {(form.frequency === 'Monthly' || form.frequency === 'Quarterly') && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: colors.muted }}>
              Day of month {form.frequency === 'Quarterly' && '(first month of quarter)'}
            </label>
            <input
              type="number"
              min={1}
              max={31}
              value={form.dayOfMonth}
              onChange={(e) => setForm((f) => ({ ...f, dayOfMonth: Number(e.target.value) }))}
              className="rounded-lg px-3 py-2 text-sm outline-none font-body"
              style={{ border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text }}
            />
          </div>
        )}

        {form.frequency === 'Annually' && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: colors.muted }}>
              Date
            </label>
            <input
              type="date"
              value={form.specificDate}
              onChange={(e) => setForm((f) => ({ ...f, specificDate: e.target.value }))}
              className="rounded-lg px-3 py-2 text-sm outline-none font-body"
              style={{ border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text }}
            />
          </div>
        )}
      </div>

      {/* Send to + format */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold" style={{ color: colors.muted }}>
            Send to
          </label>
          <input
            required
            type="email"
            value={form.sendTo}
            onChange={(e) => setForm((f) => ({ ...f, sendTo: e.target.value }))}
            className="rounded-lg px-3 py-2 text-sm outline-none font-body"
            style={{ border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text }}
            placeholder="you@anikainitiative.com"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold" style={{ color: colors.muted }}>
            Format
          </label>
          <div className="flex gap-2 font-body">
            {FORMATS.map((fmt) => (
              <label
                key={fmt}
                className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold"
                style={{
                  border: `1px solid ${colors.border}`,
                  background: form.format === fmt ? colors.buttonBg : colors.inputBg,
                  color: form.format === fmt ? colors.buttonText : colors.text,
                }}
              >
                <input
                  type="radio"
                  name="format"
                  value={fmt}
                  checked={form.format === fmt}
                  onChange={() => setForm((f) => ({ ...f, format: fmt }))}
                  className="hidden"
                />
                {fmt}
              </label>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs italic" style={{ color: colors.muted }}>
        Scheduling isn't wired up to an email dispatch yet — this saves your preference for when it is.
      </p>

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={form.reportTypes.length === 0}
          style={{ background: colors.buttonBg, color: colors.buttonText, opacity: form.reportTypes.length === 0 ? 0.5 : 1 }}
          className="flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold font-body"
        >
          {isEditing ? 'Save changes' : 'Save preference'}
        </button>
      </div>
    </form>
  )
}

function AnnualReportPanel({ colors, user }) {
  const [report, setReport] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(ANNUAL_REPORT_KEY) || 'null')
      setReport(stored)
    } catch {
      setReport(null)
    }
  }, [])

  const canUpload = user?.role === 'leadership' || user?.role === 'mel'
  const canDelete = user?.role === 'leadership'

  function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    // TODO(backend): upload to Cloudinary/backend storage and persist the
    // real URL, e.g. POST /api/reports/annual — this object URL is a
    // browser-only stand-in that won't survive a page reload or be visible
    // to anyone but you.
    const record = {
      name: file.name,
      url: URL.createObjectURL(file),
      uploadedBy: user?.name || 'Unknown',
      uploadedAt: new Date().toLocaleDateString(),
    }
    localStorage.setItem(ANNUAL_REPORT_KEY, JSON.stringify(record))
    setReport(record)
    e.target.value = ''
  }

  function handleDelete() {
    localStorage.removeItem(ANNUAL_REPORT_KEY)
    setReport(null)
    setConfirmDelete(false)
  }

  return (
    <div
      style={{ background: colors.panel, border: `1px solid ${colors.border}` }}
      className="rounded-xl p-6"
    >
      <h2 className="font-body font-bold text-base" style={{ color: colors.text }}>
        Annual report (2025)
      </h2>
      <p className="mt-1 text-sm font-body" style={{ color: colors.muted }}>
        Interested Donors and Partners can download from the public site's impact page.
      </p>

      {report ? (
        <div
          className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg p-3"
          style={{ border: `1px solid ${colors.border}`, background: colors.inputBg }}
        >
          <div className="flex items-center gap-2.5">
            <FileText size={18} color={colors.red} />
            <div>
              <p className="text-sm font-semibold font-body" style={{ color: colors.text }}>{report.name}</p>
              <p className="text-xs font-body" style={{ color: colors.muted }}>
                Uploaded by {report.uploadedBy} on {report.uploadedAt}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={report.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg px-3 py-1.5 text-xs font-bold"
              style={{ border: `1px solid ${colors.border}`, color: colors.text }}
            >
              VIEW
            </a>
            {canUpload && (
              <label
                className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold"
                style={{ background: colors.buttonBg, color: colors.buttonText }}
              >
                REPLACE
                <input type="file" accept="application/pdf" onChange={handleUpload} className="hidden" />
              </label>
            )}
            {canDelete && (
              <button
                onClick={() => setConfirmDelete(true)}
                aria-label="Delete annual report"
                className="rounded-lg p-1.5"
                style={{ color: colors.red }}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      ) : canUpload ? (
        <label
          className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-sm"
          style={{ borderColor: colors.border, color: colors.muted }}
        >
          <Upload size={20} />
          Click to upload the 2025 annual report (PDF)
          <input type="file" accept="application/pdf" onChange={handleUpload} className="hidden" />
        </label>
      ) : (
        <p className="mt-4 text-sm" style={{ color: colors.muted }}>
          No annual report has been uploaded yet.
        </p>
      )}

      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(20,18,15,0.45)' }}
          onClick={() => setConfirmDelete(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: colors.panel, border: `1px solid ${colors.red}` }}
            className="w-full max-w-sm overflow-hidden rounded-2xl shadow-xl"
          >
            <div className="p-5">
              <div className="flex items-center gap-2.5">
                <AlertTriangle size={18} color={colors.red} />
                <h2 className="text-lg font-bold" style={{ color: colors.text }}>
                  Delete annual report?
                </h2>
              </div>
              <p className="mt-2 text-sm" style={{ color: colors.muted }}>
                This removes the public download for donors and partners until a new one is uploaded.
              </p>
            </div>
            <div className="flex justify-end gap-2 border-t p-4" style={{ borderColor: colors.border }}>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-2 text-sm font-semibold"
                style={{ color: colors.muted }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{ background: colors.red, color: '#fff' }}
                className="rounded-full px-4 py-2 text-sm font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Reports() {
  const COLORS = useAdminColors()
  const { user } = useAuth()
  const [toast, setToast] = useState('')
  const [schedules, setSchedules] = useState([])
  const [form, setForm] = useState(emptyFormState())
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    // TODO(backend): replace with GET /api/reports/schedules
    try {
      const stored = JSON.parse(localStorage.getItem(SCHEDULES_KEY) || '[]')
      setSchedules(stored)
    } catch {
      setSchedules([])
    }
  }, [])

  function persist(next) {
    setSchedules(next)
    localStorage.setItem(SCHEDULES_KEY, JSON.stringify(next))
  }

  function showToast(message) {
    setToast(message)
    setTimeout(() => setToast(''), 3200)
  }

  function submitForm(e) {
    e.preventDefault()
    if (form.reportTypes.length === 0) return

    if (form.id) {
      // Editing an existing schedule — TODO(backend): PATCH /api/reports/schedules/:id
      const next = schedules.map((s) => (s.id === form.id ? { ...s, ...form } : s))
      persist(next)
      showToast('Schedule updated.')
    } else {
      // TODO(backend): POST /api/reports/schedules
      const record = {
        ...form,
        id: Date.now(),
        createdBy: user?.name || 'Unknown',
        createdByEmail: user?.email || null,
      }
      persist([...schedules, record])
      showToast('Schedule saved.')
    }
    setForm(emptyFormState())
  }

  function startEdit(schedule) {
    setForm({ ...schedule })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setForm(emptyFormState())
  }

  function confirmDelete() {
    // TODO(backend): DELETE /api/reports/schedules/:id
    persist(schedules.filter((s) => s.id !== deleteTarget.id))
    setDeleteTarget(null)
    showToast('Schedule deleted.')
  }

  return (
    <div style={{ background: COLORS.bg, minHeight: '100%' }} className="rounded-lg p-6 font-sans">
      <div className="mb-6">
        <h1 className="font-display text-2xl" style={{ color: COLORS.text }}>
          Reports & export
        </h1>
        <p className="mt-1 text-sm font-body" style={{ color: COLORS.muted }}>
          Scheduled exports and the public annual report for grant reporting, the board, and audits.
        </p>
      </div>

      <div className="space-y-6">
        <AnnualReportPanel colors={COLORS} user={user} />

        <ScheduleForm
          form={form}
          setForm={setForm}
          onSubmit={submitForm}
          onCancelEdit={cancelEdit}
          isEditing={Boolean(form.id)}
          colors={COLORS}
        />

        {/* Saved schedules */}
        <div
          style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }}
          className="overflow-x-auto rounded-xl"
        >
          <div className="p-5 pb-0">
            <h2 className="font-body font-bold text-base" style={{ color: COLORS.text }}>
              Saved schedules
            </h2>
          </div>
          {schedules.length === 0 ? (
            <p className="p-5 text-sm" style={{ color: COLORS.muted }}>
              No schedules saved yet.
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr
                  className="border-b text-xs font-bold tracking-wide"
                  style={{ borderColor: COLORS.border, color: COLORS.muted }}
                >
                  <th className="px-5 py-3">REPORTS</th>
                  <th className="px-5 py-3">FREQUENCY</th>
                  <th className="px-5 py-3">FORMAT</th>
                  <th className="px-5 py-3">SEND TO</th>
                  <th className="px-5 py-3">CREATED BY</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) => {
                  const canManage = canManageSchedule(schedule, user)
                  return (
                    <tr key={schedule.id} className="border-t" style={{ borderColor: COLORS.border }}>
                      <td className="px-5 py-3 font-semibold" style={{ color: COLORS.text }}>
                        {schedule.reportTypes
                          .map((id) => REPORT_TYPES.find((t) => t.id === id)?.label)
                          .filter(Boolean)
                          .join(', ')}
                      </td>
                      <td className="px-5 py-3" style={{ color: COLORS.muted }}>
                        {describeFrequency(schedule)}
                      </td>
                      <td className="px-5 py-3" style={{ color: COLORS.muted }}>
                        {schedule.format}
                      </td>
                      <td className="px-5 py-3" style={{ color: COLORS.muted }}>
                        {schedule.sendTo}
                      </td>
                      <td className="px-5 py-3" style={{ color: COLORS.muted }}>
                        {schedule.createdBy}
                      </td>
                      <td className="px-5 py-3">
                        {canManage && (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => startEdit(schedule)}
                              aria-label="Edit schedule"
                              className="rounded-lg p-1.5 hover:bg-black/5"
                              style={{ color: COLORS.muted }}
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(schedule)}
                              aria-label="Delete schedule"
                              className="rounded-lg p-1.5 hover:bg-black/5"
                              style={{ color: COLORS.red }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent exports — unchanged, still stub data */}
        <div
          style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }}
          className="overflow-x-auto rounded-xl"
        >
          <div className="p-5 pb-0">
            <h2 className="font-body font-bold text-base" style={{ color: COLORS.text }}>
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
      </div>

      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 text-sm font-semibold shadow-lg"
          style={{ background: COLORS.buttonBg, color: COLORS.buttonText }}
        >
          {toast}
        </div>
      )}

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(20,18,15,0.45)' }}
          onClick={() => setDeleteTarget(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: COLORS.panel, border: `1px solid ${COLORS.red}` }}
            className="w-full max-w-sm overflow-hidden rounded-2xl shadow-xl"
          >
            <div className="p-5">
              <div className="flex items-center gap-2.5">
                <AlertTriangle size={18} color={COLORS.red} />
                <h2 className="text-lg font-bold" style={{ color: COLORS.text }}>
                  Delete this schedule?
                </h2>
              </div>
              <p className="mt-2 text-sm" style={{ color: COLORS.muted }}>
                This stops the scheduled delivery for <strong style={{ color: COLORS.text }}>
                  {deleteTarget.reportTypes.map((id) => REPORT_TYPES.find((t) => t.id === id)?.label).join(', ')}
                </strong>.
              </p>
            </div>
            <div className="flex justify-end gap-2 border-t p-4" style={{ borderColor: COLORS.border }}>
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-3 py-2 text-sm font-semibold"
                style={{ color: COLORS.muted }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{ background: COLORS.red, color: '#fff' }}
                className="rounded-full px-4 py-2 text-sm font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}