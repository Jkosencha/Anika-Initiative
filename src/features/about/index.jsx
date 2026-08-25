import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import AboutHero from './components/AboutHero'
import OriginStory from './components/OriginStory'
import PoemSpotlight from './components/PoemSpotlight'
import MissionVision from './components/MissionVision'
import HistoryTimeline from './components/HistoryTimeline'
import CoreValues from './components/CoreValues'
import Partners from './components/Partners'
import JoinCTA from './components/JoinCTA'

export default function AboutSection() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return

    // Wait a tick so the section has mounted before we measure/scroll to it.
    const id = hash.replace('#', '')
    const scrollToTarget = () => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const raf = requestAnimationFrame(scrollToTarget)
    return () => cancelAnimationFrame(raf)
  }, [hash])

  return (
    <>
      <AboutHero />
      <OriginStory />
      <PoemSpotlight />
      <MissionVision />
      <HistoryTimeline />
      <CoreValues />
      <Partners />
      <JoinCTA />
    </>
  )
}

// Named exports too, in case a page wants to compose the sections itself.
export {
  AboutHero,
  OriginStory,
  PoemSpotlight,
  MissionVision,
  HistoryTimeline,
  CoreValues,
  Partners,
  JoinCTA,
}