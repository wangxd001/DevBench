import { describe, it, expect, beforeEach } from 'vitest';
import { useRecentToolsStore } from '../recent-tools-store';
import { useFavoritesStore } from '../favorites-store';

function resetStore() {
  useRecentToolsStore.setState({ recent: [] });
  useFavoritesStore.setState({ favorites: [], pinned: [] });
}

describe('recent-tools-store', () => {
  beforeEach(() => {
    resetStore();
    localStorage.clear();
  });

  it('starts with empty recent', () => {
    expect(useRecentToolsStore.getState().recent).toEqual([]);
  });

  it('addRecent adds a tool', () => {
    useRecentToolsStore.getState().addRecent('json-formatter');
    expect(useRecentToolsStore.getState().recent).toHaveLength(1);
    expect(useRecentToolsStore.getState().recent[0].toolId).toBe('json-formatter');
  });

  it('addRecent updates timestamp for repeat usage', () => {
    useRecentToolsStore.getState().addRecent('json-formatter');
    const first = useRecentToolsStore.getState().recent[0];
    useRecentToolsStore.getState().addRecent('json-formatter');
    const second = useRecentToolsStore.getState().recent[0];
    expect(second.lastUsedAt).toBeGreaterThanOrEqual(first.lastUsedAt);
    expect(useRecentToolsStore.getState().recent).toHaveLength(1);
  });

  it('clearRecent empties the list', () => {
    useRecentToolsStore.getState().addRecent('json-formatter');
    useRecentToolsStore.getState().addRecent('uuid-generator');
    useRecentToolsStore.getState().clearRecent();
    expect(useRecentToolsStore.getState().recent).toEqual([]);
  });

  it('persists to localStorage', () => {
    useRecentToolsStore.getState().addRecent('json-formatter');
    const raw = localStorage.getItem('devbench.recent');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed[0].toolId).toBe('json-formatter');
  });

  it('clearRecent does not affect favorites', () => {
    useFavoritesStore.getState().toggleFavorite('json-formatter');
    useRecentToolsStore.getState().addRecent('json-formatter');
    useRecentToolsStore.getState().clearRecent();
    expect(useFavoritesStore.getState().favorites).toContain('json-formatter');
  });
});
