// src/features/stories/index.jsx
import { useState } from "react";
import StoriesHero from "./components/StoriesHero.jsx";
import PillarFilter from "./components/PillarFilter.jsx";
import StoryGrid from "./components/StoryGrid.jsx";
import JoinCTA from "./components/JoinCTA.jsx";
import { stories } from "./data/stories.js";

export default function Stories() {
  const [activePillar, setActivePillar] = useState("All");

  return (
    <section className="px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <StoriesHero />
        <PillarFilter active={activePillar} onChange={setActivePillar} />
        <StoryGrid stories={stories} activePillar={activePillar} />
        <JoinCTA />
      </div>
    </section>
  );
}
