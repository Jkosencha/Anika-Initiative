import { storiesContent as content } from "../data/storiesContent.js";

const StoriesHero = () => {
  const { headingLead, headingAccent, subheading } = content;

  return (
    <section className="bg-ink text-cream px-6 md:px-16 py-16">
      <h1 className="font-display text-5xl md:text-6xl uppercase">
        {headingLead} {headingAccent}
      </h1>

      <p className="font-editorial italic text-gold mt-4 max-w-md text-lg">
        {subheading}
      </p>
    </section>
  );
};

export default StoriesHero;