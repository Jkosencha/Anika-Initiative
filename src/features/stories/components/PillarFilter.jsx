import { pillars } from "../data/stories.js";

// Tailwind's JIT scanner only picks up class names it can see literally in
// source, so each pillar's active-state classes are spelled out in full
// here rather than built with a template string like `bg-${color}`.
const activeClasses = {
  All: "bg-ink border-ink text-cream",
  "Arts & Culture": "bg-coral border-coral text-cream",
  "Youth & Migration": "bg-gold border-gold text-ink",
  "Gender & Development": "bg-anika-blue border-anika-blue text-cream",
  "Climate Action": "bg-anika-green border-anika-green text-cream",
  Governance: "bg-ink border-ink text-cream",
};

const PillarFilter = ({ active, onChange }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-10">
      {pillars.map((pillar) => {
        const isActive = pillar === active;
        return (
          <button
            key={pillar}
            type="button"
            onClick={() => onChange(pillar)}
            aria-pressed={isActive}
            className={`font-body text-sm px-5 py-2 rounded-full border transition-colors duration-200 ${
              isActive
                ? activeClasses[pillar]
                : "bg-transparent border-ink/20 text-ink hover:border-ink/40"
            }`}
          >
            {pillar}
          </button>
        );
      })}
    </div>
  );
};

export default PillarFilter;
