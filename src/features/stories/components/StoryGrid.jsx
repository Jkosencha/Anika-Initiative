import StoryCard from "./StoryCard.jsx";

const StoryGrid = ({ stories, activePillar }) => {
  const filtered =
    activePillar === "All"
      ? stories
      : stories.filter((story) => story.pillar === activePillar);

  if (filtered.length === 0) {
    return (
      <p className="text-center font-body text-ink/55 py-8">
        No stories yet for this pillar. Check back soon.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filtered.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
};

export default StoryGrid;