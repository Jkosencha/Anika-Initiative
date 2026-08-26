import { useParams, Link } from "react-router-dom";
import StoryDetail from "./components/StoryDetail.jsx";
import { stories } from "./data/stories.js";

export default function StoryDetailView() {
  const { slug } = useParams();
  const story = stories.find((s) => s.slug === slug);

  if (!story) {
    return (
      <div className="px-6 py-24 text-center">
        <p className="font-body text-base text-ink/55 mb-4">
          We couldn't find that story.
        </p>
        <Link
          to="/stories"
          className="font-body text-sm px-7 py-2.5 rounded border border-ink text-ink hover:bg-ink hover:text-cream transition-colors duration-200"
        >
          Back to stories
        </Link>
      </div>
    );
  }

  return <StoryDetail story={story} />;
}