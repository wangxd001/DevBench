import { create } from 'zustand';
import type { ToolId } from '@/tools/registry/types';

const STORAGE_KEY = 'devbench.favorites';

interface FavoritesState {
  favorites: ToolId[];
  pinned: ToolId[];
  toggleFavorite: (id: ToolId) => void;
  togglePinned: (id: ToolId) => void;
}

function loadFavorites(): { favorites: ToolId[]; pinned: ToolId[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { favorites: [], pinned: [] };
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.favorites) && Array.isArray(parsed.pinned)) {
      return { favorites: parsed.favorites, pinned: parsed.pinned };
    }
    return { favorites: [], pinned: [] };
  } catch {
    return { favorites: [], pinned: [] };
  }
}

function saveFavorites(state: { favorites: ToolId[]; pinned: ToolId[] }): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ favorites: state.favorites, pinned: state.pinned }));
  } catch {
    // 写入失败不影响核心功能
  }
}

const initial = loadFavorites();

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ...initial,
  toggleFavorite: (id) => {
    const s = get();
    const favorites = s.favorites.includes(id)
      ? s.favorites.filter((f) => f !== id)
      : [...s.favorites, id];
    set({ favorites });
    saveFavorites({ ...s, favorites, pinned: s.pinned });
  },
  togglePinned: (id) => {
    const s = get();
    const pinned = s.pinned.includes(id)
      ? s.pinned.filter((p) => p !== id)
      : [...s.pinned, id];
    set({ pinned });
    saveFavorites({ ...s, favorites: s.favorites, pinned });
  },
}));
