export const PILLARS = [
  {
    slug: 'arts-and-culture',
    name: 'Arts & Culture',
    letter: 'A',
    tagline: 'Authenticity + Nobility',
    accentClass: 'coral',
  },
  {
    slug: 'youth-and-migration',
    name: 'Youth & Migration',
    letter: 'N',
    tagline: 'Nobility + Inclusive Impact',
    accentClass: 'anika-green',
  },
  {
    slug: 'expressions',
    name: 'Expressions',
    letter: 'E',
    tagline: 'Kuumba',
    accentClass: 'gold',
  },
  {
    slug: 'gender-equality',
    name: 'Gender Equality',
    letter: 'G',
    tagline: 'Inclusive Impact',
    accentClass: 'anika-blue',
  },
  {
    slug: 'governance',
    name: 'Governance',
    letter: 'V',
    tagline: 'Adaptability',
    accentClass: 'ink',
  },
];

// accentClass lookup for when color is needed
export const pillarColors = Object.fromEntries(
    PILLARS.map((p) => [p.slug, p.accentClass])
);

// Used anywhere with a slug and full pillar object is needed
export function getPillarBySlug(slug) {
  return PILLARS.find((p) => p.slug === slug);
}

// Used anywhere with a display name and slug is needed
export function getPillarByName(name) {
  return PILLARS.find((p) => p.name === name);
}