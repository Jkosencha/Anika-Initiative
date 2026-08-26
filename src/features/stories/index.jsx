// src/features/stories/index.jsx
import { useEffect, useState } from "react";
import StoriesHero from "./components/StoriesHero.jsx";
import PillarFilter from "./components/PillarFilter.jsx";
import StoryGrid from "./components/StoryGrid.jsx";
import { stories } from "./data/stories.js";
import { useSearchParams } from "react-router-dom";

export default function Stories() {
  const [searchParams] = useSearchParams();
  const pillarParam = searchParams.get("pillar");

  const [activePillar, setActivePillar] = useState(pillarParam ?? "all");


  useEffect(() => {
    if (pillarParam) {
      setActivePillar(pillarParam);
    }
  }, [pillarParam]);
  
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