import { DollarSign, CalendarDays, UserPlus, Globe, MapPin } from 'lucide-react'
import StatCard from '../components/StatCard'
import TrendBarChart from '../components/charts/TrendBarChart'
import DonutChart from '../components/charts/DonutChart'
import { useAdminColors, initials, avatarColor } from '../theme'

const donationTrend = [
  { label: 'Mar', value: 62000 },
  { label: 'Apr', value: 91000 },
  { label: 'May', value: 54000 },
  { label: 'Jun', value: 88000 },
  { label: 'Jul', value: 71000 },
  { label: 'Aug', value: 120500 },
]

const recentDonations = [
  { name: 'Wanjiru A.', amount: '+2,500' },
  { name: 'David M.', amount: '+1,000' },
  { name: 'Anonymous', amount: '+5,000' },
  { name: 'Faith K.', amount: 'pending', pending: true },
  { name: 'Samuel M.', amount: '+10,000' },
]

const recentActivity = [
  { text: 'New registration for "Open Mic: Air It Out"', time: '12 minutes ago' },
  { text: 'M-Pesa donation of KES 2,500 received', time: '1 hour ago' },
  { text: 'Partnership enquiry from Creatives Garage', time: '3 hours ago' },
  { text: 'Story submitted: "A Room Becomes a Stage"', time: 'Yesterday' },
]

const reach = [
  { country: 'Kenya', tag: 'HQ · Operational' },
  { country: 'Uganda', tag: 'Operational' },
  { country: 'Rwanda', tag: 'Operational' },
  { country: 'Ghana', tag: 'Programme reach' },
  { country: 'South Africa', tag: 'Programme reach' },
]

function Card({ title, action, children, colors }) {
  return (
    <div style={{ background: colors.panel, border: `1px solid ${colors.border}` }} className="rounded-xl p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold" style={{ color: colors.text }}>
          {title}
        </h2>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function LinkButton({ children, colors, ...props }) {
  return (
    <button {...props} className="text-xs font-bold tracking-wide" style={{ color: colors.text }}>
      {children}
    </button>
  )
}

function Dashboard() {
  const COLORS = useAdminColors()
  const totalContributions = recentDonations.length + 137
  const totalDonationValue = donationTrend.reduce((sum, d) => sum + d.value, 0)

  const giftSize = [
    { label: 'Under 1,000', percent: 46, color: COLORS.red },
    { label: '1,000–5,000', percent: 30, color: COLORS.orange },
    { label: 'Over 5,000', percent: 24, color: COLORS.blue },
  ]

  return (
    <div style={{ background: COLORS.bg, minHeight: '100%' }} className="rounded-lg p-6 font-sans">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>
          Dashboard
        </h1>
        <p className="mt-1 text-sm" style={{ color: COLORS.muted }}>
          A quick overview of what's happening across ANIKA.
        </p>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="TOTAL RAISED" value="KES 486K" sub="▲ 12% this month" icon={DollarSign} bg={COLORS.red} />
        <StatCard label="UPCOMING EVENTS" value="4" sub="▲ 2 new this week" icon={CalendarDays} bg={COLORS.green} />
        <StatCard
          label="NEW REGISTRATIONS"
          value="37"
          sub="▲ 9 since Monday"
          icon={UserPlus}
          bg={COLORS.orange}
          textColor="#1c1a17"
        />
        <StatCard label="ACTIVE COUNTRIES" value="5" sub="KE · UG · RW · GH · ZA" icon={Globe} bg={COLORS.blue} />
      </div>

      <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr_1fr]">
        <Card title="Donation trend" colors={COLORS} action={<LinkButton colors={COLORS}>REPORT</LinkButton>}>
          <TrendBarChart data={donationTrend} colors={COLORS} />
          <p className="mt-3 text-xs" style={{ color: COLORS.muted }}>
            KES {totalDonationValue.toLocaleString()} · {totalContributions} contributions this period.
          </p>
        </Card>

        <Card title="By gift size" colors={COLORS}>
          <DonutChart data={giftSize} centerValue={totalContributions} centerLabel="Gifts" colors={COLORS} />
          <ul className="mt-4 space-y-2">
            {giftSize.map((slice) => (
              <li key={slice.label} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2" style={{ color: COLORS.muted }}>
                  <span className="h-2 w-2 rounded-sm" style={{ background: slice.color }} />
                  {slice.label}
                </span>
                <span className="font-bold" style={{ color: COLORS.text }}>
                  {slice.percent}%
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Recent donations" colors={COLORS} action={<LinkButton colors={COLORS}>ALL</LinkButton>}>
          <ul className="space-y-3">
            {recentDonations.map((d) => (
              <li key={d.name} className="flex items-center gap-3 text-sm">
                <div
                  style={{ background: avatarColor(d.name) }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                >
                  {initials(d.name)}
                </div>
                <span className="flex-1" style={{ color: COLORS.text }}>
                  {d.name}
                </span>
                <span className="font-bold" style={{ color: d.pending ? COLORS.orange : COLORS.green }}>
                  {d.amount}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card title="Recent activity" colors={COLORS} action={<LinkButton colors={COLORS}>VIEW ALL</LinkButton>}>
          <ul>
            {recentActivity.map((item) => (
              <li
                key={item.text}
                className="flex items-start gap-3 border-t py-3 first:border-t-0 first:pt-0 last:pb-0"
                style={{ borderColor: COLORS.border }}
              >
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: COLORS.blue }} />
                <div>
                  <p className="text-sm" style={{ color: COLORS.text }}>
                    {item.text}
                  </p>
                  <p className="text-xs" style={{ color: COLORS.muted }}>
                    {item.time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title="Where we reach"
          colors={COLORS}
          action={
            <span
              style={{ background: COLORS.panelAlt, color: COLORS.text }}
              className="rounded-full px-2.5 py-1 text-xs font-bold"
            >
              {reach.length} countries
            </span>
          }
        >
          <ul className="space-y-2.5">
            {reach.map((r) => (
              <li key={r.country} className="flex items-center gap-3 text-sm">
                <MapPin size={14} style={{ color: COLORS.muted }} />
                <span className="flex-1" style={{ color: COLORS.text }}>
                  {r.country}
                </span>
                <span className="text-xs" style={{ color: COLORS.muted }}>
                  {r.tag}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs" style={{ color: COLORS.muted }}>
            Kenya HQ, with programme reach across {reach.length} African countries via the 2022 Fellowship.
          </p>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
