import { Download, Pencil, Trash2, X, Plus, AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"
import { useAdminColors } from "../theme"
import { apiRequest } from "../utils/api"

const COLOR_OPTIONS = [
    { value: 'red', label: 'Coral' },
    { value: 'green', label: 'Green' },
    { value: 'orange', label: 'Gold' },
    { value: 'blue', label: 'Blue' },
]

function StatFormModal({ stat, onClose, onSave, colors, saving }) {
    const isEdit = Boolean(stat)
    const [label, setLabel] = useState(stat?.label ?? '')
    const [value, setValue] = useState(stat?.value ?? '')
    const [colorKey, setColorKey] = useState(stat?.colorKey ?? COLOR_OPTIONS[0].value)

    function submit(e) {
        e.preventDefault()
        if (!label.trim() || !value.trim()) return
        onSave({
            ...(isEdit ? stat : {}),
            label: label.trim(),
            value: value.trim(),
            colorKey,
        })
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
                    <h2 className="text-lg font-bold" style={{ color: colors.text }}>
                        {isEdit ? 'Edit stat' : 'Add impact stat'}
                    </h2>
                    <button type="button" onClick={onClose} className="rounded-full p-1 hover:bg-black/5">
                        <X size={18} color={colors.muted} />
                    </button>
                </div>

                <div className="space-y-3 p-5 font-body">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold" style={{ color: colors.muted }}>
                            Label
                        </label>
                        <input
                            required
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            className="rounded-lg px-3 py-2 text-sm outline-none"
                            style={{ border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text }}
                            placeholder="e.g. Events held"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold" style={{ color: colors.muted }}>
                            Value
                        </label>
                        <input
                            required
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="rounded-lg px-3 py-2 text-sm outline-none"
                            style={{ border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text }}
                            placeholder="e.g. 100+"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold" style={{ color: colors.muted }}>
                            Accent color
                        </label>
                        <select
                            value={colorKey}
                            onChange={(e) => setColorKey(e.target.value)}
                            className="rounded-lg px-3 py-2 text-sm outline-none"
                            style={{ border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text }}
                        >
                            {COLOR_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-2 border-t p-4" style={{ borderColor: colors.border }}>
                    <button type="button" onClick={onClose} className="px-3 py-2 text-sm font-semibold cursor-pointer font-body" style={{ color: colors.muted }}>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        style={{ background: colors.buttonBg, color: colors.buttonText, opacity: saving ? 0.6 : 1 }}
                        className="rounded-full px-4 py-2 text-sm font-semibold cursor-pointer font-body"
                    >
                        {saving ? 'Saving…' : isEdit ? 'Save' : 'Add'}
                    </button>
                </div>
            </form>
        </div>
    )
}

function ConfirmDeleteModal({ stat, onClose, onConfirm, colors, deleting }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(20,18,15,0.45)' }}
            onClick={onClose}
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
                            Delete this stat?
                        </h2>
                    </div>
                    <p className="mt-2 text-sm" style={{ color: colors.muted }}>
                        <strong style={{ color: colors.text }}>{stat.label}</strong> will be removed from the
                        public Impact page immediately.
                    </p>
                </div>
                <div className="flex justify-end gap-2 border-t p-4" style={{ borderColor: colors.border }}>
                    <button type="button" onClick={onClose} className="px-3 py-2 text-sm font-semibold" style={{ color: colors.muted }}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={deleting}
                        style={{ background: colors.red, color: '#fff', opacity: deleting ? 0.6 : 1 }}
                        className="rounded-full px-4 py-2 text-sm font-semibold"
                    >
                        {deleting ? 'Deleting…' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function Impact() {
    const COLORS = useAdminColors()
    const [stats, setStats] = useState([])
    const [loading, setLoading] = useState(true)
    const [formTarget, setFormTarget] = useState(null) // null | { stat: null | stat }
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [toast, setToast] = useState('')

    function showToast(message) {
        setToast(message)
        setTimeout(() => setToast(''), 2200)
    }

    useEffect(() => {
        let cancelled = false
        apiRequest('/api/impact')
            .then((data) => {
                if (!cancelled) setStats(data)
            })
            .catch(() => {
                if (!cancelled) showToast('Could not load impact stats.')
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })
        return () => { cancelled = true }
    }, [])

    async function saveStat(data) {
        setSaving(true)
        try {
            if (data.id) {
                const updated = await apiRequest(`/api/impact/${data.id}`, {
                    method: 'PATCH',
                    body: { label: data.label, value: data.value, colorKey: data.colorKey },
                })
                setStats((prev) => prev.map((s) => (s.id === data.id ? updated : s)))
                showToast('Stat updated.')
            } else {
                const created = await apiRequest('/api/impact', {
                    method: 'POST',
                    body: { label: data.label, value: data.value, colorKey: data.colorKey },
                })
                setStats((prev) => [...prev, created])
                showToast('Stat added.')
            }
            setFormTarget(null)
        } catch (err) {
            showToast(err.message || 'Could not save stat.')
        } finally {
            setSaving(false)
        }
    }

    async function confirmDelete() {
        setDeleting(true)
        try {
            await apiRequest(`/api/impact/${deleteTarget.id}`, { method: 'DELETE' })
            setStats((prev) => prev.filter((s) => s.id !== deleteTarget.id))
            showToast('Stat deleted.')
        } catch (err) {
            showToast(err.message || 'Could not delete stat.')
        } finally {
            setDeleting(false)
            setDeleteTarget(null)
        }
    }

    function exportCsv() {
        const header = 'Label,Value\n'
        const rows = stats.map((s) => `"${s.label}","${s.value}"`).join('\n')
        const csv = header + rows

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `anika-impact-stats-${new Date().toISOString().slice(0, 10)}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    return (
        <div style={{ background: COLORS.bg, minHeight: '100%' }} className="rounded-lg p-6 font-sans">

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">

                <div>
                    <h1 className="text-2xl font-body font-bold" style={{ color: COLORS.text }}>
                        Impact metrics
                    </h1>
                    <p className="mt-1 text-sm font-body" style={{ color: COLORS.muted }}>
                        These power the public Impact page. Changes save immediately.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={exportCsv}
                        style={{ background: COLORS.panel, color: COLORS.text, border: `1px solid ${COLORS.border}` }}
                        className="flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-bold font-body tracking-wide cursor-pointer"
                    >
                        <Download size={14} />
                        EXPORT CSV
                    </button>

                    <button
                        onClick={() => setFormTarget({ stat: null })}
                        style={{ background: COLORS.buttonBg, color: COLORS.buttonText }}
                        className="flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-bold font-body tracking-wide cursor-pointer"
                    >
                        <Plus size={14} />
                        ADD IMPACT
                    </button>
                </div>
            </div>

            {loading ? (
                <p className="text-sm" style={{ color: COLORS.muted }}>Loading…</p>
            ) : stats.length === 0 ? (
                <p className="text-sm" style={{ color: COLORS.muted }}>
                    No impact stats yet. Click "Add impact" to create the first one.
                </p>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.id}
                            style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }}
                            className="relative rounded-xl p-5"
                        >
                            <div className="absolute right-4 top-4 flex items-center gap-2">
                                <button
                                    onClick={() => setFormTarget({ stat })}
                                    aria-label={`Edit ${stat.label}`}
                                    className="cursor-pointer"
                                    style={{ color: COLORS[stat.colorKey] }}
                                >
                                    <Pencil size={14} />
                                </button>
                                <button
                                    onClick={() => setDeleteTarget(stat)}
                                    aria-label={`Delete ${stat.label}`}
                                    className="cursor-pointer"
                                    style={{ color: COLORS.red }}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <p className="text-3xl font-extrabold" style={{ color: COLORS[stat.colorKey] }}>
                                {stat.value}
                            </p>
                            <p className="mt-2 text-sm" style={{ color: COLORS.text }}>
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {formTarget && (
                <StatFormModal
                    stat={formTarget.stat}
                    onClose={() => setFormTarget(null)}
                    onSave={saveStat}
                    colors={COLORS}
                    saving={saving}
                />
            )}

            {deleteTarget && (
                <ConfirmDeleteModal
                    stat={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={confirmDelete}
                    colors={COLORS}
                    deleting={deleting}
                />
            )}

            {toast && (
                <div
                    className="fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 text-sm font-semibold shadow-lg"
                    style={{ background: COLORS.buttonBg, color: COLORS.buttonText }}
                >
                    {toast}
                </div>
            )}
        </div>
    )
}