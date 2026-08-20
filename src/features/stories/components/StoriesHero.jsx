import { storiesContent as content } from "../data/storiesContent.js";

const StoriesHero = () => {
  const { eyebrow, headingLead, headingAccent, subheading } = content;

  return (
    <div className="text-center mb-12">
      {eyebrow && (
        <span className="font-body uppercase tracking-[0.15em] text-xs text-coral">
          {eyebrow}
        </span>
      )}

      <h2 className="font-display text-4xl sm:text-5xl mt-2 mb-4 text-ink">
        {headingLead}{" "}
        <span className="font-editorial italic normal-case text-coral text-[0.85em]">
          {headingAccent}
        </span>
      </h2>

      {subheading && (
        <p className="font-body max-w-xl mx-auto text-ink/65 leading-relaxed">
          {subheading}
        </p>
      )}
    </div>
  );
};

export default StoriesHero;
