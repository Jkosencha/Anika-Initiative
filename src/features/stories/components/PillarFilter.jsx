import { pillars } from "../data/stories.js";

const activeClasses = {
  All: "text-ink",
  "Arts & Culture": "text-coral",
  "Youth & Migration": "text-gold",
  "Gender & Development": "text-anika-blue",
  "Climate Action": "text-anika-green",
  Governance: "text-ink",
};

const PillarFilter = ({ active, onChange }) => {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-10">
        {pillars.map((pillar) => {
          const isActive = pillar === active;
          return (
            <button
              key={pillar}
              type="button"
              onClick={() => onChange(pillar)}
              aria-pressed={isActive}
              className={`font-body text-sm uppercase tracking-wide pb-1 border-b-2 transition-colors duration-200 ${
                isActive
                  ? `${activeClasses[pillar]} border-current`
                  : "text-ink/50 border-transparent hover:text-ink"
              }`}
            >
              {pillar}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PillarFilter;