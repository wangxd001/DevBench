import { describe, it, expect, beforeEach } from 'vitest';
import { useFavoritesStore } from '../favorites-store';

function resetStore() {
  useFavoritesStore.setState({ favorites: [], pinned: [] });
}

describe('favorites-store', () => {
  beforeEach(() => {
    resetStore();
    localStorage.clear();
  });

  it('starts with empty favorites and pinned', () => {
    const s = useFavoritesStore.getState();
    expect(s.favorites).toEqual([]);
    expect(s.pinned).toEqual([]);
  });

  it('toggleFavorite adds a tool', () => {
    useFavoritesStore.getState().toggleFavorite('json-formatter');
    expect(useFavoritesStore.getState().favorites).toContain('json-formatter');
  });

  it('toggleFavorite removes a tool', () => {
    useFavoritesStore.getState().toggleFavorite('json-formatter');
    useFavoritesStore.getState().toggleFavorite('json-formatter');
    expect(useFavoritesStore.getState().favorites).not.toContain('json-formatter');
  });

  it('togglePinned adds a tool', () => {
    useFavoritesStore.getState().togglePinned('uuid-generator');
    expect(useFavoritesStore.getState().pinned).toContain('uuid-generator');
  });

  it('togglePinned removes a tool', () => {
    useFavoritesStore.getState().togglePinned('uuid-generator');
    useFavoritesStore.getState().togglePinned('uuid-generator');
    expect(useFavoritesStore.getState().pinned).not.toContain('uuid-generator');
  });

  it('persists to localStorage', () => {
    useFavoritesStore.getState().toggleFavorite('json-formatter');
    const raw = localStorage.getItem('devbench.favorites');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.favorites).toContain('json-formatter');
  });
});
