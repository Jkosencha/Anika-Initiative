function StatCard({ label, value, sub, icon: Icon, bg, textColor = '#fff' }) {
  return (
    <div style={{ background: bg, color: textColor }} className="rounded-xl p-4">
      <div className="flex items-start justify-between">
        <p className="text-xs font-bold tracking-wide opacity-80">{label}</p>
        {Icon && (
          <div style={{ background: 'rgba(255,255,255,0.2)' }} className="rounded-lg p-1.5">
            <Icon size={16} />
          </div>
        )}
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      {sub && <p className="mt-1 text-xs opacity-80">{sub}</p>}
    </div>
  )
}

export default StatCard
