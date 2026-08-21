import { storiesContent as content } from "../data/storiesContent.js";

const StoriesHero = () => {
  const { headingLead, headingAccent, subheading } = content;

  return (
    <section className="bg-charcoal text-cream py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h1 className="font-display text-5xl md:text-6xl uppercase">
          {headingLead} {headingAccent}
        </h1>

        <p className="font-editorial italic text-gold mt-4 max-w-md text-lg">
          {subheading}
        </p>
      </div>
    </section>
  );
};

export default StoriesHero;