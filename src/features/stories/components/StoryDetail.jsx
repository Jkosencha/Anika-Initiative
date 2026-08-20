import { Link } from "react-router-dom";
import { pillarColors } from "../data/stories.js";

const tagClasses = {
  coral: "bg-coral/10 text-coral",
  gold: "bg-gold/10 text-gold",
  "anika-blue": "bg-anika-blue/10 text-anika-blue",
  "anika-green": "bg-anika-green/10 text-anika-green",
  ink: "bg-ink/10 text-ink",
};

const StoryDetail = ({ story }) => {
  const colorToken = pillarColors[story.pillar] ?? "ink";

  return (
    <article className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/stories"
          className="font-body text-sm text-ink/55 hover:text-ink transition-colors"
        >
          ← Back to stories
        </Link>

        <span
          className={`mt-6 inline-block rounded-full px-3 py-1 font-body text-xs uppercase tracking-wide ${tagClasses[colorToken]}`}
        >
          {story.pillar}
        </span>

        <h1 className="font-display text-3xl sm:text-5xl mt-4 mb-8 text-ink leading-tight">
          {story.title}
        </h1>

        <div className="aspect-[16/9] overflow-hidden rounded-lg bg-ink/10 mb-10">
          <img
            src={story.image}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <div className="font-editorial text-lg sm:text-xl text-ink/80 leading-relaxed space-y-6">
          {story.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </article>
  );
};

export default StoryDetail;
