import { Link } from "react-router-dom";
import { pillarColors } from "../data/stories.js";


const tagClasses = {
  coral: "bg-coral/10 text-coral",
  gold: "bg-gold/10 text-gold",
  "anika-blue": "bg-anika-blue/10 text-anika-blue",
  "anika-green": "bg-anika-green/10 text-anika-green",
  ink: "bg-ink/10 text-ink",
};

const StoryCard = ({ story }) => {
  const colorToken = pillarColors[story.pillar] ?? "ink";

  return (
    <article className="flex flex-col overflow-hidden rounded-lg bg-white/40 shadow-sm">
      <div className="aspect-[4/3] overflow-hidden bg-ink/10">
        <img
          src={story.image}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <span
          className={`self-start rounded-full px-3 py-1 font-body text-xs uppercase tracking-wide ${tagClasses[colorToken]}`}
        >
          {story.pillar}
        </span>

        <h3 className="font-display text-xl mt-4 mb-2 text-ink leading-snug">
          {story.title}
        </h3>

        <p className="font-body text-sm text-ink/65 leading-relaxed flex-1">
          {story.excerpt}
        </p>

        <Link
          to={`/stories/${story.slug}`}
          className="mt-6 self-start font-body text-sm text-ink hover:text-coral transition-colors duration-200"
        >
          Read our story →
        </Link>
      </div>
    </article>
  );
};

export default StoryCard;