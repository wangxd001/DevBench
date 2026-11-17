import { create } from 'zustand';
import type { ToolId } from '@/tools/registry/types';

interface FavoritesState {
  favorites: ToolId[];
  pinned: ToolId[];
  toggleFavorite: (id: ToolId) => void;
  togglePinned: (id: ToolId) => void;
}

export const useFavoritesStore = create<FavoritesState>((set) => ({
  favorites: [],
  pinned: [],
  toggleFavorite: (id) =>
    set((s) => ({
      favorites: s.favorites.includes(id)
        ? s.favorites.filter((f) => f !== id)
        : [...s.favorites, id],
    })),
  togglePinned: (id) =>
    set((s) => ({
      pinned: s.pinned.includes(id)
        ? s.pinned.filter((p) => p !== id)
        : [...s.pinned, id],
    })),
}));
