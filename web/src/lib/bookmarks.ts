import { writable } from "svelte/store";

const STORAGE_KEY = "bookmarked-programs";

function loadBookmarks(): Set<string> {
  /* Reading localStorage itself throws when site data is blocked */
  try {
    if (typeof localStorage === "undefined") return new Set();
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
  } catch {
    return new Set();
  }
}

function persist(slugs: Set<string>) {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...slugs]));
  } catch {}
}

function createBookmarkStore() {
  const { subscribe, set, update } = writable<Set<string>>(loadBookmarks());

  // Cross-tab sync
  if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEY) {
        set(loadBookmarks());
      }
    });
  }

  return {
    subscribe,
    toggle(slug: string) {
      update((current) => {
        const next = new Set(current);
        if (next.has(slug)) {
          next.delete(slug);
        } else {
          next.add(slug);
        }
        persist(next);
        return next;
      });
    },
  };
}

export const bookmarks = createBookmarkStore();
