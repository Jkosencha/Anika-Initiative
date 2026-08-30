import { Download, Pencil, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useAdminColors } from "../theme"

const COLOR_OPTIONS = [
    { value: 'red', label: 'Coral' },
    { value: 'green', label: 'Green' },
    { value: 'orange', label: 'Gold' },
    { value: 'blue', label: 'Blue' },
]

const SEED = [
    { id: 1, label: 'Events held', value: '100+', colorKey: 'red' },
    { id: 2, label: 'Forum participants', value: '2,500+', colorKey: 'green' },
    { id: 3, label: 'Artists engaged', value: '150', colorKey: 'orange' },
    { id: 4, label: 'Online impressions', value: '24M+', colorKey: 'blue' },
    { id: 5, label: 'Refugees engaged', value: '200+', colorKey: 'red' },
    { id: 6, label: 'Scripts received', value: '160', colorKey: 'green' },
    { id: 7, label: 'Young leaders', value: '80', colorKey: 'orange' },
    { id: 8, label: 'African countries', value: '14', colorKey: 'blue' },
    { id: 9, label: 'Flagship programmes', value: '4', colorKey: 'red' },
    { id: 10, label: 'WhatsApp interactions', value: '8,400', colorKey: 'green' },
    { id: 11, label: 'Campaigns launched', value: '12', colorKey: 'orange' },
]

const STORAGE_KEY = 'anika_admin_impact_stats'

function StatEditModal({ stat, onClose, onSave, colors}) {
    const [label, setLabel] = useState(stat.label)
    const [value, setValue] = useState(stat.value)
    const [colorKey, setColorKey] = useState(stat.colorKey)

    function submit(e) {
        e.preventDefault()
        if (!label.trim() || !value.trim()) return
        onSave({...stat, label: label.trim(), value: value.trim(), colorKey })
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
                    <h2 className="text-lg font-bold" style={{ color: colors.text }}>
                        Edit stat
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
                        style={{ background: colors.buttonBg, color: colors.buttonText }}
                        className="rounded-full px-4 py-2 text-sm font-semibold cursor-pointer font-body"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    )
}




export default function Impact() {
    const COLORS = useAdminColors()
    const [stats, setStats] = useState(SEED)
    const [editTarget, setEditTarget] = useState(null)
    const [isDirty, setIsDirty] = useState(false)
    const [savedNotice, setSavedNotice] = useState(false)

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) setStats(JSON.parse(stored))
        } catch {
            // ignore corrupted storage, fall back to SEED
        }
    }, [])

    function updateStat(updated) {
        setStats((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
        setIsDirty(true)
    }

    function saveChanges() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
        setIsDirty(false)
        setSavedNotice(true)
        setTimeout(() => setSavedNotice(false), 2200)
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
                        These power the public Impact page. Keep them verified.
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
                        onClick={saveChanges}
                        disabled={!isDirty}
                        style={{
                            background: isDirty ? COLORS.buttonBg : COLORS.border,
                            color: isDirty ? COLORS.buttonText : COLORS.muted,
                            cursor: isDirty ? 'pointer' : 'not-allowed',
                        }}
                        className="rounded-lg px-4 py-2.5 text-xs font-bold font-body tracking-wide cursor-pointer"
                    >
                        {savedNotice ? 'SAVED' : 'SAVE CHANGES'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.id}
                        style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }}
                        className="relative rounded-xl p-5"
                    >
                        <button
                            onClick={() => setEditTarget(stat)}
                            className="absolute right-4 top-4 flex items-center gap-1 text-xs font-bold tracking-wide cursor-pointer"
                            style={{ color: COLORS[stat.colorKey] }}
                        >
                            <Pencil size={12} />
                           
                        </button>
                        <p className="text-3xl font-extrabold" style={{ color: COLORS[stat.colorKey] }}>
                            {stat.value}
                        </p>
                        <p className="mt-2 text-sm" style={{ color: COLORS.text }}>
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>

            {editTarget && (
                <StatEditModal
                    stat={editTarget}
                    onClose={() => setEditTarget(null)}
                    onSave={updateStat}
                    colors={COLORS}
                />
            )}
        </div>
    )
}
