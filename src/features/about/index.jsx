// src/features/about/index.js
// Public entry point for the about feature — the page shell only
// ever imports from here, never reaches into components/ or data/ directly.

import AboutHero from './components/AboutHero'
import OriginStory from './components/OriginStory'
import PoemSpotlight from './components/PoemSpotlight'
import MissionVision from './components/MissionVision'
import HistoryTimeline from './components/HistoryTimeline'
import CoreValues from './components/CoreValues'
import GovernanceCallout from './components/GovernanceCallout'
import JoinCTA from './components/JoinCTA'

export default function AboutSection() {
  return (
    <>
      <AboutHero />
      <OriginStory />
      <PoemSpotlight />
      <MissionVision />
      <HistoryTimeline />
      <GovernanceCallout />
      <CoreValues />
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
  GovernanceCallout,
  JoinCTA,
}
