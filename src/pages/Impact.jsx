import ImpactHeader from '../components/impact/ImpactHeader'
import ImpactStats from '../components/impact/ImpactStats'
import { caseStudies, impactStats } from '../data/impact'
import CaseStudies from '../components/impact/CaseStudies'
import ReportBanner from '../components/impact/ReportBanner'

export default function Impact() {
  return (
    <>
     <ImpactHeader />
     <ImpactStats stats={impactStats} />
     <CaseStudies caseStudies={caseStudies} /> 
     <ReportBanner />
    </>
  )
}
