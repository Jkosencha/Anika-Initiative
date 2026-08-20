// src/features/stories/index.jsx
import { useState } from "react";
import StoriesHero from "./components/StoriesHero.jsx";
import PillarFilter from "./components/PillarFilter.jsx";
import StoryGrid from "./components/StoryGrid.jsx";
import { stories } from "./data/stories.js";

export default function Stories() {
  const [activePillar, setActivePillar] = useState("All");

  return (
    <>
      <StoriesHero />

      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <PillarFilter active={activePillar} onChange={setActivePillar} />
          <StoryGrid stories={stories} activePillar={activePillar} />
        </div>
      </section>
    </>
  );
}