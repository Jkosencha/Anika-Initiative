// src/data/storiesStore.js
import { PILLARS } from "./pillars.js";

// Normalize pillar slugs between admin and public
const normalizePillarSlug = (slug) => {
  const mapping = {
    'arts-culture': 'arts-and-culture',
    'arts-and-culture': 'arts-and-culture',
    'youth-migration': 'youth-and-migration',
    'youth-and-migration': 'youth-and-migration',
    'expressions': 'expressions',
    'gender-equality': 'gender-equality',
    'governance': 'governance',
  };
  return mapping[slug] || slug;
};

// Convert admin pillar slug to public format
const toAdminPillarSlug = (slug) => {
  const mapping = {
    'arts-and-culture': 'arts-culture',
    'youth-and-migration': 'youth-migration',
  };
  return mapping[slug] || slug;
};

// Default stories with the correct pillar slugs
const DEFAULT_STORIES = [
  {
    id: 1,
    slug: "sema-anika-forum",
    pillar: "arts-and-culture",
    date: "2026-02-25",
    title: "When a room becomes a stage for honest conversation",
    excerpt: "Inside the Sema-Anika Forum, spoken word turns silence into shared testimony, and a packed room learns to listen differently.",
    image: "/image5.jpg",
    body: [
      "The Sema-Anika Forum started as a single open-mic night and has since become one of ANIKA's most requested gatherings, a room where spoken word is treated as testimony, not performance.",
      "Poets take the floor one at a time, no set list, no rehearsal notes. What comes out is unfiltered: grief, joy, anger, hope, sometimes all in the same three minutes. The audience doesn't clap politely and move on, they respond, they sit with it, they carry it out the door with them.",
      "That's the point. ANIKA built the Forum on the idea that art doesn't need to be polished to matter, it needs to be honest. And honesty, said out loud in a room full of people willing to listen, is its own kind of change.",
    ],
    content: '<p>The Sema-Anika Forum started as a single open-mic night and has since become one of ANIKA\'s most requested gatherings, a room where spoken word is treated as testimony, not performance.</p><p>Poets take the floor one at a time, no set list, no rehearsal notes. What comes out is unfiltered: grief, joy, anger, hope, sometimes all in the same three minutes. The audience doesn\'t clap politely and move on, they respond, they sit with it, they carry it out the door with them.</p><p>That\'s the point. ANIKA built the Forum on the idea that art doesn\'t need to be polished to matter, it needs to be honest. And honesty, said out loud in a room full of people willing to listen, is its own kind of change.</p>',
    status: "published",
    author: "Comms Team",
    updated: "2026-02-25T00:00:00.000Z",
    thumbnail: "/image5.jpg",
  },
  {
    id: 2,
    slug: "refupoet-belonging",
    pillar: "youth-and-migration",
    date: "2026-01-18",
    title: "A generation building belonging across borders",
    excerpt: "Through Refupoet, young refugees and host-community artists trade verses instead of assumptions and start writing a shared future.",
    image: "/image7.jpg",
    body: [
      "Refupoet pairs young refugees with host-community artists for joint writing sessions, not as a one-off workshop, but as an ongoing exchange where both sides show up to write, perform, and listen to each other.",
      "The verses that come out of it aren't about explaining refugee experience to an outside audience. They're conversations between two people figuring out what they have in common, line by line, session by session.",
      "Participants have gone on to perform together at community events across the region, but the real work happens earlier, in the sessions where assumptions get traded for actual stories, and strangers become collaborators.",
    ],
    content: '<p>Refupoet pairs young refugees with host-community artists for joint writing sessions, not as a one-off workshop, but as an ongoing exchange where both sides show up to write, perform, and listen to each other.</p><p>The verses that come out of it aren\'t about explaining refugee experience to an outside audience. They\'re conversations between two people figuring out what they have in common, line by line, session by session.</p><p>Participants have gone on to perform together at community events across the region, but the real work happens earlier, in the sessions where assumptions get traded for actual stories, and strangers become collaborators.</p>',
    status: "published",
    author: "Comms Team",
    updated: "2026-01-18T00:00:00.000Z",
    thumbnail: "/image7.jpg",
  },
  {
    id: 3,
    slug: "air-it-out",
    pillar: "gender-equality",
    date: "2025-11-03",
    title: "Naming what silence protects",
    excerpt: "The Air It Out campaign gives survivors and allies a stage to say what community whispers usually bury, because #SilenceKills.",
    image: "/image8.jpg",
    body: [
      "Air It Out started from a simple observation: in most communities, the loudest response to gender-based violence is silence. Not because people don't know, because saying it out loud is treated as more dangerous than the harm itself.",
      "The campaign flips that. Survivors and allies are given a real stage, through public readings, recorded testimony, and community screenings, to say plainly what's usually only whispered. No euphemisms, no soft framing.",
      "It's uncomfortable by design. ANIKA's position is that comfort has protected silence for long enough, and #SilenceKills isn't a slogan, it's the whole argument for why this work has to be loud.",
    ],
    content: '<p>Air It Out started from a simple observation: in most communities, the loudest response to gender-based violence is silence. Not because people don\'t know, because saying it out loud is treated as more dangerous than the harm itself.</p><p>The campaign flips that. Survivors and allies are given a real stage, through public readings, recorded testimony, and community screenings, to say plainly what\'s usually only whispered. No euphemisms, no soft framing.</p><p>It\'s uncomfortable by design. ANIKA\'s position is that comfort has protected silence for long enough, and #SilenceKills isn\'t a slogan, it\'s the whole argument for why this work has to be loud.</p>',
    status: "published",
    author: "Comms Team",
    updated: "2025-11-03T00:00:00.000Z",
    thumbnail: "/image8.jpg",
  },
];

// Helper to generate slug from title if not provided
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Load stories from localStorage or use defaults
const loadStories = () => {
  try {
    const stored = localStorage.getItem('anika_stories');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure all stories have proper slugs and required fields
      return parsed.map(story => ({
        ...story,
        slug: story.slug || generateSlug(story.title),
        pillar: normalizePillarSlug(story.pillar),
        // Ensure body exists for public display
        body: story.body || formatContentToBody(story.content || ''),
        // Ensure date exists
        date: story.date || story.updated?.split('T')[0] || new Date().toISOString().split('T')[0],
      }));
    }
  } catch (e) {
    console.warn('Failed to load stories from localStorage, using defaults', e);
  }
  return DEFAULT_STORIES;
};

// Save stories to localStorage
const saveStories = (stories) => {
  try {
    localStorage.setItem('anika_stories', JSON.stringify(stories));
    // Dispatch custom event for cross-tab sync
    window.dispatchEvent(new Event('storiesUpdated'));
  } catch (e) {
    console.warn('Failed to save stories to localStorage', e);
  }
};

// Convert story to public format (for website)
const toPublicStory = (story) => ({
  id: story.id,
  slug: story.slug || generateSlug(story.title),
  pillar: normalizePillarSlug(story.pillar),
  date: story.date || story.updated?.split('T')[0] || new Date().toISOString().split('T')[0],
  title: story.title,
  excerpt: story.excerpt || extractExcerpt(story.content || ''),
  image: story.thumbnail || story.image || '/placeholder-image.jpg',
  body: story.body || formatContentToBody(story.content || ''),
});

// Helper to extract excerpt from HTML content
const extractExcerpt = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  const text = div.textContent || '';
  return text.substring(0, 160) + (text.length > 160 ? '...' : '');
};

// Helper to format HTML content to body array
const formatContentToBody = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  const paragraphs = div.querySelectorAll('p');
  if (paragraphs.length > 0) {
    return Array.from(paragraphs).map(p => p.textContent);
  }
  const text = div.textContent || '';
  return text ? [text] : ['No content available.'];
};

// Helper: Convert body array to HTML content
const formatBodyToContent = (bodyArray) => {
  if (!bodyArray || bodyArray.length === 0) return '<p></p>';
  return bodyArray.map(p => `<p>${p}</p>`).join('');
};

// Helper: Convert a file to base64 string
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Helper: Check if a string is a base64 image
const isBase64Image = (str) => {
  if (!str) return false;
  return str.startsWith('data:image/');
};

// Helper: Get a valid image URL (works for both base64 and regular URLs)
const getImageUrl = (thumbnail) => {
  if (!thumbnail) return '/placeholder-image.jpg';
  if (isBase64Image(thumbnail)) return thumbnail;
  return thumbnail;
};

// State
let stories = loadStories();
let listeners = [];

// Subscribe to storage changes from other tabs
window.addEventListener('storage', (e) => {
  if (e.key === 'anika_stories') {
    stories = loadStories();
    listeners.forEach(listener => listener());
  }
});

// Subscribe to custom events within same tab
window.addEventListener('storiesUpdated', () => {
  stories = loadStories();
  listeners.forEach(listener => listener());
});

// Public API
export const storiesStore = {
  // Get all stories
  getAll: () => [...stories],

  // Get only published stories (for public website)
  getPublished: () => stories
    .filter(s => s.status === 'published')
    .map(toPublicStory),

  // Get a single story by slug (for public detail view)
  getBySlug: (slug) => {
    const story = stories.find(s => s.slug === slug);
    return story ? toPublicStory(story) : null;
  },

  // Get a single story by ID (for admin editing)
  getById: (id) => {
    const story = stories.find(s => s.id === id);
    if (!story) return null;
    // Return with admin-specific fields
    return {
      ...story,
      // Ensure admin has access to both content and body
      content: story.content || formatBodyToContent(story.body || []),
    };
  },

  // Save a story (create or update)
  save: (storyData) => {
    const now = new Date().toISOString();
    const existing = storyData.id ? stories.find(s => s.id === storyData.id) : null;

    // Ensure proper pillar slug format
    const pillar = normalizePillarSlug(storyData.pillar);

    let updatedStory;
    if (existing) {
      // Update existing - preserve the original date if it exists, or keep the new one
      const dateToKeep = existing.date || existing.updated?.split('T')[0] || now.split('T')[0];
      
      updatedStory = {
        ...existing,
        ...storyData,
        pillar,
        // If status is 'published' and there's no date yet, set it to today
        date: storyData.status === 'published' && !existing.date ? now.split('T')[0] : dateToKeep,
        // Update body from content if provided
        body: storyData.body || formatContentToBody(storyData.content || existing.content || ''),
        updated: now,
      };
      stories = stories.map(s => s.id === existing.id ? updatedStory : s);
    } else {
      // Create new
      const newId = Math.max(0, ...stories.map(s => s.id)) + 1;
      const slug = storyData.slug || generateSlug(storyData.title);
      
      // Ensure unique slug
      let finalSlug = slug;
      let counter = 1;
      while (stories.some(s => s.slug === finalSlug && s.id !== newId)) {
        finalSlug = `${slug}-${counter}`;
        counter++;
      }

      // Get today's date for publication
      const today = now.split('T')[0];
      
      updatedStory = {
        id: newId,
        slug: finalSlug,
        pillar,
        // If status is 'published', use today's date, otherwise use date from input or today
        date: storyData.status === 'published' ? today : (storyData.date || today),
        title: storyData.title || 'Untitled',
        excerpt: storyData.excerpt || extractExcerpt(storyData.content || ''),
        image: storyData.thumbnail || storyData.image || '/placeholder-image.jpg',
        body: storyData.body || formatContentToBody(storyData.content || ''),
        content: storyData.content || '<p></p>',
        status: storyData.status || 'draft',
        author: storyData.author || 'You',
        updated: now,
        thumbnail: storyData.thumbnail || null,
      };
      stories = [updatedStory, ...stories];
    }

    saveStories(stories);
    return updatedStory;
  },

  // Delete a story
  delete: (id) => {
    stories = stories.filter(s => s.id !== id);
    saveStories(stories);
  },

  // Subscribe to changes
  subscribe: (callback) => {
    listeners.push(callback);
    return () => {
      listeners = listeners.filter(l => l !== callback);
    };
  },

  // Helper function to upload and save thumbnail
  uploadThumbnail: async (file) => {
    try {
      const base64 = await fileToBase64(file);
      return base64;
    } catch (error) {
      console.error('Failed to convert thumbnail to base64:', error);
      throw error;
    }
  },

  // Helper to get image URL
  getImageUrl: getImageUrl,
};

// React hook for easy use in components
export const useStories = () => {
  const [state, setState] = React.useState({
    stories: storiesStore.getAll(),
    published: storiesStore.getPublished(),
  });

  React.useEffect(() => {
    const unsubscribe = storiesStore.subscribe(() => {
      setState({
        stories: storiesStore.getAll(),
        published: storiesStore.getPublished(),
      });
    });
    return unsubscribe;
  }, []);

  return {
    ...state,
    save: storiesStore.save,
    delete: storiesStore.delete,
    getBySlug: storiesStore.getBySlug,
    getById: storiesStore.getById,
    uploadThumbnail: storiesStore.uploadThumbnail,
    getImageUrl: storiesStore.getImageUrl,
  };
};