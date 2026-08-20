import React from 'react'
import ImpactHeader from '../components/impact/ImpactHeader'
import ImpactStats from '../components/impact/ImpactStats'
import { impactStats } from '../data/impact'

export default function Impact() {
  return (
    <>
     <ImpactHeader />
     <ImpactStats stats={impactStats} /> 
    </>
  )
}
