// src/features/about/data/aboutContent.js
// Core organisational facts + section copy for the About page.
// Single source of truth so components stay presentational.

export const hero = {
  eyebrow: 'About Anika',
  headingLines: ['The work', 'is the story.'],
  intro:
    'ANIKA Initiative is a Pan-African, art-based initiative whose journey began in 2015 with a gathering of seven poets and rappers seeking to find and amplify their voices. Formally registered in 2022, we now use artistic expression, dialogue and people-centred creative approaches to bring lived realities into the open, strengthen artists and communities, and create possibilities for positive social change.',
}

export const origin = {
  eyebrow: 'Where we started',
  heading: 'Founded on a single sitting, grown into a movement.',
  founded: {
    year: 2015,
    description:
      'Seven poets and rappers sat down together to find and amplify their own voices.',
  },
  registered: {
    year: 2022,
    description: 'Formally registered as a non-profit association.',
  },
  founders: {
    count: 1,
    coFounderCount: 3,
    label: '1 founder, 3 co-founders',
    description:
      'Of the original seven, four carried the flame forward — one founder and three co-founders who built ANIKA into what it is today.',
  },
  countries: {
    count: 5,
    list: ['Kenya', 'Uganda', 'Rwanda', 'Ghana', 'South Africa'],
    description:
      'Nine years on, that single sitting has grown into work across five African countries.',
  },
  pillars: [
    'Arts & Culture',
    'Youth & Migration',
    'Gender & Development',
    'Climate Action',
    'Governance',
  ],
  summary:
    'ANIKA Initiative is a Pan-African, art-based civil society organisation founded in 2015 by a collective of spoken-word artists in Kenya. Operating under the philosophy that art is one of the most powerful yet underutilised tools for social transformation, ANIKA uses artistic expression — spoken word, theatre, visual art, music, and dialogue — to address pressing issues in society. Formally registered as a non-profit association in 2022, ANIKA now operates across five thematic pillars: Arts & Culture, Youth & Migration, Gender & Development, Climate Action, and Governance.',
}

export const missionVision = {
  eyebrow: 'Why we exist',
  heading: 'Mission & Vision',
  mission: {
    label: 'Mission',
    tagline: 'Changing the world, Art at a time.',
    body: 'We use artistic expression, dialogue and people-centred creative approaches to bring lived realities into the open, strengthen artists and communities, and create possibilities for positive social change — one conversation at a time.',
  },
  vision: {
    label: 'Vision',
    tagline: 'A society made better through art.',
    body: 'A society made better through the utilisation of the immense potential of art in all its forms to effect positive change.',
  },
}

export const history = {
  eyebrow: 'Our History',
  heading: 'Nine years of making space for difficult, necessary and beautiful conversations.',
  body: [
    'ANIKA Initiative began in 2015, when seven poets and rappers sat down to find and amplify their own voices. That single sitting grew into a founding team of one founder and three co-founders — and, nine years on, into work across five African countries.',
    "We use artistic expression, dialogue and people-centred creative approaches to bring lived realities into the open, strengthen artists and communities, and create real possibilities for social change. Airing isn't exposure for its own sake — it's building the dignified conditions in which a story can breathe, be heard, and actually lead somewhere.",
  ],
  milestones: [
    {
      year: '2015',
      title: 'Seven voices, one sitting',
      description: 'Seven poets and rappers gather to find and amplify their own voices — the founding moment.',
    },
    {
      year: '2022',
      title: 'Formally registered',
      description: 'ANIKA is formally registered as a non-profit association.',
    },
    {
      year: 'Today',
      title: '9 years, 5 countries',
      description: 'Work now spans Kenya, Uganda, Rwanda, Ghana and South Africa.',
    },
  ],
}

export const governance = {
  eyebrow: 'Governance',
  heading: 'Trust is built in public.',
  body: 'Meet our board, read our trust deed summary and explore the principles that guide our work.',
  ctaLabel: 'Governance details',
  ctaHref: '/governance',
}

export const joinCta = {
  eyebrow: 'Start where you are',
  headingLines: ['There is a place', 'for your voice.'],
  body: "Silence Kills. Art Airs. Whatever brought you here, there's a way to join the conversation.",
  ctaLabel: 'Talk to ANIKA',
  ctaHref: '/get-involved',
}
