import { useEffect, useState } from 'react'
import ImpactHeader from '../components/impact/ImpactHeader'
import ImpactStats from '../components/impact/ImpactStats'
import { caseStudies, impactStats as fallbackStats } from '../data/impact'
import CaseStudies from '../components/impact/CaseStudies'
import ReportBanner from '../components/impact/ReportBanner'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

// Admin's colorKey (red/green/orange/blue, matching the admin dashboard's
// own design tokens) doesn't match the public site's accentClass names
// (coral/anika-green/gold/anika-blue, from accentClasses.js) -- same
// colors, different naming conventions on each side.
const COLOR_KEY_TO_ACCENT = {
  red: 'coral',
  green: 'anika-green',
  orange: 'gold',
  blue: 'anika-blue',
}

/**
 * Admin stores a free-text value like "100+", "24M+", "2,500+" -- the
 * Counter component needs a numeric target to animate up to, plus
 * whatever comes after the number as a suffix. This splits one into the
 * other without requiring any change to the admin's simple text field.
 *
 * parseStatValue("2,500+") -> { target: 2500, suffix: "+" }
 * parseStatValue("24M+")   -> { target: 24, suffix: "M+" }
 * parseStatValue("14")     -> { target: 14, suffix: "" }
 */
function parseStatValue(value) {
  const match = String(value).match(/^([\d,]+)(.*)$/)
  if (!match) return { target: 0, suffix: String(value) }
  const [, numberPart, suffix] = match
  return { target: Number(numberPart.replace(/,/g, '')) || 0, suffix }
}

function toPublicStat(stat) {
  const { target, suffix } = parseStatValue(stat.value)
  return {
    label: stat.label,
    target,
    suffix,
    accentClass: COLOR_KEY_TO_ACCENT[stat.colorKey] || 'ink',
  }
}

export default function Impact() {
  const [stats, setStats] = useState(fallbackStats)

  useEffect(() => {
    let cancelled = false
    fetch(`${API_BASE}/api/impact`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setStats(data.map(toPublicStat))
        }
      })
      .catch(() => {
        // Backend unreachable or empty -- keep the static fallback so the
        // public page never shows a blank stats section.
      })
    return () => { cancelled = true }
  }, [])

  return (
    <>
     <ImpactHeader />
     <ImpactStats stats={stats} />
     <CaseStudies caseStudies={caseStudies} /> 
     <ReportBanner />
    </>
  )
}