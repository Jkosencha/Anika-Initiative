// src/data/storiesStore.js
//
// Drop-in replacement for the old localStorage-based store. Same public API
// (getAll, getPublished, getBySlug, getById, save, delete, subscribe,
// uploadThumbnail, getImageUrl) so existing components need only small
// tweaks (await the previously-synchronous calls — see the updated
// index.jsx / StoryDetailView.jsx / admin Stories.jsx).
import React from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

// Same admin-slug -> public-slug mapping the old store used, kept here as a
// safety net in case a caller passes an admin-format pillar slug directly.
const normalizePillarSlug = (slug) => {
  const mapping = {
    "arts-culture": "arts-and-culture",
    "arts-and-culture": "arts-and-culture",
    "youth-migration": "youth-and-migration",
    "youth-and-migration": "youth-and-migration",
    expressions: "expressions",
    "gender-equality": "gender-equality",
    governance: "governance",
  };
  return mapping[slug] || slug;
};

let listeners = [];
const notify = () => listeners.forEach((listener) => listener());

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch (_) {
      // no JSON body — keep the default message
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}

// Helper: convert a file to base64 (kept for the "upload new image" flow
// until external image storage — S3/Cloudinary — is wired up).
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

const isBase64Image = (str) => !!str && str.startsWith("data:image/");

const getImageUrl = (thumbnail) => {
  if (!thumbnail) return "/placeholder-image.jpg";
  return thumbnail;
};

export const storiesStore = {
  // Admin: every story regardless of status
  getAll: async () => request("/admin/stories"),

  // Public: published stories only, optional pillar filter
  getPublished: async (pillar) => {
    const query = pillar && pillar !== "all" ? `?pillar=${encodeURIComponent(pillar)}` : "";
    return request(`/stories${query}`);
  },

  // Public: single published story by slug (returns null if not found)
  getBySlug: async (slug) => {
    try {
      return await request(`/stories/${encodeURIComponent(slug)}`);
    } catch (error) {
      return null;
    }
  },

  // Admin: single story by id, any status, includes raw `content`
  getById: async (id) => request(`/admin/stories/${id}`),

  // Create (no id) or update (has id)
  save: async (storyData) => {
    const payload = { ...storyData, pillar: normalizePillarSlug(storyData.pillar) };
    const saved = payload.id
      ? await request(`/admin/stories/${payload.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        })
      : await request("/admin/stories", {
          method: "POST",
          body: JSON.stringify(payload),
        });
    notify();
    return saved;
  },

  delete: async (id) => {
    await request(`/admin/stories/${id}`, { method: "DELETE" });
    notify();
  },

  // Subscribe to changes (fires after any successful save/delete)
  subscribe: (callback) => {
    listeners.push(callback);
    return () => {
      listeners = listeners.filter((l) => l !== callback);
    };
  },

  // TODO(backend): once S3/Cloudinary is wired up, replace this with a real
  // upload call (e.g. POST /api/admin/uploads) and return the hosted URL
  // instead of base64. Until then, base64 is still sent to the backend and
  // stored as-is in the `thumbnail` column.
  uploadThumbnail: async (file) => fileToBase64(file),

  getImageUrl,
};

// React hook — same shape as before, now backed by fetch + refetch-on-change
export const useStories = () => {
  const [state, setState] = React.useState({ stories: [], published: [] });

  const reload = React.useCallback(async () => {
    const [all, published] = await Promise.all([
      storiesStore.getAll(),
      storiesStore.getPublished(),
    ]);
    setState({ stories: all, published });
  }, []);

  React.useEffect(() => {
    reload();
    const unsubscribe = storiesStore.subscribe(reload);
    return unsubscribe;
  }, [reload]);

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
